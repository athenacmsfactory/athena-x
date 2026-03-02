# Changelog - Athena CMS Factory

## [8.0.5] - 2026-03-02
### 🔍 Site Reviewer & Stability Engine
- **Athena Site Reviewer**: Introductie van een nieuwe interactieve reviewer op `localhost:5001/reviewer.html`. Hiermee kunnen 35+ sites systematisch worden gecontroleerd met automatische installatie en opstart-logica.
- **EPIPE Immunity**: Kritieke fix voor de beruchte `EPIPE` crash die de dashboard-server willekeurig kon stoppen tijdens logging-operaties.
- **Smart Resource Management**: De `SiteController` ruimt nu proactief oude preview-servers op voordat een nieuwe wordt gestart, wat cruciaal is voor de stabiliteit op systemen met beperkt RAM (Chromebooks).
- **Forced Linux Environment**: De `athena.sh` launcher is geoptimaliseerd om geforceerd de Linux-versie van Chrome te openen via een absolute binary call (`/opt/google/chrome/google-chrome`), inclusief profiel-isolatie om ChromeOS overnames te voorkomen.
- **Bulk Audit Utility**: Nieuwe tool `bulk-site-audit.js` toegevoegd voor een snelle technische scan van het volledige portfolio.

## [8.0.4] - 2026-03-02
### 🛡️ Asset Reliability & Stability Standard (v8.2)
...
- **Safe Path Resolution**: Introductie van een robuust pad-resolutie protocol in `EditableMedia` en `EditableImage`. 
    - **Crash-proof**: Toegevoegd `typeof src === 'string'` checks om te voorkomen dat de applicatie crasht op `endsWith()` wanneer er per ongeluk objecten of null-waarden in afbeeldingsvelden staan.
    - **Smart Root Access**: Het systeem herkent nu automatisch root-assets (`.svg`, `.ico`, `.png` in de `public/` root) en omzeilt daarvoor de `/images/` submap.
- **Dock Stability Fix**: Hersteld van een kritieke "white screen" crash in de Athena Dock `VisualEditor` bij het openen van media-items. De ontbrekende `getPreviewUrl` functie is toegevoegd, inclusief een live preview en upload-interface.
- **EditableImage Upgrade**: De `EditableImage` component (gebruikt voor o.a. logo's en hero's) is gepromoveerd naar de v8.1 interactie-standaard. Het reageert nu correct op **Shift+Klik** voor bewerking in de Dock.
- **Tailwind v4 Utility Fix**: Opgelost van een build-fout in glassmorphism-thema's waarbij `@utility` directives genest waren binnen `@layer`, wat niet toegestaan is in de nieuwe v4 engine.
- **Ecosystem Recovery**: Volledige hersteloperatie uitgevoerd op `athena-hub` en 8 andere sites. De beruchte `images/images` pad-dubbeling fout is geëlimineerd via een schone rebuild en data-sync.

## [8.0.3] - 2026-03-02
### ⚡ User Experience & Interaction Standard (v8.1)
- **Swapped Dock Interaction Logic**: De interactie tussen de Dock en de Site is fundamenteel verbeterd. 
    - **Normale klik**: Voert nu altijd de standaard actie uit (link volgen, knop indrukken). Dit lost het probleem op waarbij live sites op GitHub Pages (zoals Athena Hub) Shift+Klik vereisten voor navigatie.
    - **Shift + Klik**: Is nu de standaard methode om een element te selecteren voor bewerking in de Athena Dock.
- **Universal Tooltip Update**: Alle `Editable` componenten (`EditableText`, `EditableLink`, `EditableMedia`) tonen nu de correcte instructie in de tooltip: "Shift+Klik om te bewerken".
- **Global Patch**: De nieuwe logica is batch-gewijs uitgerold naar alle 30+ bestaande sites in de `sites/` directory via een geautomatiseerde engine-patch.

## [8.0.2] - 2026-03-02
### ⚡ Performance & Scalability Optimization
- **Parallel Publisher Workflow**: De monorepo-publisher (`athena-publisher.yml`) is volledig herschreven. Sites worden nu parallel gebouwd en gepusht via een matrix-job, wat de deployment-tijd voor bulk-updates met circa 70% verlaagt.
- **Smart Caching**: Implementatie van `pnpm` store caching op GitHub Actions, waardoor `pnpm install` nagenoeg onmiddellijk klaar is bij herhaalde runs.
- **Optional Audits**: Lighthouse scans zijn nu standaard gedeactiveerd (triggerbaar via `[audit]` in commit) om de feedback-loop te versnellen.

### 🎨 Identity & Aesthetics
- **Randomized Logo Generator**: Introductie van een gecentraliseerde SVG-generator in de Factory-engine. Elke nieuwe site krijgt nu automatisch een uniek, gestileerd logo (Cirkel, Vierkant, Hexagon of Badge) gebaseerd op de sitenaam en primaire kleur.
- **Batch Logo Rollout**: Alle 36 bestaande portfolio-sites zijn voorzien van een uniek gegenereerd logo om lege slots in de headers te elimineren.
- **Urban Soles Media Overhaul**: Alle product-placeholders zijn vervangen door kwalitatieve, lokale afbeeldingen van echte sportschoenen.

### 🛒 E-Commerce & Structural Integrity
- **Cart Isolation Protocol**: De `CartContext` in de kern-boilerplates is aangepast om `localStorage` sleutels te gebruiken op basis van de `site_name`. Dit voorkomt dat winkelwagentjes van verschillende Athena-sites op hetzelfde domein met elkaar vermengd raken.
- **New Site Type**: `premium-webshop-filter` is toegevoegd aan de Factory. Dit type ondersteunt standaard interactieve product-filtering en categorie-badges, gebaseerd op de geoptimaliseerde Urban Soles structuur.

### 🛡️ Fixed & Refined
- **Logo Resolution**: `EditableMedia` is robuuster gemaakt voor paden die al `images/` bevatten, en ondersteunt nu logo's in de `public/` root.
- **Site Renaming**: `Code Crafters Bold` is gepromoveerd naar de standaard `Code Crafters` site; de oude versie is hernoemd naar `Code Crafters Plain`.
- **Publisher Fix**: De workflow stript nu trailing newlines van site-namen om `cd` errors in de runner te voorkomen.
- **Tailwind v4 Fix**: Conflicterende `@import` regels in `main.jsx` en `index.css` opgelost om 500 errors te voorkomen.

---

## [8.0.0-alpha] - 2026-03-01
### 💎 The v8 Gold Standard - Excellence Cycle
Dit is een fundamentele upgrade van de Factory-architectuur, gericht op 100% stabiliteit tussen de Dock en de Site, en een significante verbetering van de performance (LCP).

### 🚀 Breakthrough: v33 Sync Bridge (State Recovery Protocol)
**Het Probleem:** 
In complexe React-omgevingen traden race-conditions op waarbij de Dock-modal leeg bleef of waarden (zoals URLs) direct na het loslaten van een slider "terugsprongen" naar de oude JSON-waarde. Dit kwam doordat de server-write (opslaan op schijf) trager was dan de React re-render.

**De Oplossing (v33):**
- **On-Demand Sync:** De Dock "vraagt" nu bij het openen van een modal (of bij focus) expliciet aan de site: `DOCK_REQUEST_SYNC`.
- **State Responder:** De site (`App.jsx`) antwoordt direct met de data uit zijn actuele React-geheugen via `SITE_SYNC_RESPONSE`.
- **Ref-Based Binding:** De `VisualEditor` in de Dock gebruikt nu `useRef` en `defaultValue` in plaats van directe `value` binding om te voorkomen dat React-cycles de tekstvakken leegmaken tijdens het typen.

### 🛠️ Nieuwe Architectuur-Standaarden
- **Data Aggregation:** Introductie van `all_data.json`. De site laadt nu alle content in één netwerkverzoek, wat de LCP met **45%** verlaagt (getest op `athena-hub`: 2.1s -> 1.1s).
- **Modular Sections:** De monolithische `Section.jsx` is vervangen door een modulaire structuur in `src/components/sections/` (`HeroSection.jsx`, `ProductSection.jsx`, etc.).
- **Universal Save Bridge:** De "Save to Disk" knop gebruikt nu een veilige batch-update via een speciaal geconfigureerde Vite-middleware met harde CORS-headers.
- **Session Persistence:** Live-overrides worden tijdens de sessie gebufferd in de `sessionStorage` van de browser, waardoor wijzigingen behouden blijven, zelfs bij een harde pagina-ververs (F5).

### 🛡️ Security & Integrity
- **Media Mapper Filter:** Metadata-tabellen (`site_settings`, `style_bindings`) worden nu automatisch verborgen in de Visual Media Mapper om accidentele corruptie van systeemconfiguraties te voorkomen.
- **CORS Hardening:** De Vite-server van elke site is nu standaard uitgerust met handmatige CORS-headers voor poort 5001 en 5002.

---

## [7.9.7] - 2026-02-28
### Fixed
- **Jets Archive Restoration**: Resolved a critical white-page crash in `jets-archive` by wrapping the `App` component in a `HashRouter`.
- **Registry Port Correction**: Updated the centralized `sites.json` to reflect port 6225 for `jets-archive`.

... rest of history remains unchanged ...

## [2026-03-01] v8.0.1 - Athena Hub Showcase Update
- **Feature**: Toegevoegd 'showcase' sectie aan Athena Hub met 5 top-tier demo's.
- **Fix**: Hersteld hero CTA koppeling naar #showcase.
- **Optimization**: Lokale opslag van alle showcase afbeeldingen voor snelheid en betrouwbaarheid.
- **Architecture**: Verfijning van HeroSection image-key detectie via JSON volgorde.
- Mon Mar  2 03:54:19 PM CET 2026: Start onderzoek naar gedeelde node_modules (Lead Architect)
