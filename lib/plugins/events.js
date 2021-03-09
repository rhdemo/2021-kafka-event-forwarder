'use strict'

const { ValidationError } = require('cloudevents')
const events = require('../cloud.events')
const log = require('../log')
const fp = require('fastify-plugin')


const eventsPlugin = (server, options, done) => {
  /**
   * This endpoint is used to process received cloud events.
   * These events are forwarded to this service using a Knative Trigger.
   */
  server.route({
    method: 'POST',
    url: '/events/trigger',
    handler: async (request, reply) => {
      try {
        const evt = events.parse(request.headers, request.body);

        if (!events.isKnownEventType(evt)) {
          log.warn(`received request to process unknown "${evt.type}" event type`)

          reply.status(422).send({
            info: `cloud event type "${evt.type}" is not known`
          });
        } else {
          log.info(`processing "${evt.type}" event`)
          await events.processEvent(evt);
          reply.send(`processed "${evt.type}" successfully`)
        }
      } catch (e) {
        if (e instanceof ValidationError) {
          log.warn('error parsing cloud event. event data: %j', {
            body: request.body,
            headers: request.headers
          });
          log.warn(e);

          reply.status(400).send({
            info: 'cloud event validation failed',
            details: e
          });
        } else {
          reply.status(500).send('internal server error');
        }
      }
    }
  });
  done();
};

module.exports = fp(eventsPlugin);
