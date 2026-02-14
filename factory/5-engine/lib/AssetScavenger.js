import fs from 'fs';
import path from 'path';

export class AssetScavenger {
    constructor(projectDir, projectName) {
        this.projectDir = projectDir;
        this.projectName = projectName;
        this.dataDir = path.join(projectDir, 'src/data');
        this.imagesDest = path.join(projectDir, 'public/images');
        
        // Define source directories based on prompt
        this.sourceDirs = [
            path.resolve(projectDir, '../../input', projectName.replace('-site', ''), 'input'),
            path.resolve(projectDir, '../../input', projectName.replace('-site', ''), 'images'),
            path.resolve(projectDir, '../../inputsites')
        ];

        this.neededAssets = new Set();
        this.foundAssets = new Set(); // Assets found in source
        this.missingAssets = new Set();
        this.restoredAssets = [];
        
        // Indexes
        this.exactMatchIndex = new Map(); // filename -> fullPath
        this.fuzzyMatchIndex = new Map(); // basename -> [fullPath]
    }

    scavenge() {
        console.log(`🔍  Starting Asset Scavenger for ${this.projectName}...`);

        if (!fs.existsSync(this.dataDir)) {
            console.warn(`⚠️  Data directory not found: ${this.dataDir}`);
            return;
        }

        // 1. Find all asset references in JSON files
        this.findAssetsInJson();

        if (this.neededAssets.size === 0) {
            console.log(`ℹ️  No asset references found in JSON data.`);
            return;
        }

        console.log(`🔍  Found ${this.neededAssets.size} unique asset references in JSON.`);

        // 2. Index available files in source directories
        this.buildSourceIndex();

        // 3. Search and copy assets
        this.neededAssets.forEach(assetName => {
            this.findAndCopyAsset(assetName);
        });

        // 4. Log results
        this.logResults();
    }

    findAssetsInJson() {
        try {
            const files = fs.readdirSync(this.dataDir).filter(f => f.endsWith('.json'));
            
            for (const file of files) {
                const filePath = path.join(this.dataDir, file);
                try {
                    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    this.traverse(content);
                } catch (err) {
                    console.error(`❌  Error parsing JSON file ${file}:`, err.message);
                }
            }
        } catch (err) {
            console.error(`❌  Error reading data directory:`, err.message);
        }
    }

    traverse(obj) {
        if (!obj) return;

        if (Array.isArray(obj)) {
            obj.forEach(item => this.traverse(item));
        } else if (typeof obj === 'object') {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    this.traverse(obj[key]);
                }
            }
        } else if (typeof obj === 'string') {
            this.checkString(obj);
        }
    }

    checkString(str) {
        // Basic check for extensions
        // Supported: jpg, jpeg, png, gif, webp, svg, mp4, webm
        if (str.match(/\.(jpg|jpeg|png|gif|webp|svg|mp4|webm)$/i)) {
            // Ignore external URLs
            if (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('//')) {
                return;
            }

            // Extract filename (ignore paths like /images/hero.jpg -> hero.jpg)
            // We assume assets are flattened in public/images
            const filename = path.basename(str);
            this.neededAssets.add(filename);
        }
    }

    buildSourceIndex() {
        this.sourceDirs.forEach(dir => {
            if (fs.existsSync(dir)) {
                this.indexDirectory(dir);
            }
        });
        console.log(`📂  Indexed ${this.exactMatchIndex.size} source files.`);
    }

    indexDirectory(dir) {
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    this.indexDirectory(fullPath);
                } else if (entry.isFile()) {
                    // Only index likely media files to save memory/time
                    if (entry.name.match(/\.(jpg|jpeg|png|gif|webp|svg|mp4|webm)$/i)) {
                        // Exact match index
                        if (!this.exactMatchIndex.has(entry.name)) {
                             this.exactMatchIndex.set(entry.name, fullPath);
                        }
                        
                        // Fuzzy match index (basename)
                        const baseName = path.parse(entry.name).name.toLowerCase();
                        if (!this.fuzzyMatchIndex.has(baseName)) {
                            this.fuzzyMatchIndex.set(baseName, []);
                        }
                        this.fuzzyMatchIndex.get(baseName).push(fullPath);
                    }
                }
            }
        } catch (e) {
            console.warn(`⚠️  Could not read directory ${dir}: ${e.message}`);
        }
    }

    findAndCopyAsset(assetName) {
        // Ensure destination directory exists
        if (!fs.existsSync(this.imagesDest)) {
            fs.mkdirSync(this.imagesDest, { recursive: true });
        }

        const destPath = path.join(this.imagesDest, assetName);
        let sourcePath = null;
        let foundName = null;

        // 1. Try Exact Match
        if (this.exactMatchIndex.has(assetName)) {
            sourcePath = this.exactMatchIndex.get(assetName);
            foundName = assetName;
        } 
        // 2. Try Fuzzy Match (same basename, different extension)
        else {
            const baseName = path.parse(assetName).name.toLowerCase();
            if (this.fuzzyMatchIndex.has(baseName)) {
                const candidates = this.fuzzyMatchIndex.get(baseName);
                if (candidates.length > 0) {
                    sourcePath = candidates[0]; // Just take the first one found
                    foundName = path.basename(sourcePath);
                }
            }
        }

        if (sourcePath) {
            try {
                // If the found asset has a different extension, we copy it to the DESTINATION filename
                // This ensures the link in JSON (which points to assetName) works.
                // E.g. JSON wants "hero.jpg", we found "hero.png".
                // We copy "hero.png" content to "public/images/hero.jpg".
                // Browser will sniff content type.
                
                fs.copyFileSync(sourcePath, destPath);
                
                this.foundAssets.add(assetName);
                this.restoredAssets.push({
                    requested: assetName,
                    found: foundName,
                    source: sourcePath,
                    isFuzzy: assetName !== foundName
                });
            } catch (e) {
                console.error(`❌  Failed to copy ${sourcePath} to ${destPath}:`, e.message);
                this.missingAssets.add(assetName);
            }
        } else {
            this.missingAssets.add(assetName);
        }
    }

    logResults() {
        if (this.restoredAssets.length > 0) {
            console.log(`✅  Restored ${this.restoredAssets.length} assets.`);
            // Only log details for fuzzy matches or if verbose
            const fuzzy = this.restoredAssets.filter(a => a.isFuzzy);
            if (fuzzy.length > 0) {
                console.log(`   (Included ${fuzzy.length} fuzzy matches)`);
                fuzzy.forEach(a => console.log(`    - ${a.requested} -> found: ${a.found}`));
            }
        }

        if (this.missingAssets.size > 0) {
            console.warn(`⚠️  Missing ${this.missingAssets.size} assets:`);
            this.missingAssets.forEach(a => console.warn(`    - ${a}`));
        } else {
            console.log(`✨  All referenced assets are present.`);
        }
    }
}
