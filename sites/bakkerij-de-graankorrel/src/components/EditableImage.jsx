import React, { useState } from 'react';

/**
 * EditableImage
 * Wraps a standard img tag. In Development, it allows dragging a new image onto it.
 */
export default function EditableImage({ src, alt, className, cmsBind, ...props }) {
  const isDev = import.meta.env.DEV;
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Als we niet in dev mode zijn, render gewoon de image
  if (!isDev) {
    return <img src={src} alt={alt} className={className} {...props} />;
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsHovering(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsHovering(false);
    
    if (!cmsBind) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) return;

      setIsUploading(true);
      
      try {
        const uploadRes = await fetch('/__athena/upload', {
          method: 'POST',
          headers: { 'X-Filename': file.name },
          body: file
        });
        const uploadData = await uploadRes.json();
        
        if (!uploadData.success) throw new Error(uploadData.error || "Upload failed");

        await fetch('/__athena/update-json', {
            method: 'POST',
            body: JSON.stringify({
                file: cmsBind.file,
                index: cmsBind.index || 0,
                key: cmsBind.key,
                value: uploadData.filename
            })
        });

        window.location.reload();
      } catch (err) {
        console.error("Edit error:", err);
        alert("Fout bij updaten: " + err.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div 
      className={`relative group ${className}`} 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onDragOver={handleDragOver} 
      onDragLeave={handleDragLeave} 
      onDrop={handleDrop}
      style={{ cursor: 'pointer' }}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" {...props} />
      
      {/* 
          OVERLAY - Altijd in het midden, zichtbaar bij hover of drag 
          We gebruiken inline style voor opacity om Tailwind-conflicten te vermijden
      */}
      {cmsBind && (
        <div 
          className="absolute inset-0 bg-blue-500/40 flex items-center justify-center transition-opacity duration-300 pointer-events-none"
          style={{ 
            opacity: isHovering ? 1 : 0,
            zIndex: 50 
          }}
        >
          <span className="text-white font-black bg-black/60 px-4 py-2 rounded-lg text-xs uppercase tracking-widest shadow-2xl border border-white/20">
            {isUploading ? "⏳ Uploaden..." : "📸 Sleep foto hier"}
          </span>
        </div>
      )}
    </div>
  );
}
