import fs from 'fs';
import path from 'path';

const pagesDir = 'sites/fpc-gent-site/public/data/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.json'));

const types = {};

files.forEach(file => {
    try {
        const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
        const json = JSON.parse(content);
        if (json.content && json.content.sections) {
            json.content.sections.forEach(sec => {
                const t = sec.type;
                types[t] = (types[t] || 0) + 1;
            });
        }
    } catch (e) {
        console.error(`Error reading ${file}:`, e.message);
    }
});

console.log("Section Types Found:");
console.table(types);
