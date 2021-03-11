'use strict';

const log = require('./log');
const kafka = require('./kafka');

const EventType = {
  MatchStart: 'match-start',
  Attack: 'attack',
  MatchEnd: 'match-end'
};

const ValidEvents = Object.values(EventType);

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
    return kafka.forwardMatchEndUpdate(evt.data);
  } else {
    throw new Error(`received unknown cloud event type: "${evt.type}"`);
  }
};
