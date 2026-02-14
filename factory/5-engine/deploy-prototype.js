import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');
const SITES_DIR = path.resolve(ROOT_DIR, 'sites');
const BOILERPLATE_DIR = path.resolve(ROOT_DIR, 'factory/2-templates/boilerplate/static-wrapper');
const INPUT_DATA_DIR = path.resolve(ROOT_DIR, 'input');
const INPUT_SITES_DIR = path.resolve(ROOT_DIR, 'inputsites');

async function main() {
    const args = process.argv.slice(2);
    const siteName = args[0];

    if (!siteName) {
        console.log("Usage: node deploy-prototype.js [site-name]");
        return;
    }

    const targetDir = path.join(SITES_DIR, `${siteName}-site`);
    const prototypeDir = path.join(INPUT_SITES_DIR, siteName);
    const dockedHtmlPath = path.join(prototypeDir, 'index.docked.html');

    if (!fs.existsSync(dockedHtmlPath)) {
        console.error(`❌ Error: index.docked.html not found in ${prototypeDir}. Run athenafier.js first.`);
        return;
    }

    console.log(`🚀 Deploying prototype: ${siteName}...`);

    // 1. Create target directory
    if (fs.existsSync(targetDir)) {
        console.log(`⚠️  Target directory ${targetDir} already exists. Cleaning up...`);
        fs.rmSync(targetDir, { recursive: true, force: true });
    }
    fs.mkdirSync(targetDir, { recursive: true });

    // 2. Copy Boilerplate
    console.log("📁 Copying static-wrapper boilerplate...");
    copyRecursiveSync(BOILERPLATE_DIR, targetDir);

    // 3. Copy index.docked.html as index.html
    console.log("📄 Injecting docked HTML and connector...");
    let html = fs.readFileSync(dockedHtmlPath, 'utf8');
    
    // Inject the Dock Connector script tag
    if (!html.includes('dock-connector.js')) {
        const scriptTag = '<script type="module" src="/src/dock-connector.js"></script>';
        html = html.replace('</body>', `${scriptTag}</body>`);
    }
    fs.writeFileSync(path.join(targetDir, 'index.html'), html);

    // 4. Copy Data
    const sourceData = path.join(INPUT_DATA_DIR, siteName, 'json-data');
    const targetData = path.join(targetDir, 'src/data');
    if (fs.existsSync(sourceData)) {
        console.log("📊 Copying initial JSON data...");
        copyRecursiveSync(sourceData, targetData);
    }

    // 5. Update sites.json for the Dock
    updateSitesJson(siteName);

    console.log(`\n✅ Prototype deployed to sites/${siteName}-site`);
    console.log(`👉 Step 1: cd sites/${siteName}-site`);
    console.log(`👉 Step 2: pnpm install`);
    console.log(`👉 Step 3: pnpm dev`);
}

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

function updateSitesJson(name) {
    const sitesJsonPath = path.resolve(ROOT_DIR, 'dock/public/sites.json');
    if (fs.existsSync(sitesJsonPath)) {
        const sites = JSON.parse(fs.readFileSync(sitesJsonPath, 'utf8'));
        const siteId = `${name}-site`;
        if (!sites.find(s => s.id === siteId)) {
            sites.push({
                id: siteId,
                name: `Prototype: ${name}`,
                path: `../../sites/${siteId}`,
                url: `http://localhost:5173`
            });
            fs.writeFileSync(sitesJsonPath, JSON.stringify(sites, null, 4));
            console.log("⚓ Added to Athena Dock (sites.json)");
        }
    }
}

main();
