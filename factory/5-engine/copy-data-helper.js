/**
 * @file copy-data-helper.js
 * @description Hulpprogramma om de inhoud van de geparseerde TSV-bestanden te tonen,
 * zodat de gebruiker deze gemakkelijk kan kopiëren naar Google Sheets.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const projectName = process.argv[2];

    if (!projectName) {
        console.error("❌ Fout: Geef een projectnaam op.");
        console.log("Gebruik: node 5-engine/copy-data-helper.js [project-naam]");
        process.exit(1);
    }

    const root = path.resolve(__dirname, '..');
    const parserResultsDir = path.join(root, '../input', projectName, 'tsv-data');

    try {
        const files = await fs.readdir(parserResultsDir);
        const tsvFiles = files.filter(f => f.endsWith('.tsv'));

        if (tsvFiles.length === 0) {
            console.log(`⚠️ Geen TSV-bestanden gevonden voor project "${projectName}" in:`);
            console.log(parserResultsDir);
            return;
        }

        console.log("=============================================================");
        console.log(`📋 Data voor project: ${projectName}`);
        console.log("=============================================================");
        console.log("Kopieer de onderstaande inhoud naar de juiste tabbladen in je Google Sheet.");
        console.log("Tip: Selecteer de tekst van de eerste kolomnaam tot de laatste waarde.\n");

        for (const file of tsvFiles) {
            const tableName = file.replace('.tsv', '');
            const filePath = path.join(parserResultsDir, file);
            // Vervang tabs door 2 spaties voor makkelijker plakken in Google Sheets (als gebruiker dat prefereert)
            // Of beter: behoud tabs maar geef instructie.
            // Gebruiker vraagt specifiek om support voor "2 spaties".
            const formattedContent = content.replace(/\t/g, '  ');

            console.log(`--- TABBLAD: [ ${tableName} ] ---`);
            console.log("-------------------------------------------------------------");
            console.log(formattedContent);
            console.log("-------------------------------------------------------------\n");
        }

        console.log("✅ Klaar met alle tabbladen.");

    } catch (error) {
        console.error(`❌ Fout bij het lezen van parser-resultaten: ${error.message}`);
    }
}

main();
