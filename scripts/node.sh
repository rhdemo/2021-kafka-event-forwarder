DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR/..

func run -e NODE_ENV=dev -e KAFKA_BOOTSTRAP_URL=localhost:9092
