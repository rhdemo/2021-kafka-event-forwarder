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

Send events to the Node.js service at `localhost:3004` like so:

```
node scripts/send.event.js payloads/attack.event.json
```
