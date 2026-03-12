/**
 * SiteController.js
 * @description Headless business logic for managing generated sites.
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import { createProject, validateProjectName } from '../core/factory.js';
import { deployProject } from '../wizards/deploy-wizard.js';
import { AthenaDataManager } from '../lib/DataManager.js';
import { AthenaInterpreter } from '../core/interpreter.js';
import { InstallManager } from '../lib/InstallManager.js';

export class SiteController {
    constructor(configManager, executionService, processManager) {
        this.configManager = configManager;
        this.execService = executionService;
        this.pm = processManager;
        this.root = configManager.get('paths.root');
        this.sitesDir = configManager.get('paths.sites');
        this.sitesExternalDir = configManager.get('paths.sitesExternal');
        this.dataManager = new AthenaDataManager(configManager.get('paths.factory'));
        this.interpreter = new AthenaInterpreter(configManager);
        this.installManager = new InstallManager(this.root);
    }

    /**
     * Update a site based on a natural language instruction
     */
    async updateFromInstruction(projectName, instruction) {
        // 1. Haal de huidige data op voor context (beperkt voor AI token limits)
        const paths = this.dataManager.resolvePaths(projectName);
        const basisData = this.dataManager.loadJSON(path.join(paths.dataDir, 'basis.json')) || [];
        const settings = this.dataManager.loadJSON(path.join(paths.dataDir, 'site_settings.json')) || {};
        
        const context = {
            availableFiles: fs.existsSync(paths.dataDir) ? fs.readdirSync(paths.dataDir).filter(f => f.endsWith('.json')) : [],
            basisSample: basisData[0],
            settingsSample: Array.isArray(settings) ? settings[0] : settings
        };

        // 2. Laat de AI de instructie interpreteren
        console.log(`🤖 AI interpreteert instructie: "${instruction}"`);
        const aiResponse = await this.interpreter.interpretUpdate(instruction, context);
        
        // 3. Pas de patches toe
        for (const patch of aiResponse.patches) {
            this.dataManager.patchData(projectName, patch.file, patch.index, patch.key, patch.value);
        }

        // 4. Sync naar Google Sheet indien nodig (Sheets-First!)
        if (aiResponse.syncRequired) {
            console.log(`📡 Wijzigingen worden gesynchroniseerd naar de Google Sheet van ${projectName}...`);
            await this.dataManager.syncToSheet(projectName);
        }

        return {
            success: true,
            message: "Site succesvol bijgewerkt op basis van de instructie.",
            patches: aiResponse.patches,
            syncPerformed: aiResponse.syncRequired
        };
    }

    /**
     * List all generated sites with their current status
     */
    list() {
        const nativeSites = this._scanDir(this.sitesDir, true);
        const externalSites = this._scanDir(this.sitesExternalDir, false);
        return [...nativeSites, ...externalSites];
    }

    _scanDir(dir, isNative) {
        if (!dir || !fs.existsSync(dir)) return [];
        const sites = fs.readdirSync(dir).filter(f => 
            fs.statSync(path.join(dir, f)).isDirectory() && !f.startsWith('.') && f !== 'athena-cms'
        );

        return sites.map(site => {
            const sitePath = path.join(dir, site);
            const deployFile = path.join(sitePath, 'project-settings', 'deployment.json');
            const sheetFile = path.join(sitePath, 'project-settings', 'url-sheet.json');

            let status = 'local';
            let deployData = null;
            let sheetData = null;
            let isDataEmpty = false;

            // Check if data exists
            const dataDir = path.join(sitePath, 'src', 'data');
            if (fs.existsSync(dataDir)) {
                const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'schema.json');
                if (jsonFiles.length > 0) {
                    let allEmpty = true;
                    for (const file of jsonFiles) {
                        if (fs.statSync(path.join(dataDir, file)).size > 5) {
                            allEmpty = false;
                            break;
                        }
                    }
                    isDataEmpty = allEmpty;
                } else isDataEmpty = true;
            } else isDataEmpty = true;

            if (fs.existsSync(deployFile)) {
                try {
                    deployData = JSON.parse(fs.readFileSync(deployFile, 'utf8'));
                    status = deployData.status || 'live';

                    // Fallback for missing liveUrl/repoUrl if status is live
                    if (status === 'live' && !deployData.liveUrl) {
                        const githubUser = process.env.GITHUB_USER || this.configManager.get('GITHUB_USER');
                        const githubOrg = process.env.GITHUB_ORG || this.configManager.get('GITHUB_ORG');
                        const owner = githubOrg || githubUser || 'athena-cms-factory';
                        deployData.liveUrl = `https://${owner}.github.io/${site}/`;
                        if (!deployData.repoUrl) deployData.repoUrl = `https://github.com/${owner}/${site}`;
                    }
                } catch (e) {
                    console.error(`Error parsing deployment for ${site}:`, e.message);
                }
            }

            if (fs.existsSync(sheetFile)) {
                try {
                    const json = JSON.parse(fs.readFileSync(sheetFile, 'utf8'));
                    const firstKey = Object.keys(json)[0];
                    if (firstKey) sheetData = json[firstKey].editUrl;
                } catch (e) {}
            }

            // Get SiteType from athena-config.json
            let siteType = null;
            const configPath = path.join(sitePath, 'athena-config.json');
            if (fs.existsSync(configPath)) {
                try {
                    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                    siteType = config.siteType;
                } catch (e) { }
            }

            const isInstalled = fs.existsSync(path.join(sitePath, 'node_modules'));
            const port = this.getSitePort(site, sitePath);

            return { name: site, status, deployData, sheetUrl: sheetData, isDataEmpty, siteType, isInstalled, port, isNative };
        });
    }

    /**
     * Generate a new site from blueprint and source project
     */
    async create(params) {
        const { projectName, sourceProject, siteType, layoutName, styleName, siteModel, autoSheet, clientEmail } = params;
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
        return { success: true, message: `Project ${config.projectName} created!` };
    }

    /**
     * Get the full structure and data of a site for the Dock
     */
    getSiteStructure(id) {
        // Try native first, then external
        let siteDir = path.join(this.sitesDir, id);
        if (!fs.existsSync(siteDir)) siteDir = path.join(this.sitesExternalDir, id);
        
        const dataDir = path.join(siteDir, 'src/data');
        const data = {};

        if (fs.existsSync(dataDir)) {
            const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
            files.forEach(file => {
                const name = file.replace('.json', '');
                try {
                    const content = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
                    data[name] = content;
                } catch (e) {
                    console.error(`Error loading ${file}:`, e.message);
                }
            });
        }

        // Return combined structure
        return {
            id,
            data,
            url: this.getSiteUrl(id, siteDir)
        };
    }

    getSiteUrl(id, siteDir) {
        const port = this.getSitePort(id, siteDir);
        return `http://localhost:${port}/${id}/`;
    }

    /**
     * Directly update a data field in a site's JSON
     */
    updateData(id, { table, rowId, field, value }) {
        // Find site dir
        let siteDir = path.join(this.sitesDir, id);
        if (!fs.existsSync(siteDir)) siteDir = path.join(this.sitesExternalDir, id);

        const filePath = path.join(siteDir, 'src', 'data', `${table.toLowerCase()}.json`);
        if (!fs.existsSync(filePath)) throw new Error(`Tabel ${table} niet gevonden.`);

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let updated = false;
        if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id == rowId || data[i].uuid == rowId || i == rowId) {
                    data[i][field] = value;
                    updated = true;
                    break;
                }
            }
        }

        if (updated) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return { success: true };
        }
        throw new Error("Rij niet gevonden.");
    }

    /**
     * Get installation status (node_modules existence + active progress)
     */
    getStatus(name) {
        let siteDir = path.join(this.sitesDir, name);
        if (!fs.existsSync(siteDir)) siteDir = path.join(this.sitesExternalDir, name);

        const nodeModules = path.join(siteDir, 'node_modules');
        const installInfo = this.installManager.getStatus(name);
        
        return { 
            isInstalled: fs.existsSync(nodeModules),
            installStatus: installInfo.status,
            installLog: installInfo.logTail,
            isInstalling: installInfo.status === 'running'
        };
    }

    /**
     * Install dependencies for a site
     */
    async install(name) {
        let siteDir = path.join(this.sitesDir, name);
        if (!fs.existsSync(siteDir)) siteDir = path.join(this.sitesExternalDir, name);

        if (!fs.existsSync(siteDir)) throw new Error("Site niet gevonden");

        return await this.installManager.install(name, siteDir);
    }

    /**
     * Start/Get preview server for a site
     */
    async preview(id) {
        let siteDir = path.join(this.sitesDir, id);
        if (!fs.existsSync(siteDir)) siteDir = path.join(this.sitesExternalDir, id);

        if (!fs.existsSync(siteDir)) throw new Error(`Site '${id}' niet gevonden.`);

        // Get site type to decide server
        let siteType = 'basis';
        const configPath = path.join(siteDir, 'athena-config.json');
        if (fs.existsSync(configPath)) {
            try { siteType = JSON.parse(fs.readFileSync(configPath, 'utf8')).siteType; } catch(e){}
        }

        const previewPort = this.getSitePort(id, siteDir);

        // 1. STOP ALLE ANDERE PREVIEWS (behalve het dashboard!)
        try {
            const activeProcesses = this.pm.listActive();
            const dashboardPort = 5001; 
            
            for (const port in activeProcesses) {
                const pNum = parseInt(port);
                if (activeProcesses[port].type === 'preview' && pNum !== dashboardPort) {
                    await this.pm.stopProcessByPort(pNum);
                }
            }
            await this.pm.stopProcessByPort(previewPort); 
        } catch (e) {}

        // 2. START SERVER
        if (siteType === 'static-legacy') {
            console.log(`📦 Starting light server (sirv) for static site ${id} on port ${previewPort}...`);
            // Static sites don't need installation
            await this.pm.startProcess(id, 'preview', previewPort, 'sirv', [siteDir, '--port', previewPort.toString(), '--host', '--dev', '--single'], { cwd: siteDir });
        } else {
            // VITE/APP SITES
            if (!fs.existsSync(path.join(siteDir, 'node_modules'))) {
                console.log(`📦 node_modules ontbreken in ${id}, installatie starten in achtergrond...`);
                this.install(id).catch(err => console.error(`Fout bij installatie ${id}:`, err));
                return { 
                    success: true, 
                    status: 'installing', 
                    message: 'Installatie is gestart. Even geduld...',
                    url: `http://localhost:${previewPort}/${id}/`
                };
            }

            console.log(`🚀 Starting Vite preview for ${id} on port ${previewPort}...`);
            try {
                await this.pm.startProcess(id, 'preview', previewPort, 'pnpm', ['dev', '--port', previewPort.toString(), '--host'], { cwd: siteDir });
            } catch (e) {
                console.error(`Fout bij starten preview ${id}:`, e.message);
            }
        }

        return { success: true, status: 'ready', url: `http://localhost:${previewPort}/${id}/` };
    }

    /**
     * Create a new athenified version of an external site
     */
    async athenifySite(id) {
        const sourceDir = path.join(this.sitesExternalDir, id);
        if (!fs.existsSync(sourceDir)) throw new Error("Bron site niet gevonden in external.");

        const newName = `${id}-ath`;
        const targetDir = path.join(this.sitesDir, newName);

        if (fs.existsSync(targetDir)) throw new Error(`Doelmap '${newName}' bestaat al.`);

        console.log(`✨ Athenifying ${id} to ${newName}...`);
        
        try {
            // 1. Maak kopie (zonder node_modules)
            execSync(`mkdir -p "${targetDir}"`);
            execSync(`rsync -av --exclude 'node_modules' --exclude '.git' "${sourceDir}/" "${targetDir}/"`);

            // 2. Update/Create athena-config.json
            const config = {
                projectName: newName,
                safeName: newName,
                siteType: 'athenified-legacy',
                sourceLegacy: id,
                athenifiedAt: new Date().toISOString()
            };
            fs.writeFileSync(path.join(targetDir, 'athena-config.json'), JSON.stringify(config, null, 2));

            // 3. Run Athenafier engine script
            await this.execService.runEngineScript('athenafier.js', [newName]);

            return { success: true, newName };
        } catch (e) {
            console.error("❌ Athenify failed:", e.message);
            return { success: false, error: e.message };
        }
    }

    /**
     * Helper to get site port (duplicated from ServerController for autonomy)
     */
    getSitePort(siteId, siteDir) {
        const registryPath = path.join(this.configManager.get('paths.factory'), 'config/site-ports.json');
        if (fs.existsSync(registryPath)) {
            try {
                const ports = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
                if (ports[siteId]) return ports[siteId];
            } catch (e) { }
        }
        return 5100;
    }

    /**
     * Update deployment settings manually
     */
    updateDeployment(data) {
        const { projectName, status, liveUrl, repoUrl } = data;
        const sitePath = path.join(this.sitesDir, projectName);
        const settingsDir = path.join(sitePath, 'project-settings');
        const deployFile = path.join(settingsDir, 'deployment.json');

        if (!fs.existsSync(settingsDir)) fs.mkdirSync(settingsDir, { recursive: true });

        const deployData = {
            deployedAt: new Date().toISOString(),
            repoUrl: repoUrl || "",
            liveUrl: liveUrl || "",
            status: status || 'live'
        };

        fs.writeFileSync(deployFile, JSON.stringify(deployData, null, 2));
        return { success: true, message: "Deployment settings updated." };
    }

    /**
     * Get all deployments for the Live Manager GUI
     */
    getAllDeployments() {
        const nativeDeps = this._scanDeployments(this.sitesDir);
        const externalDeps = this._scanDeployments(this.sitesExternalDir);
        return [...nativeDeps, ...externalDeps];
    }

    _scanDeployments(dir) {
        if (!dir || !fs.existsSync(dir)) return [];
        const projects = fs.readdirSync(dir).filter(f => 
            fs.statSync(path.join(dir, f)).isDirectory() && !f.startsWith('.')
        );

        return projects.map(project => {
            const projectPath = path.join(dir, project);
            const deployFile = path.join(projectPath, 'project-settings', 'deployment.json');
            let deployData = { liveUrl: '', repoUrl: '', status: 'local' };
            let flags = { liveUrlFallback: false, repoUrlFallback: false };
            
            const port = this.getSitePort(project, projectPath);
            const localUrl = `http://localhost:${port}/${project}/`;

            if (fs.existsSync(deployFile)) {
                try { 
                    deployData = JSON.parse(fs.readFileSync(deployFile, 'utf8')); 
                    
                    if (deployData.status === 'live' || !deployData.status) {
                        const githubUser = process.env.GITHUB_USER || this.configManager.get('GITHUB_USER');
                        const githubOrg = process.env.GITHUB_ORG || this.configManager.get('GITHUB_ORG');
                        const owner = githubOrg || githubUser || 'athena-cms-factory';
                        
                        if (!deployData.liveUrl) {
                            deployData.liveUrl = `https://${owner}.github.io/${project}/`;
                            flags.liveUrlFallback = true;
                        }
                        if (!deployData.repoUrl) {
                            deployData.repoUrl = `https://github.com/${owner}/${project}`;
                            flags.repoUrlFallback = true;
                        }
                        if (!deployData.status) deployData.status = 'live';
                    }
                } catch (e) {}
            }
            return { id: project, localUrl, ...deployData, ...flags };
        });
    }

    /**
     * Link a Google Sheet to a site
     */
    async linkSheet(id, sheetUrl) {
        return this.execService.runEngineScript('sheet-linker-wizard.js', [id, sheetUrl]);
    }

    /**
     * Auto-provision a Google Sheet for a site
     */
    async autoProvision(id) {
        return this.execService.runEngineScript('auto-sheet-provisioner.js', [id]);
    }

    /**
     * Compare Local, GitHub, and Google Sheet data for a site
     */
    async compareSiteSources(id) {
        const paths = this.dataManager.resolvePaths(id);
        const dataDir = paths.dataDir;
        if (!fs.existsSync(dataDir)) throw new Error("Data directory not found.");

        const report = {
            hasRepo: false,
            hasDrift: false,
            files: {}
        };

        // 0. Check if it's a git repo (within the monorepo context)
        try {
            execSync('git rev-parse --is-inside-work-tree', { cwd: this.root, stdio: 'ignore' });
            report.hasRepo = true;
            // Fetch origin to ensure drift check is against current server state
            console.log("📡 Fetching origin to check for drift...");
            execSync('git fetch origin main', { cwd: this.root, stdio: 'ignore' });
        } catch (e) {
            return report; // Early exit if no git context
        }

        const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'schema.json');

        // 1. Fetch GitHub version (origin/main)
        const getGithubContent = (file) => {
            try {
                const relPath = path.relative(this.root, path.join(dataDir, file));
                return JSON.parse(execSync(`git show origin/main:${relPath}`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString());
            } catch (e) { return null; }
        };

        for (const file of jsonFiles) {
            const localData = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
            const githubData = getGithubContent(file);
            
            const fileReport = {
                localVsGitHub: this._compareArrays(localData, githubData),
                drift: false
            };

            if (fileReport.localVsGitHub.changed) {
                report.hasDrift = true;
                fileReport.drift = true;
            }

            report.files[file] = fileReport;
        }

        return report;
    }

    /**
     * Safe pull: Backup local data before pulling from GitHub
     */
    async safePullFromGitHub(id) {
        const paths = this.dataManager.resolvePaths(id);
        console.log(`📦 Creating safety backup for ${id} before surgical sync...`);
        this.dataManager.backupData(paths.siteDir, paths.dataDir);

        const relPath = path.relative(this.root, paths.siteDir);
        const dataPath = path.join(relPath, 'src/data');
        
        console.log(`📡 Surgically syncing ${dataPath} from GitHub main...`);
        
        try {
            // 1. Haal de laatste status op van de remote (verandert geen lokale bestanden)
            execSync('git fetch origin main', { cwd: this.root, stdio: 'ignore' });
            
            // 2. We resetten eerst de index voor deze specifieke map om conflicten bij checkout te vermijden
            execSync(`git reset origin/main -- ${dataPath}`, { cwd: this.root, stdio: 'ignore' });

            // 3. Overschrijf chirurgisch alleen de bestanden in de DATA-map met de versie van GitHub main
            // Dit raakt geen andere sites aan en laat de factory/dock/logs volledig met rust.
            execSync(`git checkout origin/main -- ${dataPath}`, { cwd: this.root, stdio: 'inherit' });
            
            return { success: true, message: `GitHub Sync voltooid voor ${id} (na backup). Content is bijgewerkt vanaf GitHub.` };
        } catch (err) {
            console.error("❌ Surgical Sync failed:", err);
            throw new Error(`Surgische sync mislukt: ${err.message}. Controleer je internetverbinding of Git status.`);
        }
    }

    _compareArrays(arr1, arr2) {
        if (!arr1 || !arr2) return { changed: true, reason: !arr1 ? "Local missing" : "GitHub missing" };
        const s1 = JSON.stringify(arr1);
        const s2 = JSON.stringify(arr2);
        if (s1 === s2) return { changed: false };

        return {
            changed: true,
            lengthDiff: arr1.length !== arr2.length,
            diffCount: Math.abs(arr1.length - arr2.length)
        };
    }

    /**
     * Pull latest changes from GitHub (Monorepo)
     */
    async pullFromGitHub() {
        console.log(`📡 Pulling latest changes from GitHub monorepo...`);
        try {
            execSync('git pull origin main', { cwd: this.root, stdio: 'inherit' });
            return { success: true, message: "Monorepo succesvol bijgewerkt vanaf GitHub." };
        } catch (err) {
            console.error("❌ Git Pull failed:", err);
            throw new Error(`Git Pull mislukt: ${err.message}`);
        }
    }

    /**
     * Sync local JSON data to Google Sheet
     */
    async syncToSheet(id) {
        await this.dataManager.syncToSheet(id);
        return { success: true, message: "Sync naar Google Sheet voltooid." };
    }

    /**
     * Pull data from Google Sheet to local JSON
     */
    async pullFromSheet(id) {
        await this.dataManager.syncFromSheet(id);
        return { success: true, message: "Data opgehaald uit Google Sheet." };
    }

    /**
     * Pull data from Google Sheet to a temporary directory
     */
    async pullToTemp(id) {
        await this.dataManager.pullToTemp(id);
        return { success: true, message: "Data tijdelijk opgehaald uit Google Sheet voor controle." };
    }

    /**
     * Deploy site to GitHub Pages
     */
    async deploy(projectName, commitMsg) {
        const result = await deployProject(projectName, commitMsg);
        return { success: true, result };
    }

    /**
     * Get available visual styles from the boilerplate
     */
    getStyles() {
        const stylesDir = path.join(this.configManager.get('paths.templates'), 'boilerplate/docked/css');
        if (!fs.existsSync(stylesDir)) return [];
        return fs.readdirSync(stylesDir)
            .filter(f => f.endsWith('.css'))
            .map(f => f.replace('.css', ''));
    }

    /**
     * Get available layouts for a specific sitetype
     */
    getLayouts(siteType) {
        // siteType can be "track/name"
        const [track, name] = siteType.includes('/') ? siteType.split('/') : ['docked', siteType];
        const webDir = path.join(this.configManager.get('paths.sitetypes'), track, name, 'web');
        
        if (!fs.existsSync(webDir)) return [];
        return fs.readdirSync(webDir).filter(f => 
            fs.statSync(path.join(webDir, f)).isDirectory() && !f.startsWith('.')
        );
    }

    /**
     * Run a maintenance script (e.g. sync-deployment-status)
     */
    runScript(script, args) {
        return this.execService.runEngineScript(script, args);
    }
}
