/**
 * @file sync-tsv-to-sheet.js
 * @description Uploadt geparseerde data direct naar Google Sheets via de API.
 * Vereist een Service Account JSON key.
 */

import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const [projectName, sheetUrl, serviceAccountPath, githubUser, repoName] = process.argv.slice(2);

    if (!projectName || !sheetUrl || !serviceAccountPath) {
        console.error("❌ Gebruik: node sync-tsv-to-sheet.js <project> <sheetUrl> <serviceAccountPath> [ghUser] [repoName]");
        process.exit(1);
    }

    // Sheet ID extraheren
    const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
        console.error("❌ Ongeldige Google Sheet URL.");
        process.exit(1);
    }
    const spreadsheetId = match[1];

    try {
        console.log(`📡 Verbinden met Google Sheets (ID: ${spreadsheetId})...`);
        const auth = new google.auth.GoogleAuth({
            keyFile: serviceAccountPath,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // 0. Bestaande tabbladen ophalen
        const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
        const existingSheets = spreadsheet.data.sheets.map(s => s.properties.title);

        // 1. Probeer url-sheet.json te laden voor mapping
        let urlSheetMapping = {};
        try {
            const mappingPath = path.resolve(__dirname, '../sites', projectName, 'project-settings', 'url-sheet.json');
            const mappingRaw = await fs.readFile(mappingPath, 'utf8');
            urlSheetMapping = JSON.parse(mappingRaw);
            console.log(`   📂 Mapping geladen uit url-sheet.json (${Object.keys(urlSheetMapping).length} tabbladen)`);
        } catch (e) {
            console.log("   ℹ️ Geen url-sheet.json gevonden, we gebruiken directe bestandsnamen.");
        }

        // 2. Data voorbereiden
        const projectDataDir = path.resolve(__dirname, '../../input', projectName, 'tsv-data');
        const files = await fs.readdir(projectDataDir);
        const tsvFiles = files.filter(f => f.endsWith('.tsv') && f !== 'schema.tsv');

        // We bouwen een lijst van taken (welk bestand -> welk tabblad)
        const uploadTasks = [];

        // Eerst op basis van de mapping
        for (const [key, config] of Object.entries(urlSheetMapping)) {
            // Zoek een passend TSV bestand voor deze key (case-insensitive)
            const matchedFile = tsvFiles.find(f => f.toLowerCase().replace('.tsv', '') === key.toLowerCase());
            if (matchedFile) {
                uploadTasks.push({ fileName: matchedFile, tableName: key });
                // Verwijder uit de 'nog te doen' lijst
                const idx = tsvFiles.indexOf(matchedFile);
                if (idx > -1) tsvFiles.splice(idx, 1);
            }
        }

        // Daarna de overgebleven bestanden
        for (const file of tsvFiles) {
            uploadTasks.push({ fileName: file, tableName: file.replace('.tsv', '') });
        }

        // 3. Uitvoeren van de uploads
        const uploadedTableNames = new Set(['_System']);

        for (const task of uploadTasks) {
            let { fileName, tableName } = task;
            
            // Zoek case-insensitive match in bestaande sheets
            const matchedSheet = existingSheets.find(s => s.toLowerCase() === tableName.toLowerCase());
            
            if (matchedSheet) {
                tableName = matchedSheet; // Gebruik de exacte naam van de bestaande sheet
            } else {
                // Maak nieuwe aan (met hoofdletter voor de netheid)
                const formattedName = tableName.charAt(0).toUpperCase() + tableName.slice(1);
                console.log(`   ➕ Tabblad '${formattedName}' aanmaken...`);
                await sheets.spreadsheets.batchUpdate({
                    spreadsheetId,
                    requestBody: {
                        requests: [{ addSheet: { properties: { title: formattedName } } }]
                    }
                });
                tableName = formattedName;
                existingSheets.push(tableName);
            }

            uploadedTableNames.add(tableName);

            const content = await fs.readFile(path.join(projectDataDir, fileName), 'utf8');
            
            // TSV parsen naar array arrays (inclusief headers op rij 1)
            const rows = content.trim().split('\n').map(line => line.split('\t'));
            
            if (rows.length === 0) continue;

            console.log(`   📤 Uploaden [${fileName}] -> Tabel '${tableName}' (${rows.length} rijen)...`);
            
            // Eerst wissen, dan schrijven
            await sheets.spreadsheets.values.clear({
                spreadsheetId,
                range: tableName,
            });

            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: tableName,
                valueInputOption: 'RAW',
                requestBody: { values: rows },
            });
        }

        // 4. Opschonen van overbodige tabbladen
        console.log(`   🧹 Controleren op overbodige tabbladen...`);
        const finalSpreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
        const allSheets = finalSpreadsheet.data.sheets;
        const sheetsToDelete = allSheets.filter(s => 
            !uploadedTableNames.has(s.properties.title)
        );

        const formattingRequests = [];

        // Voorbereiden van opmaak voor de GEÜPLOADE tabbladen
        allSheets.forEach(s => {
            if (uploadedTableNames.has(s.properties.title) && s.properties.title !== '_System') {
                const sheetId = s.properties.sheetId;
                
                // 1. Bevries eerste rij
                formattingRequests.push({
                    updateSheetProperties: {
                        properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
                        fields: 'gridProperties.frozenRowCount'
                    }
                });

                // 2. Maak header vet + achtergrond + tekstomloop voor alles
                formattingRequests.push({
                    repeatCell: {
                        range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
                        cell: {
                            userEnteredFormat: {
                                textFormat: { bold: true },
                                backgroundColor: { red: 0.95, green: 0.95, blue: 0.95 },
                                verticalAlignment: 'MIDDLE'
                            }
                        },
                        fields: 'userEnteredFormat(textFormat.bold,backgroundColor,verticalAlignment)'
                    }
                });

                // 3. Zet Wrap Strategy op WRAP voor de hele sheet
                formattingRequests.push({
                    repeatCell: {
                        range: { sheetId, startRowIndex: 0, endRowIndex: 500, startColumnIndex: 0, endColumnIndex: 20 },
                        cell: {
                            userEnteredFormat: { wrapStrategy: 'WRAP', verticalAlignment: 'TOP' }
                        },
                        fields: 'userEnteredFormat(wrapStrategy,verticalAlignment)'
                    }
                });

                // 4. Stel kolombreedte in (standaard 200px voor leesbaarheid)
                formattingRequests.push({
                    updateDimensionProperties: {
                        range: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 20 },
                        properties: { pixelSize: 200 },
                        fields: 'pixelSize'
                    }
                });
            }
        });

        const batchRequests = [];
        if (sheetsToDelete.length > 0) {
            sheetsToDelete.forEach(s => {
                batchRequests.push({ deleteSheet: { sheetId: s.properties.sheetId } });
            });
        }
        
        // Voeg alle opmaak requests toe
        batchRequests.push(...formattingRequests);

        if (batchRequests.length > 0) {
            console.log(`   🎨 Opmaak en opschonen uitvoeren (${batchRequests.length} acties)...`);
            try {
                await sheets.spreadsheets.batchUpdate({
                    spreadsheetId,
                    requestBody: { requests: batchRequests }
                });
            } catch (e) {
                console.warn(`   ⚠️  Kon opmaak/opschonen niet volledig uitvoeren: ${e.message}`);
            }
        }

        // 5. _System configuren (als GH gegevens er zijn)
        if (githubUser && repoName) {
            console.log(`   ⚙️  Configuren _System tab...`);
            const systemData = [
                ['key', 'value'],
                ['github_user', githubUser],
                ['github_repo_name', repoName],
                ['last_updated', new Date().toISOString()]
            ];

            try {
                 await sheets.spreadsheets.values.update({
                    spreadsheetId,
                    range: '_System!A1',
                    valueInputOption: 'RAW',
                    requestBody: { values: systemData },
                });
            } catch (e) {
                console.warn("   ⚠️ Kon _System niet updaten (bestaat de tab wel?).", e.message);
            }
        }

        console.log("✅ Alle data is succesvol geüpload naar Google Sheets!");

    } catch (error) {
        console.error(`❌ Fout tijdens upload: ${error.message}`);
        process.exit(1);
    }
}

await main();
