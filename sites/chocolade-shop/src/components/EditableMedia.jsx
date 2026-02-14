import React, { useState } from 'react';

/**
 * EditableMedia (Docked Track)
 * Handles images and videos with Dock-driven editing.
 * Minimalist version for MPA/Docked sites.
 */
export default function EditableMedia({ src: rawSrc, alt, className, cmsBind, dataItem = {}, ...props }) {
  const isDev = import.meta.env.DEV;
  const [hasError, setHasError] = useState(false);

  // Path resolution
  const baseUrl = import.meta.env.BASE_URL || '/';
  const src = (rawSrc && rawSrc !== "" && !rawSrc.startsWith('http') && !rawSrc.startsWith('/') && !rawSrc.startsWith('data:'))
    ? `${baseUrl}images/${rawSrc}`.replace(/\/+/g, '/')
    : (rawSrc || null);

  const isVideo = src && (src.endsWith('.mp4') || src.endsWith('.webm') || src.includes('video'));
  
  // Loop setting from data (default is true)
  const loopKey = `${cmsBind?.key}_loop`;
  const isLooping = dataItem[loopKey] !== false && dataItem[loopKey] !== "false";

  const renderContent = () => {
    if (src && !hasError) {
      if (isVideo) {
          return <video src={src} autoPlay loop={isLooping} muted playsInline className="w-full h-full object-cover" onError={() => setHasError(true)} />;
      }
      return <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setHasError(true)} {...props} />;
    }
    return (
      <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 gap-2 border-2 border-dashed border-slate-200 dark:border-slate-800 min-h-[150px]">
        <i className={`fa-solid ${isVideo ? 'fa-video' : 'fa-image'} text-4xl opacity-20`}></i>
        <span className="text-[10px] uppercase font-bold opacity-40">Slot: {cmsBind?.key}</span>
      </div>
    );
  };

  if (!isDev) {
    if (!src || hasError) return null;
    if (isVideo) return <video src={src} autoPlay loop={isLooping} muted playsInline className={className} {...props} />;
    return <img src={src} alt={alt} className={className} onError={() => setHasError(true)} {...props} />;
  }

  // In Dev mode, we return a wrapper that the Dock can identify
  return (
    <div 
      className={`relative group overflow-hidden cursor-pointer ${className}`}
      data-dock-bind={JSON.stringify(cmsBind)} data-dock-type="media"
      data-dock-current={rawSrc || ""}
      {...props}
    >
      {renderContent()}
      
      {/* NO in-site tools for docked track - Dock handles this via Drag & Drop */}
      <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors pointer-events-none border-4 border-transparent group-hover:border-blue-500/30 rounded-inherit"></div>
    </div>
  );
}