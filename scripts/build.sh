#!/usr/bin/env bash
printf "\n\n######## kafka-event-forwarder build ########\n"

IMAGE_REPOSITORY=${IMAGE_REPOSITORY:-quay.io/redhatdemo/2021-kafka-event-forwarder:latest}

rm -rf node_modules/
rm -rf build/

s2i build -c . registry.access.redhat.com/ubi8/nodejs-14 ${IMAGE_REPOSITORY}
