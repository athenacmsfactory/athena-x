# Athena Factory - Log Management Schema

Dit document beschrijft hoe en waar logs worden opgeslagen in de Athena Factory.

## Centrale Opslag
Alle logs worden opgeslagen in: `./output/logs/`

## Naamconventie
Logs volgen het format: `YYYY-MM-DD_[script_naam].log`

## Log Typen

| Log Naam | Gegenereerd door | Beschrijving |
|:---|:---|:---|
| `dashboard` | `launch-dashboard.sh` | De hoofd Express server logs (poort 3000). |
| `layout-editor` | `dashboard/server.js` | Logs van de visuele layout architect. |
| `media-mapper` | `dashboard/server.js` | Logs van de visuele media mapping tool. |
| `preview_[id]` | `dashboard/server.js` | Logs van de `pnpm dev` server voor site previews (poort 4000). |
| `smoke_test` | `smoke-test-generator.js` | Resultaten van de automatische integratie-tests. |

## Ontwikkelrichtlijnen
Gebruik voor nieuwe scripts altijd de logger utility:
```javascript
import { getLogPath, logToFile } from '../5-engine/lib/logger.js';

// Voor child processen:
const logPath = getLogPath('mijn-script');

// Voor directe logging:
logToFile('mijn-script', 'Bericht');
```
