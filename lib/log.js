'use strict';

const pino = require('pino')
const { LOG_LEVEL, NODE_ENV } = require('./config');

const level = LOG_LEVEL ? LOG_LEVEL : NODE_ENV === 'prod' ? 'info' : 'debug';

const log = pino({
  level
});

module.exports = log;
