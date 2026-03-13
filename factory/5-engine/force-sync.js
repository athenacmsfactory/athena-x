import { AthenaDataManager } from './lib/DataManager.js';
import path from 'path';

async function forceSync() {
    const root = '/home/kareltestspecial/0-IT/2-Productie/athena-x/factory';
    const dm = new AthenaDataManager(root);

    console.log("🚀 STARTING FORCED SYNC TO GOOGLE SHEETS...");
    try {
        await dm.syncToSheet('de-salon-site');
        console.log("✅ SYNC SUCCESSFUL!");
    } catch (e) {
        console.error("❌ SYNC FAILED:", e.message);
    }
}

forceSync();
