/**
 * @file parse-mpa-pages.js
 * @description Gebruikt AI om geselecteerde MPA pagina's te structureren in secties.
 * @compliance Gemini 3.0 Ready (Jan 2026)
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get absolute path to project root (athena/)
const projectRoot = path.resolve(__dirname, '../../');
const factoryRoot = path.resolve(__dirname, '../');

// Load .env from factory root
dotenv.config({ path: path.join(factoryRoot, '.env') });

// 1. Validatie van API Key
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error("❌ CRITIQUE FOUT: Geen GEMINI_API_KEY gevonden in factory/.env");
    console.error("   Huidig pad: " + path.join(factoryRoot, '.env'));
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
// Gebruik het model uit .env met een fallback naar gemini-2.5-flash
const modelName = process.env.MPA_PARSER_AI_MODEL || "gemini-2.5-flash";
const model = genAI.getGenerativeModel({ model: modelName });

async function parsePage(projectName, filename) {
    const inputPath = path.join(projectRoot, 'input', projectName, 'json-data/pages', filename);
    const outputPath = path.join(projectRoot, 'input', projectName, 'json-data/pages', filename); // Overschrijven!

    try {
        console.log(`🧠 AI analyseert pagina: ${filename}...`);
        
        let rawData;
        try {
            rawData = JSON.parse(await fs.readFile(inputPath, 'utf8'));
        } catch (e) {
            console.warn(`   ⚠️ Kon bestand niet lezen: ${filename}`);
            return;
        }

        const text = rawData.content.raw_text;

        const prompt = `
            Analyseer de volgende tekst van een webpagina en verdeel deze in logische secties voor een website.
            Gebruik uitsluitend de volgende sectietypes:
            - hero (titel, tagline, cta_text, link)
            - text_block (titel, tekst)
            - features (titel, items: [{titel, beschrijving, link, icoon}])
            - list (titel, items: [tekst])
            - contact_info (titel, adres, telefoon, email)

            BELANGRIJKE INSTRUCTIES VOOR LINKS:
            - De brontekst bevat links in het formaat [LINK: url] tekst [/LINK].
            - Als een item (zoals een feature of hero CTA) een link bevat, extraheer dan de URL naar het 'link' veld.
            - Zorg dat interne links relatief blijven (bv. /over-ons) indien mogelijk.

            Geef het resultaat terug als een JSON array van objecten, waarbij elk object een 'type' en 'content' veld heeft.
            Zorg dat de tekst behouden blijft maar logisch gegroepeerd wordt.
            Geef ALLEEN valide JSON terug, geen markdown formatting.

            TEKST OM TE ANALYSEREN:
            ${text}
        `;

        const result = await (async () => {
            try {
                return await model.generateContent(prompt);
            } catch (err) {
                if (err.message.includes('429') || err.message.includes('Too Many Requests')) {
                    console.warn("   ⏳ Rate limit bereikt. 10 seconden wachten...");
                    await new Promise(r => setTimeout(r, 10000));
                    return await model.generateContent(prompt);
                }
                throw err;
            }
        })();

        const response = await result.response;

        // GEMINI 3.0 COMPLIANCE: Safe Part Extraction
        const parts = response.candidates?.[0]?.content?.parts || [];
        
        // Zoek het tekst-deel (en negeer 'thought' parts)
        const textPart = parts.find(p => p.text && !p.thought);
        let jsonString = textPart ? textPart.text : (response.text ? response.text() : "");

        if (!jsonString) {
            throw new Error("Geen tekst gevonden in AI response");
        }
        
        // Clean markdown if present
        jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
        
        let structuredSections = [];
        try {
            structuredSections = JSON.parse(jsonString);
        } catch (parseErr) {
            console.error(`   ⚠️ JSON Parse fout voor ${filename}. Ruwe output:`, jsonString.substring(0, 100) + "...");
            return;
        }

        const finalData = {
            ...rawData,
            content: {
                ...rawData.content,
                sections: structuredSections
            }
        };

        await fs.writeFile(outputPath, JSON.stringify(finalData, null, 2));
        console.log(`   ✅ Gestructureerd en opgeslagen in: ${filename}`);

    } catch (error) {
        console.error(`   ❌ Fout bij parsen van ${filename}: ${error.message}`);
    }
}

async function start() {
    const [projectName, ...files] = process.argv.slice(2);
    
    if (!projectName || files.length === 0) {
        console.error('❌ Gebruik: node 6-utilities/parse-mpa-pages.js <project-naam> <file1.json> <file2.json> ...');
        process.exit(1);
    }

    console.log(`🚀 Start AI-structurering (Gemini 2.5 Flash) voor ${files.length} pagina's in ${projectName}...`);
    
    // Serieel uitvoeren om rate-limits te respecteren
    for (const file of files) {
        await parsePage(projectName, file);
    }

    console.log(`
✨ KLAAR! Je kunt nu verder met de MPA-generatie.`);
}

start();