import { runParser } from '../../../5-engine/parser-engine.js';

const customPrompt = `{{CUSTOM_PROMPT_CONTENT}}`;

runParser('{{SITE_TYPE_NAME}}.json', customPrompt);
