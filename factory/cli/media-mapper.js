import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- HELPERS ---
function createRl() {
    return readline.createInterface({ input: process.stdin, output: process.stdout });
}

function askLocal(rl, query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

// ASCII WIREFRAME GENERATOR (Improved Visuals)
function showWireframe(componentContext, currentField) {
    const ctx = componentContext.toLowerCase();
    
    // Determine active section
    const isHero = ctx.includes('hero') || ctx.includes('header');
    const isFooter = ctx.includes('footer');
    // Alles wat geen hero of footer is, is waarschijnlijk content/section
    const isSection = !isHero && !isFooter;

    const highlight = (isActive) => isActive ? "\x1b[36m<--- [HIER BEWERKEN]\x1b[0m" : "";
    const border = (isActive) => isActive ? "\x1b[36m||\x1b[0m" : "|";

    console.log("\n");
    console.log("      _______________________________________________________");
    console.log("     |  WEBSITE PREVIEW (Wireframe)                          |");
    console.log("     |_______________________________________________________|");

    // HERO SECTION
    if (isHero) {
        console.log(`     \x1b[36m=========================================================\x1b[0m ${highlight(true)}`);
        console.log(`     \x1b[36m||\x1b[0m  HERO / HEADER                                      \x1b[36m||\x1b[0m`);
        console.log(`     \x1b[36m||\x1b[0m                                                       \x1b[36m||\x1b[0m`);
        console.log(`     \x1b[36m||\x1b[0m   [   AFBEELDING   ] : ${currentField.padEnd(20)}   \x1b[36m||\x1b[0m`);
        console.log(`     \x1b[36m=========================================================\x1b[0m`);
    } else {
        console.log("     |  HERO / HEADER                                        |");
        console.log("     |_______________________________________________________|");
    }

    // MAIN CONTENT SECTION
    if (isSection) {
        console.log(`     \x1b[36m=========================================================\x1b[0m ${highlight(true)}`);
        console.log(`     \x1b[36m||\x1b[0m  SECTIES / CARDS / CONTENT                          \x1b[36m||\x1b[0m`);
        console.log(`     \x1b[36m||\x1b[0m                                                       \x1b[36m||\x1b[0m`);
        console.log(`     \x1b[36m||\x1b[0m   [ IMG ] [ IMG ] [ IMG ]                             \x1b[36m||\x1b[0m`);
        console.log(`     \x1b[36m=========================================================\x1b[0m`);
    } else {
        console.log("     |  SECTIES / CARDS                                      |");
        console.log("     |   [ IMG ] [ IMG ] [ IMG ]                             |");
        console.log("     |_______________________________________________________|");
    }

    // FOOTER SECTION
    if (isFooter) {
        console.log(`     \x1b[36m=========================================================\x1b[0m ${highlight(true)}`);
        console.log(`     \x1b[36m||\x1b[0m  FOOTER                                             \x1b[36m||\x1b[0m`);
        console.log(`     \x1b[36m=========================================================\x1b[0m`);
    } else {
        console.log("     |  FOOTER                                               |");
        console.log("     |_______________________________________________________|");
    }
    console.log("");
}

// --- MAIN LOGIC ---
async function runMediaMapper() {
    console.log("=======================================");
    console.log("📸  ATHENA VISUAL MEDIA MAPPER");
    console.log("=======================================");

    // 1. SELECT PROJECT
    const projectsDataDir = path.join(__dirname, '../../input');
    if (!fs.existsSync(projectsDataDir)) {
        console.log("❌ Geen projecten gevonden.");
        return;
    }
    const folders = fs.readdirSync(projectsDataDir).filter(f => fs.statSync(path.join(projectsDataDir, f)).isDirectory());
    
    console.log('\n📁 Kies een project:');
    folders.forEach((f, i) => console.log(`   [${i + 1}] ${f}`));
    
    const rl = createRl();
    const choice = await askLocal(rl, '\n🚀 Keuze: ');
    const index = parseInt(choice, 10);
    if (isNaN(index) || index < 1 || index > folders.length) {
        console.log("❌ Ongeldige keuze.");
        rl.close();
        return;
    }
    const project = folders[index - 1];
    const projectSiteDir = path.join(__dirname, '../sites', project);
    
    // 2. CHECK DIRS
    const publicImagesDir = path.join(projectSiteDir, 'public/images');
    const dataDir = path.join(projectSiteDir, 'src/data');
    
    if (!fs.existsSync(publicImagesDir)) {
        console.log(`❌ Map 'public/images' bestaat niet in ${project}.`);
        rl.close();
        return;
    }

    // 3. GET IMAGES
    const images = fs.readdirSync(publicImagesDir).filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f));
    if (images.length === 0) {
        console.log("⚠️  Geen afbeeldingen gevonden in public/images.");
        console.log("    Voeg eerst afbeeldingen toe aan deze map.");
        rl.close();
        return;
    }

    // 4. ITERATE DATA FILES
    const dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'schema.json');
    
    for (const jsonFile of dataFiles) {
        const tableName = jsonFile.replace('.json', '');
        const filePath = path.join(dataDir, jsonFile);
        let data = [];
        try {
            const raw = fs.readFileSync(filePath, 'utf8');
            data = JSON.parse(raw);
            if (!Array.isArray(data)) data = [data]; // Handle single object config files
        } catch(e) { continue; }

        if (data.length === 0) continue;

        // Check columns of first row to see if any look like images
        const rowSample = data[0];
        let imageKeys = Object.keys(rowSample).filter(k => {
            const low = k.toLowerCase();
            // Exclude prompts, they are text
            if (low.includes('prompt')) return false;
            return low.includes('image') || low.includes('img') || low.includes('afbeelding') || low.includes('logo') || low.includes('foto') || k.endsWith('_url');
        });

        // Feature: Als er geen velden gevonden zijn, bied aan om er een te maken
        if (imageKeys.length === 0) {
            console.log(`\n📂 Tabel: \x1b[36m${tableName}\x1b[0m (Geen afbeeldingsvelden gevonden)`);
            const add = await askLocal(rl, "   Wil je een nieuw veld 'afbeelding-url' toevoegen aan deze tabel? (j/n): ");
            if (add.toLowerCase() === 'j') {
                // Voeg veld toe aan alle rijen
                data = data.map(row => ({ ...row, "afbeelding-url": "" }));
                imageKeys = ['afbeelding-url'];
                console.log("   ✅ Veld 'afbeelding-url' toegevoegd.");
            } else {
                continue;
            }
        } else {
            console.log(`\n📂 Tabel gevonden met mogelijke afbeeldingen: \x1b[36m${tableName}\x1b[0m`);
        }
        
        for (const key of imageKeys) {
            console.log(`   🔎 Veld: \x1b[33m${key}\x1b[0m`);
            
            const skip = await askLocal(rl, '      Wil je dit veld koppelen? (j/n/Enter=ja): ');
            if (skip.toLowerCase() === 'n') continue;

            const updateAll = await askLocal(rl, '      Wil je alle rijen dezelfde afbeelding geven? (j/n): ');
            
            if (updateAll.toLowerCase() === 'j') {
                // Toon UI
                showWireframe(tableName, key);
                console.log("🖼️  BESCHIKBARE AFBEELDINGEN:");
                images.forEach((img, idx) => console.log(`   [${idx+1}] ${img}`));
                
                const imgChoice = await askLocal(rl, `   Kies een afbeelding voor ALLE rijen in ${tableName}.${key}: `);
                const imgIdx = parseInt(imgChoice, 10);
                
                if (!isNaN(imgIdx) && imgIdx >= 1 && imgIdx <= images.length) {
                    const selectedImg = images[imgIdx - 1];
                    // Update data
                    data = data.map(row => ({ ...row, [key]: selectedImg }));
                    console.log(`   ✅ Alle rijen geupdate naar: ${selectedImg}`);
                }
            } else {
                // Loop door rijen
                let limit = 5;
                if (data.length > limit) {
                    const limitChoice = await askLocal(rl, `   Er zijn ${data.length} rijen. Wil je ze stuk voor stuk doen? (j/n): `);
                    if (limitChoice.toLowerCase() !== 'j') continue;
                }

                for (let i = 0; i < data.length; i++) {
                    showWireframe(tableName, key);
                    console.log(`   Rij ${i+1}: Huidige waarde: ${data[i][key] || 'leeg'}`);
                    console.log("   ---");
                    images.forEach((img, idx) => console.log(`   [${idx+1}] ${img}`));
                    
                    const imgChoice = await askLocal(rl, `   Kies afbeelding voor rij ${i+1} (of Enter om te houden): `);
                    if (imgChoice.trim() === '') continue;
                    
                    const imgIdx = parseInt(imgChoice, 10);
                     if (!isNaN(imgIdx) && imgIdx >= 1 && imgIdx <= images.length) {
                        data[i][key] = images[imgIdx - 1];
                        console.log(`   ✅ Rij ${i+1} geupdate.`);
                    }
                }
            }
            
            // SAVE FILE
            const origRaw = fs.readFileSync(filePath, 'utf8');
            const wasArray = Array.isArray(JSON.parse(origRaw));
            
            const contentToWrite = wasArray ? data : data[0];
            fs.writeFileSync(filePath, JSON.stringify(contentToWrite, null, 2));
            console.log(`💾 Wijzigingen opgeslagen in ${jsonFile}`);
        }
    }

    console.log("\n✅ Klaar! Start de dev server (Optie 9) om het resultaat te zien.");
    rl.close();
}

runMediaMapper();
