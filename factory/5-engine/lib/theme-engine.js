/**
 * @file theme-engine.js
 * @description Generates style_config.json from blueprint design_system.
 * Maps design_system tokens to CSS custom properties.
 */

const DEFAULT_THEME = {
    '--color-primary': '#0f172a',
    '--color-secondary': '#64748b',
    '--color-accent': '#3b82f6',
    '--color-button-bg': '#3b82f6',
    '--color-card-bg': '#ffffff',
    '--color-header-bg': '#ffffff',
    '--color-background': '#ffffff',
    '--color-surface': '#f8fafc',
    '--color-text': '#1e293b',
    '--color-heading': '#0f172a',
    '--color-title': '#0f172a',
    '--font-sans': "'Inter', ui-sans-serif, system-ui, sans-serif",
    '--font-serif': "'Playfair Display', ui-serif, Georgia, serif",
    '--radius-custom': '1rem',
    '--shadow-main': '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
};

/**
 * Color key mapping: design_system.colors.X → CSS variable
 */
const COLOR_MAP = {
    primary: '--color-primary',
    secondary: '--color-secondary',
    accent: '--color-accent',
    background: '--color-background',
    surface: '--color-surface',
    text: '--color-text',
    heading: '--color-heading',
    title: '--color-title',
    button_bg: '--color-button-bg',
    card_bg: '--color-card-bg',
    header_bg: '--color-header-bg',
    success: '--color-success',
    warning: '--color-warning',
    error: '--color-error'
};

export class ThemeEngine {

    /**
     * Returns sensible defaults matching modern.css for blueprints without design_system.
     * @returns {Object} CSS variable map
     */
    static getDefaults() {
        return { ...DEFAULT_THEME };
    }

    /**
     * Generates a style_config.json object from a blueprint's design_system.
     * @param {Object} blueprint - The full blueprint object.
     * @returns {Object} CSS variable map ready for style_config.json
     */
    static generate(blueprint) {
        const ds = blueprint?.design_system;
        if (!ds) return ThemeEngine.getDefaults();

        const config = { ...DEFAULT_THEME };

        // Map colors
        if (ds.colors && typeof ds.colors === 'object') {
            for (const [key, value] of Object.entries(ds.colors)) {
                const cssVar = COLOR_MAP[key];
                if (cssVar) {
                    config[cssVar] = value;
                } else {
                    // Custom color → --color-{key}
                    config[`--color-${key}`] = value;
                }
            }

            // Derive missing variables from provided colors
            if (ds.colors.primary && !ds.colors.heading) config['--color-heading'] = ds.colors.primary;
            if (ds.colors.primary && !ds.colors.title) config['--color-title'] = ds.colors.primary;
            if (ds.colors.accent && !ds.colors.button_bg) config['--color-button-bg'] = ds.colors.accent;
        }

        // Map typography
        if (ds.font_sans) config['--font-sans'] = ds.font_sans;
        if (ds.font_serif) config['--font-serif'] = ds.font_serif;

        // Map radius
        if (ds.radius) config['--radius-custom'] = ds.radius;

        // Store typography scale as metadata (useful for components)
        if (ds.typography_scale) {
            config['_typography_scale'] = ds.typography_scale;
        }

        return config;
    }
}
