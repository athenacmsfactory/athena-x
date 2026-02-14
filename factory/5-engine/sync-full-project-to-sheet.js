/**
 * @file sync-full-project-to-sheet.js
 * @description Een robuuste sync die lokale JSON data naar Google Sheets pusht, 
 *              ontbrekende tabbladen aanmaakt en de url-sheet.json ververst.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fullSync(projectName) {
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
        throw new Error(`Site directory niet gevonden voor project ${projectName} (geprobeerd: ${projectName} en ${projectName}-site)`);
    }

    const dataDir = path.join(siteDir, 'src/data');
    const settingsPath = path.join(siteDir, 'project-settings/url-sheet.json');
    
    let saPath = path.join(root, 'sheet-service-account.json');
    if (!fs.existsSync(saPath)) saPath = path.join(root, 'service-account.json');

    if (!fs.existsSync(saPath)) {
        throw new Error("Geen service-account.json gevonden.");
    }

    // 1. Spreadsheet ID bepalen
    if (!fs.existsSync(settingsPath)) {
        throw new Error("url-sheet.json niet gevonden. Koppel eerst een sheet.");
    }
    const urlConfig = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const firstUrl = Object.values(urlConfig).find(v => v.editUrl)?.editUrl;
    const spreadsheetId = firstUrl?.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];

    if (!spreadsheetId) throw new Error("Spreadsheet ID niet gevonden.");

    console.log(`🚀 Start Full Sync voor ${projectName} (ID: ${spreadsheetId})`);

    const auth = new google.auth.GoogleAuth({
        keyFile: saPath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // --- MIGRATION: SPLIT MIXED DATA (From Visuals script) ---
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
            fs.writeFileSync(settingsJsonPath, JSON.stringify([content], null, 2));
            fs.writeFileSync(styleJsonPath, JSON.stringify([style], null, 2));
            console.log("  ✅ Succesvol gesplitst: style_config.json aangemaakt.");
        } catch (e) { console.error("  ❌ Migratie mislukt:", e.message); }
    }

    // 2. Bestaande tabbladen ophalen
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const existingTabs = spreadsheet.data.sheets.map(s => s.properties.title);

    // 3. Lokale JSON bestanden scannen (negeer systeem bestanden)
    const ignoreList = ['schema.json', 'display_config.json', 'layout_settings.json', 'section_order.json', 'style_bindings.json', '_system.json', 'schema.json'];
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !ignoreList.includes(f));

    for (const file of files) {
        const tabName = file.replace('.json', '');
        const jsonData = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
        if (!Array.isArray(jsonData) || jsonData.length === 0) continue;

        // Check of tab bestaat (case-insensitive), anders aanmaken
        if (!existingTabs.some(t => t.toLowerCase() === tabName.toLowerCase())) {
            console.log(`   ➕ Tabblad aanmaken: ${tabName}`);
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [{ addSheet: { properties: { title: tabName } } }]
                }
            });
            existingTabs.push(tabName);
        }

        // Data voorbereiden
        const headers = Object.keys(jsonData[0]);
        const rows = [headers, ...jsonData.map(item => headers.map(h => item[h] ?? ""))];

        console.log(`   📤 Uploaden: ${tabName}`);
        await sheets.spreadsheets.values.clear({ spreadsheetId, range: `'${tabName}'!A1:Z1000` });
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `'${tabName}'!A1`,
            valueInputOption: 'RAW',
            requestBody: { values: rows },
        });
    }

    // 4. URL Sheet verversen (Mapping updaten)
    console.log(`🔄 Mapping verversen...`);
    const finalSpreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const newConfig = {};
    finalSpreadsheet.data.sheets.forEach(s => {
        const title = s.properties.title;
        const gid = s.properties.sheetId;
        newConfig[title] = {
            editUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${gid}`,
            exportUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=tsv&gid=${gid}`
        };
    });

    fs.writeFileSync(settingsPath, JSON.stringify(newConfig, null, 2));
    console.log("✅ Full Project Sync voltooid!");
}

const proj = process.argv[2];
if (proj) {
    fullSync(proj).catch(err => {
        console.error("❌ Fout:", err.message);
        process.exit(1);
    });
}
