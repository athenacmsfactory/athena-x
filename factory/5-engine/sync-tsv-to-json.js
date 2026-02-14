/**
 * @file sync-tsv-to-json.js
 * @description Injecteert lokale TSV data (uit tsv-data) in de src/data map van een site.
 */

import csv from 'csvtojson';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function converttsv2json() {
    const projectName = process.argv[2];
    if (!projectName) {
        console.error("❌ Gebruik: node 5-engine/sync-tsv-to-json.js [project-naam]");
        process.exit(1);
    }

    const rootDir = path.resolve(__dirname, '..');
    const safeProjectName = projectName.toLowerCase().replace(/\s+/g, '-');

    const parserDir = path.join(rootDir, '../input', safeProjectName, 'tsv-data');
    const projectDir = path.resolve(rootDir, '../sites', safeProjectName);
    const dataDir = path.join(projectDir, 'src/data');

    console.log(`🔄 Data injecteren voor project: '${projectName}'`);
    console.log(`📂 Bron (TSV): ${parserDir}`);
    console.log(`🎯 Doel (JSON): ${projectDir}`);

    if (!fs.existsSync(projectDir)) {
        console.error(`❌ Projectmap bestaat niet op locatie: ${projectDir}`);
        process.exit(1);
    }
    if (!fs.existsSync(parserDir)) {
        console.error(`❌ Geen parser data gevonden voor '${projectName}' op locatie: ${parserDir}. (Draai de parser eerst!)`);
        process.exit(1);
    }

    const files = fs.readdirSync(parserDir).filter(f => f.endsWith('.tsv'));
    if (files.length === 0) {
        console.error(`⚠️ Geen .tsv bestanden gevonden in ${parserDir}`);
        process.exit(1);
    }

    for (const file of files) {
        const tsvPath = path.join(parserDir, file);
        const json = await csv({ delimiter: '\t', checkType: true }).fromFile(tsvPath);

        // Simpele conversie, de mapping logica is uit de schema's gehaald
        const cleaned = json.map(row => {
            const newRow = {};
            Object.keys(row).forEach(key => {
                let val = row[key];
                if (typeof val === 'string') {
                    val = val.replace(/<br>/gi, '\n').trim();
                }
                // De key wordt niet meer veranderd, direct overgenomen van TSV header
                newRow[key] = val;
            });
            return newRow;
        });

        const destName = file.replace('.tsv', '.json').toLowerCase();

        if (!cleaned || cleaned.length === 0) {
            console.warn(`⚠️  WAARSCHUWING: ${destName} is leeg! Controleer de parser output.`);
        } else {
            const jsonPath = path.join(dataDir, destName);
            fs.writeFileSync(jsonPath, JSON.stringify(cleaned, null, 2));

            // Extra check op bestandsgrootte
            const stats = fs.statSync(jsonPath);
            if (stats.size < 5) {
                console.warn(`⚠️  WAARSCHUWING: ${destName} is verdacht klein (${stats.size} bytes).`);
            } else {
                console.log(`  ✅ Geïnjecteerd: src/data/${destName} (${cleaned.length} items)`);
            }
        }
    }
    console.log(`\n🎉 Data Sync Compleet!`);
}

await converttsv2json();
