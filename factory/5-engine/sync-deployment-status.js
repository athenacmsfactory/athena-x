import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

async function syncStatuses() {
    const sitesDir = path.join(root, 'sites');
    if (!fs.existsSync(sitesDir)) return;

    const sites = fs.readdirSync(sitesDir).filter(f => 
        fs.statSync(path.join(sitesDir, f)).isDirectory() && !f.startsWith('.')
    );

    console.log(`🔍 Scannen van ${sites.length} sites...`);

    for (const site of sites) {
        const projectDir = path.join(sitesDir, site);
        const settingsDir = path.join(projectDir, 'project-settings');
        const deployFile = path.join(settingsDir, 'deployment.json');

        let config = {};
        if (fs.existsSync(deployFile)) {
            try { config = JSON.parse(fs.readFileSync(deployFile, 'utf8')); } catch(e) {}
        }

        // Als de status handmatig op 'local' is gezet, laten we die zo!
        if (config.status === 'local') {
            console.log(`⏩ ${site}: Status 'local' gerespecteerd. Overslaan.`);
            continue;
        }

        try {
            // Check of de site zelf een .git map heeft om verwarring met de root te voorkomen
            if (!fs.existsSync(path.join(projectDir, '.git'))) {
                console.log(`ℹ️  ${site}: Geen eigen .git map gevonden.`);
                continue;
            }

            const remote = execSync('git remote get-url origin', { cwd: projectDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
            
            if (remote) {
                let repoName = remote.split('/').pop().replace('.git', '');
                let username = remote.includes('github.com:') 
                    ? remote.split('github.com:')[1].split('/')[0] 
                    : remote.split('github.com/')[1].split('/')[0];
                
                if (username.includes(':')) username = username.split(':').pop();
                if (username.includes('@')) username = username.split('@').pop();

                const deployInfo = {
                    deployedAt: config.deployedAt || new Date().toISOString(),
                    repoUrl: `https://github.com/${username}/${repoName}`,
                    liveUrl: `https://${username.toLowerCase()}.github.io/${repoName}`,
                    status: 'live'
                };

                if (!fs.existsSync(settingsDir)) fs.mkdirSync(settingsDir, { recursive: true });
                fs.writeFileSync(deployFile, JSON.stringify(deployInfo, null, 2));
                console.log(`✅ ${site}: Status gesynchroniseerd (Live)`);
            }
        } catch (e) {
            // Geen remote gevonden? Geen probleem, we laten de config met rust
        }
    }
    console.log('\n✨ Klaar!');
}

syncStatuses();