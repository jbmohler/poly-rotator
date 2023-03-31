#!/bin/sh
#
# docker build -t prettier -f Dockerfile.nodetool .
docker run --rm  -v `pwd`:/app:Z -u root prettier prettier --write /app/engine.js
docker run --rm  -v `pwd`:/app:Z -u root prettier prettier --write /app/polygon.html
