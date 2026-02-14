/**
 * @file layout-wizard.js
 * @description Wizard voor het aanpassen of creëren van UI-layouts voor sitetypes.
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadEnv } from './env-loader.js';
import { rl, ask } from './cli-interface.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function askWithValidation(query, options) {
    while (true) {
        const answer = await ask(query);
        const index = parseInt(answer, 10);
        if (!isNaN(index) && index >= 1 && index <= options.length) {
            return options[index - 1];
        }
        console.log(`\x1b[31m❌ Ongeldige keuze. Voer een nummer in tussen 1 en ${options.length}.\x1b[0m`);
    }
}

async function generateComponents(sitetype, layoutName, mapping, blueprint, preferences) {
    console.log(`\n🤖 AI UI-Designer genereert componenten voor "${layoutName}"...`);
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const modelName = process.env.AI_MODEL_FRONTEND_ARCHITECT || process.env.AI_MODEL_DEFAULT || "gemini-flash-latest";
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = `
            Je bent een expert in React en Tailwind CSS (v4).
            Genereer de broncode voor een set React-componenten voor een website van het type "${sitetype}".
            
            CONTEXT:
            - Blueprint (datastructuur): ${JSON.stringify(blueprint, null, 2)}
            - Mapping van velden naar UI-sloten: ${JSON.stringify(mapping, null, 2)}
            - Gebruikersvoorkeuren: "${preferences}"

            GEWENSTE BESTANDEN:
            1. App.jsx (Hoofdcomponent)
            2. components/Header.jsx
            3. components/Section.jsx
            4. index.css (Volledige styling met Tailwind CSS v4 directives)

            INSTRUCTIES:
            - Gebruik 'modern design' principes: veel witruimte, mooie lettertypes, subtiele schaduwen.
            - De data wordt in 'App.jsx' ontvangen via een 'data' prop (een object met tabelnamen als keys).
            - Prop-drilling: App geeft relevante data door aan Header en Section.
            - Gebruik de mapping om de juiste velden op de juiste plek te zetten.
            - Voor afbeeldingen: gebruik de velden die eindigen op '_url'.
            - Voor call-to-actions: gebruik velden zoals 'boekings_url' of 'directe_boekingslink'.
            - Tailwind v4 gebruikt @theme blokken voor custom kleuren indien nodig.
            
            OUTPUT FORMAAT:
            Stuur een JSON-object terug met de bestandsnamen als keys en de volledige code-inhoud als waarden.
            {
              "App.jsx": "...",
              "Header.jsx": "...",
              "Section.jsx": "...",
              "index.css": "..."
            }
            GEEN markdown, geen extra tekst, alleen de valide JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // Gemini 3 handling: find text part
        const parts = response.candidates?.[0]?.content?.parts || [];
        const textPart = parts.find(p => p.text);
        const text = textPart ? textPart.text : response.text();
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("❌ Fout bij AI generatie:", error.message);
        return null;
    }
}

async function runLayoutWizard() {
    await loadEnv(path.join(__dirname, '../.env'));
    const root = path.resolve(__dirname, '..');

    console.log("=================================================");
    console.log("🧙‍♂️ Welkom bij de Athena Layout & Component Wizard");
    console.log("=================================================");

    // 1. SELECT SITETYPE
    const siteTypesDir = path.join(root, '3-sitetypes');
    const siteTypes = (await fs.readdir(siteTypesDir)).filter(f => existsSync(path.join(siteTypesDir, f, 'blueprint')));
    
    console.log('\n📁 Voor welk site-type wil je een layout aanpassen of maken?');
    siteTypes.forEach((st, i) => console.log(`  [${i + 1}] ${st}`));
    const selectedSitetype = await askWithValidation('Kies een nummer: ', siteTypes);

    // 2. ACTION: MODIFY OR CREATE
    console.log('\n🛠️  Wat wil je doen?');
    console.log('  [1] Een bestaande layout aanpassen');
    console.log('  [2] Een volledig nieuwe layout maken');
    const actionChoice = await ask('Kies (1/2): ');

    let layoutName = "";
    const layoutsDir = path.join(siteTypesDir, selectedSitetype, 'web');
    
    if (actionChoice === '1') {
        const layouts = (await fs.readdir(layoutsDir)).filter(f => existsSync(path.join(layoutsDir, f)));
        console.log('\n🏗️ Kies de layout die je wilt aanpassen:');
        layouts.forEach((l, i) => console.log(`  [${i + 1}] ${l}`));
        layoutName = await askWithValidation('Kies een nummer: ', layouts);
    } else {
        while (true) {
            layoutName = await ask('\n✨ Geef een naam voor de nieuwe layout (bv. "modern", "dark"): ');
            layoutName = layoutName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
            if (layoutName.length >= 3) break;
            console.log("❌ Naam te kort.");
        }
    }

    // 3. LOAD BLUEPRINT
    const blueprintPath = path.join(siteTypesDir, selectedSitetype, 'blueprint', `${selectedSitetype}.json`);
    const blueprint = JSON.parse(await fs.readFile(blueprintPath, 'utf8'));

    // 4. MAPPING (Interactive mapping with tracking)
    // 4. MAPPING (Interactive mapping with tracking)
    const mapping = {};
    const allFields = [];
    blueprint.data_structure.forEach(table => {
        table.columns.forEach(col => {
            allFields.push(`${table.table_name}.${col.name}`);
        });
    });

    // --- VISUELE HULPMIDDELEN ---
    const showWireframe = (step) => {
        console.log('\n   _______________________________________________________');
        console.log('  |  WEBSITE PREVIEW (Wireframe)                          |');
        console.log('  |_______________________________________________________|');
        
        const isCurrent = (s) => step === s ? '\x1b[36m<-- HIER ZIJN WE NU\x1b[0m' : '';
        const val = (key) => mapping[key] ? `\x1b[32m${mapping[key]}\x1b[0m` : '...';

        console.log(`  |  HERO / HEADER                                        |`);
        console.log(`  |                                                       |`);
        console.log(`  |   [ GROTE TITEL ]   : ${val('header_title')} ${isCurrent('header_title')}`);
        console.log(`  |   [ Ondertitel  ]   : ${val('header_subtitle')} ${isCurrent('header_subtitle')}`);
        console.log(`  |   ( ACTIE KNOP  )   : ${val('hero_action')} ${isCurrent('hero_action')}`);
        console.log(`  |_______________________________________________________|`);
        console.log(`  |  SECTIES (Herhalende blokken)                         |`);
        console.log(`  |                                                       |`);
        console.log(`  |   [  CARD 1  ] [  CARD 2  ] [  CARD 3  ]              |`);
        console.log(`  |   REPEAT SOURCE     : ${val('section_repeater')} ${isCurrent('section_repeater')}`);
        console.log(`  |_______________________________________________________|`);
        console.log('');
    };

    const displayFieldStatus = () => {
        console.log('\n📊 BESCHIKBARE VELDEN UIT JE DATA:');
        const slots = Object.keys(mapping);
        
        // Group by table for clarity
        const byTable = {};
        allFields.forEach(f => {
            const [tbl, col] = f.split('.');
            if (!byTable[tbl]) byTable[tbl] = [];
            byTable[tbl].push({ full: f, col: col }); 
        });

        Object.keys(byTable).forEach(tbl => {
            console.log(`  \x1b[1m📂 Tabel '${tbl}':\x1b[0m`);
            byTable[tbl].forEach(item => {
                const mappedSlots = slots.filter(slot => mapping[slot] === item.full);
                const isMapped = mappedSlots.length > 0;
                const icon = isMapped ? '✅' : '⚪';
                const color = isMapped ? '\x1b[32m' : '\x1b[37m'; // White for unmapped
                const slotLabel = isMapped ? ` \x1b[90m(Gekoppeld aan: ${mappedSlots.join(', ')})\x1b[0m` : '';
                console.log(`     ${icon} ${color}${item.full}\x1b[0m${slotLabel}`);
            });
        });
    };

    console.log('\n🧩 Mapping: We gaan nu de velden uit je database koppelen aan het scherm.');
    
    showWireframe('header_title');
    displayFieldStatus();
    mapping.header_title = await ask('\n🏷️  Kies het veld voor de [ GROTE TITEL ] (bv. Blog_Info.titel): ');
    
    showWireframe('header_subtitle');
    // displayFieldStatus(); // Niet elke keer herhalen om scroll te besparen, wireframe is belangrijker
    mapping.header_subtitle = await ask('📝 Kies het veld voor de [ Ondertitel ] (bv. Blog_Info.beschrijving): ');
    
    showWireframe('hero_action');
    mapping.hero_action = await ask('🔗 Kies het veld voor de ( ACTIE KNOP ) (URL) (bv. Auteurs.social_url, of laat leeg): ');
    
    showWireframe('section_repeater');
    console.log("ℹ️  Nu kiezen we welke TABEL we gaan herhalen als blokken (bv. Posts, Producten).");
    console.log("    Kies dus geen veld, maar een tabelnaam.");
    mapping.section_repeater = await ask('🔄 Welke TABEL moet getoond worden in het rooster? (bv. "Posts"): ');
    
    const preferences = await ask('\n🎨 Heb je nog specifieke wensen voor het design? (bv. "donker thema", "minimalistisch", "veel blauwe accenten"): ');

    // 5. GENERATE
    const components = await generateComponents(selectedSitetype, layoutName, mapping, blueprint, preferences);

    if (components) {
        console.log(`\n✅ AI heeft de code gegenereerd voor layout "${layoutName}".`);
        console.log(`   Ontvangen bestanden: ${Object.keys(components).join(', ')}`);

        const targetDir = path.join(layoutsDir, layoutName);
        const compDir = path.join(targetDir, 'components');
        
        await fs.mkdir(compDir, { recursive: true });
        
        // Helper om veilig te schrijven
        const safeWrite = async (filename, content, subdir = '') => {
            if (!content) {
                console.log(`   ⚠️  Waarschuwing: AI heeft geen "${filename}" gegenereerd. Sla over.`);
                return;
            }
            const dest = subdir ? path.join(targetDir, subdir, filename) : path.join(targetDir, filename);
            await fs.writeFile(dest, content);
            console.log(`   💾 Opgeslagen: ${filename}`);
        };

        // We proberen flexibel te zijn met de bestandsnamen die de AI teruggeeft
        // Soms geeft hij "components/Header.jsx" terug als key, soms gewoon "Header.jsx"
        
        const findContent = (name) => {
            // Exact match
            if (components[name]) return components[name];
            // Case insensitive match
            const key = Object.keys(components).find(k => k.toLowerCase() === name.toLowerCase());
            if (key) return components[key];
            // Check in subpaths (bv. "components/Header.jsx")
            const subKey = Object.keys(components).find(k => k.endsWith(name));
            return subKey ? components[subKey] : undefined;
        };

        await safeWrite('App.jsx', findContent('App.jsx'));
        await safeWrite('index.css', findContent('index.css'));
        await safeWrite('Header.jsx', findContent('Header.jsx'), 'components');
        await safeWrite('Section.jsx', findContent('Section.jsx'), 'components');

        // Zorg dat we ook main.jsx hebben als het een nieuwe layout is
        const mainPath = path.join(targetDir, 'main.jsx');
        if (!existsSync(mainPath)) {
            const boilerplateMain = await fs.readFile(path.join(root, '2-templates/boilerplate/SPA/main.jsx'), 'utf8');
            await fs.writeFile(mainPath, boilerplateMain);
        }

        console.log(`\n✨ Layout "${layoutName}" is opgeslagen in: ${targetDir}`);
        console.log(`Je kunt deze layout nu kiezen in de site-wizard!`);
    } else {
        console.log("❌ Generatie mislukt. Probeer het opnieuw.");
    }

    rl.close();
}

runLayoutWizard();
