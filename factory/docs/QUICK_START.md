# Quick Start Guide (February 2026 - v7.6.2)

## 1. Installation
Clone the repository and install dependencies:
```bash
pnpm install --child-concurrency 1
```

## 2. Environment Variables (.env)
Copy `.env.example` to `.env`. You can fill in the variables manually or manage them via the **Settings** tab once the dashboard is running.

### GitHub
- `GITHUB_USER` & `GITHUB_ORG`: Your GitHub username and organization (currently: `athenacmsfactory`).
- `GITHUB_PAT`: Personal Access Token (with `repo` and `delete_repo` scopes).
- `GITHUB_SSH_HOST`: The SSH alias configured in `~/.ssh/config` (e.g., `github.com-athenacms`).

### Google API (Service Account)
- Used for daily data synchronization. Place `service-account.json` in the root.

### Google OAuth 2.0 (User)
- Required for the 'Holy Grail' (Auto-sheet).
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`.
- `DRIVE_PROJECTS_FOLDER_ID`: Folder ID on your Drive for project sheets.
- `MASTER_TEMPLATE_ID`: ID of your Athena Master Sheet.

## 3. Starting the Dashboard
The dashboard is the nerve center of the factory:
```bash
node dashboard/server.js
```
Then open: `http://localhost:4001`

## 4. Visual Tools
On Chromebook, it is recommended to start these manually in separate terminals:
- **Layout Architect:** `node 5-engine/layout-visualizer.js` (Port 3030)
- **Media Mapper:** `node 5-engine/media-visualizer.js` (Port 3031)

## 5. Power User CLI Workflow (v7.6+)
For rapid generation and maintenance without the dashboard:

```bash
# 1. Generate Sitetype based on text
node 6-utilities/generate-sitetype-from-input.js my-type docked ../input/my-data.txt

# 2. Parse the data
node 3-sitetypes/docked/my-type/parser/parser-my-type.js my-project my-data.txt

# 3. Generate the Site
node 6-utilities/generate-site.js my-site my-type docked

# 4. Propagate updates to all sites (v7.6 FEATURE)
node 6-utilities/update-all-sites.js

# 5. Start Dock & Site
# Gebruik het universele launch script in de root:
./launch.sh my-site
```

## 6. Exporting Changes (Back to Sheets)
After editing the site in the Dock:
```bash
node 6-utilities/export-site-to-sheets.js my-site my-project my-type docked
```
The results will be in `input/my-project/tsv-data/`. Copy the content of these files to your Google Sheet.

---

## 7. Important Ports
- **3000**: Site Dev Server (Local)
- **4001**: Athena Factory Dashboard
- **4002**: Athena Dock (Visual Editor)
- **3030**: Layout Architect

---

## 💡 Useful Aliases
For a faster workflow, you can add the following aliases to your `~/.bash_aliases` (or `~/.bashrc`):

```bash
# ~/.bash_aliases

#### Athena
alias adash='/home/kareltestspecial/athena/factory/launch-dashboard.sh'
alias athena='/home/kareltestspecial/athena/launch.sh'
```
Restart your terminal or run `source ~/.bash_aliases` to activate them.