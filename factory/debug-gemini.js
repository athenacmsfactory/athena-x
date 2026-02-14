import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// .env staat in dezelfde map als dit script (factory/)
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function debugGemini() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const modelName = "gemini-2.5-flash-image"; 
    
    console.log(`🚀 Testing Gemini Image Gen...`);
    console.log(`Key: ${apiKey ? 'Found (starts with ' + apiKey.substring(0, 5) + ')' : 'MISSING'}`);
    console.log(`Model: ${modelName}`);

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: modelName,
            generationConfig: { responseModalities: ["IMAGE", "TEXT"] } 
        });

        const prompt = "A professional cinematic photo of a high-end hair salon interior, modern lighting, 4k";
        const result = await model.generateContent(prompt);
        
        console.log("Response candidates:", result.response.candidates?.length);
        const parts = result.response.candidates?.[0]?.content?.parts || [];
        const hasImage = parts.some(p => p.inlineData);
        console.log("Has image data:", hasImage);

    } catch (e) {
        console.error("❌ FULL ERROR OBJECT:");
        console.error(JSON.stringify(e, null, 2));
        console.error("Message:", e.message);
    }
}

debugGemini();
