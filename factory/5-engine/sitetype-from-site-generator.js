import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from './env-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

/**
 * Creates a new Sitetype based on an existing Site.
 */
async function generateSitetypeFromSite(sourceSiteName, targetSitetypeName) {
    console.log(`
🏗️  Generating Sitetype [${targetSitetypeName}] from Site [${sourceSiteName}]...`);

    const sourceSiteDir = path.join(root, '../sites', sourceSiteName);
    if (!fs.existsSync(sourceSiteDir)) {
        throw new Error(`Source site [${sourceSiteName}] not found at ${sourceSiteDir}`);
    }

    const configPath = path.join(sourceSiteDir, 'athena-config.json');
    if (!fs.existsSync(configPath)) {
        throw new Error(`athena-config.json not found in source site.`);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const track = config.siteModel === 'SPA' ? 'docked' : 'autonomous'; // Simplified track detection
    
    const targetSitetypeDir = path.join(root, '3-sitetypes', track, targetSitetypeName);
    if (fs.existsSync(targetSitetypeDir)) {
        throw new Error(`Target sitetype [${targetSitetypeName}] already exists.`);
    }

    // 1. Create directory structure
    const blueprintDir = path.join(targetSitetypeDir, 'blueprint');
    const webDir = path.join(targetSitetypeDir, 'web', 'standard');
    const componentsDir = path.join(webDir, 'components');
    const parserDir = path.join(targetSitetypeDir, 'parser');

    [blueprintDir, webDir, componentsDir, parserDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

    // 2. Copy and adapt Blueprint
    const schemaPath = path.join(sourceSiteDir, 'src/data/schema.json');
    if (fs.existsSync(schemaPath)) {
        const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
        schema.blueprint_name = targetSitetypeName;
        fs.writeFileSync(path.join(blueprintDir, `${targetSitetypeName}.json`), JSON.stringify(schema, null, 2));
        console.log(`   ✅ Blueprint created.`);
    }

    // 3. Copy Components
    const sourceComponentsDir = path.join(sourceSiteDir, 'src/components');
    if (fs.existsSync(sourceComponentsDir)) {
        copyRecursiveSync(sourceComponentsDir, componentsDir);
        console.log(`   ✅ Components copied.`);
    }

    // 4. Copy Core Files
    ['App.jsx', 'main.jsx', 'index.css'].forEach(file => {
        const srcFile = path.join(sourceSiteDir, 'src', file);
        if (fs.existsSync(srcFile)) {
            let content = fs.readFileSync(srcFile, 'utf8');
            
            // Generalize content
            content = content.replace(new RegExp(sourceSiteName, 'g'), '{{PROJECT_NAME}}');
            
            fs.writeFileSync(path.join(webDir, file), content);
        }
    });
    console.log(`   ✅ Core files (App, main, index.css) copied and generalized.`);

    // 5. Generate Parser Stub
    const parserTemplate = `import { ParserEngine } from '../../5-engine/parser-engine.js';

export class ${toPascalCase(targetSitetypeName)}Parser extends ParserEngine {
    constructor() {
        super('${targetSitetypeName}');
    }

    async customParsing(data) {
        return data;
    }
}`;
    fs.writeFileSync(path.join(parserDir, `parser-${targetSitetypeName}.js`), parserTemplate);
    console.log(`   ✅ Parser stub generated.`);

    console.log(`
✨ Sitetype [${targetSitetypeName}] successfully created!`);
}

// --- HELPERS ---

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

function toPascalCase(str) {
    return str.replace(/(?:^|[\s_-])+(.)/g, (_, char) => char.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '');
}

// --- EXPORT ---
export { generateSitetypeFromSite };

// --- CLI RUNNER ---
const source = process.argv[2];
const target = process.argv[3];

if (source && target) {
    generateSitetypeFromSite(source, target).catch(err => {
        console.error(`❌ Error: ${err.message}`);
        process.exit(1);
    });
}
