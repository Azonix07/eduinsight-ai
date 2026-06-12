#!/usr/bin/env bash
# Starts the local MongoDB instance used by EduInsight AI (installed to ~/.local/eduinsight-mongo).
set -e

MONGO_ROOT="$HOME/.local/eduinsight-mongo"
MONGOD="$MONGO_ROOT/mongodb-macos-aarch64-8.0.4/bin/mongod"

if ! [ -x "$MONGOD" ]; then
  echo "mongod binary not found at: $MONGOD"
  echo "Download the macOS arm64 community build from https://www.mongodb.com/try/download/community"
  echo "and extract it under $MONGO_ROOT, or update this script's path."
  exit 1
fi

if pgrep -f "eduinsight-mongo/data" >/dev/null 2>&1; then
  echo "MongoDB is already running on 127.0.0.1:27017"
  exit 0
fi

mkdir -p "$MONGO_ROOT/data" "$MONGO_ROOT/log"
"$MONGOD" --dbpath "$MONGO_ROOT/data" --port 27017 --bind_ip 127.0.0.1 \
  --fork --logpath "$MONGO_ROOT/log/mongod.log"

echo "MongoDB started on 127.0.0.1:27017"
echo "  data: $MONGO_ROOT/data"
echo "  log:  $MONGO_ROOT/log/mongod.log"
echo "Stop it with:  pkill -f 'eduinsight-mongo/data'"
