#!/bin/sh
set -eu

if [ ! -x node_modules/.bin/vite ]; then
  echo "Installing frontend dependencies…"
  npm ci
fi

exec "$@"
