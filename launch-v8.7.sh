#!/bin/bash
# Athena Dashboard Launcher (v8.7 - Decoupled)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# Maak log directory aan
mkdir -p output/logs
TIMESTAMP=$(date +%Y-%m-%d)
LOG_FILE_API="output/logs/${TIMESTAMP}_athena_api.log"
LOG_FILE_UI="output/logs/${TIMESTAMP}_athena_ui.log"

# Ports
API_PORT=5000
UI_PORT=5001

# Clean up existing processes
NODE_BIN=$(command -v node)
$NODE_BIN factory/cli/pm-cli.js stop $API_PORT
$NODE_BIN factory/cli/pm-cli.js stop $UI_PORT
sleep 1

echo "🔱 Starting Athena API on port $API_PORT..."
cd factory/athena-api
pnpm start > "../../$LOG_FILE_API" 2>&1 &
cd ../..

echo "🌐 Starting Athena Dashboard UI on port $UI_PORT..."
cd factory/athena-dashboard-ui
# In production, this would be a build served by the API, but for now we start dev
pnpm dev --port $UI_PORT > "../../$LOG_FILE_UI" 2>&1 &
cd ../..

sleep 3

# Open browser
USER_DATA_DIR="/home/kareltestspecial/.chrome-linux-profile"
mkdir -p "$USER_DATA_DIR"

URL="http://localhost:$UI_PORT"
echo "Opening $URL..."

if [ -f "/opt/google/chrome/google-chrome" ]; then
    /opt/google/chrome/google-chrome --user-data-dir="$USER_DATA_DIR" --new-window "$URL" --no-first-run --no-default-browser-check &
else
    xdg-open "$URL"
fi
