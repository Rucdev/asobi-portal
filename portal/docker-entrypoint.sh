#!/bin/sh
set -e

ENV_FILE="/app/.env"

# Generate .env if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
  echo "Generating $ENV_FILE..."
  cat > "$ENV_FILE" << EOF
NODE_ENV=${NODE_ENV:-production}
PORT=${PORT:-3000}
DB_PATH=${DB_PATH:-/data/portal.db}
EOF
  echo ".env file created"
else
  echo ".env file already exists, skipping generation"
fi

exec "$@"
