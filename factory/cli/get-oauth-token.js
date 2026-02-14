// 5-engine/get-oauth-token.js
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// --- CONFIGURATIE ---
// Je kunt deze hier plakken OF 'oauth_credentials.json' in de root zetten.
let CLIENT_ID = 'PLAK_HIER_JE_CLIENT_ID';
let CLIENT_SECRET = 'PLAK_HIER_JE_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost'; // De modernere standaard voor Desktop apps

async function getAccessToken() {
    console.log("🔑 Athena OAuth 2.0 Token Generator");
    console.log("-----------------------------------");

    // Probeer uit bestand te laden als placeholders niet zijn ingevuld
    const credPath = path.join(root, 'oauth_credentials.json');
    if (CLIENT_ID.includes('PLAK_HIER') && fs.existsSync(credPath)) {
        const keys = JSON.parse(fs.readFileSync(credPath, 'utf8'));
        const key = keys.installed || keys.web;
        CLIENT_ID = key.client_id;
        CLIENT_SECRET = key.client_secret;
        console.log("✅ Gegevens geladen uit oauth_credentials.json");
    }

    if (CLIENT_ID.includes('PLAK_HIER')) {
        console.error("❌ FOUT: Geen CLIENT_ID gevonden. Plak deze in het script of gebruik oauth_credentials.json");
        process.exit(1);
    }

    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent', // Forceert het krijgen van een refresh token
        scope: [
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive.readonly', // Nodig om de Master Template te lezen
            'https://www.googleapis.com/auth/spreadsheets'
        ],
    });

    console.log(`
👇 1. Open deze URL in je browser en log in:

${authUrl}

👇 2. Na inloggen kom je op een (fout)pagina die niet laadt. 
   KOPIEER de volledige URL uit de adresbalk van die pagina (begint met http://localhost/?code=...)
    `);

    const rl = createInterface({ input: process.stdin, output: process.stdout });

    rl.question('👇 3. Plak de URL (of de code na "code=") hier: ', async (input) => {
        try {
            let code = input;
            if (input.includes('code=')) {
                code = new URL(input).searchParams.get('code');
            }

            const { tokens } = await oauth2Client.getToken(code);
            console.log('\n✅ SUCCES! Hier zijn je tokens voor je .env bestand:\n');
            console.log('---------------------------------------------------');
            console.log(`GOOGLE_CLIENT_ID=${CLIENT_ID}`);
            console.log(`GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}`);
            console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
            console.log('---------------------------------------------------');
            
            if (!tokens.refresh_token) {
                console.log("\n⚠️  GEEN refresh_token ontvangen! De app heeft waarschijnlijk nog toegang.");
                console.log("   Ga naar https://myaccount.google.com/permissions, trek toegang voor 'Athena' in en probeer opnieuw.");
            }
        } catch (error) {
            console.error('\n❌ Fout bij ophalen tokens:', error.message);
        } finally {
            rl.close();
        }
    });
}

getAccessToken();