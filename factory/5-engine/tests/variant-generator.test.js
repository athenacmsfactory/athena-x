import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import functions to test
import {
    getAvailableThemes,
    detectCurrentTheme,
    generateVariantName,
    parseThemeColors,
    createVariant,
    generateVariants
} from '../variant-generator.js';

describe('variant-generator.js', () => {

    describe('getAvailableThemes()', () => {
        it('should return an array of theme names', () => {
            const themes = getAvailableThemes();
            expect(Array.isArray(themes)).toBe(true);
            expect(themes.length).toBeGreaterThan(0);
        });

        it('should include known themes', () => {
            const themes = getAvailableThemes();
            expect(themes).toContain('modern');
            expect(themes).toContain('bold');
            expect(themes).toContain('warm');
            expect(themes).toContain('classic');
            expect(themes).toContain('corporate');
            expect(themes).toContain('modern-dark');
        });

        it('should not include .css extensions', () => {
            const themes = getAvailableThemes();
            themes.forEach(t => {
                expect(t).not.toMatch(/\.css$/);
            });
        });
    });

    describe('detectCurrentTheme()', () => {
        const tmpDir = path.join(__dirname, '__tmp_detect_theme');

        beforeEach(() => {
            fs.mkdirSync(path.join(tmpDir, 'src/css'), { recursive: true });
        });

        afterEach(() => {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        });

        it('should detect theme from index.css @import', () => {
            fs.writeFileSync(
                path.join(tmpDir, 'src/index.css'),
                '@import "tailwindcss";\n@import "./css/bold.css";'
            );
            expect(detectCurrentTheme(tmpDir)).toBe('bold');
        });

        it('should detect theme from main.jsx import', () => {
            fs.writeFileSync(
                path.join(tmpDir, 'src/main.jsx'),
                "import React from 'react';\nimport './css/warm.css';\n"
            );
            expect(detectCurrentTheme(tmpDir)).toBe('warm');
        });

        it('should detect theme from athena-config.json as fallback', () => {
            fs.writeFileSync(
                path.join(tmpDir, 'athena-config.json'),
                JSON.stringify({ styleName: 'corporate.css' })
            );
            expect(detectCurrentTheme(tmpDir)).toBe('corporate');
        });

        it('should return null if no theme is detected', () => {
            expect(detectCurrentTheme(tmpDir)).toBeNull();
        });
    });

    describe('generateVariantName()', () => {
        it('should append theme to base name', () => {
            expect(generateVariantName('demo-bakkerij', 'bold')).toBe('demo-bakkerij-bold');
        });

        it('should strip existing theme suffix to avoid double-theming', () => {
            expect(generateVariantName('demo-bakkerij-modern', 'bold')).toBe('demo-bakkerij-bold');
        });

        it('should handle names without existing theme suffix', () => {
            expect(generateVariantName('my-site', 'warm')).toBe('my-site-warm');
        });
    });

    describe('parseThemeColors()', () => {
        const tmpDir = path.join(__dirname, '__tmp_parse_colors');

        beforeEach(() => {
            fs.mkdirSync(tmpDir, { recursive: true });
        });

        afterEach(() => {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        });

        it('should parse CSS variables from @theme block', () => {
            const css = `@theme {\n  --color-primary: #FF0000;\n  --color-accent: #00FF00;\n}`;
            const tmpFile = path.join(tmpDir, 'test.css');
            fs.writeFileSync(tmpFile, css);

            const vars = parseThemeColors(tmpFile);
            expect(vars['--color-primary']).toBe('#FF0000');
            expect(vars['--color-accent']).toBe('#00FF00');
        });

        it('should parse CSS variables from :root block', () => {
            const css = `:root {\n  --color-background: #ffffff;\n  --color-text: #000000;\n}`;
            const tmpFile = path.join(tmpDir, 'test.css');
            fs.writeFileSync(tmpFile, css);

            const vars = parseThemeColors(tmpFile);
            expect(vars['--color-background']).toBe('#ffffff');
            expect(vars['--color-text']).toBe('#000000');
        });

        it('should return empty object for non-existent file', () => {
            const vars = parseThemeColors('/tmp/nonexistent.css');
            expect(vars).toEqual({});
        });

        it('should handle multiple blocks', () => {
            const css = `@theme {\n  --color-primary: #111;\n}\n:root {\n  --color-primary: #222;\n  --color-secondary: #333;\n}`;
            const tmpFile = path.join(tmpDir, 'multi.css');
            fs.writeFileSync(tmpFile, css);

            const vars = parseThemeColors(tmpFile);
            // :root should overwrite @theme value
            expect(vars['--color-primary']).toBe('#222');
            expect(vars['--color-secondary']).toBe('#333');
        });
    });

    describe('createVariant() - dry run', () => {
        it('should return dry run result without creating files', () => {
            const sitesDir = path.resolve(__dirname, '../../../sites');
            const existingSites = fs.readdirSync(sitesDir).filter(f => {
                return fs.statSync(path.join(sitesDir, f)).isDirectory();
            });

            if (existingSites.length > 0) {
                const sourceSite = path.join(sitesDir, existingSites[0]);
                const result = createVariant(sourceSite, 'bold', { dryRun: true });
                expect(result.dryRun).toBe(true);
                expect(result.created).toBe(false);
                expect(result.variantName).toContain('bold');
            }
        });
    });

    describe('generateVariants() - dry run', () => {
        it('should return empty array for non-existent site', () => {
            const results = generateVariants('nonexistent-site-xyz-123');
            expect(results).toEqual([]);
        });

        it('should return dry run results for existing site', () => {
            const sitesDir = path.resolve(__dirname, '../../../sites');
            const existingSites = fs.readdirSync(sitesDir).filter(f => {
                return fs.statSync(path.join(sitesDir, f)).isDirectory();
            });

            if (existingSites.length > 0) {
                const results = generateVariants(existingSites[0], { dryRun: true });
                expect(results.length).toBeGreaterThan(0);
                results.forEach(r => {
                    expect(r.dryRun).toBe(true);
                    expect(r.created).toBe(false);
                });
            }
        });
    });
});
