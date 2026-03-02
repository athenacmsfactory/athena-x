import fs from 'fs';
import path from 'path';

const SITES_DIR = './sites';
const results = [];

const sites = fs.readdirSync(SITES_DIR).filter(f => 
    fs.statSync(path.join(SITES_DIR, f)).isDirectory() && !f.startsWith('.')
);

console.log(`🔍 Start automatische audit van ${sites.length} sites...`);

for (const site of sites) {
    const sitePath = path.join(SITES_DIR, site);
    const issues = [];
    
    // 1. Check index.html
    if (!fs.existsSync(path.join(sitePath, 'index.html'))) {
        issues.push("Missing index.html");
    }
    
    // 2. Check Data
    const dataDir = path.join(sitePath, 'src/data');
    if (!fs.existsSync(dataDir)) {
        issues.push("Missing src/data directory");
    } else {
        const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
        if (jsonFiles.length === 0) issues.push("No data JSON files found");
        
        for (const file of jsonFiles) {
            const content = fs.readFileSync(path.join(dataDir, file), 'utf8').trim();
            if (content === '[]' || content === '{}' || content === '') {
                if (file === 'basis.json') issues.push("basis.json is empty");
            }
        }
    }
    
    // 3. Check for node_modules
    if (!fs.existsSync(path.join(sitePath, 'node_modules'))) {
        issues.push("node_modules not installed");
    }

    results.push({
        site,
        status: issues.length === 0 ? '✅ OK' : '❌ ISSUE',
        issues
    });
}

const report = results.map(r => `${r.status} ${r.site.padEnd(40)} ${r.issues.join(', ')}`).join('\n');
fs.writeFileSync('output/SITES_AUDIT_REPORT.md', `# Athena Sites Audit Report\n\n${new Date().toLocaleString()}\n\n\`\`\`text\n${report}\n\`\`\``);

console.log(`✅ Audit voltooid. Rapport opgeslagen in output/SITES_AUDIT_REPORT.md`);
console.log(report);
