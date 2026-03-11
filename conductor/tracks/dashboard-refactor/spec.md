# Specification: Dashboard Refactor (v8.7)

## Objective
Split the monolithic `factory/dashboard/` into two independent entities: `athena-api` (Backend) and `athena-dashboard-ui` (Frontend) to improve maintainability, developer experience (DX), and scalability.

## Architecture
- **athena-api (Backend):**
  - **Port:** 5000 (standard API port).
  - **Technology:** Express.js (ES Modules).
  - **Responsibility:** Data processing, controller execution (via `5-engine`), file system management, AI integration.
  - **Structure:**
    ```text
    factory/athena-api/
    ├── server.js (main entrypoint)
    ├── routes/ (modular API routes)
    ├── controllers/ (API-specific logic, if not in 5-engine)
    └── package.json
    ```

- **athena-dashboard-ui (Frontend):**
  - **Port:** 5001 (Production) / 5173 (Development with proxy).
  - **Technology:** React 19 + Vite + Tailwind v4.
  - **Responsibility:** User interface, data visualization, interaction logic.
  - **Structure:**
    ```text
    factory/athena-dashboard-ui/
    ├── src/ (React components, hooks, services)
    ├── public/
    ├── vite.config.js
    └── package.json
    ```

## Constraints
- **Strictly `pnpm`**: Use `pnpm` workspace management.
- **Human-Readable JSON**: Ensure all field names in Sheets/JSON remain Dutch.
- **Compatibility**: All existing `/api/*` endpoints must remain functional.
- **Production Serving**: In production, the API on 5000 (or a separate server) should serve the UI build on port 5001.

## Proposed Ports
| Service | Dev Port | Prod Port | Notes |
|---|---|---|---|
| athena-api | 5000 | 5000 | Backend REST API |
| athena-dashboard-ui | 5173 | 5001 | Frontend React App |

## Deployment Strategy
- Update `athena.sh` and `launch.sh` to start both services.
- Update `athena-dashboard.desktop` if necessary.
- Ensure the `athena-api` correctly handles CORS for development on port 5173.
