/**
 * @file athena-media-fetcher.js
 * @description Downloadt automatisch afbeeldingen van Unsplash op basis van JSON data.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (query) => new Promise(resolve => rl.question(query, resolve));

async function runFetcher() {
    console.log("========================================");
    console.log("📸 Athena Media Fetcher (Unsplash Free)");
    console.log("========================================");

    const root = path.resolve(__dirname, '..');
    const sitesDir = path.resolve(root, '../sites');

    // 1. Selecteer Project
    const projects = fs.readdirSync(sitesDir).filter(f => 
        fs.statSync(path.join(sitesDir, f)).isDirectory() && f !== '.gitkeep'
    );

    if (projects.length === 0) {
        console.log("❌ Geen projecten gevonden in '../sites/'.");
        rl.close();
        return;
    }

    console.log("\nKies een project:");
    projects.forEach((p, i) => console.log(`  [${i + 1}] ${p}`));
    const pIdx = parseInt(await ask("Nummer: ")) - 1;
    const project = projects[pIdx];

    // 2. Selecteer Data Tabel
    const dataDir = path.join(sitesDir, project, 'src/data');
    if (!fs.existsSync(dataDir)) {
        console.log("❌ Geen data map gevonden voor dit project.");
        rl.close();
        return;
    }

    const tables = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'schema.json');
    console.log("\nKies een tabel om afbeeldingen voor te zoeken:");
    tables.forEach((t, i) => console.log(`  [${i + 1}] ${t}`));
    const tIdx = parseInt(await ask("Nummer: ")) - 1;
    const tableFile = tables[tIdx];

    // 3. Scan Data voor afbeeldingen
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, tableFile), 'utf8'));
    const imgDir = path.join(sitesDir, project, 'public/images');
    if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

    console.log(`\n🔍 Scannen van ${tableFile}...`);

    for (const item of data) {
        // Zoek naar keys die op afbeeldingen lijken
        const imgKey = Object.keys(item).find(k => /foto|afbeelding|image|img/i.test(k));
        if (!imgKey || !item[imgKey]) continue;

        const fileName = item[imgKey];
        const filePath = path.join(imgDir, fileName);

        if (fs.existsSync(filePath)) {
            console.log(`  ✅ ${fileName} bestaat al.`);
            continue;
        }

        // Bepaal zoekterm (gebruik de naam van het item of de bestandsnaam)
        const nameKey = Object.keys(item).find(k => /naam|titel|gerecht|product/i.test(k));
        const searchTerm = item[nameKey] || fileName.split('.')[0];

        console.log(`\n🖼️  Zoeken naar afbeelding voor: "${searchTerm}" (${fileName})`);
        const keywords = await ask(`   Voer zoekterm in (Enter voor "${searchTerm}"): `);
        const finalQuery = (keywords.trim() || searchTerm).replace(/\s+/g, ',');

        const downloadUrl = `https://source.unsplash.com/1200x800/?${encodeURIComponent(finalQuery)}`;
        
        console.log(`   🚀 Downloaden van Unsplash...`);
        try {
            // We gebruiken curl -L omdat Unsplash Source redirect naar de echte afbeelding
            execSync(`curl -L "${downloadUrl}" -o "${filePath}"`, { stdio: 'pipe' });
            console.log(`   ✨ Opgeslagen als ${fileName}`);
        } catch (e) {
            console.error(`   ❌ Download mislukt: ${e.message}`);
        }
    }

    console.log("\n✅ Klaar met verwerken!");
    
    // Check of er daadwerkelijk bestanden zijn toegevoegd/gewijzigd
    let hasChanges = false;
    try {
        const status = execSync(`cd "${path.join(sitesDir, project)}" && git status --porcelain public/images/`, { encoding: 'utf8' });
        if (status.trim() !== "") hasChanges = true;
    } catch (e) { }

    if (!hasChanges) {
        console.log("ℹ️ Geen nieuwe afbeeldingen om te pushen.");
        rl.close();
        return;
    }

    const doPush = await ask("\n📤 Wil je deze nieuwe afbeeldingen direct pushen naar GitHub? (j/n): ");
    if (doPush.toLowerCase() === 'j') {
        console.log("   🚀 Pushen naar GitHub...");
        try {
            execSync(`cd "${path.join(sitesDir, project)}" && git add public/images/ && git commit -m "Add: images from media-fetcher" && git push`, { stdio: 'inherit' });
        } catch (e) {
            console.error(`   ❌ Push mislukt: ${e.message}`);
        }
    }

    rl.close();
}

runFetcher();
