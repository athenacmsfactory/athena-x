/**
 * @file sync-json-to-sheet.js
 * @description Leest de lokale JSON data van een site en uploadt deze naar de Google Sheet.
 *              Dit is de 'back-sync' die visuele edits permanent maakt in het CMS.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function syncSiteToSheet(projectName) {
    const root = path.resolve(__dirname, '..');
    
    // Probeer beide varianten: [projectName] en [projectName]-site
    let siteDir = path.resolve(root, '../sites', projectName);
    if (!fs.existsSync(siteDir)) {
        const altSiteDir = path.resolve(root, '../sites', `${projectName}-site`);
        if (fs.existsSync(altSiteDir)) {
            siteDir = altSiteDir;
        }
    }
    
    if (!fs.existsSync(siteDir)) {
        console.error(`❌ Site directory niet gevonden voor project ${projectName} (geprobeerd: ${projectName} en ${projectName}-site)`);
        return;
    }

    const dataDir = path.join(siteDir, 'src/data');
    const settingsPath = path.join(siteDir, 'project-settings/url-sheet.json');
    let serviceAccountPath = path.join(root, 'sheet-service-account.json');

    if (!fs.existsSync(serviceAccountPath)) {
        serviceAccountPath = path.join(root, 'service-account.json');
    }

    console.log(`🔄 Syncing ${projectName} back to Google Sheets...`);

    if (!fs.existsSync(serviceAccountPath)) {
        console.error("❌ Geen sheet-service-account.json of service-account.json gevonden in de root.");
        return;
    }

    if (!fs.existsSync(settingsPath)) {
        console.error("❌ Geen url-sheet.json gevonden voor dit project.");
        return;
    }

    const urlConfig = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    
    // Spreadsheet ID halen uit de eerste de beste editUrl
    const firstUrl = Object.values(urlConfig)[0].editUrl;
    const spreadsheetId = firstUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];

    if (!spreadsheetId) {
        console.error("❌ Kon Spreadsheet ID niet bepalen uit url-sheet.json.");
        return;
    }

    const auth = new google.auth.GoogleAuth({
        keyFile: serviceAccountPath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // --- 1. CONFIG CHECK & TAB CREATION ---
    async function ensureHiddenTabs(currentConfig) {
        let changed = false;
        const hiddenTabs = ["_style_config", "_links_config"];
        const newConfig = { ...currentConfig };

        for (const tabName of hiddenTabs) {
            if (newConfig[tabName]) continue;

            console.log(`  🎨 '${tabName}' tab ontbreekt in configuratie. Controleren/Aanmaken...`);
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
                                        gridProperties: { rowCount: 1000, columnCount: 2 } // Simpele key-value structuur
                                    }
                                }
                            }]
                        }
                    });
                    newSheetId = addRes.data.replies[0].addSheet.properties.sheetId;
                    console.log(`  ✅ Tab '${tabName}' aangemaakt (GID: ${newSheetId}).`);
                } else {
                    newSheetId = targetSheet.properties.sheetId;
                    console.log(`  ℹ️ Tab '${tabName}' bestond al (GID: ${newSheetId}).`);
                }

                const baseUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
                newConfig[tabName] = {
                    editUrl: `${baseUrl}/edit#gid=${newSheetId}`,
                    exportUrl: `${baseUrl}/export?format=tsv&gid=${newSheetId}`
                };
                changed = true;
            } catch (e) {
                console.error(`  ❌ Kon '${tabName}' niet verwerken: ${e.message}`);
            }
        }

        if (changed) {
            fs.writeFileSync(settingsPath, JSON.stringify(newConfig, null, 2));
            console.log("  📝 url-sheet.json bijgewerkt.");
        }
        return newConfig;
    }

    if (urlConfig.site_settings) {
        const updatedConfig = await ensureHiddenTabs(urlConfig);
        Object.assign(urlConfig, updatedConfig);
    }

    // --- 2. LOCAL MIGRATION (SPLIT MIXED DATA) ---
    const settingsJsonPath = path.join(dataDir, 'site_settings.json');
    const styleJsonPath = path.join(dataDir, 'style_config.json');

    if (fs.existsSync(settingsJsonPath) && !fs.existsSync(styleJsonPath)) {
        console.log("  🧹 Migratie: Oude 'site_settings.json' splitsen in Content & Style...");
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

            // Schrijf de gesplitste bestanden
            fs.writeFileSync(settingsJsonPath, JSON.stringify([content], null, 2));
            fs.writeFileSync(styleJsonPath, JSON.stringify([style], null, 2));
            console.log("  ✅ Succesvol gesplitst: style_config.json aangemaakt.");
        } catch (e) {
            console.error("  ❌ Migratie mislukt:", e.message);
        }
    }

    // --- 3. UPLOAD LOOP ---
    for (const [tabName, config] of Object.entries(urlConfig)) {
        // Bepaal welk bestand bij welke tab hoort
        let fileName = `${tabName.toLowerCase()}.json`;
        if (tabName === '_style_config') fileName = 'style_config.json';
        if (tabName === '_links_config') fileName = 'links_config.json';
        
        const jsonPath = path.join(dataDir, fileName);

        if (!fs.existsSync(jsonPath)) {
             // Als style_config.json niet bestaat, en we zijn bij _style_config, skip silently
             if (tabName !== '_style_config' && tabName !== '_links_config') {
                 console.warn(`  ⚠️ Geen lokaal JSON bestand gevonden voor ${tabName} (${fileName}), overslaan.`);
             }
             continue;
        }

        console.log(`  📤 Uploaden ${tabName}...`);
        let jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        
        // Omzetten naar 2D array voor Sheets
        let headers = [];
        let rows = [];

        if (Array.isArray(jsonData)) {
            if (jsonData.length === 0) continue;
            headers = Object.keys(jsonData[0]);
            rows = [headers];
            jsonData.forEach(item => {
                rows.push(headers.map(h => {
                    const val = item[h];
                    return val === null || val === undefined ? "" : val;
                }));
            });
        } else {
            // Het is een simpel object (key-value), bv links_config of style_bindings
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
            console.log(`  ✅ ${tabName} succesvol bijgewerkt.`);
        } catch (e) {
            console.error(`  ❌ Fout bij uploaden van ${tabName}: ${e.message}`);
        }
    }

    console.log("✨ Klaar! De Google Sheet is nu synchroon met je lokale visuele edits.");
}

const projectName = process.argv[2];
if (!projectName) {
    console.error("Gebruik: node 5-engine/sync-json-to-sheet.js <project-naam>");
} else {
    syncSiteToSheet(projectName);
}
