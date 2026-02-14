import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const siteName = args[0] || 'de-salon-site';
const projectName = args[1] || 'de-salon';
const siteType = args[2] || 'de-salon-type';
const track = args[3] || 'docked';

console.log("==================================================");
console.log("📤 Athena CMS - Full Export Pipeline (Site -> Sheets)");
console.log("==================================================");
console.log(`📝 Site      : ${siteName}`);
console.log(`📂 Project   : ${projectName}`);
console.log(`🏗️  Sitetype  : ${siteType}`);
console.log("==================================================\n");

const root = path.resolve(__dirname, '..');

try {
    // 1. Sync Site JSON naar Input JSON
    console.log("🚀 Stap 1: Gegevens ophalen van de website...");
    execSync(`"${process.execPath}" "5-engine/sync-site-to-input.js" "${siteName}" "${projectName}"`, { cwd: root, stdio: 'inherit' });

    // 2. Convert Input JSON naar TSV
    console.log("\n🚀 Stap 2: Gegevens converteren naar TSV (Sheets-vriendelijk)...");
    execSync(`"${process.execPath}" "5-engine/sync-json-to-tsv.js" "${projectName}" "${siteType}" "${track}"`, { cwd: root, stdio: 'inherit' });

    console.log("\n==================================================");
    console.log("✨ SUCCES: De export pipeline is voltooid!");
    console.log(`📂 De TSV bestanden staan klaar in: input/${projectName}/tsv-data/`);
    console.log("👉 Je kunt deze nu kopiëren naar je Google Sheet.");
    console.log("==================================================");
    
    process.exit(0);
} catch (error) {
    console.error("\n❌ Fout tijdens de export pipeline:", error.message);
    process.exit(1);
}
