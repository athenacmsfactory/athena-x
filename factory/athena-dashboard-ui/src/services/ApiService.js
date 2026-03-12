/**
 * Athena Dashboard API Service (v8.7)
 * Handles communication with athena-api on port 5000 via Vite proxy.
 */

const API_BASE = '/api';

export const ApiService = {
  // System
  getSystemStatus: () => fetch(`${API_BASE}/system-status`).then(res => res.json()),
  getConfig: () => fetch(`${API_BASE}/system/config`).then(res => res.json()),
  
  // Projects
  getProjects: () => fetch(`${API_BASE}/projects`).then(res => res.json()),
  createProject: (projectName) => fetch(`${API_BASE}/projects/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectName })
  }).then(res => res.json()),

  // Sites
  getSites: () => fetch(`${API_BASE}/sites`).then(res => res.json()),
  getSiteStatus: (name) => fetch(`${API_BASE}/sites/${name}/status`).then(res => res.json()),
  startSiteDev: (id) => fetch(`${API_BASE}/sites/${id}/preview`, { method: 'POST' }).then(res => res.json()),
  athenifySite: (id) => fetch(`${API_BASE}/sites/${id}/athenify`, { method: 'POST' }).then(res => res.json()),
  stopSiteServer: (port) => fetch(`${API_BASE}/servers/kill/${port}`, { method: 'POST' }).then(res => res.json()),
  deploy: (projectName, commitMsg) => fetch(`${API_BASE}/deploy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectName, commitMsg })
  }).then(res => res.json()),
  
  // Site Actions
  getThemeInfo: (id) => fetch(`${API_BASE}/sites/${id}/theme-info`).then(res => res.json()),
  generateVariants: (id, styles) => fetch(`${API_BASE}/sites/${id}/generate-variants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ styles })
  }).then(res => res.json()),
  generateSEO: (projectName) => fetch(`${API_BASE}/marketing/generate-seo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectName })
  }).then(res => res.json()),
  generateBlog: (projectName, topic) => fetch(`${API_BASE}/marketing/generate-blog`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectName, topic })
  }).then(res => res.json()),
  
  // Data Gateway
  pullFromSheet: (id) => fetch(`${API_BASE}/sites/${id}/pull-from-sheet`, { method: 'POST' }).then(res => res.json()),
  syncToSheet: (id) => fetch(`${API_BASE}/sites/${id}/sync-to-sheet`, { method: 'POST' }).then(res => res.json()),
  // Servers
  getActiveServers: () => fetch(`${API_BASE}/servers/active`).then(res => res.json()),

  // GitHub Repositories
  getRepositories: () => fetch(`${API_BASE}/remote-repos`).then(res => res.json()),
  deleteRemoteRepo: (fullName) => fetch(`${API_BASE}/projects/remote-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName })
  }).then(res => res.json()),

  // Tools
  runScript: (script, args = []) => fetch(`${API_BASE}/run-script`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ script, args })
  }).then(res => res.json()),

  startDock: () => fetch(`${API_BASE}/start-dock`, { method: 'POST' }).then(res => res.json()),
  startLayoutServer: () => fetch(`${API_BASE}/start-layout-server`, { method: 'POST' }).then(res => res.json()),
  startMediaServer: (siteName) => fetch(`${API_BASE}/start-media-server`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ siteName })
  }).then(res => res.json()),

  // Storage
  getStorageStatus: (siteName = '') => fetch(`${API_BASE}/storage/status${siteName ? `?siteName=${siteName}` : ''}`).then(res => res.json()),
  setStoragePolicy: (siteName, policy) => fetch(`${API_BASE}/storage/policy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ siteName, policy })
  }).then(res => res.json()),
  enforceStoragePolicy: (siteName) => fetch(`${API_BASE}/storage/enforce`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ siteName })
  }).then(res => res.json()),
  pruneStorage: () => fetch(`${API_BASE}/storage/prune-all`, { method: 'POST' }).then(res => res.json()),
  prunePnpmStore: () => fetch(`${API_BASE}/storage/prune-pnpm`, { method: 'POST' }).then(res => res.json()),
  cleanupTempData: () => fetch(`${API_BASE}/storage/cleanup-temp`, { method: 'POST' }).then(res => res.json()),

  // Settings
  updateConfig: (config) => fetch(`${API_BASE}/system/config/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  }).then(res => res.json()),
};
