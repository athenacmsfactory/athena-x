import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
    console.log("Checking environment...");
    console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
    console.log("AI_MODEL_IMAGE_GENERATOR:", process.env.AI_MODEL_IMAGE_GENERATOR);
    
    try {
        const res = await fetch("https://google.com");
        console.log("Global fetch works:", res.ok);
    } catch (e) {
        console.log("Global fetch fails:", e.message);
    }
}
test();
