#!/usr/bin/env node

/**
 * @file status-check.js
 * @description CLI tool to display the status of all generated sites.
 * Usage: node factory/5-engine/status-check.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sitesDir = path.resolve(__dirname, '../../sites');

function getPortFromViteConfig(projectDir) {
    const vitePath = path.join(projectDir, 'vite.config.js');
    if (!fs.existsSync(vitePath)) return '—';
    try {
        const content = fs.readFileSync(vitePath, 'utf8');
        const match = content.match(/port:\s*(\d+)/);
        return match ? match[1] : '—';
    } catch { return '—'; }
}

function getBlueprintName(projectDir) {
    const configPath = path.join(projectDir, 'athena-config.json');
    if (!fs.existsSync(configPath)) return '—';
    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return config.siteType || config.blueprintFile || '—';
    } catch { return '—'; }
}

function getVersion(projectDir) {
    const schemaPath = path.join(projectDir, 'src/data/schema.json');
    if (!fs.existsSync(schemaPath)) return '—';
    try {
        const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
        return schema.version || '—';
    } catch { return '—'; }
}

function hasStyleConfig(projectDir) {
    return fs.existsSync(path.join(projectDir, 'src/data/style_config.json')) ? '✅' : '❌';
}

// --- Main ---
if (!fs.existsSync(sitesDir)) {
    console.log('📂 No sites/ directory found.');
    process.exit(0);
}

const sites = fs.readdirSync(sitesDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(d => d.name);

if (sites.length === 0) {
    console.log('📂 No sites found in sites/ directory.');
    process.exit(0);
}

// Header
const cols = { name: 25, blueprint: 25, pkg: 5, port: 6, ver: 5, theme: 6 };
const header = [
    'Name'.padEnd(cols.name),
    'Blueprint'.padEnd(cols.blueprint),
    'pkg'.padEnd(cols.pkg),
    'Port'.padEnd(cols.port),
    'Ver'.padEnd(cols.ver),
    'Theme'.padEnd(cols.theme)
].join(' │ ');

console.log(`\n🔱  Athena Site Status — ${sites.length} site(s)\n`);
console.log(header);
console.log('─'.repeat(header.length));

sites.forEach(name => {
    const dir = path.join(sitesDir, name);
    const hasPkg = fs.existsSync(path.join(dir, 'package.json')) ? '✅' : '❌';
    const port = getPortFromViteConfig(dir);
    const blueprint = getBlueprintName(dir);
    const version = getVersion(dir);
    const theme = hasStyleConfig(dir);

    console.log([
        name.padEnd(cols.name).slice(0, cols.name),
        blueprint.padEnd(cols.blueprint).slice(0, cols.blueprint),
        hasPkg.padEnd(cols.pkg),
        port.toString().padEnd(cols.port),
        version.padEnd(cols.ver),
        theme.padEnd(cols.theme)
    ].join(' │ '));
});

console.log('');
