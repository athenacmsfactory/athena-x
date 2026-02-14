import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Sync Tool: JSON van input map naar sites map kopiëren.
 * Gebruik: node sync-json-to-site.js [projectName] [siteName]
 */
async function syncJsonToSite() {
    const args = process.argv.slice(2);
    const projectName = args[0]; // bv 'de-salon'
    const siteName = args[1];    // bv 'de-salon-site'

    if (!projectName || !siteName) {
        console.error("❌ Gebruik: node sync-json-to-site.js [projectName] [siteName]");
        process.exit(1);
    }

    const root = path.resolve(__dirname, '..');
    const sourceDir = path.join(root, '../input', projectName, 'json-data');
    const targetDir = path.join(root, '../sites', siteName, 'src/data');

    console.log(`\n🔄 JSON Sync: '${projectName}' -> '${siteName}'`);

    try {
        // 1. Check bron
        const files = await fs.readdir(sourceDir);
        console.log(`   - 📂 Bron gevonden: ${files.length} bestanden.`);

        // 2. Check doel
        await fs.mkdir(targetDir, { recursive: true });

        // 3. Kopiëren
        for (const file of files) {
            if (file.endsWith('.json')) {
                const srcPath = path.join(sourceDir, file);
                const destPath = path.join(targetDir, file);
                await fs.copyFile(srcPath, destPath);
                console.log(`   - ✅ ${file} gekopieerd.`);
            }
        }

        console.log(`\n✨ Sync voltooid! De site '${siteName}' heeft nu de nieuwste data.`);
        process.exit(0);
    } catch (error) {
        console.error(`❌ Fout tijdens sync: ${error.message}`);
        process.exit(1);
    }
}

syncJsonToSite();
