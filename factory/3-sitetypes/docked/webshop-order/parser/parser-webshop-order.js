import { runParser } from '../../../../5-engine/parser-engine.js';

const customPrompt = `Extract data for a local retail/food business with an order-via-email system.
Focus on products (products/items), categories, and contact details with ordering instructions.
Use Dutch for all field names as specified in the blueprint.`;

runParser('webshop-order.json', customPrompt);
