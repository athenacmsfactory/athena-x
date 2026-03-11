import React, { useState } from 'react';

/**
 * EditableMedia (Docked Track)
 * Handles images and videos with Dock-driven editing.
 */
export default function EditableMedia({ src: rawSrc, alt, className, cmsBind, dataItem = {}, ...props }) {
  const isDev = import.meta.env.DEV;
  const [hasError, setHasError] = useState(false);

  // Path resolution
  const baseUrl = import.meta.env.BASE_URL || '/';
  const src = (rawSrc && !rawSrc.startsWith('http') && !rawSrc.startsWith('/') && !rawSrc.startsWith('data:'))
    ? `${baseUrl}images/${rawSrc}`.replace(/\/+/g, '/')
    : rawSrc;

  const isVideo = src && (src.endsWith('.mp4') || src.endsWith('.webm') || src.includes('video'));
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
      <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-300 gap-2 border-2 border-dashed border-slate-200 min-h-[150px]">
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

  const dockBind = JSON.stringify({ 
    file: cmsBind?.file, 
    index: cmsBind?.index || 0, 
    key: cmsBind?.key 
  });

  return (
    <div 
      data-dock-bind={dockBind}
      data-dock-type="media"
      className={`relative group overflow-hidden cursor-pointer hover:ring-4 hover:ring-blue-500/30 transition-all ${className}`}
      {...props}
    >
      {renderContent()}
    </div>
  );
}
