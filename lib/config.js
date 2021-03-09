'use strict';

const { get } = require('env-var');

module.exports = {
  NODE_ENV: get('NODE_ENV').default('dev').asEnum(['dev', 'prod']),
  LOG_LEVEL: get('LOG_LEVEL').asString(),

  HTTP_PORT: get('HTTP_PORT').default(3000).asPortNumber(),

  KAFKA_BOOTSTRAP_URL: get('KAFKA_BOOTSTRAP_URL').required().asUrlString(),
  KAFKA_SVC_USERNAME: get('KAFKA_SVC_USERNAME').required().asString(),
  KAFKA_SVC_PASSWORD: get('KAFKA_SVC_PASSWORD').required().asString(),
  KAFKA_TOPIC_MATCHES: get('KAFKA_TOPIC_MATCHES').default('match-instances').asString(),
  KAFKA_TOPIC_ATTACKS: get('KAFKA_TOPIC_ATTACKS').default('match-attacks').asString()
};

