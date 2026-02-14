import React from 'react';
import { useDisplayConfig } from './DisplayConfigContext';

/**
 * EditableText (Passive Wrapper for Docked Track)
 * Renders text with 'data-dock-bind' for Athena Dock.
 * Inline editing is disabled in favor of the Dock's specialized Modal editor.
 */
export default function EditableText({ tagName: Tag = 'span', value, children, cmsBind, table, field, id, className = "", style = {}, renderValue, ...props }) {
  const isDev = import.meta.env.DEV;
  const { isFieldVisible } = useDisplayConfig();

  const actualValue = value !== undefined ? value : children;

  // Normalize binding
  const binding = cmsBind || { file: table, key: field, index: id || 0 };

  // Check visibility
  if (!isFieldVisible(binding.file, binding.key)) {
    return null;
  }

  // Load formatting from style_bindings if available
  const [styleOverrides, setStyleOverrides] = React.useState({});
  
  React.useEffect(() => {
    if (!isDev) return;
    try {
        const fetchStyles = async () => {
            const dataModules = import.meta.glob('../data/style_bindings.json', { eager: true });
            const styles = dataModules['../data/style_bindings.json']?.default || {};
            const key = `${binding.file}:${binding.index}:${binding.key}`;
            if (styles[key]) {
                const f = styles[key];
                setStyleOverrides({
                    fontWeight: f.bold ? 'bold' : 'normal',
                    fontStyle: f.italic ? 'italic' : 'normal',
                    fontSize: f.fontSize,
                    textAlign: f.textAlign,
                    fontFamily: f.fontFamily === 'inherit' ? 'inherit' : f.fontFamily,
                    textShadow: f.textShadow ? '2px 1px 1px rgba(0, 0, 0, 1)' : 'none'
                });
            }
        };
        fetchStyles();
    } catch(e) {}
  }, [binding.file, binding.index, binding.key]);

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
    return <Tag className={className} style={{...style, ...styleOverrides}} {...props}>{content}</Tag>;
  }

  return (
    <Tag
      data-dock-bind={dockBind}
      data-dock-type="text"
      className={`${className} cursor-pointer hover:ring-2 hover:ring-blue-400/40 hover:bg-blue-50/5 rounded-sm transition-all duration-200`}
      style={{...style, ...styleOverrides}}
      title={`Klik om "${binding.key}" te bewerken in de Dock`}
      {...props}
    >
      {content}
    </Tag>
  );
}
