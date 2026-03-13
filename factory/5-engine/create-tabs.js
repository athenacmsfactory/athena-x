import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

async function createTabs() {
    const root = '/home/kareltestspecial/0-IT/2-Productie/athena-x/factory';
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(root, 'service-account.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1HrOUhMWGmY2A_eqsyMmBid1ChWNxtVA9TBwFPVNLxPk';

    console.log("🛠️ CREATING MISSING TABS...");

    try {
        const meta = await sheets.spreadsheets.get({ spreadsheetId });
        const existingTabs = meta.data.sheets.map(s => s.properties.title);

        const tabsToCreate = ['style_bindings'];
        const requests = [];

        for (const tab of tabsToCreate) {
            if (!existingTabs.includes(tab)) {
                console.log(`- Adding tab: ${tab}`);
                requests.push({
                    addSheet: {
                        properties: {
                            title: tab,
                            hidden: true
                        }
                    }
                });
            } else {
                console.log(`- Tab already exists: ${tab}`);
            }
        }

        if (requests.length > 0) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: { requests }
            });
            console.log("✅ TABS CREATED SUCCESSFULLY!");
        } else {
            console.log("ℹ️ NO NEW TABS NEEDED.");
        }
    } catch (e) {
        console.error("❌ FAILED TO CREATE TABS:", e.message);
    }
}

createTabs();
