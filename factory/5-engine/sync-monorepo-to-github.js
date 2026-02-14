import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
const envPath = path.join(__dirname, '../.env');
let env = {};
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#') && trimmedLine.includes('=')) {
            const [key, ...valueParts] = trimmedLine.split('=');
            env[key.trim()] = valueParts.join('=').trim();
        }
    });
}

const GITHUB_PAT = env.GITHUB_PAT;
const OWNER = env.GITHUB_ORG || env.GITHUB_USER || "athenacmsfactory";

if (!GITHUB_PAT) {
    console.error("❌ GITHUB_PAT niet gevonden in .env");
    process.exit(1);
}

async function ensureRepoExists(name) {
    console.log(`🔍 Controleren of repo '${OWNER}/${name}' bestaat...`);
    try {
        const response = await fetch(`https://api.github.com/repos/${OWNER}/${name}`, {
            headers: { 
                'Authorization': `Bearer ${GITHUB_PAT}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (response.status === 404) {
            console.log(`➕ Repo bestaat niet. Aanmaken...`);
            execSync(`node factory/5-engine/create-repo.js ${name}`, { stdio: 'inherit', cwd: path.resolve(__dirname, '../../') });
        } else {
            console.log(`✅ Repo bestaat al.`);
        }
    } catch (e) {
        console.error(`❌ Fout bij controleren repo: ${e.message}`);
    }
}

async function syncSite(siteName) {
    const sitePath = path.join('sites', siteName);
    if (!fs.existsSync(sitePath)) {
        console.error(`❌ Pad sites/${siteName} bestaat niet.`);
        return;
    }

    await ensureRepoExists(siteName);

    console.log(`🚀 Starten van geforceerde sync voor ${siteName}...`);
    const remoteUrl = `https://x-access-token:${GITHUB_PAT}@github.com/${OWNER}/${siteName}.git`;
    
    try {
        // Workaround voor force push met subtree:
        // 1. Split de subtree naar een lokale tijdelijke branch
        const tempBranch = `temp-split-${siteName}`;
        try { execSync(`git branch -D ${tempBranch}`, { stdio: 'ignore' }); } catch(e) {}
        
        console.log(`   Splitting subtree...`);
        execSync(`git subtree split --prefix=sites/${siteName} -b ${tempBranch}`, { stdio: 'inherit' });
        
        console.log(`   Force pushing to remote...`);
        execSync(`git push "${remoteUrl}" ${tempBranch}:main --force`, { stdio: 'inherit' });
        
        // Ruim de tijdelijke branch op
        execSync(`git branch -D ${tempBranch}`, { stdio: 'inherit' });
        
        console.log(`✨ ${siteName} succesvol gesynchroniseerd (geforceerd)!`);
    } catch (e) {
        console.error(`❌ Fout bij syncen van ${siteName}: ${e.message}`);
    }
}

const targetSite = process.argv[2];
const sitesDir = path.join(process.cwd(), 'sites');
if (!fs.existsSync(sitesDir)) {
    console.error("❌ 'sites' map niet gevonden in de huidige directory.");
    process.exit(1);
}

const availableSites = fs.readdirSync(sitesDir).filter(f => fs.statSync(path.join(sitesDir, f)).isDirectory() && !f.startsWith('.'));

if (!targetSite) {
    console.log("Beschikbare sites:");
    availableSites.forEach(s => console.log(` - ${s}`));
    console.log("\nGebruik: node factory/5-engine/sync-monorepo-to-github.js <site-naam> of 'all'");
    process.exit(0);
}

if (targetSite === 'all') {
    for (const site of availableSites) {
        console.log(`\n--- Synchroniseren: ${site} ---`);
        await syncSite(site);
    }
} else {
    await syncSite(targetSite);
}
