import React from 'react';

/**
 * EditableText (Passive Wrapper for Docked Track)
 * Renders text with 'data-dock-bind' for Athena Dock.
 * Inline editing is disabled in favor of the Dock's specialized Modal editor.
 */
export default function EditableText({ tagName: Tag = 'span', value, cmsBind, table, field, id, className = "", style = {}, ...props }) {
  const isDev = import.meta.env.DEV;

  // Normalize binding
  const binding = cmsBind || { file: table, key: field, index: id || 0 };

  // Generate binding string for Dock
  const dockBind = (isDev && binding.file) ? JSON.stringify({ 
    file: binding.file, 
    index: binding.index || 0, 
    key: binding.key 
  }) : null;

  if (!isDev) {
    return <Tag className={className} style={style} {...props}>{value}</Tag>;
  }

  return (
    <Tag
      data-dock-bind={dockBind}
      className={`${className} cursor-pointer hover:ring-2 hover:ring-blue-400/40 hover:bg-blue-50/5 rounded-sm transition-all duration-200`}
      style={style}
      title={`Klik om "${binding.key}" te bewerken in de Dock`}
      {...props}
    >
      {value}
    </Tag>
  );
}
