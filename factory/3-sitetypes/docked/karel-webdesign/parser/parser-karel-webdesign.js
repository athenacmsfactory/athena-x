import { runParser } from '../../../../5-engine/parser-engine.js';

const customPrompt = `Je bent een Data Engineer gespecialiseerd in het omzetten van portfolio-content naar gestructureerde data.
Jouw taak is om de ruwe tekst te analyseren en te extraheren naar de volgende tabelstructuur:

1. **site_settings**: site_title, site_description, contact_email, logo_text
2. **navigation**: label, href, order
3. **hero**: title, subtitle, cta_text, cta_link, image_url
4. **features**: title, description, icon (ShieldCheck, User, Zap)
5. **services**: title, price, description, features_list (comma-separated), recommended (boolean), order (number)
6. **portfolio**: title, description, tech_stack (comma-separated), status, github_url, live_url, image_url
7. **about**: title, content, image_url
8. **contact**: title, description, address, phone

### STRIKTE EISEN:
- Output is één JSON object met tabelnamen als keys.
- 'recommended' is een boolean (true/false).
- 'order' is een integer.
- 'features_list' en 'tech_stack' zijn strings met komma-gescheiden waarden.
- Genereer realistische data als er iets ontbreekt, gebaseerd op de context van een freelance webdeveloper genaamd Karel.

Begin direct met de JSON output.`;

runParser('karel-webdesign.json', customPrompt);
