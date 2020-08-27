#!/usr/bin/env bash

until $(curl --output /dev/null --silent --head --fail http://localhost:8080/health); do
    printf 'waiting for node up\n'
    sleep 5
done

echo 'done'
node dist/index.js mock $1