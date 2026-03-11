import React from 'react';
import { useDisplayConfig } from './DisplayConfigContext';

/**
 * EditableMedia (Docked Track)
 * Passive wrapper that binds to the Athena Dock.
 */
export default function EditableMedia({ src, alt, className, cmsBind, ...props }) {
  const { isFieldVisible } = useDisplayConfig() || {};
  const isDev = import.meta.env.DEV;

  // Visibility Check
  if (isFieldVisible && cmsBind && !isFieldVisible(cmsBind.file, cmsBind.key)) {
    return null;
  }

  let finalPath = src;
  if (typeof src === 'string' && src && !src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:')) {
    // v8.1: Robust detection of root public assets (logo.svg, favicon.ico, etc)
    const isRootPublic = src.endsWith('.svg') || src.endsWith('.ico') || src === 'site-logo.svg' || src === 'athena-icon.svg';
    const pathPrefix = isRootPublic ? '' : 'images/';
    finalPath = `${import.meta.env.BASE_URL}${pathPrefix}${src.replace('./', '')}`.replace(/\/+/g, '/');
  }
  const finalSrc = finalPath;

  const isVideo = src && (src.endsWith('.mp4') || src.endsWith('.webm'));

  const renderMedia = () => {
    if (isVideo) return <video src={finalSrc} className={className} autoPlay muted loop playsInline {...props} />;
    if (!src) return <div className={`bg-slate-200 flex items-center justify-center text-slate-400 ${className}`}>🖼️</div>;
    return <img src={finalSrc} alt={alt} className={className} {...props} />;
  };

  if (!isDev) return renderMedia();

  const dockBind = cmsBind ? JSON.stringify({
    file: cmsBind.file,
    index: cmsBind.index || 0,
    key: cmsBind.key
  }) : null;

  return (
    <div
      className={`relative group ${className} cursor-pointer hover:ring-2 hover:ring-blue-400/40 rounded-sm transition-all duration-200`}
      data-dock-bind={dockBind}
      data-dock-type="media"
      title={cmsBind ? `Klik om "${cmsBind.key}" te bewerken in de Dock` : undefined}
    >
      {renderMedia()}
    </div>
  );
}
