import { describe, it, expect } from 'vitest';
import { ThemeEngine } from '../lib/theme-engine.js';

describe('ThemeEngine', () => {
    describe('getDefaults()', () => {
        it('should return a complete set of CSS variables', () => {
            const defaults = ThemeEngine.getDefaults();
            expect(defaults['--color-primary']).toBe('#0f172a');
            expect(defaults['--color-accent']).toBe('#3b82f6');
            expect(defaults['--font-sans']).toContain('Inter');
            expect(defaults['--radius-custom']).toBe('1rem');
        });
    });

    describe('generate()', () => {
        it('should return defaults when blueprint has no design_system', () => {
            const result = ThemeEngine.generate({ blueprint_name: 'test' });
            expect(result).toEqual(ThemeEngine.getDefaults());
        });

        it('should return defaults when blueprint is null', () => {
            const result = ThemeEngine.generate(null);
            expect(result).toEqual(ThemeEngine.getDefaults());
        });

        it('should map colors from design_system', () => {
            const blueprint = {
                design_system: {
                    colors: {
                        primary: '#1A1A2E',
                        accent: '#00C896',
                        background: '#F5F7FA'
                    }
                }
            };
            const result = ThemeEngine.generate(blueprint);
            expect(result['--color-primary']).toBe('#1A1A2E');
            expect(result['--color-accent']).toBe('#00C896');
            expect(result['--color-background']).toBe('#F5F7FA');
        });

        it('should derive heading from primary when heading is not set', () => {
            const blueprint = {
                design_system: {
                    colors: { primary: '#FF0000' }
                }
            };
            const result = ThemeEngine.generate(blueprint);
            expect(result['--color-heading']).toBe('#FF0000');
            expect(result['--color-title']).toBe('#FF0000');
        });

        it('should derive button_bg from accent when button_bg is not set', () => {
            const blueprint = {
                design_system: {
                    colors: { accent: '#00FF00' }
                }
            };
            const result = ThemeEngine.generate(blueprint);
            expect(result['--color-button-bg']).toBe('#00FF00');
        });

        it('should map fonts and radius', () => {
            const blueprint = {
                design_system: {
                    font_sans: 'Roboto, sans-serif',
                    font_serif: 'Lora, serif',
                    radius: '8px'
                }
            };
            const result = ThemeEngine.generate(blueprint);
            expect(result['--font-sans']).toBe('Roboto, sans-serif');
            expect(result['--font-serif']).toBe('Lora, serif');
            expect(result['--radius-custom']).toBe('8px');
        });

        it('should store typography_scale as metadata', () => {
            const blueprint = {
                design_system: {
                    typography_scale: { heading_xl: '3.5rem / 1.1' }
                }
            };
            const result = ThemeEngine.generate(blueprint);
            expect(result['_typography_scale']).toEqual({ heading_xl: '3.5rem / 1.1' });
        });

        it('should handle custom color keys gracefully', () => {
            const blueprint = {
                design_system: {
                    colors: { brand_gold: '#FFD700' }
                }
            };
            const result = ThemeEngine.generate(blueprint);
            expect(result['--color-brand_gold']).toBe('#FFD700');
        });
    });
});
