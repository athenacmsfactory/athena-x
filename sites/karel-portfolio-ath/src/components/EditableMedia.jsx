import React, { useState } from 'react';
import { useDisplayConfig } from './DisplayConfigContext';

/**
 * EditableMedia (Standard Library)
 * Handles images and videos with Dock-driven editing.
 * v7.4.3: Strict Pointer Events to ensure Editor detects IMG tag target.
 */
export default function EditableMedia({ src: rawSrc, alt, className, cmsBind, dataItem = {}, fallback, ...props }) {
  const isDev = import.meta.env.DEV;
  const { isFieldVisible } = useDisplayConfig();
  const [hasError, setHasError] = useState(false);

  // Check visibility
  if (cmsBind && !isFieldVisible(cmsBind.file, cmsBind.key)) {
    return null;
  }

  // Path resolution
  const baseUrl = import.meta.env.BASE_URL || '/';
  const src = (rawSrc && rawSrc !== "" && !rawSrc.startsWith('http') && !rawSrc.startsWith('/') && !rawSrc.startsWith('data:'))
    ? `${baseUrl}images/${rawSrc}`.replace(/\/+/g, '/')
    : (rawSrc || null);

  const isVideo = src && (src.endsWith('.mp4') || src.endsWith('.webm') || src.includes('video'));
  
  // Loop setting from data (default is true)
  const loopKey = `${cmsBind?.key}_loop`;
  const isLooping = dataItem[loopKey] !== false && dataItem[loopKey] !== "false";

  // Prepare Dock Attributes
  const dockAttrs = isDev ? {
    'data-dock-bind': JSON.stringify(cmsBind),
    'data-dock-current': rawSrc || "",
    'data-dock-type': 'media'
  } : {};

  const renderContent = () => {
    // 1. VALID MEDIA
    if (src && !hasError) {
      if (isVideo) {
          return <video src={src} autoPlay loop={isLooping} muted playsInline className="w-full h-full object-cover relative z-10" onError={() => setHasError(true)} {...dockAttrs} />;
      }
      return <img src={src} alt={alt} className="w-full h-full object-cover relative z-10" onError={() => setHasError(true)} {...props} {...dockAttrs} />;
    }
    
    // 2. FALLBACK -> GRAPHIC PLACEHOLDER
    const getFallbackSrc = () => {
        if (typeof fallback === 'string' && fallback.length <= 2) {
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#3b82f6"/><text x="50" y="55" font-family="serif" font-weight="900" font-size="60" fill="white" text-anchor="middle" alignment-baseline="middle">${fallback}</text></svg>`;
            return `data:image/svg+xml;base64,${btoa(svg)}`;
        }
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f1f5f9"/><path d="M30 30h40v40H30z" fill="#cbd5e1"/></svg>`;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    };

    return (
      <img 
        src={getFallbackSrc()} 
        alt="placeholder" 
        className="w-full h-full object-cover opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 relative z-10" 
        {...dockAttrs} 
      />
    );
  };

  if (!isDev) {
    if (!src || hasError) {
        if (typeof fallback === 'string' && fallback.length <= 2) {
            return <div className="w-full h-full bg-accent flex items-center justify-center text-white font-serif font-black">{fallback}</div>;
        }
        return null;
    }
    if (isVideo) return <video src={src} autoPlay loop={isLooping} muted playsInline className={className} {...props} />;
    return <img src={src} alt={alt} className={className} onError={() => setHasError(true)} {...props} />;
  }

  // DEV MODE
  return (
    <div className={`relative group overflow-hidden ${className}`} {...props}>
      <div className="w-full h-full cursor-pointer pointer-events-auto">
        {renderContent()}
      </div>
      <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors pointer-events-none border-4 border-transparent group-hover:border-blue-500/40 rounded-inherit z-30"></div>
    </div>
  );
}
