'use strict';

/**
 * Send an event to the event forwarder. Usage:
 *
 *    node scripts/send.event.js $FILENAME
 *
 * For example:
 *
 *    node scripts/send.event.js payloads/attack.event.json
 *
 */

const got = require('got');
const { readFileSync } = require('fs');
const evt = JSON.parse(readFileSync(process.argv[2]));

got(process.argv[3] || 'http://localhost:8080', {
  method: 'POST',
  headers: {
    ...evt.headers
  },
  json: evt.body
})
  .then((r) => {
    console.log('sent event');
  })
  .catch((e) => {
    console.log('error sending event', e);
  });
