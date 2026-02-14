#!/bin/bash

# Athena Dock Start Script
# Gebruik: ./start-dock.sh [dock_port] [site_port]

DOCK_PORT=${1:-4000}
SITE_PORT=${2:-3000}

echo "=================================================="
echo "⚓ Athena Dock Bootloader"
echo "=================================================="
echo "📝 Dock Port : $DOCK_PORT"
echo "📝 Site Port : $SITE_PORT"
echo "=================================================="

# Start Vite met de opgegeven poorten
# We geven VITE_SITE_PORT mee zodat de React code weet waar de site draait.
VITE_SITE_PORT=$SITE_PORT pnpm dev --port $DOCK_PORT --host 0.0.0.0 &

# Wacht even op de output
sleep 2

echo ""
echo "✅ pnpm run dev uitgevoerd."
echo "🌐 Dock opgestart op http://localhost:$DOCK_PORT"
echo ""
echo "👉 Volgende stappen:"
echo "   1. Start de site op met: cd sites/[projectnaam] && pnpm dev --port $SITE_PORT"
echo "   2. Zorg dat dock/public/sites.json correct is ingevuld."
echo "=================================================="

# Houd het script actief om de achtergrondtaak te monitoren
wait
