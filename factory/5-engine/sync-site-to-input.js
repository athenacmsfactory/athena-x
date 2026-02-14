import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Reverse Sync: JSON van site naar input map kopiëren.
 * Gebruik: node sync-site-to-input.js [siteName] [projectName]
 */
async function syncSiteToInput() {
    const args = process.argv.slice(2);
    const siteName = args[0];    // bv 'de-salon-site'
    const projectName = args[1]; // bv 'de-salon'

    if (!projectName || !siteName) {
        console.error("❌ Gebruik: node sync-site-to-input.js [siteName] [projectName]");
        process.exit(1);
    }

    const root = path.resolve(__dirname, '..');
    const sourceDir = path.join(root, '../sites', siteName, 'src/data');
    const targetDir = path.join(root, '../input', projectName, 'json-data');

    console.log(`\n🔄 Reverse Sync: '${siteName}' -> '${projectName}'`);

    try {
        const files = await fs.readdir(sourceDir);
        await fs.mkdir(targetDir, { recursive: true });

        for (const file of files) {
            if (file.endsWith('.json') && file !== 'schema.json') {
                const srcPath = path.join(sourceDir, file);
                const destPath = path.join(targetDir, file);
                await fs.copyFile(srcPath, destPath);
                console.log(`   - ✅ ${file} gesynchroniseerd naar input.`);
            }
        }

        console.log(`\n✨ Reverse sync voltooid!`);
        process.exit(0);
    } catch (error) {
        console.error(`❌ Fout tijdens reverse sync: ${error.message}`);
        process.exit(1);
    }
}

syncSiteToInput();
