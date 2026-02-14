/**
 * @file athena-cli.js
 * @description THE ATHENA MASTER CLI v2.0
 * ---------------------------------------
 * Centralized terminal-based orchestration for all Athena CMS Factory tools.
 */

import { spawn } from 'child_process';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCRIPTS = {
    SITETYPE_WIZARD: '../5-engine/sitetype-wizard.js',
    LAYOUT_WIZARD: '../5-engine/layout-visualizer.js',
    PARSER_WIZARD: '../5-engine/parser-wizard.js',
    SITE_WIZARD: '../5-engine/site-wizard.js',
    DEPLOY_WIZARD: '../5-engine/deploy-wizard.js',
    SHEET_LINKER: '../5-engine/sheet-linker-wizard.js',
    TSV_TO_JSON: '../5-engine/sync-tsv-to-json.js',
    TSV_TO_SHEET: '../5-engine/sync-tsv-to-sheet.js',
    JSON_TO_SHEET: '../5-engine/sync-json-to-sheet.js',
    JSON_TO_TSV: '../5-engine/sync-json-to-tsv.js',
    SHEET_TO_TSV: '../5-engine/sync-sheet-to-tsv.js',
    SHEET_TO_JSON: '../5-engine/sync-sheet-to-json.js',
    IMAGE_PROMPTS: '../5-engine/generate-image-prompts.js',
    MEDIA_MAPPER: './media-mapper.js',
    CLEANUP_WIZARD: '../5-engine/cleanup-wizard.js'
};

// --- CORE UTILITIES ---

function createRl() {
    return readline.createInterface({ input: process.stdin, output: process.stdout });
}

async function ask(query) {
    const rl = createRl();
    const answer = await new Promise(r => rl.question(query, r));
    rl.close();
    return answer;
}

/**
 * Execute a local node script with enhanced error handling.
 */
function runScript(scriptPath, args = []) {
    return new Promise((resolve) => {
        const absolutePath = path.join(__dirname, scriptPath);
        console.log(`\n🚀  Launching: ${scriptPath} ${args.join(' ')}`);

        const ignoreSigint = () => { };
        process.on('SIGINT', ignoreSigint);

        const child = spawn('node', [absolutePath, ...args], { stdio: 'inherit' });

        child.on('close', (code, signal) => {
            process.off('SIGINT', ignoreSigint);
            if (signal === 'SIGINT') console.log(`\n🛑  Process interrupted.`);
            else if (code !== 0 && code !== null) console.error(`\n⚠️  Process exited with code ${code}`);

            ask('\n[Enter] to return to dashboard...').then(resolve);
        });
    });
}

// --- PROJECT HELPERS ---

async function selectFromDir(dirPath, label) {
    if (!fs.existsSync(dirPath)) {
        console.error(`❌  Directory not found: ${dirPath}`);
        return null;
    }
    const folders = fs.readdirSync(dirPath).filter(f => fs.statSync(path.join(dirPath, f)).isDirectory() && f !== '.git');
    if (folders.length === 0) {
        console.warn(`⚠️  No items found in ${label}.`);
        return null;
    }
    console.log(`\n📁  Select ${label}:`);
    folders.forEach((f, i) => console.log(`   [${i + 1}] ${f}`));
    const choice = await ask('\n🚀  Choice: ');
    const idx = parseInt(choice) - 1;
    return folders[idx] || null;
}

// --- MAIN MENU ---

const CATEGORIES = [
    {
        title: "🏗️  DEFINITION & DESIGN", options: [
            { key: '1', label: 'Sitetype Wizard', script: SCRIPTS.SITETYPE_WIZARD },
            { key: '2', label: 'Layout Visualizer', script: SCRIPTS.LAYOUT_WIZARD },
            { key: '3', label: 'AI Parser Wizard', script: SCRIPTS.PARSER_WIZARD }
        ]
    },
    {
        title: "🚀  SITE MANAGEMENT", options: [
            { key: '4', label: 'Site Wizard (Build)', script: SCRIPTS.SITE_WIZARD },
            { key: '5', label: 'Deploy Wizard', script: SCRIPTS.DEPLOY_WIZARD },
            { key: '6', label: 'Sheet Linker', script: SCRIPTS.SHEET_LINKER },
            { key: '7', label: 'Start Dev Server', action: 'dev' }
        ]
    },
    {
        title: "🔄  DATA SYNC", options: [
            { key: '8', label: 'TSV -> JSON', script: SCRIPTS.TSV_TO_JSON, needsProject: true },
            { key: '9', label: 'TSV -> Sheet', script: SCRIPTS.TSV_TO_SHEET, needsProject: true },
            { key: '10', label: 'JSON -> Sheet', script: SCRIPTS.JSON_TO_SHEET },
            { key: '11', label: 'JSON -> TSV', script: SCRIPTS.JSON_TO_TSV },
            { key: '12', label: 'Sheet -> TSV', script: SCRIPTS.SHEET_TO_TSV, needsProject: true },
            { key: '13', label: 'Sheet -> JSON', script: SCRIPTS.SHEET_TO_JSON, needsSite: true }
        ]
    },
    {
        title: "📸  MEDIA & ASSETS", options: [
            { key: '14', label: 'Image Prompts', script: SCRIPTS.IMAGE_PROMPTS, needsProject: true },
            { key: '15', label: 'Media Mapper', script: SCRIPTS.MEDIA_MAPPER }
        ]
    },
    {
        title: "🧹  MAINTENANCE", options: [
            { key: '16', label: 'Cleanup Wizard', script: SCRIPTS.CLEANUP_WIZARD }
        ]
    }
];

async function startDevServer() {
    const site = await selectFromDir(path.resolve(__dirname, '../../sites'), 'Site');
    if (!site) return;
    const siteDir = path.resolve(__dirname, '../../sites', site);

    if (!fs.existsSync(path.join(siteDir, 'node_modules'))) {
        console.log('📦  Installing dependencies...');
        await new Promise(r => spawn('pnpm', ['install', '--child-concurrency', '1'], { cwd: siteDir, stdio: 'inherit', shell: true }).on('close', r));
    }

    console.log(`\n🌍  Starting dev server for ${site}...`);
    await new Promise(r => {
        const child = spawn('pnpm', ['dev'], { cwd: siteDir, stdio: 'inherit', shell: true });
        child.on('close', r);
    });
    await ask('\n[Enter] to return...');
}

async function showDashboard() {
    while (true) {
        process.stdout.write('\x1Bc'); // Clear screen
        console.log("=======================================");
        console.log("🔱  ATHENA MASTER DASHBOARD v2.0  🔱");
        console.log("=======================================");

        CATEGORIES.forEach(cat => {
            console.log(`\n--- ${cat.title} ---`);
            cat.options.forEach(opt => console.log(`   ${opt.key.padEnd(3)} ${opt.label}`));
        });
        console.log("\n   Q   Exit");

        const choice = (await ask('\n🔱  Select: ')).toUpperCase();
        if (choice === 'Q') break;

        let selectedOpt = null;
        for (const cat of CATEGORIES) {
            selectedOpt = cat.options.find(o => o.key === choice);
            if (selectedOpt) break;
        }

        if (selectedOpt) {
            if (selectedOpt.action === 'dev') {
                await startDevServer();
            } else if (selectedOpt.script) {
                let args = [];
                if (selectedOpt.needsProject) {
                    const project = await selectFromDir(path.resolve(__dirname, '../../input'), 'Project');
                    if (project) {
                        args.push(project);
                        if (selectedOpt.key === '9') {
                            args.push(await ask('Sheet URL: '));
                            const sa = await ask('Service Account (empty for default): ');
                            args.push(sa || 'sheet-service-account.json');
                        } else if (selectedOpt.key === '12') {
                            args.push(await ask('Sheet URL: '));
                        }
                    } else continue;
                }
                if (selectedOpt.needsSite) {
                    const site = await selectFromDir(path.resolve(__dirname, '../../sites'), 'Site');
                    if (site) args.push(site);
                    else continue;
                }
                await runScript(selectedOpt.script, args);
            }
        } else {
            console.log("❌  Invalid choice.");
            await new Promise(r => setTimeout(r, 1000));
        }
    }
    console.log("\nGoodbye! 👋");
}

showDashboard().catch(console.error);
