import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

async function deepCleanServiceAccount() {
    console.log("🧹 Start DEEP Service Account Cleaning (including Trash)...");

    let saPath = path.join(root, 'sheet-service-account.json');
    if (!fs.existsSync(saPath)) saPath = path.join(root, 'service-account.json');
    
    if (!fs.existsSync(saPath)) {
        console.error("❌ Geen service-account.json gevonden.");
        return;
    }

    const auth = new google.auth.GoogleAuth({
        keyFile: saPath,
        scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    try {
        // 1. Zoek ALLE bestanden die de robot bezit (ook in prullenbak)
        const res = await drive.files.list({
            q: "'me' in owners",
            fields: 'files(id, name, trashed)',
            pageSize: 1000
        });

        const files = res.data.files;
        
        if (!files || files.length === 0) {
            console.log("✅ De robot bezit momenteel geen bestanden.");
        } else {
            console.log(`🗑️  ${files.length} bestanden gevonden. Start definitieve verwijdering...`);
            for (const file of files) {
                try {
                    await drive.files.delete({ fileId: file.id });
                    console.log(`   - Definitief gewist: ${file.name} (ID: ${file.id})`);
                } catch (err) {
                    console.error(`   ❌ Kon ${file.name} niet wissen: ${err.message}`);
                }
            }
        }

        // 2. Leeg de prullenbak voor de zekerheid
        console.log("🚮 Prullenbak geforceerd legen...");
        await drive.files.emptyTrash();
        
        // 3. Check Quotum status
        const about = await drive.about.get({ fields: 'storageQuota' });
        const quota = about.data.storageQuota;
        console.log("\n📊 Quotum Status voor Robot:");
        console.log(`   Limiet: ${(quota.limit / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Gebruikt: ${(quota.usage / 1024 / 1024).toFixed(2)} MB`);

    } catch (error) {
        console.error("❌ Fout tijdens deep clean:", error.message);
    }
}

deepCleanServiceAccount();