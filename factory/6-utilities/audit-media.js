import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

async function auditMedia(projectName) {
    console.log(`\n🔍 Media Audit voor: ${projectName}`);
    
    // 1. Paden bepalen
    let siteDir = path.join(ROOT, 'sites', projectName);
    if (!fs.existsSync(siteDir)) siteDir = path.join(ROOT, 'sites', `${projectName}-site`);
    
    if (!fs.existsSync(siteDir)) {
        console.error("❌ Site niet gevonden.");
        return;
    }

    const dataDir = path.join(siteDir, 'src/data');
    const publicDir = path.join(siteDir, 'public');
    // Sommige sites gebruiken /public/images, andere direct /public/
    let imagesDir = path.join(publicDir, 'images');
    if (!fs.existsSync(imagesDir)) imagesDir = publicDir;

    console.log(`📂 Data map: ${dataDir}`);
    console.log(`📂 Images map: ${imagesDir}`);

    // 2. Scan alle JSON files voor afbeeldingsreferenties
    const usedImages = new Set();
    if (fs.existsSync(dataDir)) {
        const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

        jsonFiles.forEach(file => {
            const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
            // Regex om bestandsnamen met bekende extensies te vinden
            const matches = content.match(/[a-zA-Z0-9\-_.]+\.(jpg|jpeg|png|gif|svg|webp)/gi);
            if (matches) {
                matches.forEach(img => usedImages.add(img.toLowerCase()));
            }
        });
    }

    // 3. Scan fysieke bestanden
    if (!fs.existsSync(imagesDir)) {
        console.error("❌ Images map bestaat niet.");
        return;
    }
    const physicalFiles = fs.readdirSync(imagesDir).filter(f => 
        /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(f)
    );

    // 4. Analyse
    const unusedFiles = physicalFiles.filter(f => !usedImages.has(f.toLowerCase()));
    const brokenLinks = Array.from(usedImages).filter(f => !physicalFiles.map(pf => pf.toLowerCase()).includes(f));

    console.log("\n--- RESULTAAT ---");
    
    if (brokenLinks.length > 0) {
        console.warn(`\n⚠️  GEBROKEN LINKS (${brokenLinks.length}):`);
        console.warn("Deze staan in je JSON maar het bestand ONTBEERT (kan crashes veroorzaken!):");
        brokenLinks.forEach(f => console.warn(`   - ${f}`));
    } else {
        console.log("\n✅ Geen gebroken links gevonden.");
    }

    if (unusedFiles.length > 0) {
        console.log(`\n🗑️  ONGEBRUIKTE BESTANDEN (${unusedFiles.length}):`);
        console.log("Deze staan niet in je JSON en kunnen waarschijnlijk VEILIG verwijderd worden:");
        unusedFiles.forEach(f => console.log(`   - ${f}`));
    } else {
        console.log("\n✨ Alle bestanden in de map zijn in gebruik.");
    }

    console.log(`\nTotaal aantal unieke afbeeldingen in gebruik: ${usedImages.size}`);
}

const proj = process.argv[2];
if (!proj) {
    console.log("Gebruik: node factory/6-utilities/audit-media.js <project-naam>");
} else {
    auditMedia(proj);
}