/**
 * @file batch-parse-mpa.js
 * @description Automatiseert het parsen van grote hoeveelheden pagina's voor een MPA.
 * @compliance Gemini 3.0 Ready (Jan 2026)
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paden bepalen relatief aan dit script
const factoryRoot = path.resolve(__dirname, '../');
const projectRoot = path.resolve(__dirname, '../../');
const parserScript = path.join(__dirname, 'parse-mpa-pages.js');

async function startBatch() {
    const [projectName, limitStr] = process.argv.slice(2);
    if (!projectName) {
        console.error('❌ Gebruik: node 6-utilities/batch-parse-mpa.js <project-naam> [limit]');
        process.exit(1);
    }

    const limit = limitStr ? parseInt(limitStr, 10) : Infinity;
    const manifestPath = path.join(projectRoot, 'input', projectName, 'json-data/pages-manifest.json');
    const pagesDir = path.join(projectRoot, 'input', projectName, 'json-data/pages');

    try {
        if (!await fs.access(manifestPath).then(() => true).catch(() => false)) {
            console.error(`❌ Manifest niet gevonden: ${manifestPath}`);
            return;
        }

        const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
        
        // Filter pagina's: we kijken in de content of er al 'sections' zijn
        // Dit is betrouwbaarder dan kijken of het bestand bestaat
        let todo = [];
        console.log(`🔍 Controleren welke pagina's nog gestructureerd moeten worden...`);
        
        for (const page of manifest) {
            try {
                const filePath = path.join(pagesDir, page.file);
                const content = JSON.parse(await fs.readFile(filePath, 'utf8'));
                if (!content.content?.sections || content.content.sections.length === 0) {
                    todo.push(page);
                }
            } catch (e) {
                // Skip bestanden die niet leesbaar zijn
            }
        }

        console.log(`📊 Totaal pagina's in manifest: ${manifest.length}`);
        
        if (limit < todo.length) {
            console.log(`⚠️  Limiet toegepast: we verwerken de eerste ${limit} van de ${todo.length} resterende pagina's.`);
            todo = todo.slice(0, limit);
        }

        console.log(`🚀 Nog te doen (in deze batch): ${todo.length}`);

        if (todo.length === 0) {
            console.log("✨ Alles is al gestructureerd!");
            return;
        }

        // Vraag om bevestiging als het er veel zijn (RAM safe)
        if (todo.length > 50) {
            console.log(`⚠️  Let op: Je gaat ${todo.length} pagina's door de AI halen.`);
            console.log(`   Dit kan even duren en verbruikt API tokens.`);
        }

        console.log("\n--- START BATCH PROCESSING ---");
        
        for (const [index, page] of todo.entries()) {
            console.log(`[${index + 1}/${todo.length}] Verwerken: ${page.file}...`);
            
            // We roepen het individuele parser script aan met het volledige pad
            const result = spawnSync(process.execPath, [parserScript, projectName, page.file], {
                stdio: 'inherit',
                cwd: factoryRoot
            });

            if (result.status !== 0) {
                console.error(`   ❌ Fout bij ${page.file} (Exit code: ${result.status})`);
            }
            
            // Pauzeer tegen rate-limits (5 seconden voor stabiliteit op de gratis tier)
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        console.log("\n✨ BATCH KLAAR!");
        console.log(`💡 Tip: Kopieer de bestanden naar je site:`);
        console.log(`   cp -r input/${projectName}/json-data/pages/* sites/${projectName}-site/public/data/pages/`);

    } catch (error) {
        console.error(`❌ Fout in batch-parser: ${error.message}`);
    }
}

startBatch();