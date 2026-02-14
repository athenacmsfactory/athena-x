/**
 * @file split-scraper-data.js
 * @description Analyseert scraped-content.txt en splitst deze in losse JSON-pagina bestanden.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function splitData() {
    const [projectName] = process.argv.slice(2);
    
    if (!projectName) {
        console.error('❌ Gebruik: node 5-engine/split-scraper-data.js <project-naam>');
        process.exit(1);
    }

    const root = path.resolve(__dirname, '..');
    const inputDir = path.join(root, '../input', projectName, 'input');
    const sourceFile = path.join(inputDir, 'scraped-content.txt');
    const outputBase = path.join(root, '../input', projectName, 'json-data');
    const pagesDir = path.join(outputBase, 'pages');

    try {
        console.log(`🔍 Lezen van: ${sourceFile}`);
        const content = await fs.readFile(sourceFile, 'utf8');
        
        // Zorg dat de mappen bestaan
        await fs.mkdir(pagesDir, { recursive: true });

        // Splitsen op de SOURCE marker
        const rawPages = content.split('--- SOURCE:');
        
        let pageCount = 0;
        let indexMap = [];

        console.log(`🚀 Verwerken van ruwe data...`);

        for (const rawPage of rawPages) {
            if (!rawPage.trim()) continue;

            // Haal URL en Content uit elkaar
            const endOfLine = rawPage.indexOf('---');
            if (endOfLine === -1) continue;

            const urlLine = rawPage.substring(0, endOfLine).trim();
            let bodyContent = rawPage.substring(endOfLine + 3).trim();

            // Extract images if present
            const imagesMatch = bodyContent.match(/\[IMAGES: (.*?)\]/);
            const images = imagesMatch ? imagesMatch[1].split(', ') : [];
            if (imagesMatch) {
                bodyContent = bodyContent.replace(/\[IMAGES: .*?\]/, '').trim();
            }

            // Extract logo if present
            const logoMatch = bodyContent.match(/\[LOGO: (.*?)\]/);
            const logo = logoMatch ? logoMatch[1] : null;
            if (logoMatch) {
                bodyContent = bodyContent.replace(/\[LOGO: .*?\]/, '').trim();
            }

            if (!urlLine || bodyContent.length < 50) continue; // Skip lege/kleine pagina's

            try {
                const urlObj = new URL(urlLine);
                let pathname = urlObj.pathname;
                
                // Normaliseer pad
                if (pathname === '/' || pathname === '') pathname = '/home';
                if (pathname.endsWith('/')) pathname = pathname.slice(0, -1);

                // Bestandsnaam bepalen
                const filename = pathname.replace(/^\//, '').replace(/\//g, '_') + '.json';
                const filePath = path.join(pagesDir, filename);

                // Simpele structuur voor nu. De parser kan dit later verrijken.
                const pageData = {
                    meta: {
                        url: urlLine,
                        path: pathname,
                        title: pathname.split('/').pop().replace(/-/g, ' '),
                        images: images,
                        logo: logo
                    },
                    content: {
                        raw_text: bodyContent
                    }
                };

                await fs.writeFile(filePath, JSON.stringify(pageData, null, 2));
                
                indexMap.push({
                    path: pathname,
                    file: filename,
                    title: pageData.meta.title
                });

                pageCount++;
                // console.log(`   ✅ Opgeslagen: ${filename}`);

            } catch (err) {
                console.warn(`   ⚠️ Kon URL niet parsen: ${urlLine}`);
            }
        }

        // Sla ook een master-index op
        await fs.writeFile(
            path.join(outputBase, 'pages-manifest.json'), 
            JSON.stringify(indexMap, null, 2)
        );

        console.log(`\n✨ KLAAR! ${pageCount} pagina's opgesplitst.`);
        console.log(`📂 Opgeslagen in: ${pagesDir}`);
        console.log(`📜 Manifest: ${path.join(outputBase, 'pages-manifest.json')}`);

    } catch (error) {
        console.error(`❌ Fout: ${error.message}`);
        process.exit(1);
    }
}

splitData();
