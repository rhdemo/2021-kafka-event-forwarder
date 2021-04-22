'use strict';

const events = require('./lib/cloud.events');
const log = require('./lib/log');

module.exports = async ({ cloudevent }) => {
  if (!cloudevent) {
    log.warn('received a request that did not contain a cloud event');
    return {
      code: 400,
      body: {
        info: 'invalid cloud event HTTP request'
      }
    };
  } else if (events.isKnownEventType(cloudevent)) {
    // Fire and forget...but handle errors
    events.processEvent(cloudevent).catch((e) => {
      log.error('erorr processing event: %j', cloudevent);
      log.error(e);
    });

    return {
      code: 202
    };
  } else {
    log.warn(`an unknown event type of "${cloudevent.type}" was received`);
    return {
      code: 202
    };
  }
};
