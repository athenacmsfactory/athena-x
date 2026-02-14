/**
 * @file sync-standard-layouts.js
 * @description Forceert een update van Section.jsx in een project op basis van de nieuwste generator-logica.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSectionComponent } from '../5-engine/logic/standard-layout-generator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Root van de factory (athena/factory)
const factoryRoot = path.resolve(__dirname, '..');
// Root van het project (athena)
const projectRoot = path.resolve(factoryRoot, '..');

async function sync(projectName) {
    const projectDir = path.resolve(projectRoot, 'sites', projectName);
    const configFile = path.join(projectDir, 'athena-config.json');

    if (!fs.existsSync(configFile)) {
        console.error(`❌ Project ${projectName} niet gevonden in ${projectDir}`);
        return;
    }

    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    const sitetype = config.siteType;
    
    // Laad de blueprint vanuit factoryRoot
    const blueprintPath = path.join(factoryRoot, '3-sitetypes', sitetype, 'blueprint', `${sitetype}.json`);
    if (!fs.existsSync(blueprintPath)) {
        console.error(`❌ Blueprint niet gevonden: ${blueprintPath}`);
        return;
    }
    
    const blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf8'));
    
    console.log(`🧠 Genereren van nieuwe Section.jsx voor ${projectName}...`);
    const newSectionCode = generateSectionComponent(blueprint);
    
    const targetPath = path.join(projectDir, 'src/components/Section.jsx');
    fs.writeFileSync(targetPath, newSectionCode);
    
    console.log(`✅ Section.jsx is bijgewerkt in ${targetPath}`);
}

const target = process.argv[2] || 'basic-dock-site';
sync(target);
