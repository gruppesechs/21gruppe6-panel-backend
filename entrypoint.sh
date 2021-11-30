#!/bin/sh

if [ ! -f ".initialized" ]; then
  npx prisma migrate deploy
  touch .initialized
fi

exec "$@"
