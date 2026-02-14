import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

/**
 * Creates a new Data Source (Input Project) from an existing Site's data.
 */
async function generateDataSourceFromSite(sourceSiteName, targetProjectName) {
    console.log(`
📦 Generating Data Source [${targetProjectName}] from Site [${sourceSiteName}]...`);

    const sourceSiteDir = path.join(root, '../sites', sourceSiteName);
    const sourceDataDir = path.join(sourceSiteDir, 'src/data');
    
    if (!fs.existsSync(sourceDataDir)) {
        throw new Error(`Source site data not found at ${sourceDataDir}`);
    }

    const targetProjectDir = path.join(root, '../input', targetProjectName);
    if (fs.existsSync(targetProjectDir)) {
        throw new Error(`Target project [${targetProjectName}] already exists.`);
    }

    // 1. Create directory structure
    const jsonDataDir = path.join(targetProjectDir, 'json-data');
    const inputDir = path.join(targetProjectDir, 'input');
    const imagesDir = path.join(targetProjectDir, 'images');

    [targetProjectDir, jsonDataDir, inputDir, imagesDir].forEach(d => fs.mkdirSync(d, { recursive: true }));
    fs.writeFileSync(path.join(inputDir, '.gitkeep'), '');

    // 2. Copy JSON data files
    const files = fs.readdirSync(sourceDataDir).filter(f => f.endsWith('.json'));
    files.forEach(file => {
        // Skip schema and section_order as they are site-instance specific, 
        // though keeping them doesn't hurt.
        fs.copyFileSync(path.join(sourceDataDir, file), path.join(jsonDataDir, file));
    });
    console.log(`   ✅ JSON data copied (${files.length} files).`);

    // 3. Optional: Copy images from public/images
    const sourceImagesDir = path.join(sourceSiteDir, 'public/images');
    if (fs.existsSync(sourceImagesDir)) {
        const images = fs.readdirSync(sourceImagesDir);
        images.forEach(img => {
            const stats = fs.statSync(path.join(sourceImagesDir, img));
            if (stats.isFile()) {
                fs.copyFileSync(path.join(sourceImagesDir, img), path.join(imagesDir, img));
            }
        });
        console.log(`   ✅ Images copied (${images.length} files).`);
    }

    console.log(`
✨ Data Source [${targetProjectName}] successfully created in ../input/${targetProjectName}`);
}

// --- CLI RUNNER ---
const source = process.argv[2];
const target = process.argv[3];

if (source && target) {
    generateDataSourceFromSite(source, target).catch(err => {
        console.error(`❌ Error: ${err.message}`);
        process.exit(1);
    });
}

export { generateDataSourceFromSite };
