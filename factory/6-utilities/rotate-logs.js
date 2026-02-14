import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_DIR = path.resolve(__dirname, '../output/logs');

const MAX_LOGS = 10;
const MAX_SIZE_MB = 5;

export function rotateLogs() {
    if (!fs.existsSync(LOG_DIR)) return;

    const files = fs.readdirSync(LOG_DIR);
    
    // 1. Truncate files that are too large
    files.forEach(file => {
        const filePath = path.join(LOG_DIR, file);
        try {
            const stats = fs.statSync(filePath);
            const fileSizeMB = stats.size / (1024 * 1024);
            
            if (fileSizeMB > MAX_SIZE_MB) {
                console.log(`✂️ Truncating oversized log (${fileSizeMB.toFixed(2)}MB): ${file}`);
                // Keep the last 100KB of the file instead of just emptying it
                const buffer = Buffer.alloc(1024 * 100);
                const fd = fs.openSync(filePath, 'r+');
                const startPos = Math.max(0, stats.size - buffer.length);
                fs.readSync(fd, buffer, 0, buffer.length, startPos);
                fs.closeSync(fd);
                fs.writeFileSync(filePath, "--- [TRUNCATED DUE TO SIZE] ---\n" + buffer.toString());
            }
        } catch (err) {
            console.error(`❌ Size check failed for ${file}:`, err.message);
        }
    });

    // 2. Categorize files for deletion logic
    const categories = {
        dock: [],
        site: [],
        dashboard: []
    };

    files.forEach(file => {
        if (file.includes('dock_launch')) categories.dock.push(file);
        else if (file.includes('site_launch')) categories.site.push(file);
        else if (file.includes('dashboard')) categories.dashboard.push(file);
    });

    // For each category, sort by name (which starts with timestamp) and remove old ones
    Object.keys(categories).forEach(cat => {
        const catFiles = categories[cat].sort(); // Default sort works for YYYY-MM-DD
        if (catFiles.length > MAX_LOGS) {
            const toDelete = catFiles.slice(0, catFiles.length - MAX_LOGS);
            toDelete.forEach(file => {
                try {
                    fs.unlinkSync(path.join(LOG_DIR, file));
                    console.log(`🗑️ Deleted old log: ${file}`);
                } catch (err) {
                    console.error(`❌ Failed to delete ${file}:`, err.message);
                }
            });
        }
    });
}

// Run if called directly
if (process.argv[1] === __filename) {
    rotateLogs();
}
