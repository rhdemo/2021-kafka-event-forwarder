'use strict';

const test = require('tape');
const sinon = require('sinon');
const { join } = require('path');
const { CloudEvent, HTTP } = require('cloudevents');
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();

const logStub = {
  trace: sinon.spy(),
  info: sinon.spy()
};
const eventTypes = ['match-start', 'attack', 'match-end'];

test('#isKnownEventType: should accept valid event types', (t) => {
  const events = proxyquire('../lib/cloud.events', {
    './kafka': {},
    './log': logStub
  });

  eventTypes.forEach((type) => {
    t.equal(
      events.isKnownEventType({ type }),
      true,
      `failed to validate "${type}"`
    );
  });

  t.end();
});

test('#isKnownEventType: should reject valid event types', (t) => {
  const events = proxyquire('../lib/cloud.events', {
    './kafka': {},
    './log': logStub
  });

  t.equal(events.isKnownEventType({ type: 'not-an-event' }), false);
  t.end();
});

test('#processEvent: should send event to the correct handler', async (t) => {
  const kafkaStub = {
    forwardMatchStartUpdate: sinon.spy(),
    forwardMatchAttackUpdate: sinon.spy(),
    forwardMatchEndUpdate: sinon.spy()
  };
  const events = proxyquire('../lib/cloud.events', {
    './kafka': kafkaStub,
    './log': logStub
  });

  const promises = eventTypes.map(async (type) => {
    const { headers, body } = require(join(
      __dirname,
      `../payloads/${type}.event.json`
    ));

    return events.processEvent(HTTP.toEvent({ headers, body }));
  });

  try {
    await promises;
  } catch (e) {
    t.fail(e);
  }

  t.equal(kafkaStub.forwardMatchAttackUpdate.callCount, 1);
  t.equal(kafkaStub.forwardMatchEndUpdate.callCount, 1);
  t.equal(kafkaStub.forwardMatchStartUpdate.callCount, 1);
});
