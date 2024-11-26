#!/bin/bash
script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
init_files_dir="$script_dir/../shared/init-files"

# Check if an argument is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <directory>|<app-name>"
    exit 1
fi

# Change to the specified directory
cd "apps/$1" || { echo "Failed to change directory to $1"; exit 1; }

# Define an array of library names
workspace_libraries=(
    "@repo/tailwind-config"
    "@repo/typescript-config"
)

# Iterate over the array and add each library to devDependencies
for lib in "${workspace_libraries[@]}"; do
    jq --arg lib "$lib" '.devDependencies[$lib] = "workspace:*"' package.json > tmp.$$.json && mv tmp.$$.json package.json
    echo "added $lib to devDependencies"
done

pnpm add -D prettier-plugin-tailwindcss
pnpm add tailwindcss-animate

# Copy all files from init-files to the current directory
cp -r "$init_files_dir/." .

pnpm install