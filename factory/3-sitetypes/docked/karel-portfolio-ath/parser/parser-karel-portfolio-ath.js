import { runParser } from '../../../../5-engine/parser-engine.js';

const customPrompt = `Je bent een Data Engineer gespecialiseerd in het omzetten van portfolio-content naar gestructureerde data voor Athena CMS.
Jouw taak is om de ruwe tekst te analyseren en te extraheren naar de volgende tabelstructuur:

1. **site_settings**: site_title, site_description, contact_email, logo_text, theme (dark of light)
2. **profile**: full_name, tagline, professional_title, bio_short, bio_long, avatar_url, contact_email, cta_text
3. **projects**: title, category, summary, description, tech_stack (comma-separated), demo_url, repo_url, image_url, status
4. **services**: title, description, icon_name (Lucide icoon naam)
5. **testimonials**: client_name, company, quote
6. **socials**: platform, url, icon

### STRIKTE EISEN:
- Output is één JSON object met tabelnamen als keys.
- 'tech_stack' is een string met komma-gescheiden waarden.
- 'theme' moet 'dark' zijn voor dit portfolio.
- Genereer realistische data als er iets ontbreekt.

Begin direct met de JSON output.`;

runParser('karel-portfolio-ath.json', customPrompt);
