#!/bin/bash
script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
kysely_dir="$script_dir/../shared/kysely"
# Check if an argument is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <directory>|<app-name>"
    exit 1
fi

# Change to the specified directory
cd "apps/$1" || { echo "Failed to change directory to $1"; exit 1; }

pnpm install kysely pg 

pnpm add -D kysely-ctl @types/pg kysely-codegen

echo 'DATABASE_URL=postgres://postgres:1234@localhost:5432/postgres' > .env

cp "$kysely_dir/db.ts" ./src/db/db.ts
cp "$kysely_dir/types.ts" ./src/db/types.ts
cp "$kysely_dir/kysely.config.ts" ./.config/kysely.config.ts

jq '.scripts += {
    "codegen:db": "kysely-codegen --out-file src/db/types.ts",
    "db:migrate:add": "kysely migrate:make",
    "db:migrate:up": "kysely migrate up",
    "db:migrate:down": "kysely migrate down"
}' package.json > tmp.$$.json && mv tmp.$$.json package.json