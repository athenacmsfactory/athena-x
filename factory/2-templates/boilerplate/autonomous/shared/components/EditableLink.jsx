import React from 'react';

/**
 * EditableLink (Autonomous Track)
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
  const isDev = import.meta.env.DEV;
  const binding = cmsBind || { file: table, index: id, key: field };

  const actualUrl = (url && !url.startsWith('http') && !url.startsWith('/') && !url.startsWith('#'))
    ? `${import.meta.env.BASE_URL}${url}`.replace(/\/+/g, '/')
    : url;

  const content = label || children || actualUrl;

  return (
    <Tag
      href={Tag === 'a' ? actualUrl : undefined}
      className={`${className} ${isDev ? 'cursor-pointer hover:ring-2 hover:ring-blue-400/40 rounded-sm' : ''}`}
      {...props}
    >
      {content}
    </Tag>
  );
}
