# Implementation Plan: Dashboard Refactor (v8.7)

## Phase 1: Preparation & Scaffolding
- [x] Create `factory/athena-api` folder and initialize `package.json`.
- [x] Create `factory/athena-dashboard-ui` using Vite + React.
- [x] Update `factory/pnpm-workspace.yaml` to include new packages.
- [x] Run `pnpm install` at workspace root.

## Phase 2: Backend Migration (athena-api)
- [x] Move `factory/dashboard/athena.js` to `factory/athena-api/server.js`.
- [x] Correct engine imports and root paths.
- [x] Set backend port to 5000.
- [x] Synchronize API endpoints with new UI requirements (TODO, Marketing).

## Phase 3: Frontend Scaffolding (athena-dashboard-ui)
- [x] Set up Vite config with proxy to port 5000.
- [x] Set up Tailwind CSS v4.
- [x] Create `ApiService.js` for clean backend communication.
- [x] Implement Toast notification system.

## Phase 4: UI Conversion & Classic Look
- [x] Restore classic 180px Sidebar and 48px Top-bar.
- [x] Implement Dark Mode (Slate-Midnight) as the new standard.
- [x] Port Sites View with full action grid (10 buttons).
- [x] Port Data Hub Pipeline View.
- [x] Port Servers View with Start/Stop controls.
- [x] Port Storage & Health View.
- [x] Port GitHub Repositories View.
- [x] Port SiteTypes Blueprints View.
- [x] Port Roadmap (TODO) View.
- [x] Port Settings View.

## Phase 5: AI Wizards & Modals
- [x] Implement AI Site Generator Modal (3-step wizard).
- [x] Implement Marketing & SEO Modal.
- [x] Implement AI Blog Generator Modal.

## Phase 6: Integration & Finalization
- [ ] Replace original `factory/athena.sh` with v8.7 standard.
- [ ] Update root `launch.sh`.
- [x] Perform global logic & style verification.
- [ ] Clean up `factory/dashboard/` (Archive).
