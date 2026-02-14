# Athena System Audit Report - v7.6.2

## 1. Redundancy Analysis

### 1.1 Template Redundancy
The current `factory/2-templates/boilerplate` structure maintains two separate tracks: `autonomous` and `docked`. While their purposes differ (inline editing vs. passive viewing), they share significant amounts of code:
- **UI Components:** `Badge.jsx`, `Button.jsx`, `Card.jsx` are virtually identical across tracks.
- **Core Logic:** `CartContext.jsx`, `CartOverlay.jsx`, and various `Editable*.jsx` components have overlapping functionality.
- **Project Structure:** Both tracks use nearly identical `SPA` boilerplates.

### 1.2 Engine Redundancy
`factory/5-engine/factory.js` contains hardcoded logic for both tracks. The `copyWithFallback` and `essentialComponents` lists are manually maintained and prone to desynchronization.

## 2. Engine Architecture Improvements

### 2.1 From String Replacement to Structured Templates
The current engine relies heavily on `.replace(/{{TAG}}/g, value)`.
- **Proposed:** Implement a more robust templating approach. For complex JSX transformations, explore using a lightweight AST-based approach or a more formalized template system that allows for conditional blocks without messy regex.

### 2.2 Modular Plugin System
The `factory.js` is currently a monolith.
- **Proposed:** Break down `createProject` into modular phases:
  1. `InitializeStructure`: Create directories and base configs.
  2. `ResolveTrack`: Determine if `autonomous` or `docked`.
  3. `AssembleComponents`: Gather components from `shared`, `track-specific`, and `sitetype-specific` sources.
  4. `TransformCode`: Apply transformations (placeholders, shop-logic, etc.)
  5. `Finalize`: Git init, pnpm install, and data sync.

## 3. Workflow & Orchestration

### 3.1 `athena.js` Enhancements
The master dashboard is functional but purely sequential.
- **Proposed:** Add better error handling and progress indicators. Ensure that concurrent operations (like multi-site updates) are handled safely.

### 3.2 Asset Scavenging
The `scavengeAssets` function is a great start but could be more efficient by using a pre-indexed map of assets if the project grows.

## 4. Governance & Standards (v7.6.2)

### 4.1 Tailwind v4
- **Audit:** Verify all `index.css` templates.
- **Action:** Ensure `@theme` blocks are used correctly and old `@tailwind` imports are removed.

### 4.2 Style/Content Separation
- **Audit:** Check if any templates have hardcoded content that should be in JSON.
- **Action:** Move any remaining hardcoded strings to `site_settings.json` or equivalent.

## 5. Implementation Roadmap

1. **Phase 1: Centralization**
   - Create `factory/2-templates/shared/`.
   - Move universal UI components and hooks there.
   - Update `factory.js` to look in `shared/` before track-specific folders.

2. **Phase 2: Engine Modernization**
   - Refactor `factory.js` into a class or modular set of functions.
   - Improve the transformation engine.

3. **Phase 3: Cleanup**
   - Remove legacy `factory/2-templates/boilerplate/SPA` and `MPA` folders.
   - Standardize all `sitetypes` to follow the new shared structure.
