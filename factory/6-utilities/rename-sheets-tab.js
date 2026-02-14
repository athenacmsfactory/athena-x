import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Load env from factory/.env
dotenv.config({ path: path.join(ROOT, '.env') });

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.error("❌ Error: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REFRESH_TOKEN missing in .env");
    process.exit(1);
}

async function getAuthClient() {
    const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
    auth.setCredentials({ refresh_token: REFRESH_TOKEN });
    return auth;
}

async function renameSheetTab(spreadsheetId, oldName, newName) {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        // 1. Get spreadsheet metadata to find the sheetId for the old name
        const ss = await sheets.spreadsheets.get({ spreadsheetId });
        const targetSheet = ss.data.sheets.find(s => s.properties.title === oldName);

        if (!targetSheet) {
            console.log(`   ℹ️  Tab '${oldName}' not found in sheet ${spreadsheetId}. Skipping.`);
            return false;
        }

        const sheetId = targetSheet.properties.sheetId;

        // 2. Perform the rename
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
                requests: [{
                    updateSheetProperties: {
                        properties: {
                            sheetId: sheetId,
                            title: newName
                        },
                        fields: 'title'
                    }
                }]
            }
        });

        console.log(`   ✅ Successfully renamed '${oldName}' to '${newName}' in sheet ${spreadsheetId}`);
        return true;
    } catch (error) {
        console.error(`   ❌ Failed to rename in sheet ${spreadsheetId}:`, error.message);
        return false;
    }
}

async function run() {
    console.log("🚀 Starting Google Sheets Tab Rename Utility...");
    
    const sitesDir = path.resolve(ROOT, '../sites');
    if (!fs.existsSync(sitesDir)) {
        console.error("❌ Sites directory not found.");
        return;
    }

    const sites = fs.readdirSync(sitesDir).filter(f => fs.statSync(path.join(sitesDir, f)).isDirectory());
    const processedSheets = new Set();

    for (const site of sites) {
        const settingsPath = path.join(sitesDir, site, 'project-settings/url-sheet.json');
        if (!fs.existsSync(settingsPath)) continue;

        console.log(`\n📂 Processing site: ${site}`);
        try {
            const urlConfig = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            // Find any valid spreadsheet ID in the config
            const firstUrl = Object.values(urlConfig).find(v => v.editUrl)?.editUrl;
            const spreadsheetId = firstUrl?.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];

            if (spreadsheetId && !processedSheets.has(spreadsheetId)) {
                await renameSheetTab(spreadsheetId, 'basisgegevens', 'basis');
                processedSheets.add(spreadsheetId);
                
                // Also rename 'Basisgegevens' (case variant) just in case
                await renameSheetTab(spreadsheetId, 'Basisgegevens', 'basis');
            }
        } catch (e) {
            console.error(`   ⚠️  Error reading config for ${site}:`, e.message);
        }
    }

    console.log("\n✨ All operations complete.");
}

run();
