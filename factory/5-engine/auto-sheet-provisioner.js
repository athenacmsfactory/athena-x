import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from './env-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

await loadEnv(path.join(ROOT, '.env'));

const MASTER_TEMPLATE_ID = process.env.MASTER_TEMPLATE_ID;
const TARGET_FOLDER_ID = process.env.DRIVE_PROJECTS_FOLDER_ID;

// OAuth Config
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

async function getAuthClient() {
    const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
    auth.setCredentials({ refresh_token: REFRESH_TOKEN });
    return auth;
}

export async function provisionSheet(projectName, clientEmail = null) {
    console.log(`\n🚀 Start OAuth Provisioning voor: ${projectName}`);
    const auth = await getAuthClient();


    const drive = google.drive({ version: 'v3', auth });
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        // 1. Kopieer de Master Template
        console.log(`📋 Kopiëren van Master Template...`);
        const copyRes = await drive.files.copy({
            fileId: MASTER_TEMPLATE_ID,
            supportsAllDrives: true,
            requestBody: {
                name: `Athena Project: ${projectName}`,
                parents: [TARGET_FOLDER_ID]
            }
        });

        const newSheetId = copyRes.data.id;
        const editUrl = `https://docs.google.com/spreadsheets/d/${newSheetId}/edit`;
        console.log(`✅ Sheet aangemaakt! ID: ${newSheetId}`);

        // 2. Deel met Robot (voor CMS sync)
        let saEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        if (!saEmail) {
            console.warn("⚠️  WAARSCHUWING: GOOGLE_SERVICE_ACCOUNT_EMAIL niet gevonden in .env. Gebruik fallback...");
            saEmail = 'athena-cms-sheet-write@gen-lang-client-0519605634.iam.gserviceaccount.com';
        }

        console.log(`🤖 Robot (${saEmail}) toegang geven...`);
        await drive.permissions.create({
            fileId: newSheetId,
            requestBody: { role: 'writer', type: 'user', emailAddress: saEmail }
        });

        // 2b. Deel met Developer / Klant (indien opgegeven)
        if (clientEmail && clientEmail.includes('@')) {
            console.log(`👤 Klant/Developer (${clientEmail}) toegang geven...`);
            try {
                await drive.permissions.create({
                    fileId: newSheetId,
                    requestBody: { role: 'writer', type: 'user', emailAddress: clientEmail }
                });
            } catch (e) {
                console.warn(`⚠️ Kon sheet niet delen met ${clientEmail}: ${e.message}`);
            }
        }

        // 3. AUTOMATISCHE KOPPELING OPSLAAN
        console.log(`💾 Koppeling opslaan for project: ${projectName}...`);
        const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: newSheetId });
        const urlSheetData = {};

        spreadsheet.data.sheets.forEach(s => {
            urlSheetData[s.properties.title] = {
                editUrl: editUrl,
                exportUrl: `https://docs.google.com/spreadsheets/d/${newSheetId}/export?format=tsv&gid=${s.properties.sheetId}`
            };
        });

        // Probeer beide varianten: [projectName] en [projectName]-site
        let siteDir = path.resolve(ROOT, '../sites', projectName);
        if (!fs.existsSync(siteDir)) {
            const altSiteDir = path.resolve(ROOT, '../sites', `${projectName}-site`);
            if (fs.existsSync(altSiteDir)) {
                siteDir = altSiteDir;
            }
        }

        const projectSettingsDir = path.join(siteDir, 'project-settings');
        if (!fs.existsSync(projectSettingsDir)) fs.mkdirSync(projectSettingsDir, { recursive: true });

        fs.writeFileSync(
            path.join(projectSettingsDir, 'url-sheet.json'),
            JSON.stringify(urlSheetData, null, 2)
        );

        console.log(`🎉 Alles voltooid! Site is nu gekoppeld aan de nieuwe sheet.`);
        return { spreadsheetId: newSheetId, editUrl };

    } catch (error) {
        console.error("❌ Provisioning mislukt:", error.message);
        throw error;
    }
}

if (import.meta.url.endsWith(process.argv[1])) {
    const args = process.argv.slice(2);
    if (!args[0]) {
        console.error("❌ Gebruik: node auto-sheet-provisioner.js <projectnaam>");
        process.exit(1);
    }
    provisionSheet(args[0], args[1])
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}