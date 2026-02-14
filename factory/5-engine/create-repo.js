import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
const envPath = path.join(__dirname, '../.env');
const env = fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(line => line.includes('=') && !line.startsWith('#'))
    .reduce((acc, line) => {
        const [key, ...value] = line.split('=');
        acc[key.trim()] = value.join('=').trim();
        return acc;
    }, {});

async function createRepo(name) {
    const token = env.GITHUB_PAT;
    const org = env.GITHUB_ORG || env.GITHUB_USER;

    if (!token) {
        console.error("❌ GITHUB_PAT niet gevonden in .env");
        process.exit(1);
    }

    console.log(`🚀 Repository '${name}' aanmaken in org '${org}'...`);

    const data = {
        name: name,
        description: `Athena CMS Site: ${name}`,
        private: false,
        has_issues: true,
        has_projects: true,
        has_wiki: true
    };

    try {
        const response = await fetch(`https://api.github.com/orgs/${org}/repos`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${token}`,
                'X-GitHub-Api-Version': '2022-11-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.status === 201) {
            console.log(`✅ Repository succesvol aangemaakt!`);
            const repoData = await response.json();
            console.log(`🔗 URL: ${repoData.html_url}`);

            // Enable GitHub Pages
            console.log(`📡 GitHub Pages inschakelen...`);
            const pagesResponse = await fetch(`https://api.github.com/repos/${org}/${name}/pages`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'Authorization': `Bearer ${token}`,
                    'X-GitHub-Api-Version': '2022-11-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    source: {
                        branch: 'gh-pages' // peaceiris/actions-gh-pages uses gh-pages by default
                    }
                })
            });

            if (pagesResponse.status === 201) {
                console.log(`✅ GitHub Pages ingeschakeld (branch: gh-pages)`);
            } else {
                const pagesError = await pagesResponse.json();
                console.log(`⚠️  Kon GitHub Pages niet direct inschakelen: ${pagesError.message}`);
                console.log(`   (Dit kan vaak pas NA de eerste push via de Actions tab)`);
            }

        } else if (response.status === 422) {
            console.log(`⚠️  Repository bestaat mogelijk al of er is een validatiefout.`);
            const errData = await response.json();
            console.log(`   Fout: ${errData.message}`);
        } else {
            console.error(`❌ Fout bij aanmaken repo: ${response.status}`);
            const errData = await response.json();
            console.error(errData);
        }
    } catch (error) {
        console.error(`❌ Fout: ${error.message}`);
    }
}

const repoName = process.argv[2];
if (!repoName) {
    console.error("❌ Gebruik: node create-repo.js <repo-naam>");
    process.exit(1);
}

createRepo(repoName);
