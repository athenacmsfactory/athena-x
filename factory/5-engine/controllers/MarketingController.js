/**
 * MarketingController.js
 * @description Handles autonomous content generation for SEO and marketing.
 * Integrates with Interpreter for brains and DataManager for Sheets sync.
 */

import fs from 'fs';
import path from 'path';
import { AthenaInterpreter } from '../lib/Interpreter.js';
import { AthenaDataManager } from '../lib/DataManager.js';

export class MarketingController {
    constructor(configManager) {
        this.configManager = configManager;
        this.interpreter = new AthenaInterpreter(configManager);
        this.dataManager = new AthenaDataManager(configManager.get('paths.factory'));
    }

    /**
     * Generate a new blog post for a specific site
     * @param {string} projectName 
     * @param {string} topic (Optional)
     */
    async generateBlog(projectName, topic = "the future of AI-driven web design") {
        console.log(`✍️  AI Marketing: Blog genereren voor '${projectName}' over '${topic}'...`);

        // 1. Haal context op van de site voor relevante content
        const paths = this.dataManager.resolvePaths(projectName);
        const siteSettings = this.dataManager.loadJSON(path.join(paths.dataDir, 'site_settings.json')) || {};
        
        const systemInstruction = `
            Je bent een 'SEO Copywriter'. Schrijf een boeiende blogpost voor de website '${projectName}'.
            CONTEXT: ${JSON.stringify(siteSettings)}
            ONDERWERP: ${topic}
            
            REGEER UITSLUITEND MET EEN JSON OBJECT:
            {
                "title": "Titel van de blog",
                "excerpt": "Korte samenvatting voor de overzichtspagina",
                "content": "Volledige HTML of Markdown inhoud van de blog",
                "author": "Athena Agent",
                "date": "${new Date().toISOString().split('T')[0]}",
                "category": "Technologie"
            }
        `;

        const blogData = await this.interpreter.model.generateContent(systemInstruction);
        const response = await blogData.response;
        let text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const blogJson = JSON.parse(text);

        // 2. Voeg de blog toe aan de lokale data (blog.json)
        const blogFilePath = path.join(paths.dataDir, 'blog.json');
        let existingBlogs = [];
        if (fs.existsSync(blogFilePath)) {
            existingBlogs = JSON.parse(fs.readFileSync(blogFilePath, 'utf8'));
        }
        
        existingBlogs.unshift(blogJson); // Nieuwste bovenaan
        fs.writeFileSync(blogFilePath, JSON.stringify(existingBlogs, null, 2));
        
        console.log(`✅ Blog lokaal opgeslagen: ${blogJson.title}`);

        // 3. SYNC NAAR GOOGLE SHEETS
        console.log(`📡 Blog synchroniseren naar Google Sheet van ${projectName}...`);
        await this.dataManager.syncToSheet(projectName);

        return {
            success: true,
            message: "Blog succesvol gegenereerd en gesynchroniseerd naar de Sheet.",
            blog: blogJson
        };
    }
}
