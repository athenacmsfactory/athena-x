import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const SITES_DIR = path.resolve(root, '../sites');

// Load Config
let NICHE_TEMPLATES = {};
try {
    const configPath = path.join(root, 'config', 'image-templates.json');
    if (fs.existsSync(configPath)) {
        NICHE_TEMPLATES = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } else {
        console.warn("⚠️  Config niet gevonden: config/image-templates.json. Gebruik fallbacks.");
    }
} catch (e) {
    console.error("❌ Fout bij laden config:", e.message);
}

function detectNiche(siteName) {
    const name = siteName.toLowerCase();
    // Dynamische detectie op basis van keys in config zou mooier zijn,
    // maar voor nu houden we deze mapping even vast voor stabiliteit.
    // In een volgende iteratie kunnen we "keywords" ook naar de config verplaatsen.
    if (name.includes('kaas') || name.includes('affineur')) return 'kaas';
    if (name.includes('advocat') || name.includes('law')) return 'advocatuur';
    if (name.includes('architect')) return 'architect';
    if (name.includes('hond') || name.includes('dog')) return 'hondenpension';
    if (name.includes('yoga')) return 'yoga';
    if (name.includes('bed') || name.includes('breakfast')) return 'bed-and-breakfast';
    if (name.includes('it') || name.includes('consulting')) return 'it-consulting';
    return 'default';
}

function detectItemType(item, fileName) {
    const name = fileName.toLowerCase();
    
    // Check for specific types based on fields
    if (item.rating_sterren || item.review || name.includes('review') || name.includes('recensie')) return 'review';
    if (item.kaas_naam || name.includes('product') || name.includes('kaas')) return 'product';
    if (item.naam_bedrijf || name.includes('bedrijf') || name.includes('basis')) return 'bedrijf';
    if (item.functie || name.includes('team') || name.includes('lid')) return 'teamlid';
    if (item.naam_hond || name.includes('hond')) return 'hond';
    if (item.kamernummer || name.includes('kamer')) return 'kamer';
    if (item.les_naam || name.includes('les')) return 'les';
    if (name.includes('dienst') || name.includes('service')) return 'dienst';
    if (name.includes('project')) return 'project';
    
    return 'default';
}

function generatePrompt(item, niche, itemType) {
    const templates = NICHE_TEMPLATES[niche] || NICHE_TEMPLATES['default'] || {};
    let template = templates[itemType] || templates['default'] || 'Professional photography, high quality, 4k';
    
    // Replace {name} placeholder if present
    const itemName = item.naam || item.kaas_naam || item.product_naam || item.titel || item.naam_hond || 'item';
    template = template.replace('{name}', itemName);
    
    return template;
}

async function generatePrompts() {
    const prompts = [];
    
    if (!fs.existsSync(SITES_DIR)) {
        console.error("❌ Sites map niet gevonden.");
        return;
    }

    const sites = fs.readdirSync(SITES_DIR).filter(f => 
        fs.statSync(path.join(SITES_DIR, f)).isDirectory() && !f.startsWith('.')
    );
    
    for (const siteName of sites) {
        const dataDir = path.join(SITES_DIR, siteName, 'src/data');
        if (!fs.existsSync(dataDir)) continue;
        
        const niche = detectNiche(siteName);
        console.log(`\n📁 ${siteName} (${niche})`);
        
        const files = fs.readdirSync(dataDir).filter(f => 
            f.endsWith('.json') && 
            !['schema.json', 'site_settings.json', 'section_order.json', 'athena_meta.json'].includes(f)
        );
        
        for (const file of files) {
            const filePath = path.join(dataDir, file);
            let data = [];
            try {
                data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            } catch(e) { continue; }

            if (!Array.isArray(data)) continue;
            
            const itemType = detectItemType(data[0] || {}, file);
            
            data.forEach((item, idx) => {
                if (!item || typeof item !== 'object') return;
                
                const imgKey = Object.keys(item).find(key => 
                    key.toLowerCase().includes('afbeelding') || 
                    key.toLowerCase().includes('foto') || 
                    key.toLowerCase().includes('image')
                );
                
                if (!imgKey) return;
                
                const itemName = item.naam || item.kaas_naam || item.product_naam || item.titel || item.naam_hond || `Item ${idx + 1}`;
                const prompt = generatePrompt(item, niche, itemType);
                
                prompts.push({
                    site: siteName,
                    file: file,
                    index: idx,
                    name: itemName,
                    imageKey: imgKey,
                    prompt: prompt
                });
                
                console.log(`   ✓ ${itemName}`);
            });
        }
    }
    
    // Write prompts.txt to OUTPUT dir
    const outputPath = path.join(root, 'output', 'prompts.txt');
    let output = '# 🎨 AI Image Generation Prompts\n';
    output += '# Gegenereerd op: ' + new Date().toLocaleString('nl-NL') + '\n';
    output += '# Totaal aantal prompts: ' + prompts.length + '\n\n';
    output += '# INSTRUCTIES:\n';
    output += '# 1. Kopieer elke prompt naar je AI image generator\n';
    output += '# 2. Download de afbeelding\n';
    output += '# 3. Sla op in ../sites/[SITE]/public/images/\n\n';
    output += '═'.repeat(80) + '\n\n';
    
    prompts.forEach((p, i) => {
        output += `[${i + 1}/${prompts.length}] ${p.site} → ${p.file} → ${p.name}\n`;
        output += `Bestandsnaam: ${p.site}-${p.index}.jpg\n`;
        output += `Prompt:\n${p.prompt}\n\n`;
        output += '─'.repeat(80) + '\n\n';
    });
    
    fs.writeFileSync(outputPath, output);
    console.log(`\n✨ Prompts gegenereerd: ${outputPath}`);
    console.log(`📊 Totaal: ${prompts.length} afbeeldingen`);
}

generatePrompts();