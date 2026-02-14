/**
 * @file athena-mcp-helper.js
 * @description Bridge tussen de AI Agent en de Athena Wizards voor autonome uitvoering.
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Voert een wizard uit met een reeks voorgeprogrammeerde antwoorden.
 * @param {string} wizardPath - Pad naar de wizard (relatief aan 5-engine).
 * @param {string[]} answers - Lijst met antwoorden die naar de stdin gepusht worden.
 */
export async function runWizardAutomated(wizardName, answers = []) {
    const wizardFullPath = path.join(__dirname, wizardName);
    
    console.log(`🚀 Starten van wizard: ${wizardName} in automatische modus...`);
    
    return new Promise((resolve, reject) => {
        const child = spawn('node', [wizardFullPath], {
            stdio: ['pipe', 'inherit', 'inherit']
        });

        let currentAnswer = 0;

        // Geef antwoorden door wanneer de wizard erom vraagt (gesimuleerd via delay of prompt detectie)
        // Voor eenvoud pushen we ze nu sequentieel met een kleine pauze
        const interval = setInterval(() => {
            if (currentAnswer < answers.length) {
                console.log(`   📥 Input: ${answers[currentAnswer]}`);
                child.stdin.write(answers[currentAnswer] + '\n');
                currentAnswer++;
            } else {
                clearInterval(interval);
                child.stdin.end();
            }
        }, 1000);

        child.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Wizard stopte met code ${code}`));
        });
    });
}

// CLI Interface voor de helper zelf
const args = process.argv.slice(2);
if (args.length > 0) {
    const [wizard, ...answers] = args;
    runWizardAutomated(wizard, answers)
        .then(() => console.log('✅ Wizard succesvol afgerond.'))
        .catch(err => console.error('❌ Fout:', err.message));
}
