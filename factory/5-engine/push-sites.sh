#!/bin/bash
# Athena Site Mass Pusher
# Voert 'git push' uit voor elke submodule in de sites/ map.

echo "======================================="
echo "🚀 Athena Mass Push: Alle sites syncen"
echo "======================================="

count=0
success=0
errors=0

for dir in ../sites/*/ ; do 
    if [ -d "$dir/.git" ]; then
        # Verwijder trailing slash voor weergave
        site_name=$(basename "$dir")
        
        echo -e "\n📂 Site: \033[1;36m$site_name\033[0m"
        
        cd "$dir" || continue
        
        # Voer push uit
        git push
        
        if [ $? -eq 0 ]; then
            echo -e "   ✅ \033[1;32mSuccesvol gepusht\033[0m"
            ((success++))
        else
            echo -e "   ❌ \033[1;31mPush mislukt\033[0m"
            ((errors++))
        fi
        
        cd - > /dev/null
        ((count++))
    fi
done

echo -e "\n======================================="
echo -e "✨ Klaar! $count sites verwerkt."
echo -e "   ✅ $success gelukt"
if [ $errors -gt 0 ]; then
    echo -e "   ❌ $errors fouten"
fi
echo "======================================="
