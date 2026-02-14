/**
 * @file sync-sheet-to-tsv.js
 * @description Downloadt data van Google Sheets en slaat deze op als TSV in ../input/[project]/tsv-data/
 */

import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const [projectName, sheetUrl, serviceAccountPath] = process.argv.slice(2);

    if (!projectName || !sheetUrl) {
        console.error("❌ Gebruik: node sync-sheet-to-tsv.js <project> <sheetUrl> [serviceAccountPath]");
        console.log("   (Default serviceAccountPath: sheet-service-account.json)");
        process.exit(1);
    }

    const saPath = serviceAccountPath || 'sheet-service-account.json';
    const root = path.resolve(__dirname, '..');
    const saFullPath = path.isAbsolute(saPath) ? saPath : path.join(root, saPath);

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
            keyFile: saFullPath,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // 1. Spreadsheet metadata ophalen (voor de lijst met tabbladen)
        const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetTitles = spreadsheet.data.sheets
            .map(s => s.properties.title)
            .filter(title => !title.startsWith('_')); // Sla systeem-tabs over

        const targetDir = path.join(root, '../input', projectName, 'tsv-data');
        await fs.mkdir(targetDir, { recursive: true });

        console.log(`📂 Doelmap: ${targetDir}`);

        // 2. Elk tabblad downloaden en opslaan als TSV
        for (const title of sheetTitles) {
            console.log(`   📥 Ophalen: ${title}...`);
            
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: title,
            });

            const rows = response.data.values;
            if (!rows || rows.length === 0) {
                console.warn(`   ⚠️ Tabblad '${title}' is leeg, overslaan.`);
                continue;
            }

            // Omzetten naar TSV string
            const tsvContent = rows
                .map(row => row.map(val => {
                    if (val === null || val === undefined) return "";
                    // Verwijder tabs en newlines om TSV structuur te behouden
                    return String(val).replace(/\t/g, ' ').replace(/\n/g, ' ').trim();
                }).join('\t'))
                .join('\n');

            const fileName = `${title.toLowerCase()}.tsv`;
            await fs.writeFile(path.join(targetDir, fileName), tsvContent, 'utf8');
            console.log(`   ✅ Opgeslagen als: ${fileName}`);
        }

        console.log("\n✨ Synchronisatie voltooid! De Google Sheet data staat nu in je lokale tsv-data map.");

    } catch (error) {
        console.error(`❌ Fout tijdens synchronisatie: ${error.message}`);
        process.exit(1);
    }
}

main();
