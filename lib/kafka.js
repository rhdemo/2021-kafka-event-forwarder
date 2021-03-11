'use strict';

const log = require('./log');
const { Kafka } = require('kafkajs');
const {
  KAFKA_BOOTSTRAP_URL,
  KAFKA_SVC_USERNAME,
  KAFKA_SVC_PASSWORD,
  KAFKA_TOPIC_MATCHES
} = require('./config');

let sasl = undefined;
let ssl = undefined;
if (KAFKA_SVC_USERNAME) {
  log.info(
    'KAFKA_SVC_USERNAME was set in environment. Using SASL_PLAIN to connect to Kafka.'
  );
  ssl = true;
  sasl = {
    mechanism: 'plain',
    username: KAFKA_SVC_USERNAME,
    password: KAFKA_SVC_PASSWORD
  };
  log.trace('sasl options: %j', sasl);
}

const kafka = new Kafka({
  clientId: 'knative-match-event-forwarder',
  brokers: [KAFKA_BOOTSTRAP_URL],
  sasl,
  ssl
});

const producer = kafka.producer();

producer.on(producer.events.CONNECT, () => {
  log.info(`Kafka producer connected to broker ${KAFKA_BOOTSTRAP_URL}`);
});
producer.on(producer.events.DISCONNECT, () => {
  log.info(`Kafka producer disconnected from broker ${KAFKA_BOOTSTRAP_URL}`);
});
producer.on(producer.events.REQUEST_TIMEOUT, (e) => {
  log.error('Kafka producer had a request timeout');
});

/**
 * The definition of a MatchInstance that is pushed to a Kafka topic.
 * @typedef {Object} MatchInstance
 * @property {String} game - UUID of the game generation this match belongs to.
 * @property {String} match - UUID of this match.
 * @property {Player} playerA - Data for player A.
 * @property {Player} playerB - Data for player B.
 */

/**
 * The definition of an attack payload.
 * @typedef {Object} AttackData
 * @property {String} game - UUID of the game generation this match belongs to.
 * @property {String} match - UUID of this match.
 * @property {String} origin - A String containing integers in "x,y" format.
 * @property {Boolean} hit - Represents if the attack was a hit (true) or miss (false).
 * @property {String|undefined} destroyed - A String containing a destroyed ship name if one has been sunk by this attack.
 * @property {Object} prediction - Contains prediction data. Only exists if the attacker ("by") is not "human".
 * @property {Number} ts - Timestamp when the attack was processed by the game server.
 * @property {Player} by - The attacking player.
 * @property {Player} against - The attacking player at the receiving end of the attack.
 */

/**
 * The definition of a board configuration associated with a player
 * @typedef {Object} BoardConfiguration
 * @property {Object} Carrier
 * @property {Object} Battleship
 * @property {Object} Destroyer
 * @property {Object} Submarine
 */

/**
 * The definition of a Player that is part of a given MatchInstance
 * @typedef {Object} Player
 * @property {String} uuid - UUID of this player.
 * @property {String} username - Username of this player.
 * @property {Boolean} human - Represents whether the player is a human or AI.
 * @property {Number} shotCount - Number of shots (turns) the player has made.
 * @property {Number} consecutiveHitsCount - Number of successful shots in a row by the player. Resets after a miss.
 * @property {BoardConfiguration} board - Board containing ship data.
 */

/**
 * Generate a function that will send any data provided to Kafka.
 * The data will be tagged with a given type.
 * @param {String} type
 * @returns
 */
function _sender(type) {
  return async (data) => {
    const message = {
      // Important that messages are keyed by gameId:matchId. This ensures:
      // 1. They're routed to a consistent partition (retains message order)
      // 2. Kafka Streams can use this key for performing aggregate/joins
      key: `${data.game}:${data.match}`,
      value: JSON.stringify({ type, data })
    };

    log.info(
      `sending match update of type ${type} for key ${message.key} to topic ${KAFKA_TOPIC_MATCHES}`
    );
    log.trace(`sending payload to kafka: %j`, message.value);

    await producer.connect();

    return producer.send({
      topic: KAFKA_TOPIC_MATCHES,
      messages: [message]
    });
  };
}

/**
 * Write a match instance "start" event to the KAFKA_TOPIC_MATCHES.
 * These are keyed using a composite key of "GameUUID:MatchUUID".
 * @param {MatchInstance} instance
 */
exports.forwardMatchStartUpdate = _sender('start');

/**
 * Write a match instance "end" event to the KAFKA_TOPIC_MATCHES.
 * These are keyed using a composite key of "GameUUID:MatchUUID".
 * @param {MatchInstance} instance
 */
exports.forwardMatchEndUpdate = _sender('end');

/**
 * Write data for a match "attack" event to the KAFKA_TOPIC_MATCHES.
 * These are keyed using a composite key of "GameUUID:MatchUUID".
 * @param {AttackData} attack
 */
exports.forwardMatchAttackUpdate = _sender('attack');
