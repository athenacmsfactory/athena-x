import { deployProject } from './deploy-wizard.js';
import { loadEnv } from './env-loader.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
    await loadEnv(path.resolve(__dirname, '../.env'));
    console.log('Deploying chocolade-shop...');
    await deployProject('chocolade-shop', 'Initial deployment');
    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
