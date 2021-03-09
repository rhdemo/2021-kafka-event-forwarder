'use strict';

const { NODE_ENV, HTTP_PORT } = require('./config');
const fastify = require('fastify');

const app = fastify({
  logger: NODE_ENV !== 'prod'
});

app.register(require('./plugins/events'));

app.listen(HTTP_PORT, '0.0.0.0', (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  app.log.info(`server listening on ${address}`);
});
