#!/usr/bin/env bash
printf "\n\n######## kafka-event-forwarder push ########\n"

IMAGE_REPOSITORY=${PHONE_SERVER_IMAGE_REPOSITORY:-quay.io/redhatdemo/2021-kafka-event-forwarder:latest}

echo "Pushing ${IMAGE_REPOSITORY}"
docker push ${IMAGE_REPOSITORY}
