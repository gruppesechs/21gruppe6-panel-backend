#!/bin/sh

if [ ! -f "keys/privateKey.json" ]; then
  pnpx ts-node scripts/generateKeyPair.ts
fi

if [ ! -f ".initialized" ]; then
  # Apply database migrations
  pnpx prisma migrate deploy

  # Mark the project as initialized
  touch .initialized
fi

exec "$@"
