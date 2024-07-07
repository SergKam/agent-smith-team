#!/bin/bash

output_file="concatenated.ts"
root_dir=$(pwd)

# Clear the output file
> $output_file

# Loop over all .ts, .yaml, and .json files in the src directory, excluding ./data and ./package-lock.json
find ./ \( -name "*.ts" -o -name "*.yaml" -o -name "*.json" \) -type f | grep -v -e "concatenated.ts" -e "node_modules" -e "./data" -e "package-lock.json" | while read -r file
do
    # Convert absolute path to relative
    relative_file_path=${file#./}

    # Add a comment with the relative file name
    echo "// $relative_file_path" >> $output_file

    # Append the file content to the output file
    cat "$file" >> $output_file

    # Add a newline after each file for better readability
    echo "" >> $output_file
done
