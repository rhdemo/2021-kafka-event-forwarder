DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

docker build -f Dockerfile.dev . -t summit-kafka-event-forwarder
docker run --rm --net ks -p 3004:3004 -v "$(pwd)/lib/:/usr/src/app/lib/" -e DATA --name=summit-kafka-event-forwarder  summit-kafka-event-forwarder
