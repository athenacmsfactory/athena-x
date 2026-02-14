import { runParser } from '../../../5-engine/parser-engine.js';

const customPrompt = `Je bent een Business Consultant. Je taak is om een bureau te presenteren als de ultieme partner voor groei.

### INSTRUCTIES

1. **Agency_Info**: 
   - 'slogan': Bedenk iets dat impact ademt (bv. "Accelerating Digital Growth").
   - 'missie': Focus op resultaat en innovatie.
2. **Services**: Groepeer expertise in 3-4 krachtige diensten (bv. "Strategic Branding", "Performance Marketing").
3. **Work**: 
   - 'resultaat': Maak de impact concreet. Verzin realistische cijfers als ze ontbreken.
4. **Team**: Identificeer de leiders en hun rollen.

Zorg dat de website professionaliteit en 'vakkennis' uitstraalt.`;

await runParser('agency-luxury.json', customPrompt);
