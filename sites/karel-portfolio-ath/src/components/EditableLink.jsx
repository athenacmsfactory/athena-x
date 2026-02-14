import React from 'react';
import { useDisplayConfig } from './DisplayConfigContext';

/**
 * EditableLink
 * Special component for links and buttons that allows editing both Label and URL.
 * Interaction: Ctrl+Click to select in Dock without navigating.
 */
export default function EditableLink({ 
  href, 
  value, 
  children, 
  table, 
  field, 
  id = 0, 
  cmsBind, 
  className = "", 
  tagName: Tag = 'a',
  ...props 
}) {
  const isDev = import.meta.env.DEV;
  const { isFieldVisible } = useDisplayConfig();

  const binding = cmsBind || { file: table, key: field, index: id };
  const label = value !== undefined ? value : children;

  // Check visibility
  if (binding.file && !isFieldVisible(binding.file, binding.key)) {
    return null;
  }

  // Generate binding string for Dock (type: link)
  const dockBind = (isDev && binding.file) ? JSON.stringify({ 
    file: binding.file, 
    index: binding.index, 
    key: binding.key,
    type: 'link'
  }) : null;

  const handleClick = (e) => {
    if (isDev && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      // Dock-specific logic: clicking with Ctrl selects for editing
      console.log(`[EditableLink] Ctrl+Click detected for ${binding.key}. URL: ${href}`);
      // The Dock uses the data-dock-bind attribute to find the element
    }
  };

  if (!isDev) {
    return (
      <Tag href={href} className={className} {...props}>
        {label}
      </Tag>
    );
  }

  return (
    <Tag
      href={href}
      data-dock-bind={dockBind}
      data-dock-type="link"
      data-dock-url={href}
      onClick={handleClick}
      className={`${className} cursor-pointer hover:ring-2 hover:ring-blue-500 rounded-sm transition-all duration-200`}
      title={`Ctrl+Click om link te bewerken in de Dock`}
      {...props}
    >
      {label}
    </Tag>
  );
}
