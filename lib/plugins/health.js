const fp = require('fastify-plugin');
const { uptime } = require('process');
const humanize = require('humanize-duration');
const log = require('../log');

const healthPlugin = (server, options, done) => {
  log.info('mounting health plugin');

  server.route({
    method: 'GET',
    url: '/health',
    handler: async () => {
      return {
        status: 'ok',
        uptime: humanize(uptime() * 1000),
        serverTs: new Date().toJSON()
      };
    }
  });

  done();
};

module.exports = fp(healthPlugin);
