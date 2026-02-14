import React from 'react';
import { useDisplayConfig } from './DisplayConfigContext';

/**
 * EditableLink (Docked Track)
 */
export default function EditableLink({ 
  url, 
  label,
  children,
  className = "",
  cmsBind, 
  table, 
  field, 
  id, 
  as: Tag = 'a',
  ...props 
}) {
  const { isFieldVisible } = useDisplayConfig() || {};
  const isDev = import.meta.env.DEV;
  const binding = cmsBind || { file: table, index: id, key: field };

  // Visibility Check
  if (isFieldVisible && !isFieldVisible(binding.file, binding.key)) {
    return null;
  }

  const actualUrl = (url && !url.startsWith('http') && !url.startsWith('/') && !url.startsWith('#'))
    ? `${import.meta.env.BASE_URL}${url}`.replace(/\/+/g, '/')
    : url;

  const content = label || children || actualUrl;

  if (!isDev) {
    return (
      <Tag href={Tag === 'a' ? actualUrl : undefined} className={className} {...props}>
        {content}
      </Tag>
    );
  }

  const dockBind = JSON.stringify({
    file: binding.file,
    index: binding.index || 0,
    key: binding.key
  });

  return (
    <Tag
      href={Tag === 'a' ? actualUrl : undefined}
      data-dock-bind={dockBind}
      data-dock-type="link"
      className={`${className} cursor-pointer hover:ring-2 hover:ring-blue-400/40 rounded-sm transition-all`}
      title={`Klik om "${binding.key}" te bewerken in de Dock (Shift+Klik om actie uit te voeren)`}
      {...props}
    >
      {content}
    </Tag>
  );
}
