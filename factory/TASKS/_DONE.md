# ✅ DONE - Athena CMS

## Maintenance & Localization (Jets Archive) - 2026-02-28
- [x] **Jets Archive Restoration**
    - Hersteld van white-page crash door `HashRouter` toe te voegen in `App.jsx`.
    - Geïntegreerd `DisplayConfigProvider` en `StyleProvider` voor volledige Dock-compatibiliteit.
    - Gecorrigeerd van Header props (`siteSettings`).
- [x] **Asset Localisatie**
    - Gemigreerd van 48 jet-afbeeldingen van externe Wikimedia URLs naar lokale bestanden in `public/`.
    - Gedownload van ontbrekende afbeeldingen (`p-80`, `f-84`) om 100% dekking te garanderen.
    - Bijgewerkt van `jets.json` met directe lokale paden.
- [x] **Registry Fix**
    - Bijgewerkt van `dock/public/sites.json` met de correcte poort (6225) voor `jets-archive`.
    - Geconfigureerd van `repoUrl` en `liveUrl` voor publicatie naar de `athena-cms-factory` organisatie.
- [x] **Deployment Target Setup**
    - Aangemaakt van `sites/jets-archive/project-settings/deployment.json` om de publisher te forceren de juiste GitHub organisatie te gebruiken.


## Live & URL Manager & Link Resolution - 2026-02-21
- [x] **Athena URL Manager GUI**
    - Herbenoemd van Live Manager naar URL Manager voor breder bereik.
    - Toegevoegd kolom voor **Local URL** met play-icoon voor directe lokale navigatie.
    - Optimalisatie van kolombreedtes (Repo URL breder, Local URL smaller).
- [x] **Dock "Quick Deploy" Integratie**
    - Geautomatiseerde detectie van lokale links naar on-gedeployde sites in de `VisualEditor`.
    - Geïmplementeerd "Deploy Now" paneel voor snelle publicatie vanuit de bewerkings-flow.
    - Dynamische poort-detectie (Dashboard origin) voor stabiele API-communicatie.
- [x] **Automated Registry Sync v2**
    - Bijgewerkt van `sites.json` met `localUrl` ondersteuning.
- [x] **Dock UI Refinement**
    - Vervangen van "pills" door een compact dropdown-menu in de `VisualEditor` voor live site suggesties.
    - Weergave van volledige `https://...` URLs in de dropdown voor maximale duidelijkheid.
- [x] **Localhost Link Resolver Utility**
    - Ontwikkeld `factory/6-utilities/resolve-localhost-links.js` voor batch-migratie van lokale links naar productie URLs.
- [x] **Athena Hub Restoration**
    - Hersteld van Dock editing functionaliteit in de centrale hub site.
    - Bijgewerkt van alle showcase links naar de werkelijke live locaties.

## Data Hub & Workflow Orchestration - 2026-02-17
- [x] **Athena Data Hub Implementation**
    - Ombouw van de "Projecten" tab naar een visuele 4-traps pipeline (Ingestie -> Extractie -> Site Core -> Cloud).
    - Toegevoegd visuele status-indicatoren en context-bewuste actieknopen per fase.
- [x] **Unificatie van Terminologie (Data Bron)**
    - Volledige migratie van de term "Project" naar "Data Bron" (Data Source) voor alle input-gerelateerde mappen en acties.
    - Bijgewerkt in Dashboard UI, modals, tooltips en alle documentatie (`DEVELOPER_MANUAL.md`, `WORKFLOW_OVERVIEW.md`, etc.).
- [x] **Data Gateway Modal**
    - Geïmplementeerd gecentraliseerde modal op de site-cards voor alle data-stromen.
    - Ondersteuning voor: `Pull from Cloud`, `Push to Cloud`, en `Pull from local input folder` (voorheen TSV sync).
- [x] **Slimme Preview Orchestratie**
    - `SiteController` uitgebreid met automatische dependency-check en proces-spawning via `ProcessManager`.
    - Gebruikers kunnen nu met één klik (`DEV`) een site opstarten zonder handmatige installatie of terminal-commando's.
- [x] **Interactieve Roadmap Fixes**
    - Hersteld van de `/api/roadmaps` en `/api/todo` endpoints.
    - Toegevoegd nieuwe "Client Onboarding & Discovery" track voor stap-voor-stap begeleiding.
- [x] **Launcher Optimalisatie**
    - Splitsing van `launch.sh` (GUI) en `launch-cli.sh` (CLI).
    - Bijgewerkt `.bash_aliases` met de nieuwe `athdev` shortcut.

## E-commerce & Betaalsystemen (Stripe) - 2026-02-15
- [x] **Stripe Checkout Integratie**
    - Ontwikkeld `PaymentController.js` voor beveiligde server-side betaalsessies.
    - Geüpgrade `Checkout.jsx` in alle e-commerce sitetypes en bestaande sites.
    - Ondersteuning voor Bancontact, Payconiq, iDEAL, PayPal en Creditcard.
- [x] **Hybride Bestelflow**
    - Gecombineerde weergave van Stripe (automatisch) en E-mail (handmatig) in de checkout.
    - Automatische mandje-leeg functie na geslaagde Stripe betaling.
- [x] **Documentatie & Roadmaps**
    - Toegevoegd "Payment Gateway" Expert track aan de interactieve roadmap.
    - Geschreven `HANDLEIDING_STRIPE.md` voor developers en klanten.

## Gateway & Simulation (Operation War Game) - 2026-02-15
- [x] **Gmail IMAP Integration**
    - Transitioned Athena Gateway from Outlook to a dedicated Gmail account (`athena.cms.agent@gmail.com`).
    - Verified real-world email connectivity using `ImapFlow`.
    - Added `factory/tests/verify-imap.js` for automated connectivity audits.

## Self-Healing & Automated Monitoring - 2026-02-14
- [x] **Nightly Monitor Script (`athena-monitor.sh`)**
    - Implemented a bash-based master monitor that executes global audits.
    - Automated storage pruning (enforcing dormancy) to protect Chromebook SSD.
    - Added automated `pnpm store prune` to the maintenance cycle.
- [x] **Integrated Doctor Logic**
    - Connected the `DoctorController` audit/heal cycle to the monitoring script.
    - Generated a summary report in `output/logs/monitor.log`.

## Hydration Management System (Node Storage Optimization) - 2026-02-14
- [x] **Hierarchical Hydration Logic**
    - Implemented `DoctorController.js` with support for `Site > Group > Global` policy levels.
    - Added `hydrate()` (pnpm install) and `dehydrate()` (rm -rf node_modules) methods.
    - Integrated policy enforcement into the site audit cycle.
- [x] **Headless CLI Support (athena-agent.js)**
    - Added `storage-status`, `storage-policy`, `storage-enforce`, and `storage-prune-all` commands.
    - Enabled AI agents to manage disk space autonomously.
- [x] **Dashboard Visual Interface**
    - Created "Storage & Health" tab in the Athena Dashboard.
    - Added disk usage visualization and savable space calculation.
    - Implemented interactive policy management and bulk pruning tools.
- [x] **Automated Storage Metrics**
    - Integrated `du -sm` based storage calculation for real-time MB reporting per site.

## Link & Media Editor Robustness (v7.9.2) - 2026-02-09
- [x] **Universal Field Typing (data-dock-type)**
    - Added mandatory `data-dock-type` attributes (`text`, `media`, `link`) to all editable components (`EditableText`, `EditableMedia`, `EditableLink`).
    - This ensures the Athena Dock always opens the correct editor modal (e.g., Link Editor for links, Media for images) regardless of field naming.
    - Propagated these changes to all existing sites in `sites/` and shared templates.
- [x] **Shift+Click Interaction Mandate**
    - Standardized `Shift+Click` behavior across all sites to allow functional testing of links and buttons without triggering the editor.
    - Updated `dock-connector.js` across the entire ecosystem to support this logic.
- [x] **Object-Based Link Data (v7.8.7 Refinement)**
    - Updated `EditableLink` to support object-based values (containing both `label` and `url`).
    - Refactored `vite-plugin-athena-editor.js` to save the full link object to main data files, ensuring the frontend always has access to both label and destination.
    - Fixed corrupted `showcase.json` data in `athena-hub` where URLs were being overwritten by labels.
- [x] **Showcase & Process Section Polish**
    - Debugged and production-readied the `showcase` and `proces` sections in the `athena-showcase` sitetype.
    - Verified link functionality and visual consistency in the Athena Hub.

## Engine & Template Stability (v7.9.1)
- [x] **Vite Port Configuration Fix**
    - Corrected broken syntax in `factory/2-templates/config/vite.config.js` template (fixed missing braces and invalid formatting in port placeholder).
    - Upgraded `factory/5-engine/factory.js` with a robust regex-based replacement engine for `{{PORT}}` and `{{BASE_PATH}}` that handles optional spaces.
    - Manually repaired broken `vite.config.js` files for `demo-consultant` and `demo-bakkerij`.
    - Verified that `demo-consultant` now starts correctly on port 5982.
- [x] **Subfolder Preview Support (MIME Type Fix)**
    - Updated `vite.config.js` template to dynamically set the `base` path during development (e.g., `/demo-consultant/`).
    - This resolves "unsupported MIME type ('text/html')" errors for Service Workers (`sw.js`) and manifests when sites are accessed via a subfolder.
- [x] **Robust Data Loading Migration**
    - Converted brittle static imports in `demo-bakkerij` and `chocolade-shop` back to the robust `import.meta.glob` pattern.
    - Added `style_config.json` and `section_settings.json` to the mandatory file generation list in `factory.js`.
    - Automated creation of missing mandatory JSON files across all sites to prevent build failures.
- [x] **CSS Import Path Fix (demo-bakkerij)**
    - Fixed a 500 error caused by an incorrect `@import` path in `index.css`. The path was updated from `./modern.css` to `./css/modern.css` to match the project structure.
- [x] **Public Asset Transformation**
    - Enhanced `factory.js` to automatically replace placeholders (like `{{PROJECT_NAME}}`) in `public/manifest.json` and `public/sw.js` during site generation.
    - Manually fixed placeholders in existing showcase sites.

## UI/UX & Sitetype Management (v7.9.0)
- [x] **Sitetype Sync (athena-showcase)**
    - Updated `athena-showcase` sitetype with generalized `App.jsx` and `Header.jsx` from `athena-hub`.
    - Integrated dynamic `content_top_offset` and header transparency logic.
    - Standardized `Section.jsx` layout for high-end showcases.
- [x] **Dashboard Sitetype Refactor**
    - Converted Sitetypes tab into a detailed overview grid.
    - Moved SiteType Wizard creation flow to a modular modal.
    - Improved API to scan and display sitetypes from both `docked` and `autonomous` tracks.
- [x] **Site Re-generation (demo-consultant)**
    - Successfully rebuilt `demo-consultant` using the updated `athena-showcase` blueprint.
    - Verified data preservation and layout improvements.

## UI/UX & Data Sync (v7.8.9)
- [x] **Consolidated Sync Interface (Push/Pull)**
    - Replaced redundant "Visuals" and "Full Sync" buttons with a single **Push Sync** button.
    - Added **Pull Sync** button for fetching data from Google Sheets to local JSON.
    - Renamed and streamlined the Google Sheet Manager modal layout.
- [x] **Robust Pathing & Suffix Support**
    - Updated all sync engines (`sync-json-to-tsv.js`, `sync-json-to-sheet.js`, `sync-full-project-to-sheet.js`, `sync-sheet-to-json.js`) to support both `[id]` and `[id]-site` directory naming conventions.
    - Fixed path resolution issues in `dashboard/server.js` for project settings and data directories.
- [x] **Authentication & Provisioning Robustness**
    - Implemented Service Account fallback in `auto-sheet-provisioner.js` to bypass OAuth `invalid_grant` errors.
    - Added "Manual Actions" checklist to the Sheet Manager modal for public TSV publishing.
- [x] **Media Audit Utility**
    - Created `6-utilities/audit-media.js` to safely identify unused images and broken links.
- [x] **Chocolade Shop Restoration**
    - Fixed empty site issue by correctly importing and merging `style_config.json` in `main.jsx` and `App.jsx`.
    - Relinked to a fresh, correctly structured Google Sheet.

## UI/UX & Layout Controls (v7.8.8)
- [x] **Global Content Offset (Overlap Fix)**
    - Implemented `content_top_offset` as a global layout setting.
    - Added slider in Dock -> Design Editor.
    - Integrated CSS variable `--content-top-offset` into `App.jsx` and `dock-connector.js`.
- [x] **Advanced Header Controls in Dock**
    - Added live preview controls for:
        - `header_visible`: Toggle whole header.
        - `header_transparent`: Toggle background transparency/blur.
        - `header_height`: Adjustable height via slider.
        - `header_show_logo/title/tagline/button`: Toggle individual elements.
    - Updated `Header.jsx` boilerplate to support these dynamic variables.
- [x] **Dock Engine Refactor**
    - Updated `DesignControls.jsx` `handlePreview` to support non-prefixed variables for live preview.
    - Patched `athena-hub` as a reference implementation.

## UI/UX & Layout Controls (v7.8.7)
- [x] **Initial Hero & Header Controls** (Replaced by v7.8.8 refinement)

## Task Management & SOP
- [x] **Task Management Mandate**
    - Updated `factory/GEMINI.md` to require task management updates before starting tasks.

## Earlier Tasks
...
## [2026-03-01] Excellence Cycle v8 - Site #1 Complete\n- **Athena Hub (Site #1)**: Full v8 refactor (all_data.json, modular sections, LCP optimization).\n- **Dock-to-Disk Bridge**: Implemented explicit 'Save to Disk' with CORS and Middleware support.\n- **Multi-Agent Protocol**: Upgraded to v1.9 with Live Mirroring and session-specific roles.
- [x] **Athena Hub Demo Showcase**: Toegevoegd curated demo sectie met lokale afbeeldingen en hero CTA koppeling.
- **Media Mapper Security**: Implemented metadata filtering to prevent accidental corruption of system files.\n- **Data Integrity**: Restored corrupted style_bindings.json and implemented array-safe state merging in App.jsx.\n- **User Experience**: Added explicit 'Save to Disk' button with visual feedback and URL sanitization.
- **Debug Bridge v33**: Implemented On-Demand Data Sync between Dock and Site to resolve UI race conditions.\n- **Link Integrity**: Solved the 'Ghost Data' issue where URLs were lost during saves.\n- **UI Perfection**: Unified the navigation logic for both local anchors and external URLs.
### [2026-03-01] Site #1 Excellence Certification\n- Completed full v8 refactor of 'athena-hub'.\n- Implemented v33 Sync Bridge for real-time data recovery.\n- Standardized modular section architecture.
