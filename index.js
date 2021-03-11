'use strict';

const events = require('./lib/cloud.events');
const log = require('./lib/log');

module.exports = async ({ cloudevent }) => {
  if (!cloudevent) {
    return {
      statusCode: 400,
      body: {
        info: 'invalid cloud event HTTP request'
      }
    };
  } else if (events.isKnownEventType(cloudevent)) {
    try {
      await events.processEvent(cloudevent);

      return {
        body: {
          info: `processed "${cloudevent.type}" successfully`
        }
      };
    } catch (e) {
      log.error('error processing event: %j', cloudevent);
      log.error(e);
      return {
        statusCode: 500,
        body: {
          info: `error processing "${cloudevent.type}" event`
        }
      };
    }
  } else {
    return {
      statusCode: 400,
      body: {
        info: `invalid cloud event type: "${cloudevent.type}"`
      }
    };
  }
};
