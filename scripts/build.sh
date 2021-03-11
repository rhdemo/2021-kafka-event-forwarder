#!/usr/bin/env bash
printf "\n\n######## kafka-event-forwarder build ########\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR/..

func build
