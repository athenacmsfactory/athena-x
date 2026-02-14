import React from 'react';

/**
 * EditableText (v7.4.4)
 * Renders text with 'data-dock-bind' and applies persistent formatting.
 */
export default function EditableText({ tagName: Tag = 'span', value, children, cmsBind, table, field, id, className = "", style = {}, renderValue, ...props }) {
  const isDev = import.meta.env.DEV;

  const actualValue = value !== undefined ? value : children;

  // Normalize binding
  const binding = cmsBind || { file: table, key: field, index: id || 0 };
  const bindKey = binding.file && binding.key ? `${binding.file}:${binding.index || 0}:${binding.key}` : null;

  // Ophalen van stijlen uit de database
  const getBindingStyles = () => {
    if (!bindKey || typeof window === 'undefined' || !window.athenaStyles) return {};
    const formats = window.athenaStyles[bindKey] || {};
    const s = {};

    if (formats.bold) s.fontWeight = 'bold';
    if (formats.italic) s.fontStyle = 'italic';
    if (formats.fontSize) s.fontSize = formats.fontSize;
    if (formats.textAlign) s.textAlign = formats.textAlign;
    if (formats.fontFamily && formats.fontFamily !== 'inherit') s.fontFamily = formats.fontFamily;
    
    // De nieuwe Schaduw/Contour optie:
    if (formats.textShadow) {
        s.textShadow = '2px 1px 1px rgba(0, 0, 0, 1)';
    }

    return s;
  };

  const combinedStyles = { ...getBindingStyles(), ...style };

  // Generate binding string for Dock
  const dockBind = (isDev && binding.file) ? JSON.stringify({ 
    file: binding.file, 
    index: binding.index || 0, 
    key: binding.key 
  }) : null;

  const content = renderValue ? renderValue(actualValue) : (
    (typeof actualValue === 'object' && actualValue !== null && !React.isValidElement(actualValue)) 
      ? (actualValue.text || actualValue.title || actualValue.label || JSON.stringify(actualValue)) 
      : actualValue
  );

  if (!isDev) {
    return <Tag className={className} style={combinedStyles} {...props}>{content}</Tag>;
  }

  return (
    <Tag
      data-dock-bind={dockBind}
      data-dock-type="text"
      className={`${className} cursor-pointer hover:ring-2 hover:ring-blue-400/40 hover:bg-blue-50/5 rounded-sm transition-all duration-200`}
      style={combinedStyles}
      title={`Klik om "${binding.key}" te bewerken in de Dock`}
      {...props}
    >
      {content}
    </Tag>
  );
}