# Athena CMS Factory - Detailed Architecture & Flow

This document provides deep insight into the interactions between various scripts in the Athena Factory (v7.6.1).

## 1. Functional Hierarchy

The system has two main entry points (Hubs) that drive the rest of the engine:

1.  **Visual Hub:** `dashboard/server.js` (Express API)
2.  **CLI Hub:** `5-engine/athena.js` (Interactive Menu)

Both hubs act as "orchestrators": they contain little business logic themselves but spawn child processes or import modules to perform tasks.

---

## 2. Dependency Register (Detailed)

| Script | Path | Primary Hub | Key Dependencies | Output / Effect |
|:---|:---|:---|:---|:---|
| **Factory Engine** | `5-engine/factory.js` | Dashboard / CLI | `auto-sheet-provisioner.js`, `standard-layout-generator.js` | Generates complete React site in `../sites/` |
| **AI Engine** | `5-engine/ai-engine.js` | Many scripts | Google Gemini API, `.env` | Structured AI responses |
| **Parser Wizard** | `5-engine/parser-wizard.js` | CLI | `parser-engine.js`, `sync-tsv-to-sheet.js` | Processed data in `input/[project]/tsv-data/` |
| **Global Update** | `6-utilities/update-all-sites.js` | CLI | `standard-layout-generator.js` | Propagates v7.6+ features to existing sites |
| **Deploy Wizard** | `5-engine/deploy-wizard.js` | Dashboard / CLI | Git, GitHub CLI (`gh`), `env-loader.js` | Live website on GitHub Pages |
| **MPA Generator** | `5-engine/mpa-generator.js` | Manual | `react-router-dom` templates | Multi-page site architecture |
| **Layout Visualizer** | `5-engine/layout-visualizer.js`| Dashboard | `ai-engine.js`, `standard-layout-generator.js` | New JSX components in sitetypes |
| **Logger Utility** | `5-engine/lib/logger.js` | All (via import) | - | Logs in `output/logs/` |
| **Sync JSON -> Site** | `5-engine/sync-json-to-site.js`| `factory.js` | - | Copies data from `input/` to `sites/` |
| **Athenafier** | `5-engine/athenafier.js` | Manual | `cheerio`, `ai-engine.js` | Converts external HTML to Athena Site |

---

## 3. Data Flow Scenarios

### Scenario A: Creating a New Site (Happy Path)
1.  User selects project in **Dashboard**.
2.  Dashboard calls `factory.js`.
3.  `factory.js` reads blueprint from `3-sitetypes/`.
4.  `factory.js` calls `standard-layout-generator.js` to create `Section.jsx`.
5.  `factory.js` executes `pnpm install` in the new site directory.
6.  `factory.js` initializes Git and makes an initial commit.

### Scenario B: Saving Visual Edits to Cloud (v7.6 Split-Save)
1.  User edits text or a link in **Athena Dock**.
2.  Dock sends change to site (`vite-plugin-athena-editor.js`).
3.  **Split-Save**: Labels go to local JSON (e.g., `basisgegevens.json`), URLs go to `links_config.json`.
4.  User clicks "Sync to Sheets" in Dashboard.
5.  Dashboard calls `sync-json-to-sheet.js`.
6.  Script pushes content to primary tabs and URLs to the **hidden tab** `_links_config`.

---

## 4. Log Destinations (Schema)

Since v6.9, all non-interactive logs are centralized:

*   **Dashboard:** `output/logs/[date]_dashboard.log`
*   **Previews:** `output/logs/[date]_preview_[site-id].log`
*   **Background Tools:** `output/logs/[date]_[tool-name].log`

---

## 5. Critical Points for Developers

*   **Dollar Signs:** In generators (`factory.js`, `standard-layout-generator.js`), every `$` in template literals must be escaped as `\$` to avoid conflicts with the Node.js runtime.
*   **Path Resolution:** Always use `path.resolve()` or `path.join(__dirname, ...)` because scripts can be called from different working directories (root, dashboard, 5-engine).
*   **RAM Management:** For heavy operations (like `pnpm install`), always use `--child-concurrency 1` (or equivalent) to avoid exceeding the 4GB RAM limit.
