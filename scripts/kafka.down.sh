#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
# Need to change into this dir since docker-compose searches cwd for yaml
cd $DIR

docker-compose down
