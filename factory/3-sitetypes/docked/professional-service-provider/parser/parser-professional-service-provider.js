import { runParser } from '../../../../5-engine/parser-engine.js';

const customPrompt = `Extract data for a professional service provider. 
Focus on Hero, Intro, Benefits (Voordelen), Showcase, Process (Proces), and Contact information.
Use Dutch for all field names as specified in the blueprint.`;

runParser('professional-service-provider.json', customPrompt);
