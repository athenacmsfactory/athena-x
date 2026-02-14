import csv from 'csvtojson';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createMapper } from './mapper.js';

// LEES DE BLUEPRINT VAN HET PROJECT
const schemaPath = path.join(process.cwd(), 'src/data/schema.json');
let schema;
try {
    schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
} catch (e) {
    console.error("❌ CRITICAL: Kan src/data/schema.json niet lezen.");
    process.exit(1);
}

const mapper = createMapper(schema);

async function sync() {
    console.log(`🧹 Athena Deep Clean v6.1 | Blueprint: ${schema.blueprint_name}`);
    
    const settingsPath = path.join(process.cwd(), 'project-settings/url-sheet.json');
    if (!fs.existsSync(settingsPath)) {
        console.error("❌ Geen url-sheet.json gevonden.");
        process.exit(1);
    }
    
    let sources;
    try {
        const fileContent = fs.readFileSync(settingsPath, 'utf8');
        if (!fileContent.trim()) {
             throw new Error("Bestand is leeg");
        }
        sources = JSON.parse(fileContent);
    } catch (e) {
        console.error(`❌ CRITICAL: Kan project-settings/url-sheet.json niet parsen.`);
        console.error(`   Pad: ${settingsPath}`);
        console.error(`   Fout: ${e.message}`);
        process.exit(1);
    }

    for (const [name, config] of Object.entries(sources)) {
        // Support voor zowel string (legacy) als object (hybrid config)
        let url = config;
        if (typeof config === 'object' && config !== null) {
            if (config.exportUrl) {
                url = config.exportUrl;
            } else {
                console.warn(`  ⚠️ Configuratie voor '${name}' is een object, maar mist 'exportUrl'. Sla over.`);
                continue;
            }
        }

        if (!url || !url.startsWith('http')) continue;
        
        try {
            const res = await fetch(url);
            let tsv = await res.text();
            let json = await csv({ delimiter: '\t', checkType: true }).fromString(tsv.replace(/^\uFEFF/, ''));

            const cleaned = json.map(row => {
                const newRow = {};
                Object.keys(row).forEach(rawKey => {
                    const techKey = mapper.mapHeader(rawKey);
                    let val = row[rawKey];
                    
                    if (typeof val === 'string') {
                        // Vertaal waarde indien nodig
                        val = mapper.mapValue(val);

                        val = val
                            .replace(/<br\s*\/?>/gi, '\n')
                            .replace(/<[^>]*>/g, '')
                            .replace(/###/g, '')
                            .replace(/##/g, '')
                            .replace(/&nbsp;/g, ' ')
                            .trim();
                    }
                    newRow[techKey] = val;
                });
                return newRow;
            }).filter(row => Object.values(row).some(v => v !== ""));

            fs.writeFileSync(path.join(process.cwd(), `src/data/${name.toLowerCase()}.json`), JSON.stringify(cleaned, null, 2));
            console.log(`  ✅ ${name}.json verwerkt via schema.`);
            
        } catch (e) {
            console.error(`  ❌ Fout bij verwerken van ${name}:`, e.message);
        }
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    sync();
}

export { sync };
