#!/bin/bash

echo "🔄 Converting TypeScript to JavaScript..."
echo "=========================================="

# Function to convert a single file
convert_file() {
    local ts_file="$1"
    local js_file="${ts_file%.tsx}.js"
    js_file="${js_file%.ts}.js"
    
    echo "Converting: $ts_file -> $js_file"
    
    # Remove TypeScript types and annotations
    sed -E '
        # Remove type annotations from function parameters
        s/: [A-Za-z<>\[\]{}|&, ]+//g
        # Remove interface definitions
        /^interface /d
        /^type /d
        # Remove React.FC type
        s/: React\.FC<[^>]*>//g
        # Remove generic type parameters
        s/<[^>]*>//g
        # Remove type assertions
        s/ as [A-Za-z<>\[\]{}|&, ]+//g
        # Remove type imports
        s/import [^}]*{[^}]*} from [^;]*;//g
        # Remove ReactNode type
        s/: ReactNode//g
        # Remove any other type annotations
        s/: [A-Za-z][A-Za-z0-9_]*//g
    ' "$ts_file" > "$js_file"
    
    # Update import statements to use .js extension
    sed -i 's/from '\''\.\/[^'\'']*\.tsx'\''/from '\''\.\/\1.js'\''/g' "$js_file"
    sed -i 's/from '\''\.\/[^'\'']*\.ts'\''/from '\''\.\/\1.js'\''/g' "$js_file"
}

# Convert all TypeScript files
find client/src -name "*.tsx" -o -name "*.ts" | while read file; do
    if [[ "$file" != "*.d.ts" ]]; then
        convert_file "$file"
    fi
done

echo "✅ Conversion complete!"
echo "📁 Files converted:"
find client/src -name "*.js" | head -20

echo ""
echo "🗑️ Removing original TypeScript files..."
find client/src -name "*.tsx" -o -name "*.ts" | while read file; do
    if [[ "$file" != "*.d.ts" ]]; then
        rm "$file"
        echo "Removed: $file"
    fi
done

echo ""
echo "🎉 TypeScript to JavaScript conversion completed!"
