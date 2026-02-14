import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { spawn, execSync } from 'child_process';
import multer from 'multer';
import cors from 'cors';
import { getLogPath } from '../5-engine/lib/logger.js';
import { createProject, validateProjectName } from '../5-engine/factory.js';
import { deployProject } from '../5-engine/deploy-wizard.js';
import { linkGoogleSheet } from '../5-engine/generate-url-sheet.js';
import { deleteLocalProject, deleteRemoteRepo } from '../5-engine/cleanup-wizard.js';
import {
    generateDataStructureAPI,
    generateParserInstructionsAPI,
    generateDesignSuggestionAPI,
    generateCompleteSiteType,
    getExistingSiteTypes
} from './sitetype-api.js';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// --- MULTER CONFIG (voor uploads) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { id } = req.params;
        const uploadDir = path.join(root, '../input', id, 'input');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

let activePreviewProcess = null;

const app = express();
const port = process.env.DASHBOARD_PORT || 3001;

// --- SIMPLE LOGGER ---
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(root));

// --- HELPER: DETACHED PROCESS SPAWNER ---
function spawnDetached(script, logBaseName) {
    const logPath = getLogPath(logBaseName.replace('.log', ''));
    const out = fs.openSync(logPath, 'a');
    const err = fs.openSync(logPath, 'a');
    const child = spawn(process.execPath, [`5-engine/${script}`], {
        cwd: root,
        detached: true,
        stdio: ['ignore', out, err]
    });
    child.unref();
}

// --- API ENDPOINTS ---

app.get('/api/projects', (req, res) => {
    const dir = path.join(root, '../input');
    if (!fs.existsSync(dir)) return res.json([]);
    const projects = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory() && !f.startsWith('.'));
    res.json(projects);
});

app.get('/api/sites', (req, res) => {
    const dir = path.resolve(root, '../sites');
    if (!fs.existsSync(dir)) return res.json([]);
    const sites = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory() && !f.startsWith('.') && f !== 'athena-cms');

    const sitesWithStatus = sites.map(site => {
        const deployFile = path.join(dir, site, 'project-settings', 'deployment.json');
        const sheetFile = path.join(dir, site, 'project-settings', 'url-sheet.json');

        let status = 'local';
        let deployData = null;
        let sheetData = null;
        let isDataEmpty = false;

        // --- RAM-SAFE DATA CHECK ---
        const dataDir = path.join(dir, site, 'src', 'data');
        if (fs.existsSync(dataDir)) {
            const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'schema.json');
            if (jsonFiles.length > 0) {
                let allEmpty = true;
                for (const file of jsonFiles) {
                    try {
                        const stats = fs.statSync(path.join(dataDir, file));
                        // Als een bestand kleiner is dan 5 bytes (bv. '[]' of '[\n]'), beschouwen we het als leeg.
                        if (stats.size > 5) {
                            allEmpty = false;
                            break;
                        }
                    } catch (e) { }
                }
                isDataEmpty = allEmpty;
            } else {
                isDataEmpty = true;
            }
        } else {
            isDataEmpty = true;
        }

        if (fs.existsSync(deployFile)) {
            try {
                deployData = JSON.parse(fs.readFileSync(deployFile, 'utf8'));
                status = deployData.status || 'live';
            } catch (e) { status = 'error'; }
        }

        if (fs.existsSync(sheetFile)) {
            try {
                const json = JSON.parse(fs.readFileSync(sheetFile, 'utf8'));
                // url-sheet.json structuur is { "TabNaam": { "editUrl": "..." } }
                // We pakken de eerste de beste editUrl
                const firstKey = Object.keys(json)[0];
                if (firstKey) sheetData = json[firstKey].editUrl;
            } catch (e) { }
        }

        return { name: site, status, deployData, sheetUrl: sheetData, isDataEmpty };
    });
    res.json(sitesWithStatus);
});

app.get('/api/projects/:id/files', (req, res) => {
    try {
        const { id } = req.params;
        const dir = path.join(root, '../input', id, 'input');
        if (!fs.existsSync(dir)) return res.json([]);
        const files = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isFile() && !f.startsWith('.'));
        res.json(files);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/projects/:id/content', (req, res) => {
    try {
        const { id } = req.params;
        const baseDir = path.join(root, '../input', id);
        const inputDir = path.join(baseDir, 'input');

        // Helper to collect files from a directory
        const collectFiles = (directory) => {
            if (fs.existsSync(directory)) {
                return fs.readdirSync(directory).filter(f => {
                    return fs.statSync(path.join(directory, f)).isFile() &&
                        !f.startsWith('.') &&
                        (f.endsWith('.txt') || f.endsWith('.md') || f.endsWith('.json'));
                }).map(f => path.join(directory, f));
            }
            return [];
        };

        const filesToRead = [...collectFiles(baseDir), ...collectFiles(inputDir)];

        if (filesToRead.length === 0) return res.json({ content: "" });

        let fullContent = "";
        for (const filePath of filesToRead) {
            const content = fs.readFileSync(filePath, 'utf8');
            const fileName = path.basename(filePath);
            fullContent += `--- FILE: ${fileName} ---\n${content}\n\n`;
        }

        res.json({ content: fullContent });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/sitetypes', (req, res) => {
    try {
        const sitetypes = getExistingSiteTypes();
        res.json(sitetypes);
    } catch (e) {
        res.status(500).json([]);
    }
});

app.get('/api/layouts/:sitetype', (req, res) => {
    const { sitetype } = req.params;
    // We moeten zoeken in beide tracks
    let dir = path.join(root, '3-sitetypes', 'docked', sitetype, 'web');
    if (!fs.existsSync(dir)) {
        dir = path.join(root, '3-sitetypes', 'autonomous', sitetype, 'web');
    }

    if (!fs.existsSync(dir)) return res.json([]);
    const layouts = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());
    res.json(layouts);
});

app.get('/api/styles', (req, res) => {
    const dir = path.join(root, '2-templates/boilerplate/docked/css');
    if (!fs.existsSync(dir)) return res.json([]);
    const styles = fs.readdirSync(dir).filter(f => f.endsWith('.css')).map(f => f.replace('.css', ''));
    res.json(styles);
});

app.get('/api/todo', (req, res) => {
    const todoPath = path.join(root, 'TODO.md');
    if (fs.existsSync(todoPath)) {
        res.json({ content: fs.readFileSync(todoPath, 'utf8') });
    } else { res.status(404).json({ error: "TODO.md niet gevonden" }); }
});

app.get('/api/system-status', (req, res) => {
    try {
        const output = execSync('df -h /').toString().trim().split('\n');
        const stats = output[1].split(/\s+/);
        res.json({ size: stats[1], used: stats[2], avail: stats[3], percent: stats[4] });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/remote-repos', async (req, res) => {
    try {
        const { GITHUB_USER, GITHUB_PAT, GITHUB_ORG } = process.env;
        const owners = [...new Set([GITHUB_ORG, GITHUB_USER].filter(Boolean))];
        let allRepos = [];

        console.log(`[GITHUB] Ophalen repos voor: ${owners.join(', ')}`);

        for (const owner of owners) {
            try {
                const output = execSync(`gh repo list ${owner} --limit 100 --json name,owner,url,isPrivate,updatedAt`, {
                    env: { ...process.env, GH_TOKEN: GITHUB_PAT },
                    encoding: 'utf8',
                    stdio: ['ignore', 'pipe', 'pipe']
                });
                const repos = JSON.parse(output);
                console.log(`[GITHUB] ${repos.length} repos gevonden voor ${owner}`);
                allRepos = [...allRepos, ...repos.map(r => ({
                    name: r.name,
                    fullName: `${r.owner.login}/${r.name}`,
                    url: r.url,
                    isPrivate: r.isPrivate,
                    updatedAt: r.updatedAt,
                    owner: r.owner.login
                }))];
            } catch (err) {
                const stderr = err.stderr ? err.stderr.toString() : err.message;
                console.error(`[GITHUB] Fout bij ${owner}:`, stderr);
            }
        }

        // Verwijder duplicaten (indien user == org)
        const uniqueRepos = Array.from(new Map(allRepos.map(item => [item.fullName, item])).values());
        res.json(uniqueRepos);
    } catch (e) {
        console.error("[API] Remote repos error:", e.message);
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/config', (req, res) => {
    let saPath = path.join(root, 'sheet-service-account.json');
    if (!fs.existsSync(saPath)) saPath = path.join(root, 'service-account.json');
    let email = 'athena-cms-sheet-write@gen-lang-client-0519605634.iam.gserviceaccount.com';
    if (fs.existsSync(saPath)) {
        try {
            const saData = JSON.parse(fs.readFileSync(saPath, 'utf8'));
            if (saData.client_email) email = saData.client_email;
        } catch (e) { }
    }
    res.json({ serviceAccountEmail: email });
});

app.get('/api/settings', (req, res) => {
    const envPath = path.join(root, '.env');
    const settings = {};
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach(line => {
            const [key, ...value] = line.split('=');
            if (key && !key.startsWith('#')) {
                settings[key.trim()] = value.join('=').trim();
            }
        });
    }
    res.json(settings);
});

app.post('/api/settings', (req, res) => {
    try {
        const newSettings = req.body;
        const envPath = path.join(root, '.env');
        let envContent = '';

        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
        }

        let lines = envContent.split('\n');

        for (const [key, value] of Object.entries(newSettings)) {
            let found = false;
            lines = lines.map(line => {
                if (line.trim().startsWith(`${key}=`)) {
                    found = true;
                    return `${key}=${value}`;
                }
                return line;
            });

            if (!found && key.trim() !== '') {
                lines.push(`${key}=${value}`);
            }
        }

        fs.writeFileSync(envPath, lines.join('\n'));

        // Herlaad process.env voor de huidige sessie
        Object.assign(process.env, newSettings);

        res.json({ success: true, message: 'Instellingen succesvol bijgewerkt in .env' });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// --- ACTIONS ---

app.post('/api/projects/create', (req, res) => {
    try {
        const { projectName } = req.body;
        const safeName = validateProjectName(projectName);
        const dir = path.join(root, '../input', safeName, 'input');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(root, '../input', safeName, '.gitkeep'), '');
        }
        res.json({ success: true, message: `Bronproject '${safeName}' aangemaakt.`, projectName: safeName });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// Data Bron van Site genereren
app.post('/api/projects/create-from-site', async (req, res) => {
    try {
        const { sourceSiteName, targetProjectName } = req.body;
        if (!sourceSiteName || !targetProjectName) {
            return res.status(400).json({ error: "Bron site en doel project naam zijn verplicht" });
        }

        const tool = path.join(root, '5-engine', 'site-to-datasource-generator.js');
        const output = execSync(`"${process.execPath}" "${tool}" "${sourceSiteName}" "${targetProjectName}"`, {
            cwd: root,
            env: { ...process.env }
        }).toString();

        res.json({ success: true, message: `Data Bron '${targetProjectName}' succesvol gegenereerd van site '${sourceSiteName}'!`, details: output });
    } catch (e) {
        const stderr = e.stderr ? e.stderr.toString() : e.message;
        console.error(`[DATASOURCE-FROM-SITE] Fout:`, stderr);
        res.status(500).json({ success: false, error: stderr });
    }
});

// --- ROUTES ---

// 1. Upload Bestanden (Multiple)
app.post('/api/projects/:id/upload', upload.array('files'), (req, res) => {
    try {
        console.log(`[UPLOAD] ${req.files.length} bestand(en) geupload voor project ${req.params.id}`);
        res.json({ success: true, message: `${req.files.length} bestand(en) succesvol geüpload.` });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, error: e.message });
    }
});

// 2. Tekst Toevoegen (Append)
app.post('/api/projects/:id/add-text', (req, res) => {
    try {
        const { id } = req.params;
        const { text, filename = 'input.txt' } = req.body;

        if (!text) throw new Error("Geen tekst ontvangen.");

        const uploadDir = path.join(root, '../input', id, 'input');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);

        // Append met een scheidingsteken
        const separator = fs.existsSync(filePath) ? "\n\n--- NIEUWE INVOER ---\n\n" : "";
        fs.appendFileSync(filePath, separator + text, 'utf8');

        res.json({ success: true, message: "Tekst succesvol toegevoegd aan " + filename });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, error: e.message });
    }
});

// 3. URLs Opslaan
app.post('/api/projects/:id/save-urls', (req, res) => {
    try {
        const { id } = req.params;
        const { urls } = req.body;

        if (!urls) throw new Error("Geen URLs ontvangen.");

        const uploadDir = path.join(root, '../input', id, 'input');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        // Normaliseer URLs (splitsen op komma's en newlines, trimmen, lege regels weg)
        const urlList = urls.split(/[\n,]+/).map(u => u.trim()).filter(u => u.length > 0);

        if (urlList.length === 0) throw new Error("Geen geldige URLs gevonden.");

        const filePath = path.join(uploadDir, 'urls.txt');
        fs.writeFileSync(filePath, urlList.join('\n'), 'utf8');

        res.json({ success: true, message: `${urlList.length} URL(s) opgeslagen in urls.txt` });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, error: e.message });
    }
});

app.post('/api/create', async (req, res) => {
    try {
        const { projectName, sourceProject, siteType, layoutName, styleName, siteModel, autoSheet, clientEmail } = req.body;
        console.log(`Creating project: ${projectName} from source: ${sourceProject || projectName} (${siteModel})`);
        const config = {
            projectName: validateProjectName(projectName),
            sourceProject: sourceProject ? validateProjectName(sourceProject) : undefined,
            siteType,
            layoutName,
            styleName,
            siteModel: siteModel || 'SPA',
            autoSheet: autoSheet === true || autoSheet === 'true',
            clientEmail,
            blueprintFile: path.join(siteType, 'blueprint', `${siteType}.json`)
        };
        await createProject(config);
        res.json({ success: true, message: `Project ${config.projectName} created!` });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, error: e.message });
    }
});

// --- VARIANT GENERATOR ---
app.get('/api/sites/:id/theme-info', (req, res) => {
    try {
        const { id } = req.params;
        const siteDir = path.resolve(root, '../sites', id);
        if (!fs.existsSync(siteDir)) {
            return res.status(404).json({ error: 'Site niet gevonden' });
        }

        // Get available themes
        const themesDir = path.join(root, '2-templates/boilerplate/docked/css');
        const themes = fs.existsSync(themesDir)
            ? fs.readdirSync(themesDir).filter(f => f.endsWith('.css')).map(f => f.replace('.css', ''))
            : [];

        // Detect current theme
        let currentTheme = null;
        const indexCss = path.join(siteDir, 'src/index.css');
        if (fs.existsSync(indexCss)) {
            const content = fs.readFileSync(indexCss, 'utf8');
            const match = content.match(/@import\s+["']\.\/css\/([a-z0-9-]+)\.css["']/);
            if (match) currentTheme = match[1];
        }
        if (!currentTheme) {
            const mainJsx = path.join(siteDir, 'src/main.jsx');
            if (fs.existsSync(mainJsx)) {
                const content = fs.readFileSync(mainJsx, 'utf8');
                const match = content.match(/import\s+['"]\.\/css\/([a-z0-9-]+)\.css['"]/);
                if (match) currentTheme = match[1];
            }
        }

        res.json({ themes, currentTheme });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/sites/:id/generate-variants', async (req, res) => {
    try {
        const { id } = req.params;
        const { styles } = req.body;

        console.log(`[VARIANT] Generating variants for: ${id} (styles: ${styles ? styles.join(', ') : 'all'})`);

        const tool = path.join(root, '5-engine', 'variant-generator.js');
        const args = [tool, id];
        if (styles && styles.length > 0) {
            args.push('--styles', styles.join(','));
        }

        const output = execSync(`"${process.execPath}" ${args.map(a => `"${a}"`).join(' ')}`, {
            cwd: root,
            env: { ...process.env }
        }).toString();

        console.log(`[VARIANT] Output:`, output);
        res.json({ success: true, message: `Varianten succesvol gegenereerd voor ${id}!`, details: output });
    } catch (e) {
        const stderr = e.stderr ? e.stderr.toString() : e.message;
        console.error(`[VARIANT] Fout:`, stderr);
        res.status(500).json({ success: false, error: stderr });
    }
});

app.post('/api/projects/:id/scrape', async (req, res) => {
    try {
        const { id } = req.params;
        const { inputFile } = req.body;
        const tool = path.join(root, '5-engine', 'athena-scraper.js');
        console.log(`[SCRAPER] Gestart voor: ${id} (file: ${inputFile})`);

        // Gebruik process.execPath om de exact zelfde Node-versie te forceren
        const output = execSync(`"${process.execPath}" "${tool}" "${id}" "${inputFile}"`, {
            cwd: root,
            env: { ...process.env }
        }).toString();
        res.json({ success: true, message: 'Website tekst succesvol binnengehaald!', details: output });
    } catch (e) {
        const stderr = e.stderr ? e.stderr.toString() : e.message;
        console.error(`[SCRAPER] Fout:`, stderr);
        res.status(500).json({ success: false, error: stderr });
    }
});

app.post('/api/projects/:id/auto-provision', async (req, res) => {
    try {
        const { id } = req.params;
        const tool = path.join(root, '5-engine', 'auto-sheet-provisioner.js');
        console.log(`Auto-provisioning gestart voor: ${id}`);
        const output = execSync(`"${process.execPath}" "${tool}" "${id}"`, { cwd: root }).toString();
        res.json({ success: true, message: 'Google Sheet succesvol aangemaakt!', details: output });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.post('/api/projects/:id/link-sheet', async (req, res) => {
    try {
        const { id } = req.params;
        const { sheetUrl } = req.body;
        const tool = path.join(root, '5-engine', 'generate-url-sheet.js');
        execSync(`"${process.execPath}" "${tool}" "${id}" "${sheetUrl}"`, { cwd: root });
        res.json({ success: true, message: 'Sheet gekoppeld!' });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/projects/:id/sync-site-to-sheet', async (req, res) => {
    try {
        const { id } = req.params;
        const tool = path.join(root, '5-engine', 'sync-json-to-sheet.js');
        const output = execSync(`"${process.execPath}" "${tool}" "${id}"`, { cwd: root }).toString();
        res.json({ success: true, details: output });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/sync-to-sheets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Check of het project bestaat in sites/
        const siteDir = path.resolve(root, '../sites', id);
        if (!fs.existsSync(siteDir)) {
            return res.status(404).json({ success: false, error: "Site niet gevonden in de sites/ map." });
        }

        // --- AUTOMATISCHE PROVISIONING (v7.4) ---
        const settingsPath = path.join(siteDir, 'project-settings/url-sheet.json');
        if (!fs.existsSync(settingsPath)) {
            console.log(`[SHEETS] Geen sheet gevonden voor ${id}. Start automatische aanmaak...`);
            const provisioner = path.join(root, '5-engine', 'auto-sheet-provisioner.js');
            try {
                execSync(`"${process.execPath}" "${provisioner}" "${id}"`, { cwd: root, env: { ...process.env } });
                console.log(`[SHEETS] Nieuwe Google Sheet succesvol aangemaakt voor ${id}.`);
            } catch (provErr) {
                console.error(`[SHEETS] Provisioning mislukt voor ${id}:`, provErr.message);
                return res.status(500).json({ success: false, error: "Kon geen nieuwe Google Sheet aanmaken: " + provErr.message });
            }
        }

        const tool = path.join(root, '5-engine', 'sync-full-project-to-sheet.js');
        console.log(`[SHEETS] Full Sync gestart voor: ${id}`);

        const output = execSync(`"${process.execPath}" "${tool}" "${id}"`, {
            cwd: root,
            env: { ...process.env }
        }).toString();

        res.json({ success: true, message: 'Succesvol gesynct naar Google Sheets!', details: output });
    } catch (e) {
        const stderr = e.stderr ? e.stderr.toString() : e.message;
        console.error(`[SHEETS] Sync fout voor ${req.params.id}:`, stderr);
        res.status(500).json({ success: false, error: stderr });
    }
});

app.post('/api/pull-from-sheets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const tool = path.join(root, '5-engine', 'sync-sheet-to-json.js');
        console.log(`[SHEETS] Pull & Backup gestart voor: ${id}`);

        const output = execSync(`"${process.execPath}" "${tool}" "${id}"`, {
            cwd: root,
            env: { ...process.env }
        }).toString();

        res.json({ success: true, message: 'Data succesvol opgehaald! (Lokale backup gemaakt)', details: output });
    } catch (e) {
        const stderr = e.stderr ? e.stderr.toString() : e.message;
        console.error(`[SHEETS] Pull fout voor ${req.params.id}:`, stderr);
        res.status(500).json({ success: false, error: stderr });
    }
});

app.post('/api/projects/:id/reverse-sync', async (req, res) => {
    try {
        const { id } = req.params;
        // Probeer beide varianten: [id] en [id]-site
        let siteDir = path.join(root, '../sites', id);
        if (!fs.existsSync(siteDir)) {
            siteDir = path.join(root, '../sites', `${id}-site`);
        }

        if (!fs.existsSync(siteDir)) {
            throw new Error(`Site directory niet gevonden voor project ${id} (geprobeerd: ${id} en ${id}-site)`);
        }

        const siteDataDir = path.join(siteDir, 'src', 'data');
        const targetDir = path.join(root, '../input', id, 'tsv-data');
        const tool = path.join(root, '5-engine', 'sync-json-to-tsv.js');

        console.log(`[REVERSE-SYNC] ${siteDataDir} -> ${targetDir}`);

        execSync(`"${process.execPath}" "${tool}" "${siteDataDir}" "${targetDir}" --auto`, {
            cwd: root,
            env: { ...process.env }
        });
        res.json({ success: true });
    } catch (e) {
        console.error(`[REVERSE-SYNC] Fout:`, e.message);
        res.status(500).json({ success: false, error: e.message });
    }
});

app.post('/api/projects/:id/upload-data', async (req, res) => {
    try {
        const { id } = req.params;
        let siteDir = path.join(root, '../sites', id);
        if (!fs.existsSync(siteDir)) {
            siteDir = path.join(root, '../sites', `${id}-site`);
        }

        const urlSheetPath = path.join(siteDir, 'project-settings', 'url-sheet.json');
        if (!fs.existsSync(urlSheetPath)) {
            throw new Error(`url-sheet.json niet gevonden op ${urlSheetPath}`);
        }

        const urlData = JSON.parse(fs.readFileSync(urlSheetPath, 'utf8'));
        const sheetUrl = Object.values(urlData)[0].editUrl;
        const saPath = fs.existsSync(path.join(root, 'sheet-service-account.json')) ? 'sheet-service-account.json' : 'service-account.json';
        const tool = path.join(root, '5-engine', 'sync-tsv-to-sheet.js');

        console.log(`[UPLOAD-DATA] Syncing ${id} to ${sheetUrl} using ${saPath}`);

        execSync(`"${process.execPath}" "${tool}" "${id}" "${sheetUrl}" "${saPath}"`, {
            cwd: root,
            env: { ...process.env }
        });
        res.json({ success: true });
    } catch (e) {
        console.error(`[UPLOAD-DATA] Fout:`, e.message);
        res.status(500).json({ success: false, error: e.message });
    }
});

app.post('/api/projects/:id/rename', async (req, res) => {
    try {
        const { id } = req.params;
        const { newName } = req.body;
        const helper = path.join(root, '5-engine', 'athena-mcp-helper.js');
        const sitesDir = path.join(root, 'sites');
        const projects = fs.readdirSync(sitesDir).filter(f => fs.statSync(path.join(sitesDir, f)).isDirectory() && f !== '.git');
        const index = projects.indexOf(id) + 1;

        if (index === 0) throw new Error("Project niet gevonden in sites lijst.");

        execSync(`"${process.execPath}" "${helper}" "rename-site-wizard.js" "${index}" "${newName}"`, { cwd: root });
        res.json({ success: true, message: `Project succesvol hernoemd naar ${newName}!` });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, error: e.message });
    }
});

app.post('/api/projects/remote-delete', async (req, res) => {
    try {
        const { fullName } = req.body;
        const { GITHUB_PAT, GITHUB_USER } = process.env;

        // --- VEILIGHEIDSCHECK: HOOFDREPO MAG NOOIT WEG ---
        const protectedRepo = `${GITHUB_USER}/athena-cms`;
        if (fullName.toLowerCase() === protectedRepo.toLowerCase()) {
            console.warn(`[SECURITY] Poging tot verwijderen van hoofdrepo geblokkeerd: ${fullName}`);
            return res.status(403).json({ success: false, error: "De hoofdrepository 'athena-cms' is beveiligd en kan niet worden verwijderd via het dashboard." });
        }

        console.log(`[GITHUB] Request om repo te verwijderen: ${fullName}`);

        // Voer het delete commando uit met het token
        execSync(`gh repo delete ${fullName} --yes`, {
            env: { ...process.env, GH_TOKEN: GITHUB_PAT },
            stdio: ['ignore', 'pipe', 'pipe']
        });

        console.log(`[GITHUB] Repo succesvol verwijderd: ${fullName}`);
        res.json({ success: true, message: `Repository ${fullName} verwijderd.` });
    } catch (e) {
        const stderr = e.stderr ? e.stderr.toString() : e.message;
        console.error(`[GITHUB] Verwijder fout voor ${req.body.fullName}:`, stderr);
        res.status(500).json({ success: false, error: stderr });
    }
});

app.post('/api/projects/:id/delete', async (req, res) => {
    const { id } = req.params;
    const { deleteSite, deleteData, deleteRemote } = req.body;

    try {
        console.log(`Deleting project ${id}: site=${deleteSite}, data=${deleteData}, remote=${deleteRemote}`);

        let logs = [];

        // 1. Lokale verwijdering
        if (deleteSite || deleteData) {
            const result = deleteLocalProject(id, deleteSite, deleteData);
            logs = [...logs, ...result.logs];
        }

        // 2. Remote verwijdering
        if (deleteRemote) {
            try {
                // De helper functie deleteRemoteRepo probeert nu de org en user targets.
                const remoteResult = await deleteRemoteRepo(id);
                logs.push(`✅ ${remoteResult.message}`);
            } catch (e) {
                logs.push(`ℹ️ Geen remote repo verwijderd: ${e.message}`);
            }
        }

        res.json({ success: true, logs });
    } catch (e) {
        console.error("Delete failed:", e);
        res.status(500).json({ success: false, error: e.message });
    }
});

app.post('/api/sites/update-deployment', (req, res) => {
    try {
        const { projectName, status, liveUrl, repoUrl } = req.body;
        const projectDir = path.join(root, '../sites', projectName);
        const settingsDir = path.join(projectDir, 'project-settings');
        const deployFile = path.join(settingsDir, 'deployment.json');

        if (!fs.existsSync(settingsDir)) fs.mkdirSync(settingsDir, { recursive: true });

        const config = {
            deployedAt: new Date().toISOString(),
            repoUrl,
            liveUrl,
            status
        };

        fs.writeFileSync(deployFile, JSON.stringify(config, null, 2));
        res.json({ success: true, message: `Status voor ${projectName} bijgewerkt naar ${status}` });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, error: e.message });
    }
});

app.post('/api/deploy', async (req, res) => {
    try {
        const { projectName, commitMsg } = req.body;
        const result = await deployProject(projectName, commitMsg);
        res.json({ success: true, result });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/projects/:id/prompts', (req, res) => {
    try {
        const { id } = req.params;
        const filePath = path.join(root, '../input', id, 'image-gen', 'image-prompts.tsv');
        if (!fs.existsSync(filePath)) return res.json([]);

        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.trim().split('\n');
        if (lines.length < 2) return res.json([]);

        const headers = lines[0].split('\t');
        const prompts = lines.slice(1).map(line => {
            const cols = line.split('\t');
            const obj = {};
            headers.forEach((h, i) => obj[h] = cols[i]);
            return obj;
        });
        res.json(prompts);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/run-script', (req, res) => {
    const { script, args } = req.body;
    const scriptPath = path.join(root, '5-engine', script);
    const child = spawn(process.execPath, [scriptPath, ...args], { stdio: 'inherit' });

    child.on('close', (code) => {
        if (code === 0) {
            res.json({ success: true, message: "Script succesvol voltooid." });
        } else {
            res.status(500).json({ success: false, error: `Script eindigde met foutcode ${code}` });
        }
    });
});

app.post('/api/generate-overview', (req, res) => {
    try {
        const tool = path.join(root, '5-engine', 'generate-sites-overview.js');
        execSync(`"${process.execPath}" "${tool}"`, { cwd: root });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- SERVER MANAGEMENT API ---

app.get('/api/servers/check/:port', (req, res) => {
    const { port } = req.params;
    try {
        // Gebruik fuser of lsof om te checken of poort in gebruik is
        execSync(`fuser ${port}/tcp`, { stdio: 'ignore' });
        res.json({ online: true });
    } catch (e) {
        res.json({ online: false });
    }
});

app.post('/api/servers/stop/:type', (req, res) => {
    const { type } = req.params;
    let port;
    if (type === 'dock') port = process.env.DOCK_PORT || 4002;
    if (type === 'layout') port = process.env.LAYOUT_EDITOR_PORT || 4003;
    if (type === 'media') port = process.env.MEDIA_MAPPER_PORT || 4004;
    if (type === 'preview') port = process.env.PREVIEW_PORT || 3000;
    if (type === 'dashboard') port = process.env.DASHBOARD_PORT || 4001;

    if (port) {
        try {
            execSync(`fuser -k ${port}/tcp`);
            res.json({ success: true, message: `Server ${type} op poort ${port} gestopt.` });
        } catch (e) {
            res.json({ success: true, message: "Server was waarschijnlijk al gestopt." });
        }
    } else {
        res.status(400).json({ error: "Onbekend server type" });
    }
});

// GET ALL ACTIVE SITE SERVERS (detect via ps and fuser)
app.get('/api/servers/active', (req, res) => {
    try {
        const registryPath = path.join(root, 'config/site-ports.json');
        const activeServers = [];
        const portRegistry = fs.existsSync(registryPath) ? JSON.parse(fs.readFileSync(registryPath, 'utf8')) : {};

        // 1. Check ports from registry
        for (const [siteName, port] of Object.entries(portRegistry)) {
            try {
                const result = execSync(`fuser ${port}/tcp 2>/dev/null || echo ""`, { encoding: 'utf8' }).trim();
                if (result && result !== '') {
                    const pid = result.split(/\s+/)[0];
                    activeServers.push({
                        siteName,
                        port,
                        pid,
                        url: `http://localhost:${port}/${siteName}/`
                    });
                }
            } catch (e) { }
        }

        // 2. Always check port 3000 (Default Fallback)
        try {
            const result3000 = execSync(`fuser 3000/tcp 2>/dev/null || echo ""`, { encoding: 'utf8' }).trim();
            if (result3000 && result3000 !== '') {
                const pid = result3000.split(/\s+/)[0];
                // Try to find which site is running on 3000
                // We scan sites for vite.config.js with port 3000
                const sitesDir = path.join(root, '../sites');
                const siteDirs = fs.readdirSync(sitesDir).filter(f => fs.statSync(path.join(sitesDir, f)).isDirectory());

                let detectedSite = 'Unknown Site (3000)';
                for (const dir of siteDirs) {
                    const viteConfig = path.join(sitesDir, dir, 'vite.config.js');
                    if (fs.existsSync(viteConfig)) {
                        const content = fs.readFileSync(viteConfig, 'utf8');
                        if (content.includes('port: 3000')) {
                            detectedSite = dir;
                            break;
                        }
                    }
                }

                // Alleen toevoegen als hij nog niet in de lijst staat (via registry)
                if (!activeServers.some(s => s.port === 3000)) {
                    activeServers.push({
                        siteName: detectedSite,
                        port: 3000,
                        pid,
                        url: `http://localhost:3000/${detectedSite}/`
                    });
                }
            }
        } catch (e) { }

        res.json({ servers: activeServers });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// STOP A SPECIFIC SERVER BY PORT
app.post('/api/servers/kill/:port', (req, res) => {
    const { port } = req.params;
    try {
        execSync(`fuser -k ${port}/tcp 2>/dev/null || true`);
        res.json({ success: true, message: `Server on port ${port} stopped` });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/start-layout-server', (req, res) => {
    try {
        const port = process.env.LAYOUT_EDITOR_PORT || 3030;
        // Kill existing process on port if any
        try {
            execSync(`fuser -k ${port}/tcp 2>/dev/null || true`);
        } catch (e) { }

        spawnDetached('layout-visualizer.js', 'layout-editor.log');
        res.json({ success: true, message: `Layout Editor starting on port ${port}...` });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, error: "Could not spawn process" });
    }
});

app.post('/api/start-media-server', (req, res) => {
    try {
        const port = process.env.MEDIA_MAPPER_PORT || 3031;
        // Kill existing process on port if any
        try {
            execSync(`fuser -k ${port}/tcp 2>/dev/null || true`);
        } catch (e) { }

        spawnDetached('media-visualizer.js', 'media-visualizer.log');
        res.json({ success: true, message: `Media Mapper starting on port ${port}...` });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, error: "Could not spawn process" });
    }
});

app.post('/api/start-dock', (req, res) => {
    try {
        const dockDir = path.join(root, '..', 'dock');
        const port = process.env.DOCK_PORT || 4002;

        // Kill existing process on port if any
        try {
            execSync(`fuser -k ${port}/tcp 2>/dev/null || true`);
        } catch (e) { }

        const logPath = getLogPath('athena-dock');
        const out = fs.openSync(logPath, 'a');
        const err = fs.openSync(logPath, 'a');

        // NIEUW: Check voor node_modules in dock
        if (!fs.existsSync(path.join(dockDir, 'node_modules'))) {
            console.log("📦 node_modules ontbreken in dock, installeren...");
            execSync('pnpm install', { cwd: dockDir, stdio: 'inherit' });
        }

        const child = spawn('pnpm', ['dev', '--port', port.toString(), '--host'], {
            cwd: dockDir,
            detached: true,
            stdio: ['ignore', out, err]
        });
        child.unref();

        res.json({ success: true, message: `Athena Dock starting on port ${port}...` });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, error: e.message });
    }
});

app.post('/api/dev/start', async (req, res) => {
    try {
        const { projectName } = req.body;
        const dockPort = process.env.DOCK_PORT || 4002;
        const previewPort = process.env.PREVIEW_PORT || 3000;

        console.log(`[DEV] Starting Full Environment for ${projectName}`);

        // 1. Start Dock
        const dockDir = path.join(root, '..', 'dock');
        try { execSync(`fuser -k ${dockPort}/tcp 2>/dev/null || true`); } catch (e) { }
        const dockLog = fs.openSync(getLogPath('athena-dock'), 'a');
        const dockProc = spawn('pnpm', ['dev', '--port', dockPort.toString(), '--host'], {
            cwd: dockDir, detached: true, stdio: ['ignore', dockLog, dockLog]
        });
        dockProc.unref();

        // 2. Start Site Preview
        const siteDir = path.join(root, '../sites', projectName);
        if (fs.existsSync(siteDir)) {
            try { execSync(`fuser -k ${previewPort}/tcp 2>/dev/null || true`); } catch (e) { }
            const siteLog = fs.openSync(getLogPath(`preview_${projectName}`), 'a');
            const siteProc = spawn('pnpm', ['dev', '--port', previewPort.toString(), '--host'], {
                cwd: siteDir, detached: true, stdio: ['ignore', siteLog, siteLog]
            });
            siteProc.unref();
        }

        res.json({
            success: true,
            dockUrl: `http://localhost:${dockPort}`,
            siteUrl: `http://localhost:${previewPort}`
        });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.post('/api/maintenance', async (req, res) => {
    const { action } = req.body;
    try {
        let output = (action === 'pnpm-prune') ? execSync('pnpm store prune', { cwd: root }).toString() : "Cleanup done";
        res.json({ success: true, message: output });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- HELPER: GET SITE PORT ---
function getSitePort(siteId, siteDir) {
    // 1. Check centraal register
    const registryPath = path.join(root, 'config/site-ports.json');
    if (fs.existsSync(registryPath)) {
        try {
            const ports = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
            if (ports[siteId]) return ports[siteId];
        } catch (e) { }
    }

    // 2. Scan vite.config.js
    const configPath = path.join(siteDir, 'vite.config.js');
    if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf8');
        const match = content.match(/port:\s*(\d+)/);
        if (match) return parseInt(match[1]);
    }

    return 3000; // Fallback
}

app.post('/api/sites/:id/preview', async (req, res) => {
    const { id } = req.params;
    const siteDir = path.join(root, '../sites', id);
    const pnpmPath = 'pnpm';

    if (!fs.existsSync(siteDir)) {
        return res.status(404).json({ success: false, error: 'Site niet gevonden' });
    }

    const previewPort = getSitePort(id, siteDir);

    // Stop alleen andere processen op DEZE specifieke poort
    try {
        execSync(`fuser -k ${previewPort}/tcp 2>/dev/null || true`);
    } catch (e) { }

    console.log(`Starting preview for ${id} on port ${previewPort}...`);

    const logPath = getLogPath(`preview_${id}`);
    const out = fs.openSync(logPath, 'w');

    const child = spawn(pnpmPath, ['dev', '--port', previewPort.toString(), '--host'], {
        cwd: siteDir,
        detached: true,
        stdio: ['ignore', out, out],
        env: { ...process.env }
    });

    child.on('error', (err) => {
        console.error(`Failed to start preview for ${id}:`, err);
    });

    child.unref(); // We laten hem draaien, dashboard hoeft hem niet te managen

    // Determine the correct base URL
    let baseUrl = `/${id}/`;
    const deployFile = path.join(siteDir, 'project-settings', 'deployment.json');
    if (fs.existsSync(deployFile)) {
        try {
            const deployData = JSON.parse(fs.readFileSync(deployFile, 'utf8'));
            if (deployData.liveUrl) {
                const url = new URL(deployData.liveUrl);
                baseUrl = url.pathname;
                if (!baseUrl.endsWith('/')) baseUrl += '/';
            }
        } catch (e) { }
    }

    res.json({ success: true, url: `http://localhost:${previewPort}${baseUrl}` });
});

// --- INSTALLATION MANAGEMENT ---
const activeInstalls = new Set();

app.get('/api/sites/:name/status', (req, res) => {
    const { name } = req.params;
    const siteDir = path.join(root, '../sites', name);
    const nodeModules = path.join(siteDir, 'node_modules');

    const isInstalling = activeInstalls.has(name);
    const isInstalled = fs.existsSync(nodeModules);

    res.json({ isInstalling, isInstalled });
});

app.post('/api/sites/:name/install', (req, res) => {
    const { name } = req.params;
    const siteDir = path.join(root, '../sites', name);

    if (activeInstalls.has(name)) {
        return res.json({ success: true, message: "Installatie is al bezig..." });
    }

    if (!fs.existsSync(siteDir)) {
        return res.status(404).json({ success: false, error: "Site niet gevonden" });
    }

    console.log(`[INSTALL] Start pnpm install voor ${name}...`);
    activeInstalls.add(name);

    const logPath = getLogPath(`install_${name}`);
    const out = fs.openSync(logPath, 'a');

    const child = spawn('pnpm', ['install'], {
        cwd: siteDir,
        stdio: ['ignore', out, out],
        env: { ...process.env }
    });

    const cleanup = (code) => {
        if (activeInstalls.has(name)) {
            activeInstalls.delete(name);
            console.log(`[INSTALL] ${name} klaar (code ${code})`);
        }
    };

    child.on('close', cleanup);
    child.on('exit', cleanup);
    child.on('error', (err) => {
        cleanup('err');
        console.error(`[INSTALL] Fout bij ${name}:`, err);
    });

    res.json({ success: true, message: "Installatie gestart" });
});

// --- SITETYPE WIZARD API ENDPOINTS ---

// Genereer datastructuur voorstel
app.post('/api/sitetype/generate-structure', async (req, res) => {
    try {
        const { businessDescription } = req.body;
        if (!businessDescription) {
            return res.status(400).json({ error: "Business beschrijving is verplicht" });
        }

        const structure = await generateDataStructureAPI(businessDescription);
        res.json({ success: true, structure });
    } catch (error) {
        console.error('Sitetype structure generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Genereer parser instructies
app.post('/api/sitetype/generate-parser', async (req, res) => {
    try {
        const { table } = req.body;
        if (!table) {
            return res.status(400).json({ error: "Tabel data is verplicht" });
        }

        const instructions = await generateParserInstructionsAPI(table);
        res.json({ success: true, instructions });
    } catch (error) {
        console.error('Parser instructions generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Genereer design suggesties
app.post('/api/sitetype/generate-design', async (req, res) => {
    try {
        const { businessDescription } = req.body;
        if (!businessDescription) {
            return res.status(400).json({ error: "Business beschrijving is verplicht" });
        }

        const design = await generateDesignSuggestionAPI(businessDescription);
        res.json({ success: true, design });
    } catch (error) {
        console.error('Design generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Genereer complete sitetype
app.post('/api/sitetype/create', async (req, res) => {
    try {
        const { name, description, dataStructure, designSystem, track } = req.body;
        if (!name || !description || !dataStructure) {
            return res.status(400).json({ error: "Naam, beschrijving en datastructuur zijn verplicht" });
        }

        const result = await generateCompleteSiteType(name, description, dataStructure, designSystem, track || 'docked');
        res.json(result);
    } catch (error) {
        console.error('Sitetype creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Sitetype van Site genereren
app.post('/api/sitetype/create-from-site', async (req, res) => {
    try {
        const { sourceSiteName, targetSitetypeName } = req.body;
        if (!sourceSiteName || !targetSitetypeName) {
            return res.status(400).json({ error: "Bron site en doel sitetype naam zijn verplicht" });
        }

        const tool = path.join(root, '5-engine', 'sitetype-from-site-generator.js');
        const output = execSync(`"${process.execPath}" "${tool}" "${sourceSiteName}" "${targetSitetypeName}"`, {
            cwd: root,
            env: { ...process.env }
        }).toString();

        res.json({ success: true, message: `Sitetype '${targetSitetypeName}' succesvol gegenereerd van site '${sourceSiteName}'!`, details: output });
    } catch (e) {
        const stderr = e.stderr ? e.stderr.toString() : e.message;
        console.error(`[SITETYPE-FROM-SITE] Fout:`, stderr);
        res.status(500).json({ success: false, error: stderr });
    }
});

// Haal bestaande sitetypes op
app.get('/api/sitetype/existing', (req, res) => {
    try {
        const sitetypes = getExistingSiteTypes();
        res.json({ success: true, sitetypes });
    } catch (error) {
        console.error('Get existing sitetypes error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/sites/:id/update-data', (req, res) => {
    try {
        const { id } = req.params;
        const { table, rowId, field, value } = req.body;

        const filePath = path.join(root, '..', 'sites', id, 'src', 'data', `${table.toLowerCase()}.json`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, error: `Tabel ${table} niet gevonden.` });
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Update de specifieke rij (op basis van ID of Index)
        let updated = false;
        if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                // We checken op 'id', 'uuid' of we gebruiken de index als rowId een nummer is
                if (data[i].id == rowId || data[i].uuid == rowId || i == rowId) {
                    data[i][field] = value;
                    updated = true;
                    break;
                }
            }
        }

        if (updated) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            console.log(`[DATA] Veld '${field}' in ${table} bijgewerkt voor site ${id}`);
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, error: "Rij niet gevonden." });
        }
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.listen(port, () => {
    console.log(`🔱 Athena Dashboard running at http://localhost:${port}`);
});
