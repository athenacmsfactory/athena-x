/**
 * @file DataManager.js
 * @description Unified data management for Athena monorepo. 
 *              Consolidates JSON, TSV, and Google Sheets sync logic.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { google } from 'googleapis';
import csv from 'csvtojson';

export class AthenaDataManager {
    constructor(root) {
        this.root = root;
    }

    /**
     * Resolve project and site directories (handles -site suffix)
     */
    resolvePaths(projectName) {
        const safeName = projectName.toLowerCase().replace(/\s+/g, '-');
        
        let siteDir = path.resolve(this.root, '../sites', safeName);
        if (!fs.existsSync(siteDir)) {
            const altSiteDir = path.resolve(this.root, '../sites', `${safeName}-site`);
            if (fs.existsSync(altSiteDir)) siteDir = altSiteDir;
        }

        const inputDir = path.resolve(this.root, '../input', safeName);
        
        return {
            projectName: safeName,
            siteDir,
            inputDir,
            dataDir: path.join(siteDir, 'src/data'),
            settingsDir: path.join(siteDir, 'project-settings'),
            tsvDir: path.join(inputDir, 'tsv-data')
        };
    }

    /**
     * Get Google Auth client
     */
    getAuth() {
        let serviceAccountPath = path.join(this.root, 'sheet-service-account.json');
        if (!fs.existsSync(serviceAccountPath)) {
            serviceAccountPath = path.join(this.root, 'service-account.json');
        }

        if (!fs.existsSync(serviceAccountPath)) {
            throw new Error("❌ No sheet-service-account.json or service-account.json found in the root.");
        }

        return new google.auth.GoogleAuth({
            keyFile: serviceAccountPath,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
    }

    /**
     * Backup existing data files
     */
    backupData(siteDir, dataDir) {
        if (!fs.existsSync(dataDir)) return;
        
        const backupsRoot = path.join(siteDir, 'backups');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupDir = path.join(backupsRoot, `data_${timestamp}`);
        
        console.log(`📦 Creating backup: backups/data_${timestamp}...`);
        fs.mkdirSync(backupDir, { recursive: true });
        
        const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
        files.forEach(file => {
            fs.copyFileSync(path.join(dataDir, file), path.join(backupDir, file));
        });

        // Prune old backups (keep last 2)
        try {
            const existingBackups = fs.readdirSync(backupsRoot)
                .filter(f => f.startsWith('data_'))
                .sort();
            
            if (existingBackups.length > 2) {
                const toDelete = existingBackups.slice(0, existingBackups.length - 2);
                toDelete.forEach(folder => {
                    fs.rmSync(path.join(backupsRoot, folder), { recursive: true, force: true });
                    console.log(`🗑️ Pruned old backup: ${folder}`);
                });
            }
        } catch (e) {}
    }

    /**
     * Load JSON data
     */
    loadJSON(filePath) {
        if (!fs.existsSync(filePath)) return null;
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    /**
     * Save JSON data
     */
    saveJSON(filePath, data) {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }

    /**
     * Sync from Sheet (Trigger pnpm fetch-data in site)
     */
    async syncFromSheet(projectName) {
        const paths = this.resolvePaths(projectName);
        if (!fs.existsSync(paths.siteDir)) throw new Error(`Site directory not found for ${projectName}`);

        this.backupData(paths.siteDir, paths.dataDir);

        console.log(`🚀 Fetching data for '${projectName}'...`);
        execSync('pnpm fetch-data', { cwd: paths.siteDir, stdio: 'inherit' });
    }

    /**
     * Pull data from Sheet to a temporary directory for safety/comparison
     */
    async pullToTemp(projectName) {
        const paths = this.resolvePaths(projectName);
        if (!fs.existsSync(paths.siteDir)) throw new Error(`Site directory not found for ${projectName}`);

        console.log(`🚀 Fetching data to temp for '${projectName}'...`);
        // We use -- --temp to pass the flag THROUGH pnpm to the underlying script
        execSync('pnpm fetch-data -- --temp', { cwd: paths.siteDir, stdio: 'inherit' });
    }

    /**
     * Sync TSV to JSON
     */
    async syncTSVToJSON(projectName) {
        const paths = this.resolvePaths(projectName);
        if (!fs.existsSync(paths.tsvDir)) throw new Error(`TSV source not found: ${paths.tsvDir}`);

        console.log(`🔄 Injecting TSV data for: '${projectName}'`);
        const files = fs.readdirSync(paths.tsvDir).filter(f => f.endsWith('.tsv'));

        if (files.length === 0) {
             console.warn(`⚠️ No .tsv files found in ${paths.tsvDir}`);
             return;
        }

        for (const file of files) {
            const tsvPath = path.join(paths.tsvDir, file);
            const json = await csv({ delimiter: '\t', checkType: true }).fromFile(tsvPath);
            
            const cleaned = json.map(row => {
                const newRow = {};
                Object.keys(row).forEach(key => {
                    let val = row[key];
                    if (typeof val === 'string') {
                        val = val.replace(/<br>/gi, '\n').trim();
                    }
                    newRow[key] = val;
                });
                return newRow;
            });

            const destPath = path.join(paths.dataDir, file.replace('.tsv', '.json').toLowerCase());
            this.saveJSON(destPath, cleaned);
            
             // Extra check on file size
            const stats = fs.statSync(destPath);
            if (stats.size < 5) {
                console.warn(`⚠️  WARNING: ${path.basename(destPath)} is suspiciously small (${stats.size} bytes).`);
            } else {
                console.log(`  ✅ Injected: ${path.basename(destPath)}`);
            }
        }
        console.log(`\n🎉 Data Sync Complete!`);
    }

    /**
     * Ensure hidden configuration tabs exist in the Google Sheet
     */
    async ensureHiddenTabs(sheets, spreadsheetId, currentConfig, settingsPath) {
        let changed = false;
        const hiddenTabs = ["_style_config", "_links_config"];
        const newConfig = { ...currentConfig };

        for (const tabName of hiddenTabs) {
            if (newConfig[tabName]) continue;

            console.log(`  🎨 '${tabName}' tab missing in config. Checking/Creating...`);
            try {
                const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId });
                let targetSheet = sheetMeta.data.sheets.find(s => s.properties.title === tabName);
                let newSheetId;

                if (!targetSheet) {
                    const addRes = await sheets.spreadsheets.batchUpdate({
                        spreadsheetId,
                        requestBody: {
                            requests: [{
                                addSheet: {
                                    properties: {
                                        title: tabName,
                                        hidden: true,
                                        gridProperties: { rowCount: 1000, columnCount: 2 } // Simple key-value structure
                                    }
                                }
                            }]
                        }
                    });
                    newSheetId = addRes.data.replies[0].addSheet.properties.sheetId;
                    console.log(`  ✅ Tab '${tabName}' created (GID: ${newSheetId}).`);
                } else {
                    newSheetId = targetSheet.properties.sheetId;
                    console.log(`  ℹ️ Tab '${tabName}' already existed (GID: ${newSheetId}).`);
                }

                const baseUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
                newConfig[tabName] = {
                    editUrl: `${baseUrl}/edit#gid=${newSheetId}`,
                    exportUrl: `${baseUrl}/export?format=tsv&gid=${newSheetId}`
                };
                changed = true;
            } catch (e) {
                console.error(`  ❌ Could not process '${tabName}': ${e.message}`);
            }
        }

        if (changed) {
            fs.writeFileSync(settingsPath, JSON.stringify(newConfig, null, 2));
            console.log("  📝 url-sheet.json updated.");
        }
        return newConfig;
    }

    /**
     * Migrate old site_settings.json to split content and style
     */
    migrateSettings(dataDir) {
        const settingsJsonPath = path.join(dataDir, 'site_settings.json');
        const styleJsonPath = path.join(dataDir, 'style_config.json');

        if (fs.existsSync(settingsJsonPath) && !fs.existsSync(styleJsonPath)) {
            console.log("  🧹 Migration: Splitting old 'site_settings.json' into Content & Style...");
            try {
                const raw = JSON.parse(fs.readFileSync(settingsJsonPath, 'utf8'));
                const data = Array.isArray(raw) ? raw[0] : raw;
                
                const content = {};
                const style = {};
                
                Object.keys(data).forEach(k => {
                    if (k.match(/^(light_|dark_|hero_|font_|color_|btn_|card_|section_|footer_bg|nav_|rounded_|shadow_)/)) {
                        style[k] = data[k];
                    } else {
                        content[k] = data[k];
                    }
                });

                // Write split files
                fs.writeFileSync(settingsJsonPath, JSON.stringify([content], null, 2));
                fs.writeFileSync(styleJsonPath, JSON.stringify([style], null, 2));
                console.log("  ✅ Successfully split: style_config.json created.");
            } catch (e) {
                console.error("  ❌ Migration failed:", e.message);
            }
        }
    }

    /**
     * Patch a specific key in a JSON data file
     */
    patchData(projectName, file, index, key, value) {
        const paths = this.resolvePaths(projectName);
        const fileName = file.endsWith('.json') ? file : `${file}.json`;
        const filePath = path.join(paths.dataDir, fileName);

        if (!fs.existsSync(filePath)) {
            throw new Error(`Bestand ${fileName} niet gevonden in project ${projectName}`);
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (Array.isArray(data)) {
            if (!data[index]) data[index] = {};
            data[index][key] = value;
        } else {
            // Voor site_settings.json of andere object-gebaseerde configs
            const keys = key.split('.');
            let obj = data;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!obj[keys[i]]) obj[keys[i]] = {};
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`✅ Patched ${file} -> ${key}: ${value}`);
        return true;
    }

    /**
     * Sync local JSON data back to Google Sheet
     */
    async syncToSheet(projectName) {
        const paths = this.resolvePaths(projectName);
        if (!fs.existsSync(paths.siteDir)) {
             throw new Error(`Site directory not found for ${projectName}`);
        }

        const settingsPath = path.join(paths.settingsDir, 'url-sheet.json');
        if (!fs.existsSync(settingsPath)) {
             throw new Error("❌ No url-sheet.json found for this project.");
        }

        const urlConfig = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        
        // Get Spreadsheet ID from the first editUrl
        const firstUrl = Object.values(urlConfig)[0].editUrl;
        const spreadsheetId = firstUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];

        if (!spreadsheetId) {
             throw new Error("❌ Could not determine Spreadsheet ID from url-sheet.json.");
        }

        const auth = this.getAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        // --- 1. CONFIG CHECK & TAB CREATION ---
        if (urlConfig.site_settings) {
            const updatedConfig = await this.ensureHiddenTabs(sheets, spreadsheetId, urlConfig, settingsPath);
            Object.assign(urlConfig, updatedConfig);
        }

        // --- 2. LOCAL MIGRATION (SPLIT MIXED DATA) ---
        this.migrateSettings(paths.dataDir);

        // --- 3. UPLOAD LOOP ---
        for (const [tabName, config] of Object.entries(urlConfig)) {
            // Determine file for tab
            let fileName = `${tabName.toLowerCase()}.json`;
            if (tabName === '_style_config') fileName = 'style_config.json';
            if (tabName === '_links_config') fileName = 'links_config.json';
            
            const jsonPath = path.join(paths.dataDir, fileName);

            if (!fs.existsSync(jsonPath)) {
                 // Skip silently if missing, unless it's a critical config file
                 if (tabName !== '_style_config' && tabName !== '_links_config') {
                     console.warn(`  ⚠️ No local JSON file found for ${tabName} (${fileName}), skipping.`);
                 }
                 continue;
            }

            console.log(`  📤 Uploading ${tabName}...`);
            let jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            
            // Convert to 2D array for Sheets
            let headers = [];
            let rows = [];

            if (Array.isArray(jsonData)) {
                if (jsonData.length === 0) continue;
                headers = Object.keys(jsonData[0]);
                rows = [headers];
                jsonData.forEach(item => {
                    rows.push(headers.map(h => {
                        const val = item[h];
                        if (val && typeof val === 'object' && !Array.isArray(val)) {
                            // Extract text/title/label if it's a CMS object
                            return val.text || val.title || val.label || JSON.stringify(val);
                        }
                        return val === null || val === undefined ? "" : val;
                    }));
                });
            } else {
                // Key-value object (e.g. links_config or style_bindings)
                headers = ["Key", "Value"];
                rows = [headers];
                Object.entries(jsonData).forEach(([k, v]) => {
                    rows.push([k, typeof v === 'object' ? JSON.stringify(v) : v]);
                });
            }

            try {
                await sheets.spreadsheets.values.clear({
                    spreadsheetId,
                    range: `'${tabName}'!A1:Z1000`,
                });

                await sheets.spreadsheets.values.update({
                    spreadsheetId,
                    range: `'${tabName}'!A1`,
                    valueInputOption: 'RAW',
                    requestBody: { values: rows },
                });
                console.log(`  ✅ ${tabName} successfully updated.`);
            } catch (e) {
                console.error(`  ❌ Error uploading ${tabName}: ${e.message}`);
            }
        }

        console.log("✨ Done! The Google Sheet is now in sync with your local visual edits.");
    }
}
