import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Utility: JSON naar TSV converteren in de input map.
 * Gebruik: node sync-json-to-tsv.js [projectName] [siteType] [track]
 */
async function syncJsonToTsv() {
    const args = process.argv.slice(2);
    
    // NEW FLEXIBLE ARGUMENTS:
    // Mode 1: node sync-json-to-tsv.js <srcDir> <targetDir> --auto
    // Mode 2: node sync-json-to-tsv.js <projectName> <siteType> <track>
    
    let jsonDir, tsvDir, blueprintPath;
    let projectName;

    if (args.includes('--auto')) {
        jsonDir = args[0];
        tsvDir = args[1];
        projectName = path.basename(path.dirname(path.dirname(path.dirname(jsonDir)))); // try to guess
        console.log(`📊 Auto-sync mode: ${jsonDir} -> ${tsvDir}`);
    } else {
        projectName = args[0];
        const siteType = args[1];
        const track = args[2] || 'docked';

        if (!projectName || !siteType) {
            console.error("❌ Gebruik: node sync-json-to-tsv.js [projectName] [siteType] [track]");
            console.error("   OF: node sync-json-to-tsv.js <srcDir> <targetDir> --auto");
            process.exit(1);
        }

        const root = path.resolve(__dirname, '..');
        jsonDir = path.join(root, '../input', projectName, 'json-data');
        tsvDir = path.join(root, '../input', projectName, 'tsv-data');
        blueprintPath = path.join(root, '3-sitetypes', track, siteType, 'blueprint', `${siteType}.json`);
    }

    console.log(`
📊 Converteren JSON naar TSV voor project: '${projectName || 'unspecified'}'`);

    try {
        let tablesToProcess = [];
        
        if (blueprintPath && await fs.access(blueprintPath).then(() => true).catch(() => false)) {
            const blueprint = JSON.parse(await fs.readFile(blueprintPath, 'utf8'));
            tablesToProcess = blueprint.data_structure;
        } else {
            // No blueprint? Guess from JSON files in source dir
            console.log("ℹ️  Geen blueprint gevonden, scan bronmap voor JSON bestanden...");
            const files = await fs.readdir(jsonDir);
            const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'schema.json');
            
            for (const file of jsonFiles) {
                const tableName = file.replace('.json', '');
                const data = JSON.parse(await fs.readFile(path.join(jsonDir, file), 'utf8'));
                if (Array.isArray(data) && data.length > 0) {
                    tablesToProcess.push({
                        table_name: tableName,
                        columns: Object.keys(data[0])
                    });
                } else if (!Array.isArray(data)) {
                    // Object mode (key-value)
                    tablesToProcess.push({
                        table_name: tableName,
                        columns: ['key', 'value'],
                        isKV: true
                    });
                }
            }
        }

        await fs.mkdir(tsvDir, { recursive: true });

        for (const table of tablesToProcess) {
            const tableName = table.table_name;
            const jsonPath = path.join(jsonDir, `${tableName.toLowerCase()}.json`);
            
            try {
                const data = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
                const header = table.columns.map(col => typeof col === 'object' ? col.name : col).join('\t') + '\n';
                
                let rows = "";
                if (table.isKV) {
                    rows = Object.entries(data).map(([k, v]) => `${k}\t${String(v).replace(/\t/g, ' ')}`).join('\n');
                } else {
                    rows = data.map(row => {
                        return table.columns.map(col => {
                            const colName = typeof col === 'object' ? col.name : col;
                            let value = row[colName];
                            if (value === null || value === undefined) value = '';
                            return String(value).replace(/\t/g, ' ').replace(/\r?\n|\r/g, ' ').trim();
                        }).join('\t');
                    }).join('\n');
                }

                await fs.writeFile(path.join(tsvDir, `${tableName}.tsv`), header + rows, 'utf8');
                console.log(`   - ✅ ${tableName}.tsv aangemaakt.`);
            } catch (e) {
                console.warn(`   ⚠️  Kon ${tableName}.json niet vinden of parsen, overgeslagen.`);
            }
        }
        
        // Vergeet de nieuwe section_settings niet!
        const secJsonPath = path.join(jsonDir, 'section_settings.json');
        if (!tablesToProcess.find(t => t.table_name === 'section_settings')) {
            try {
                const secData = JSON.parse(await fs.readFile(secJsonPath, 'utf8'));
                const header = "id\ttitle\tsubtitle\n";
                const rows = secData.map(r => `${r.id}\t${r.title}\t${r.subtitle}`).join('\n');
                await fs.writeFile(path.join(tsvDir, 'section_settings.tsv'), header + rows, 'utf8');
                console.log(`   - ✅ section_settings.tsv aangemaakt.`);
            } catch (e) {}
        }

        console.log(`
✨ Conversie naar TSV voltooid!`);
        process.exit(0);
    } catch (error) {
        console.error(`❌ Fout tijdens conversie: ${error.message}`);
        process.exit(1);
    }
}

syncJsonToTsv();
