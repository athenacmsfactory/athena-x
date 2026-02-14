/**
 * @file component-registry.js
 * @description Maps layout types to React components.
 */

export const ComponentRegistry = {
    'hero': { name: 'Hero', path: './components/Hero' },
    'testimonials': { name: 'Testimonials', path: './components/Testimonials' },
    'team': { name: 'Team', path: './components/Team' },
    'faq': { name: 'FAQ', path: './components/FAQ' },
    'cta': { name: 'CTA', path: './components/CTA' },
    'product': { name: 'ProductGrid', path: './components/ProductGrid' },
    'grid': { name: 'GenericSection', path: './components/GenericSection' },
    'list': { name: 'GenericSection', path: './components/GenericSection' }
};

export function getComponentForSection(sectionName) {
    const lower = sectionName.toLowerCase();

    if (lower === 'basis' || lower === 'basisgegevens') return ComponentRegistry['hero'];
    if (lower.includes('testimonial') || lower.includes('review') || lower.includes('ervaring')) return ComponentRegistry['testimonials'];
    if (lower.includes('team') || lower.includes('medewerker') || lower.includes('wie_zijn_wij')) return ComponentRegistry['team'];
    if (lower.includes('faq') || lower.includes('vragen')) return ComponentRegistry['faq'];
    if (lower.includes('cta') || lower.includes('banner') || lower.includes('actie')) return ComponentRegistry['cta'];
    if (lower.includes('product') || lower.includes('shop')) return ComponentRegistry['product'];

    return ComponentRegistry['list']; // Default
}
