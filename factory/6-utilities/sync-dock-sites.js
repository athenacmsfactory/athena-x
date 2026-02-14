import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

async function generate() {
    console.log("🔍 Scannen van sites directory...");
    const sitesDir = path.join(root, 'sites');
    const dockPublicDir = path.join(root, 'dock/public');
    const registryPath = path.join(root, 'factory/config/site-ports.json');
    
    let portMap = {};
    if (fs.existsSync(registryPath)) {
        try {
            portMap = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
        } catch (e) {
            console.warn("⚠️  Kon site-ports.json niet lezen.");
        }
    }
    
    if (!fs.existsSync(sitesDir)) {
        console.error("❌ Sites directory niet gevonden.");
        return;
    }

    const siteDirs = fs.readdirSync(sitesDir).filter(f => {
        return fs.statSync(path.join(sitesDir, f)).isDirectory() && !f.startsWith('.');
    });

    const sites = [];

    for (const dir of siteDirs) {
        const configPath = path.join(sitesDir, dir, 'athena-config.json');
        const deployPath = path.join(sitesDir, dir, 'project-settings/deployment.json');
        
        if (fs.existsSync(configPath)) {
            try {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                let deployInfo = {};
                
                if (fs.existsSync(deployPath)) {
                    try {
                        deployInfo = JSON.parse(fs.readFileSync(deployPath, 'utf8'));
                    } catch (e) {}
                }

                sites.push({
                    id: dir,
                    name: config.projectName || dir,
                    siteType: config.siteType,
                    generatedAt: config.generatedAt,
                    governance_mode: config.governance_mode || 'dev-mode',
                    repoUrl: deployInfo.repoUrl || null,
                    liveUrl: deployInfo.liveUrl || null,
                    port: portMap[dir] || 3000
                });
                console.log(`  ✅ Gevonden: ${dir} (${config.governance_mode || 'dev-mode'})`);
            } catch (e) {
                console.warn(`  ⚠️  Kon config voor ${dir} niet lezen.`);
            }
        }
    }

    // Sorteren op datum (nieuwste eerst)
    sites.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));

    if (!fs.existsSync(dockPublicDir)) fs.mkdirSync(dockPublicDir, { recursive: true });
    
    fs.writeFileSync(
        path.join(dockPublicDir, 'sites.json'), 
        JSON.stringify(sites, null, 2)
    );

    console.log(`\n✨ sites.json succesvol bijgewerkt in dock/public/`);
    console.log(`🚀 Totaal aantal sites: ${sites.length}`);
}

generate();
