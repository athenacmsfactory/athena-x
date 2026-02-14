/**
 * @file generate-sites-overview.js
 * @description Genereert SITES_OVERZICHT.md met status en URL's van alle sites.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from './env-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const sitesDir = path.join(root, 'sites');

async function generateOverview() {
    await loadEnv(path.join(root, '.env'));
    const { GITHUB_USER, GITHUB_ORG } = process.env;
    const ORG = GITHUB_ORG || GITHUB_USER;

    const sites = fs.readdirSync(sitesDir).filter(f => {
        return fs.statSync(path.join(sitesDir, f)).isDirectory() && f !== '.git' && f !== '.gitkeep';
    });

    let liveUrls = [];
    let tableRows = [];

    for (const site of sites) {
        const projectDir = path.join(sitesDir, site);
        const url = `https://${ORG}.github.io/${site}/`;
        
        // Check of de site een .github workflow heeft (indicatie van publishing)
        const isPublished = fs.existsSync(path.join(projectDir, '.github/workflows/deploy.yml'));
        const status = isPublished ? "✅ Gepubliceerd" : "🛠️ In Ontwikkeling";

        if (isPublished) {
            liveUrls.push(url);
            tableRows.push(`| ${site} | ${status} | [Link](${url}) |`);
        } else {
            tableRows.push(`| ${site} | ${status} | - |`);
        }
    }

    const content = `# 🌐 Athena CMS Sites Overzicht

Laatst bijgewerkt: ${new Date().toLocaleString('nl-BE')}

## 📋 Status Overzicht

| Site Naam | Status | URL |
|:----------|:-------|:----|
${tableRows.join('\n')}

## 🚀 Snel Kopiëren (Live URL's)
*Selecteer de lijst hieronder om alle URL's in één keer te kopiëren voor e-mail of rapportage:*

\`\`\`text
${liveUrls.join('\n')}
\`\`\`

---
*Gegenereerd door Athena Factory Engine*
`;

    fs.writeFileSync(path.join(root, 'output', 'SITES_OVERZICHT.md'), content);
    console.log("✅ SITES_OVERZICHT.md is bijgewerkt in output/!");
}

generateOverview();
