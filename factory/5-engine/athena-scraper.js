/**
 * @file athena-scraper.js
 * @description Scrapt tekst van een lijst met URL's OF een volledig domein via sitemap detectie.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

// FORCEER SSL ACCEPTATIE (Nodig voor sommige servers met incomplete chains)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper voor XML parsing (simpel via regex voor snelheid en robuustheid)
function extractUrlsFromXml(xml) {
    const urls = [];
    const locRegex = /<loc>(.*?)<\/loc>/g;
    let match;
    while ((match = locRegex.exec(xml)) !== null) {
        urls.push(match[1].trim());
    }
    return urls;
}

// Recursieve functie om sitemaps uit te pluizen
async function crawlSitemap(url, visited = new Set()) {
    if (visited.has(url)) return [];
    visited.add(url);

    console.log(`🗺️  Analyseren sitemap: ${url}`);
    
    try {
        const response = await fetch(url, { 
            signal: AbortSignal.timeout(10000),
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
            }
        });
        if (!response.ok) {
            console.warn(`   ⚠️ Kon sitemap niet lezen: ${response.status}`);
            return [];
        }
        
        const xml = await response.text();
        const locations = extractUrlsFromXml(xml);
        let allPages = [];

        for (const loc of locations) {
            // Check of dit een geneste sitemap is (vaak .xml)
            if (loc.endsWith('.xml')) {
                const subPages = await crawlSitemap(loc, visited);
                allPages = allPages.concat(subPages);
            } else {
                // Het is een gewone pagina
                // Filter binaries eruit
                if (!loc.match(/\.(jpg|jpeg|png|gif|pdf|zip|css|js|json)$/i)) {
                    allPages.push(loc);
                }
            }
        }
        return allPages;

    } catch (err) {
        console.warn(`   ⚠️ Fout bij verwerken sitemap ${url}: ${err.message}`);
        return [];
    }
}

async function scrapeUrls() {
    const [projectName, inputSource] = process.argv.slice(2);
    
    if (!projectName || !inputSource) {
        console.error('❌ Gebruik: node 5-engine/athena-scraper.js <project-naam> <input-file-OF-url>');
        process.exit(1);
    }

    const root = path.resolve(__dirname, '..');
    // Output pad is altijd hetzelfde
    const outputDir = path.join(root, '../input', projectName, 'input');
    const outputPath = path.join(outputDir, 'scraped-content.txt');

    // Zorg dat output dir bestaat
    await fs.mkdir(outputDir, { recursive: true });

    let urlsToScrape = [];

    try {
        // STAP 1: Bepaal de bron (Bestand of URL)
        if (inputSource.startsWith('http')) {
            console.log(`🌍 URL gedetecteerd. Start Auto-Discovery op: ${inputSource}`);
            
            // Probeer standaard sitemap locaties als de URL geen .xml is
            let entryPoints = [];
            if (inputSource.endsWith('.xml')) {
                entryPoints.push(inputSource);
            } else {
                // Strip trailing slash
                const baseUrl = inputSource.replace(/\/$/, '');
                entryPoints.push(`${baseUrl}/sitemap_index.xml`);
                entryPoints.push(`${baseUrl}/sitemap.xml`);
                entryPoints.push(`${baseUrl}/wp-sitemap.xml`); // WordPress 5.5+ default
            }

            console.log(`🔍 Zoeken naar sitemaps...`);
            let foundPages = new Set();
            
            for (const entry of entryPoints) {
                const pages = await crawlSitemap(entry);
                if (pages.length > 0) {
                    pages.forEach(p => foundPages.add(p));
                }
            }

            urlsToScrape = Array.from(foundPages);
            
            if (urlsToScrape.length === 0) {
                 console.log("⚠️ Geen sitemaps gevonden. Scraping alleen de hoofdpagina.");
                 urlsToScrape = [inputSource];
            } else {
                console.log(`✅ ${urlsToScrape.length} unieke pagina's gevonden via sitemaps.`);
            }

        } else {
            const inputPath = path.join(outputDir, inputSource);
            console.log(`📄 Lezen van bronbestand: ${inputPath}`);
            const rawContent = await fs.readFile(inputPath, 'utf8');
            urlsToScrape = rawContent.split('\n')
                .map(u => u.trim())
                .filter(u => u.startsWith('http'));
        }

        if (urlsToScrape.length === 0) {
            throw new Error("Geen URL's om te verwerken.");
        }

        // STAP 2: Het daadwerkelijke scrapen
        console.log(`🚀 Start met scrapen van ${urlsToScrape.length} pagina's...`);
        let finalBuffer = `ATHENA SCRAPE RESULTAAT - PROJECT: ${projectName}\n`;
        finalBuffer += `BRON: ${inputSource}\n`;
        finalBuffer += `DATUM: ${new Date().toLocaleString()}\n`;
        finalBuffer += `==========================================\n\n`;

        let successCount = 0;

        for (const [index, url] of urlsToScrape.entries()) {
            const progress = `[${index + 1}/${urlsToScrape.length}]`;
            process.stdout.write(`${progress} 🔗 Ophalen: ${url}... `);
            
            try {
                const response = await fetch(url, { 
                    signal: AbortSignal.timeout(15000),
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
                    }
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const html = await response.text();
                const dom = new JSDOM(html);
                const doc = dom.window.document;

                // 1. LINKS BEWAREN (Marker toevoegen vòór we de HTML strippen)
                doc.querySelectorAll('a').forEach(a => {
                    const href = a.getAttribute('href');
                    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                        try {
                            const absoluteHref = new URL(href, url).href;
                            a.textContent = ` [LINK: ${absoluteHref}] ${a.textContent} [/LINK] `;
                        } catch(e) {}
                    }
                });

                // 2. MEDIA DETECTIE (Generiek & Gefilterd)
                const images = new Set();
                const imageExtensions = /\.(jpg|jpeg|png|webp|avif|svg|gif)(\?.*)?$/i;

                doc.querySelectorAll('img').forEach(img => {
                    const attrs = ['src', 'data-src', 'data-lazy-src', 'data-original'];
                    for (const attr of attrs) {
                        const val = img.getAttribute(attr);
                        if (val && !val.startsWith('data:') && imageExtensions.test(val)) {
                            try { images.add(new URL(val, url).href); } catch(e) {}
                        }
                    }
                });

                doc.querySelectorAll('[style*="url"]').forEach(el => {
                    const style = el.getAttribute('style');
                    const urlMatches = style.match(/url\(['"]?(.*?)['"]?\)/g);
                    if (urlMatches) {
                        urlMatches.forEach(m => {
                            const match = m.match(/url\(['"]?(.*?)['"]?\)/);
                            if (match && match[1] && !match[1].startsWith('data:') && imageExtensions.test(match[1])) {
                                try { images.add(new URL(match[1], url).href); } catch(e) {}
                            }
                        });
                    }
                });

                let logoUrl = null;
                const logoSelectors = ['header img', '[id*="logo"] img', '[class*="logo"] img', 'img[src*="logo"]'];
                for (const selector of logoSelectors) {
                    const el = doc.querySelector(selector);
                    if (el) {
                        const lSrc = el.getAttribute('src') || el.getAttribute('data-src');
                        if (lSrc && imageExtensions.test(lSrc)) {
                            try { logoUrl = new URL(lSrc, url).href; } catch(e) {}
                            break;
                        }
                    }
                }

                // 3. TEKST EXTRAHEREN
                const noise = doc.querySelectorAll('script, style, nav, footer, header, noscript, iframe, svg, button, form');
                noise.forEach(el => el.remove());

                const text = doc.body.textContent.replace(/\s+/g, ' ').trim();
                const imageList = Array.from(images);

                if (text.length > 50) { 
                    finalBuffer += `--- SOURCE: ${url} ---\n`;
                    if (logoUrl) finalBuffer += `[LOGO: ${logoUrl}]\n`;
                    finalBuffer += `${text}\n`;
                    if (imageList.length > 0) {
                        finalBuffer += `[IMAGES: ${imageList.join(', ')}]\n`;
                    }
                    finalBuffer += `\n`;
                    console.log(`✅ OK (${text.length} chars, ${imageList.length} imgs${logoUrl ? ', logo found' : ''})`);
                    successCount++;
                }

            } catch (err) {
                console.log(`❌ Fout: ${err.message}`);
                finalBuffer += `--- SOURCE: ${url} (FOUT: ${err.message}) ---\n\n`;
            }
        }

        await fs.writeFile(outputPath, finalBuffer, 'utf8');
        console.log(`\n✨ KLAAR! ${successCount} pagina's succesvol gescraped.`);
        console.log(`📂 Opgeslagen in: ${outputPath}`);

    } catch (error) {
        console.error(`\n❌ CRITIQUE FOUT: ${error.message}`);
        process.exit(1);
    }
}

scrapeUrls();