# Athena CMS Factory - Master Context (v7.9.2)

## ⚡ Gemini-CLI SOP (Task Management)
1. **Startup**: Read `factory/TASKS/_CHANGELOG.md`, `factory/TASKS/_TODO.md`, and `factory/docs/*.md`.
2. **Execution**:
   - **MANDATORY**: Update `factory/TASKS/_TODO.md` and `factory/TASKS/_IN_PROGRESS.md` before starting any new task.
   - Add task to `factory/TASKS/_IN_PROGRESS.md` before starting.
   - Use `pnpm` for all Node.js operations (Disk/RAM efficiency).
   - Log background processes to `output/logs/`.
   - **Interaction**: Use `Shift+Click` on buttons/links in the site preview to test functionality; standard click remains for editing.
3. **Finalization**: Move completed tasks to `factory/TASKS/_DONE.md` and remove from `factory/TASKS/_TODO.md` / `factory/TASKS/_IN_PROGRESS.md`.

## 📂 Detailed Project Directory Structure
```text
/home/kareltestspecial/athena/
├── dock/                         # Visual Editor (Athena Dock) React App (Port 4002)
│   ├── public/sites.json         # Central registry of all generated sites
│   └── src/components/           # Dock UI components (DesignControls, DockFrame)
├── factory/                      # The Factory Engine and Resources (Dashboard Port 4001)
│   ├── athena.sh                 # 🚀 Main Launcher (Dashboard GUI)
│   ├── GEMINI.md                 # Master Context for the Factory
│   ├── cli/                      # 🖥️ CLI Interface (terminal menu: athena-cli.js)
│   ├── dashboard/                # 🌐 Web GUI (athena.js)
│   ├── 2-templates/              # Core boilerplates and generation logic
│   ├── 3-sitetypes/              # Business-specific blueprints
│   ├── 5-engine/                 # ⚙️ Shared Engine Library (factory.js, sync-*, parser-*)
│   ├── 6-utilities/              # Batch maintenance tools (update-all-heros.js)
│   └── output/logs/              # Centralized logging directory
├── input/                        # Data workspace (TSV, JSON, raw-input.txt)
└── sites/                        # Output directory for generated websites.
```

## 🏛️ Project Architecture
Athena is an automated factory for React 19 + Tailwind v4 sites, built as a monorepo.
- **factory/**: Dashboard (`dashboard/`), CLI (`cli/`), Engine (`5-engine/`), Utilities (`6-utilities/`).
- **dock/**: Visual Editor (Athena Dock) - communicates via `postMessage`.
- **input/**: Raw data (TSV/JSON/Scrapes).
- **sites/**: Independent Git repos for generated sites.

### 🔱 Two-Track Strategy
- **Docked**: Lightweight, editor-less, controlled by Athena Dock.
- **Autonomous**: Self-contained with built-in editor tools.

## 🛠️ Key Architectural Pillars (v7.9.2)
- **Governance-Driven**: Sites operate in `dev-mode` (full sync) or `client-mode` (push locked).
- **Style/Content Separation**: Content (Client) and Styles (Developer) are split into separate files locally and tabs in Sheets.
- **Dynamic Hero (v7.8.4)**: Integrated `hero_height` and `hero_aspect_ratio` settings.
- **Unified Interaction (v7.9.2)**: `Shift + Click` logic for functional testing; mandatory `data-dock-type` for editor reliability.
- **Standardized Sections (v7.8.6)**: 
    - Full support for `Grid`, `List`, and `Z-Pattern` layouts via `layout_settings.json`.
    - **Icon Mapping**: Automatic translation of descriptive names (`Zap`, `Smartphone`) to FontAwesome classes.
    - **Centering First**: Default `items-center` and `text-center` alignment for consistent premium look.
- **Object-Based Links (v7.9.2)**: Links are managed as `{label, url}` objects to prevent data loss during text edits.
- **Feature-Driven (Blueprint)**: Features (`ecommerce`, `google_search_links`) inject code during generation.
- **AI Survival Engine**: Multi-provider waterfall (Google -> Groq -> OpenRouter -> Hugging Face).
- **JSON-First Data**: Bundled data loading via `import.meta.glob` for SPA robustness.

## 🚨 Critical Constraints & Guardrails
- **Header Logo**: Must use `object-contain` and transparent container for optimal brand display.
- **CSS Architecture**: ONLY `index.css` should `@import "tailwindcss"`. 
- **Template Literals**: In `5-engine/logic/`, ALWAYS escape dollar signs in generated code: `\$`.
- **BaseURL**: Use `import.meta.env.BASE_URL` for ALL assets and internal links.
- **Pathing**: Generated sites use relative paths (`./`) in `index.html`.

## 📝 Git Workflow
- **Monorepo (athena-cms-monorepo)**: The primary repository for all development (factory, dock, and site sources).
- **Sites**: Individual client repositories generated and published to the `athena-cms-factory` GitHub organization via CI/CD (GitHub Actions) from the monorepo.
- **Commit Messages**: Prefix with type (e.g., `feat:`, `fix:`, `refactor:`).
- **Pushing**: Always check `git remote -v` for the monorepo. Individual site repos are managed by the CI/CD pipeline.
