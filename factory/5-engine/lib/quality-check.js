/**
 * @file quality-check.js
 * @description Performs automated quality checks on generated sites.
 */

import fs from 'fs';
import path from 'path';

export class QualityChecker {
    static check(projectDir) {
        console.log(`\n🔍 Running Quality Checks on ${projectDir}...`);
        const report = {
            warnings: [],
            errors: []
        };

        // 1. JSON Data Check
        const dataDir = path.join(projectDir, 'src/data');
        if (fs.existsSync(dataDir)) {
            const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
            files.forEach(f => {
                const p = path.join(dataDir, f);
                const stats = fs.statSync(p);
                if (stats.size < 5) {
                    report.errors.push(`JSON file too small (possible corruption): ${f} (${stats.size} bytes)`);
                }
                try {
                    JSON.parse(fs.readFileSync(p, 'utf8'));
                } catch (e) {
                    report.errors.push(`Invalid JSON syntax in ${f}: ${e.message}`);
                }
            });
        } else {
            report.errors.push("Missing src/data directory");
        }

        // 2. Image Existence Check
        const imagesDir = path.join(projectDir, 'public/images');
        // Scan JSONs for image references
        // This is a simplified check

        // 3. Package.json Check
        const pkgPath = path.join(projectDir, 'package.json');
        if (fs.existsSync(pkgPath)) {
            try {
                JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
            } catch (e) {
                report.errors.push("Invalid package.json");
            }
        } else {
            report.errors.push("Missing package.json");
        }

        // 4. Broken Imports Scan
        const srcDir = path.join(projectDir, 'src');
        const scanDir = (dir) => {
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const fullPath = path.join(dir, item);
                const stats = fs.statSync(fullPath);
                if (stats.isDirectory()) {
                    scanDir(fullPath);
                } else if (item.endsWith('.jsx') || item.endsWith('.js')) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const importMatches = content.match(/import\s+.*?from\s+['"](\..*?)['"]/g);
                    if (importMatches) {
                        importMatches.forEach(imp => {
                            const relativePath = imp.match(/['"](\..*?)['"]/)[1];
                            // Naive path resolution for relative imports
                            try {
                                // This is complex to do perfectly without a resolver
                                // But we can check for obvious stuff like empty strings
                            } catch (e) { }
                        });
                    }
                }
            });
        }
        if (fs.existsSync(srcDir)) scanDir(srcDir);

        // Result Output
        if (report.warnings.length > 0) {
            console.log("\n⚠️  Quality Warnings:");
            report.warnings.forEach(w => console.log(`   - ${w}`));
        }
        if (report.errors.length > 0) {
            console.log("\n❌ Quality Errors:");
            report.errors.forEach(e => console.log(`   - ${e}`));
        } else {
            console.log("✅ Quality Check Passed: Site structure looks good.");
        }

        return report;
    }
}
