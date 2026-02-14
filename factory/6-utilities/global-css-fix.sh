#!/bin/bash
# Athena Global CSS Fixer (v5)
# Replaces problematic Tailwind utilities with standard CSS for maximum compatibility.

SITES_ROOT="/home/kareltestspecial/ath/athena-2/sites"

for site in "$SITES_ROOT"/*; do
    if [ -d "$site" ]; then
        echo "Fixing site: $(basename "$site")"
        
        # 1. Consolidate Imports & Theme Fixes
        if [ -d "$site/src/css" ]; then
            for theme_file in "$site"/src/css/*.css; do
                if [ -f "$theme_file" ]; then
                    sed -i '/@import "tailwindcss";/d' "$theme_file"
                    sed -i '1i @import "tailwindcss";' "$theme_file"
                    
                    # Variables in @theme
                    if [[ "$theme_file" == *"classic.css"* ]]; then
                        if ! grep -q -- "--color-background" "$theme_file"; then
                            sed -i '/@theme {/a \  --color-surface: #ffffff;\n  --color-background: #ffffff;\n  --color-text: #1a1a1a;' "$theme_file"
                        fi
                    fi
                    if [[ "$theme_file" == *"modern-dark.css"* ]]; then
                         if ! grep -q -- "--color-background" "$theme_file"; then
                            sed -i '/@theme {/a \  --color-surface: #1a1a1a;\n  --color-background: #000000;\n  --color-text: #ffffff;' "$theme_file"
                        fi
                    fi
                    
                    # Refactor @apply hover:bg-opacity-90
                    # First remove it from @apply
                    sed -i 's/hover:bg-opacity-90//g' "$theme_file"
                    # Add standard CSS hover if not present
                    if ! grep -q ".btn-primary:hover {" "$theme_file"; then
                         echo "  -> Adding .btn-primary:hover opacity to $(basename "$theme_file")"
                         echo -e "\n.btn-primary:hover { opacity: 0.9; }" >> "$theme_file"
                    fi

                    # Standardize tracking-tight
                    sed -i 's/@apply tracking-tight;/letter-spacing: -0.025em;/g' "$theme_file"
                    
                    # Refactor card border @apply
                    sed -i 's/@apply p-6 border border-gray-200/@apply p-6 border; border-color: color-mix(in srgb, var(--color-text) 10%, transparent);/g' "$theme_file"
                fi
            done
        fi
        
        # 2. Refactor index.css
        if [ -f "$site/src/index.css" ]; then
            sed -i '/@import "tailwindcss";/d' "$site/src/index.css"
            if grep -q "bg-background" "$site/src/index.css"; then
                 sed -i 's/bg-background//g' "$site/src/index.css"
                 if ! grep -q "background-color: var(--color-background);" "$site/src/index.css"; then
                    sed -i '/.cart-overlay {/a \    background-color: var(--color-background);' "$site/src/index.css"
                 fi
            fi
        fi
    fi
done

echo "✅ Global CSS fix v5 complete."
