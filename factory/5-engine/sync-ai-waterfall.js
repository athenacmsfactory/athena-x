/**
 * @file sync-ai-waterfall.js
 * @description Synchroniseert de AI Waterfall met de meest actuele gratis modellen van OpenRouter.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.resolve(__dirname, '../config/ai-models.json');
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/models";

async function syncWaterfall() {
    console.log("🔄 Synchroniseren van AI Waterfall...");

    try {
        // 1. Fetch modellen van OpenRouter
        const response = await fetch(OPENROUTER_API_URL);
        if (!response.ok) throw new Error(`OpenRouter API error: ${response.status}`);
        
        const data = await response.json();
        const allModels = data.data || [];

        // 2. Filter gratis modellen
        const freeModels = allModels.filter(m => {
            const p = m.pricing;
            return p && parseFloat(p.prompt) === 0 && parseFloat(p.completion) === 0;
        });

        // Sorteer op context_length (vaak een indicator voor kracht)
        freeModels.sort((a, b) => b.context_length - a.context_length);

        console.log(`✅ ${freeModels.length} gratis modellen gevonden op OpenRouter.`);

        // 3. Bestaande config laden
        let config = {};
        if (fs.existsSync(CONFIG_PATH)) {
            config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        }

        // 4. Waterfall verdelen over de 3 OpenRouter slots
        // We verdelen de top modellen over openrouter-1, 2 en 3
        const or1 = [];
        const or2 = [];
        const or3 = [];

        freeModels.forEach((m, index) => {
            if (index < 5) or1.push(m.id);
            else if (index < 12) or2.push(m.id);
            else if (index < 25) or3.push(m.id);
        });

        // Update de config (behoud andere settings)
        config["openrouter-1"] = or1;
        config["openrouter-2"] = or2;
        config["openrouter-3"] = or3;

        // 5. Opslaan
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4));
        console.log(`🚀 Waterfall bijgewerkt! Config opgeslagen in ${CONFIG_PATH}`);

    } catch (error) {
        console.error("❌ Synchronisatie mislukt:", error.message);
        process.exit(1);
    }
}

syncWaterfall();
