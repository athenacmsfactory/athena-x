import { runParser } from '../../../../5-engine/parser-engine.js';

const customPrompt = `
Je bent een wetenschapsjournalist. Je taak is om een diepgaande, informatieve site te vullen op basis van de bronteksten. 
Extraheer de data met de volgende focus:

1. basis: 
   - titel: ALTIJD "Nieuwe tandheelkundige inzichten (januari 2026)"
   - ondertitel: Een overkoepelende visie op de evolutie van de menselijke kaak en de revolutie in tandregeneratie.
   - introductie: Een sterke, uitgebreide inleiding (minimaal 3-4 alinea's) die de link legt tussen onze veranderende levensstijl (voeding) en de noodzaak voor nieuwe regeneratieve technologieën.

2. evolutie_kaak: 
   - Maak meerdere gedetailleerde artikelen. 
   - Vat de experimenten van Robert Corruccini en Paul Ehrlich uitgebreid samen. 
   - Leg specifiek de mechanismen uit: hoe kauwdruk botgroei stimuleert en waarom zacht voedsel leidt tot malocclusie. 
   - Gebruik de teksten over 'The toll of shrinking jaws' en de apen-studies voor diepgang.

3. regeneratie_techniek: 
   - Schrijf uitgebreide technische dossiers over TRG-035 (USAG-1) en Tideglusib.
   - Leg het biologische proces uit (het 'wakker maken' van slapende tandknoppen).
   - Vermeld de specifieke mijlpalen: 2025 (Fase I tests) en 2030 (beschikbaarheid).
   - Vat het onderzoek van King's College London (Xuechen Zhang) en Kyoto University (Katsu Takahashi) gedetailleerd samen.

4. experts: 
   - Behoud de lijst van wetenschappers en hun instituten. 
   - Voeg per expert een korte omschrijving van hun specifieke bijdrage aan deze inzichten toe.

Gebruik snake_case voor de velden. Zorg dat de teksten vloeiend, professioneel en wetenschappelijk onderbouwd zijn.
`;

runParser('science-article-type.json', customPrompt);