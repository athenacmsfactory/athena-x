/**
 * @file maintenance-wizard.js
 * @description Systeem-onderhoud voor RAM- en opslag-optimalisatie op Chromebook.
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

async function runCommand(command, args, cwd = process.cwd()) {
    return new Promise((resolve) => {
        console.log(`\n🚀 Uitvoeren: ${command} ${args.join(' ')}`);
        const child = spawn(command, args, { stdio: 'inherit', shell: true, cwd });
        child.on('close', (code) => {
            resolve(code === 0);
        });
    });
}

async function startMaintenance() {
    console.log("=======================================");
    console.log("🛠️  ATHENA SYSTEEM ONDERHOUD  🛠️");
    console.log("=======================================");
    console.log("Optimalisatie voor Chromebook (4GB RAM / 25GB Opslag)");
    
    console.log("\n[1] PNPM Store Prune (Verwijdert ongebruikte pakketten uit centrale opslag)");
    console.log("[2] Deep Clean node_modules (Verwijdert ALLE node_modules mappen in ../sites/)");
    console.log("[3] Systeem Clean (apt autoremove & clean - vereist sudo)");
    console.log("[4] Alles uitvoeren");
    console.log("[Q] Terug naar Dashboard");

    const choice = await ask('\nKies een optie: ');

    switch (choice.toUpperCase()) {
        case '1':
            await runCommand('pnpm', ['store', 'prune']);
            console.log("\n✅ PNPM Store is opgeschoond.");
            break;
        case '2':
            console.log("\n⚠️  Dit verwijdert alle node_modules in de ../sites/ map.");
            console.log("   Je kunt ze later altijd weer herstellen met 'Start Dev Servers'.");
            const confirm = await ask('Weet je het zeker? (y/n): ');
            if (confirm.toLowerCase() === 'y') {
                const sitesDir = path.resolve(__dirname, '../../sites');
                if (fs.existsSync(sitesDir)) {
                    const sites = fs.readdirSync(sitesDir).filter(f => fs.statSync(path.join(sitesDir, f)).isDirectory());
                    for (const site of sites) {
                        const nmPath = path.join(sitesDir, site, 'node_modules');
                        if (fs.existsSync(nmPath)) {
                            console.log(`🗑️  Verwijderen: ../sites/${site}/node_modules`);
                            fs.rmSync(nmPath, { recursive: true, force: true });
                        }
                    }
                    console.log("\n✅ Alle lokale node_modules zijn verwijderd.");
                }
            }
            break;
        case '3':
            console.log("\n🚀 Systeem opschonen (apt)...");
            await runCommand('sudo', ['apt', 'autoremove', '--purge', '-y']);
            await runCommand('sudo', ['apt', 'clean']);
            console.log("\n✅ Systeem is opgeschoond.");
            break;
        case '4':
            console.log("\n--- Start Volledige Schoonmaak ---");
            await runCommand('pnpm', ['store', 'prune']);
            
            const sitesDir = path.resolve(__dirname, '../../sites');
            if (fs.existsSync(sitesDir)) {
                const sites = fs.readdirSync(sitesDir).filter(f => fs.statSync(path.join(sitesDir, f)).isDirectory());
                for (const site of sites) {
                    const nmPath = path.join(sitesDir, site, 'node_modules');
                    if (fs.existsSync(nmPath)) {
                        console.log(`🗑️  Verwijderen: ../sites/${site}/node_modules`);
                        fs.rmSync(nmPath, { recursive: true, force: true });
                    }
                }
            }
            
            await runCommand('sudo', ['apt', 'autoremove', '--purge', '-y']);
            await runCommand('sudo', ['apt', 'clean']);
            console.log("\n✅ Volledige schoonmaak voltooid.");
            break;
        case 'Q':
            rl.close();
            process.exit(0);
        default:
            console.log("\n❌ Ongeldige keuze.");
    }

    const again = await ask('\nNog iets anders doen? (y/n): ');
    if (again.toLowerCase() === 'y') {
        await startMaintenance();
    } else {
        rl.close();
        process.exit(0);
    }
}

startMaintenance().catch(err => {
    console.error("Fout tijdens onderhoud:", err);
    process.exit(1);
});
