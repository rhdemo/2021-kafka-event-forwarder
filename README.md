# 2021-kafka-forwarder

Forwards the Knative Events from the demo to a centralised Kafka broker.

## Requirements

- Node.js v14.3
- npm 6.14

## Usage

### Local Dev

_NOTE: Local development requires Docker._

Start the services using the following scripts:

```
# start the zookeeper and kafka containers
./scripts/kafka.up.sh

# create a local node dev container with live reload
./scripts/node.sh
```

Send events to the Node.js service at `localhost:8080` like so:

```
node scripts/send.event.js payloads/attack.event.json
```

### Deploy

```bash
# Create a func.yaml and edit with desired env vars
cp func.template.yaml func.yaml

# Build and deploy the function
func build
./scripts/push
func deploy

# Create knative triggers that forward events to the function
oc apply \
-f knative/attack.trigger.yaml \
-f knative/match-end.trigger.yaml \
-f knative/match-start.trigger.yaml

# Prepare kafka connection details
export KAFKA_BOOTSTRAP_URL=some-broker.kafka.devshift.org:443
export KAFKA_SVC_USERNAME=service-account-username
export KAFKA_SVC_PASSWORD=service-account-password

# Apply kafka connection details to knative function config
# NOTE: you can skip this if you entered these details in the func.yaml
kn service update kafka--event--forwarder--nodejs \
--env LOG_LEVEL="trace" \
--env NODE_ENV="dev" \
--env KAFKA_BOOTSTRAP_URL=$KAFKA_BOOTSTRAP_URL \
--env KAFKA_SVC_USERNAME=$KAFKA_SVC_USERNAME \
--env KAFKA_SVC_PASSWORD=$KAFKA_SVC_PASSWORD
```
