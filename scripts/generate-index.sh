#!/bin/bash

# Directory to start scanning (defaults to current directory if not provided)
TARGET_DIR=${1:-.}

# Function to generate index.ts for a given directory
generate_index_file() {
    local dir=$1
    local index_file="$dir/index.ts"

    ts_files=$(find "$dir" -maxdepth 1 -type f \( -name "*.ts" -o -name "*.tsx" \) ! -name "index.ts" ! -name "index.tsx" ! -name "tailwind.config.ts" ! -name "*.d.ts")

    if [ -n "$ts_files" ]; then
        echo "Generating $index_file..."

        > "$index_file"

        for file in $ts_files; do
            # Get the base filename without the extension
            basename=$(basename "$(basename "$file" .tsx)" .ts)
            # Write the export statement to index.ts
            echo "export * from './$basename';" >> "$index_file"
        done

        echo "index.ts generated in $dir"
    fi
}

# Find all directories and generate index.ts for each one
find "$TARGET_DIR" -type d | while read -r dir; do
    generate_index_file "$dir"
done

echo "All index.ts files have been generated recursively."
