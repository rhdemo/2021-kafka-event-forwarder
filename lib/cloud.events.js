const log = require('./log');
const { CloudEvent, HTTP } = require('cloudevents');
const kafka = require('./kafka');

const EventType = {
  MatchStart: 'match-start',
  Attack: 'attack',
  MatchEnd: 'match-end'
};

const ValidEvents = Object.values(EventType);

/**
 * Parses incoming HTTP headers and body to a Cloud Event and returns the
 * CloudEvent instance.
 *
 * Can throw an error if the request is not correctly formatted.
 *
 * @param {FastifyRequest['headers']} headers
 * @param {FastifyRequest['body']} body
 * @returns {CloudEvent}
 */
exports.parse = function (headers, body) {
  log.trace('parsing cloud event. data: %j', {
    headers,
    body
  });

  return HTTP.toEvent({
    headers,
    body
  });
};

/**
 * Determines if a given Cloud Event has a known "type" field.
 * @param {CloudEvent} evt
 */
exports.isKnownEventType = function (evt) {
  log.trace(`checking if "${evt.type}" is in known types: %j`, ValidEvents);

  return ValidEvents.includes(evt.type);
};

/**
 * Processes events emitted
 * @param {CloudEvent} evt
 */
exports.processEvent = function (evt) {
  if (evt.type === EventType.MatchStart) {
    return kafka.forwardMatchStartUpdate(evt.data);
  } else if (evt.type === EventType.Attack) {
    return kafka.forwardMatchAttackUpdate(evt.data);
  } else if (evt.type === EventType.MatchEnd) {
    kafka.forwardMatchEndUpdate(evt.data);
  } else {
    throw new Error(`received unknown cloud event type: "${evt.type}"`);
  }
};
