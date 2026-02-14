#!/bin/bash
# Athena Site Status Checker
# Controleert alle sites op ongecommitte wijzigingen.

for dir in ../sites/*/ ; do 
    if [ -e "$dir/.git" ]; then
        echo "---------------------------------------"
        echo -e "📁 Site: \033[1;36m${dir%/}\033[0m"
        cd "$dir" && git status --short
        cd - > /dev/null
    fi
done
echo "---------------------------------------"
