#!/bin/bash
# Athena Dashboard FALLBACK (v8.6 Standard)
# Dit script start het OUDE dashboard uit het archief op poort 5001.

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.."
cd "$PROJECT_ROOT"

# Ports
OLD_PORT=5001

# Stop alle v8.7 processen eerst
NODE_BIN=$(command -v node)
$NODE_BIN factory/cli/pm-cli.js stop 5000
$NODE_BIN factory/cli/pm-cli.js stop 5001
sleep 1

echo "⚠️  Starting Athena Dashboard FALLBACK (v8.6)..."
cd factory/dashboard-OLD-ARCHIVE
node athena.js --port $OLD_PORT &
cd ../..

echo "🌐 Fallback Dashboard geactiveerd op http://localhost:$OLD_PORT"
