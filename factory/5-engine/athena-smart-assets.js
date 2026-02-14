import fs from 'fs/promises';
import path from 'path';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';

/**
 * ATHENA SMART ASSETS - Automatische Afbeeldingen Fetcher
 * Dit script leest producten.json en downloadt bijpassende afbeeldingen.
 */

async function downloadImage(url, dest) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    const fileStream = createWriteStream(dest);
    await pipeline(response.body, fileStream);
}

async function run() {
    const projectName = process.argv[2] || 'urban-soles';
    const inputPath = path.join(process.cwd(), 'input', projectName, 'json-data', 'producten.json');
    const outputDir = path.join(process.cwd(), 'input', projectName, 'images');

    try {
        console.log(`🚀 Start Smart Assets voor ${projectName}...`);
        const data = await fs.readFile(inputPath, 'utf8');
        const producten = JSON.parse(data);

        for (const product of producten) {
            const query = product.keywords || product.naam;
            const filename = `${product.id}.jpg`;
            const dest = path.join(outputDir, filename);

            // Gebruik LoremFlickr voor betrouwbare sneaker foto's
            const imageUrl = `https://loremflickr.com/1600/900/${encodeURIComponent(query.split(',')[0])}`;

            console.log(`📸 Fetchen van beeld voor [${product.naam}] via query: ${query.split(',')[0]}...`);
            
            try {
                await downloadImage(imageUrl, dest);
                console.log(`✅ Opgeslagen als: ${filename}`);
                product.afbeelding = `./images/${filename}`;
            } catch (err) {
                console.error(`❌ Fout bij downloaden voor ${product.naam}:`, err.message);
            }
        }

        // Update de JSON met de nieuwe afbeeldingspaden
        await fs.writeFile(inputPath, JSON.stringify(producten, null, 2));
        console.log(`
✨ Klaar! Afbeeldingen staan in ${outputDir} en producten.json is bijgewerkt.`);

    } catch (error) {
        console.error("🔴 Kritieke fout in Smart Assets:", error);
    }
}

run();
