import { ComponentRegistry, getComponentForSection } from '../lib/component-registry.js';

/**
 * Genereert de inhoud voor Section.jsx op basis van de blueprint.
 * @param {Object} blueprint - Het schema.json object van het sitetype.
 * @param {string} editorStrategy - 'docked' of 'autonomous'.
 * @returns {string} - De gegenereerde code voor Section.jsx.
 */
export function generateSectionComponent(blueprint, editorStrategy = 'docked') {
  const sections = blueprint.data_structure.map(t => t.table_name);
  const usedComponents = new Set();

  // Decide which components are needed
  sections.forEach(sec => {
    const comp = getComponentForSection(sec);
    if (comp) usedComponents.add(comp);
  });

  const imports = Array.from(usedComponents).map(c => `import ${c.name} from '${c.path}';`).join('\n');
  const features = JSON.stringify(blueprint.features || {});

  return `
import React, { useEffect } from 'react';
${imports}
import { useCart } from './CartContext'; 

const Section = ({ data }) => {
  const sectionOrder = data.section_order || [];
  const layoutSettings = data.layout_settings || {};

  useEffect(() => {
    if (window.athenaScan) {
      window.athenaScan(data);
    }
  }, [data, sectionOrder]);

  const getComponent = (sectionName) => {
      const lower = sectionName.toLowerCase();
      const layout = layoutSettings[sectionName] || 'list';

      // Mapping Logic (Synced with Registry)
      if (lower === 'basis' || lower === 'basisgegevens') return Hero;
      if (lower.includes('testimonial') || lower.includes('review') || lower.includes('ervaring')) return Testimonials;
      if (lower.includes('team') || lower.includes('medewerker') || lower.includes('wie_zijn_wij')) return Team;
      if (lower.includes('faq') || lower.includes('vragen')) return FAQ;
      if (lower.includes('cta') || lower.includes('banner') || lower.includes('actie')) return CTA;
      if (lower.includes('product') || lower.includes('shop')) return ProductGrid;
      
      return GenericSection;
  };

  return (
    <div className="flex flex-col">
      {sectionOrder.map((sectionName, idx) => {
        const items = data[sectionName] || [];
        if (items.length === 0) return null;
        
        const Component = getComponent(sectionName);
        const layout = layoutSettings[sectionName] || 'list';
        const sectionSettings = data.section_settings?.[sectionName] || {};
        const sectionBgColor = sectionSettings.backgroundColor || null;
        const sectionStyle = sectionBgColor ? { backgroundColor: sectionBgColor } : {};

        return (
            <Component 
                key={idx} 
                sectionName={sectionName} 
                data={items} 
                layout={layout}
                style={sectionStyle}
                features={${features}} 
            />
        );
      })}
    </div>
  );
};

export default Section;
  `.trim();
}
