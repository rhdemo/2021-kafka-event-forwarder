DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR/..

func run \
-e NODE_ENV=dev \
-e LOG_LEVEL=trace \
-e KAFKA_BOOTSTRAP_URL=$KAFKA_BOOTSTRAP_URL \
-e KAFKA_SVC_USERNAME=$KAFKA_SVC_USERNAME \
-e KAFKA_SVC_PASSWORD=$KAFKA_SVC_PASSWORD
