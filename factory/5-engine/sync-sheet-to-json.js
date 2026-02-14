/**
 * @file sync-sheet-to-json.js
 * @description Wrapper die het 'pnpm fetch-data' commando van de site zelf uitvoert.
 *              Dit zorgt ervoor dat de specifieke logica van die site (fetch-data.js) wordt gebruikt.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runFetchData() {
    const projectName = process.argv[2];
    if (!projectName) {
        console.error("❌ Gebruik: node sync-sheet-to-json.js [project-naam]");
        process.exit(1);
    }

    const root = path.resolve(__dirname, '..');
    
    // Probeer beide varianten: [projectName] en [projectName]-site
    let projectDir = path.resolve(root, '../sites', projectName);
    if (!fs.existsSync(projectDir)) {
        const altProjectDir = path.resolve(root, '../sites', `${projectName}-site`);
        if (fs.existsSync(altProjectDir)) {
            projectDir = altProjectDir;
        }
    }

    if (!fs.existsSync(projectDir)) {
        console.error(`❌ Projectmap niet gevonden voor ${projectName} (geprobeerd: ${projectName} en ${projectName}-site)`);
        process.exit(1);
    }

    const dataDir = path.join(projectDir, 'src/data');

    // --- BACKUP LOGICA ---
    const backupsRoot = path.join(projectDir, 'backups');
    if (fs.existsSync(dataDir)) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupDir = path.join(backupsRoot, `data_${timestamp}`);
        
        console.log(`📦 Backup maken van huidige data naar: backups/data_${timestamp}...`);
        fs.mkdirSync(backupDir, { recursive: true });
        
        const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
        files.forEach(file => {
            fs.copyFileSync(path.join(dataDir, file), path.join(backupDir, file));
        });
        console.log(`✅ Backup voltooid.`);

        // --- OPSCHONEN OUDE BACKUPS (MAX 2) ---
        try {
            const existingBackups = fs.readdirSync(backupsRoot)
                .filter(f => f.startsWith('data_'))
                .sort();
            
            if (existingBackups.length > 2) {
                const toDelete = existingBackups.slice(0, existingBackups.length - 2);
                toDelete.forEach(folder => {
                    fs.rmSync(path.join(backupsRoot, folder), { recursive: true, force: true });
                    console.log(`🗑️ Oude backup verwijderd: ${folder}`);
                });
            }
        } catch (e) {
            console.warn(`⚠️ Kon oude backups niet opschonen: \${e.message}`);
        }
    }

    console.log(`\n🚀 Starten van data-sync voor '${projectName}'...`);
    console.log(`   (Voert 'pnpm fetch-data' uit in ${projectDir})\n`);

    try {
        execSync('pnpm fetch-data', { cwd: projectDir, stdio: 'inherit' });
        console.log(`\n✅ Data succesvol opgehaald en opgeslagen in src/data/`);
    } catch (error) {
        console.error(`\n❌ Fout bij uitvoeren van fetch-data.`);
        // Fout wordt al getoond door stdio: inherit
        process.exit(1);
    }
}

runFetchData();