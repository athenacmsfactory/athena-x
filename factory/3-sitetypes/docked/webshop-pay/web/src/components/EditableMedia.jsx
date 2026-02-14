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
  
  // Loop setting from data (default is true)
  const loopKey = `${cmsBind?.key}_loop`;
  const isLooping = dataItem[loopKey] !== false && dataItem[loopKey] !== "false";

  const updateJson = async (key, value) => {
    try {
        const updateRes = await fetch((import.meta.env.BASE_URL + '__athena/update-json').replace(/\\/g, '/'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                file: cmsBind.file,
                index: cmsBind.index !== undefined ? cmsBind.index : 0,
                key: key,
                value: value
            })
        });
        const updateData = await updateRes.json();
        if (updateData.success) window.location.reload();
    } catch (err) {
        console.error("❌ Update Error:", err);
    }
  };

  const toggleLoop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateJson(loopKey, !isLooping);
  };

  const handleReset = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Wil je dit mediabestand verwijderen?")) {
        updateJson(cmsBind.key, "");
    }
  };

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

  return (
    <div 
      className={`relative group overflow-hidden ${className}`}
      style={{ cursor: 'pointer' }}
      {...props}
    >
      {renderContent()}
      
      {/* TOOLS (Visible on hover) */}
      <div className="absolute top-4 right-4 z-[60] flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {isVideo && src && (
            <button onClick={(e) => { e.stopPropagation(); toggleLoop(e); }} className={`p-2 rounded-full border border-white/20 shadow-xl transition-all ${isLooping ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white/50'}`} title={isLooping ? "Loop is ON" : "Loop is OFF"}>
                <i className={`fa-solid ${isLooping ? 'fa-rotate' : 'fa-play'}`}></i>
            </button>
        )}
        {src && (
            <button onClick={(e) => { e.stopPropagation(); handleReset(e); }} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-xl border border-white/20">
                <i className="fa-solid fa-trash-can"></i>
            </button>
        )}
      </div>
    </div>
  );
}
