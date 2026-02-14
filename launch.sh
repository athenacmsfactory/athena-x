#!/bin/bash

# Prevent OOM errors on 4GB systems
export NODE_OPTIONS="--max-old-space-size=2048"

# ==================================================
# 🚀 ATHENA UNIFIED LAUNCHER (v2)
# ==================================================
# Beschrijving: Sync sites, start Dock en start Site.
# Gebruik: ./launch.sh [site-naam]
# ==================================================

PROJECT_ROOT=$(dirname "$(readlink -f "$0")")
LOG_DIR="$PROJECT_ROOT/factory/output/logs"
mkdir -p "$LOG_DIR"

DATE=$(date +%Y-%m-%d_%H-%M-%S)
DOCK_LOG="$LOG_DIR/${DATE}_dock_launch.log"
SITE_LOG="$LOG_DIR/${DATE}_site_launch.log"

echo "=================================================="
echo "🧹 STAP 0: Logs opschonen (max 10)..."
node "$PROJECT_ROOT/factory/6-utilities/rotate-logs.js"

DOCK_PORT=4002
SITE_PORT=3000

echo "=================================================="
echo "🔄 STAP 1: Sites overzicht synchroniseren..."
node "$PROJECT_ROOT/factory/6-utilities/sync-dock-sites.js"
echo "=================================================="

# Laad dashboard poort uit .env
if [ -f "$PROJECT_ROOT/factory/.env" ]; then
    ENV_DASHBOARD_PORT=$(grep DASHBOARD_PORT "$PROJECT_ROOT/factory/.env" | head -n 1 | cut -d '=' -f2 | tr -d '\r')
fi
FINAL_DASHBOARD_PORT=${ENV_DASHBOARD_PORT:-4001}

# 2. Selecteer Site
SELECTED_SITE=$1

if [ -z "$SELECTED_SITE" ]; then
    echo "📂 Beschikbare Athena Sites:"
    echo "--------------------------------------------------"
    ls "$PROJECT_ROOT/sites"
    echo "--------------------------------------------------"
    echo -n "👉 Welke site wil je starten? "
    read SELECTED_SITE
fi

SITE_PATH="$PROJECT_ROOT/sites/$SELECTED_SITE"

if [ ! -d "$SITE_PATH" ]; then
    echo "❌ Fout: Site '$SELECTED_SITE' niet gevonden in $PROJECT_ROOT/sites"
    exit 1
fi

echo "=================================================="
echo "⚓ STAP 2: Start Athena Dock op poort $DOCK_PORT..."
cd "$PROJECT_ROOT/dock"
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules ontbreken in dock, installeren..."
    pnpm install
fi
VITE_SITE_PORT=$SITE_PORT VITE_DASHBOARD_PORT=$FINAL_DASHBOARD_PORT pnpm dev --port $DOCK_PORT --host 0.0.0.0 > "$DOCK_LOG" 2>&1 &
DOCK_PID=$!

echo "🏗️  STAP 3: Start Site '$SELECTED_SITE' op poort $SITE_PORT..."
cd "$SITE_PATH"
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules ontbreken in $SELECTED_SITE, installeren..."
    pnpm install
fi
pnpm dev --port $SITE_PORT --host 0.0.0.0 > "$SITE_LOG" 2>&1 &
SITE_PID=$!

echo "=================================================="
echo "✅ ALLES GESTART!"
echo "🌐 Dock : http://localhost:$DOCK_PORT"
echo "🌐 Site : http://localhost:$SITE_PORT"
echo "--------------------------------------------------"
echo "📝 Logs Dock : factory/output/logs/$(basename $DOCK_LOG)"
echo "📝 Logs Site : factory/output/logs/$(basename $SITE_LOG)"
echo "--------------------------------------------------"
echo "💡 Tip: Gebruik 'htop' om je 4GB RAM te monitoren."
echo "👉 Druk op [CTRL+C] om beide servers te stoppen."
echo "=================================================="

# Functie om netjes af te sluiten
cleanup() {
    echo -e "\n🛑 Servers worden gestopt..."
    kill $DOCK_PID $SITE_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Houd script actief
wait