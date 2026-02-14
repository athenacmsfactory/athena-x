import React, { useState } from 'react';

/**
 * EditableMedia (Autonomous Track)
 * Built-in Drag & Drop upload and editing.
 */
export default function EditableMedia({ src, alt, className, cmsBind, ...props }) {
  const isDev = import.meta.env.DEV;
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e) => {
    if (!isDev) return;
    e.preventDefault();
    e.stopPropagation();
    if (!isHovering) setIsHovering(true);
  };

  const handleDragLeave = (e) => {
    if (!isDev) return;
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(false);
  };

  const handleDrop = async (e) => {
    if (!isDev) return;
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setIsUploading(true);

      try {
        const baseUrl = import.meta.env.BASE_URL || '/';
        const uploadUrl = `${baseUrl}__athena/upload`.replace(/\/+/g, '/');
        const updateUrl = `${baseUrl}__athena/update-json`.replace(/\/+/g, '/');

        const uploadRes = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'X-Filename': file.name },
          body: file
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.success) throw new Error(uploadData.error || "Upload failed");

        await fetch(updateUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                file: cmsBind.file,
                index: cmsBind.index || 0,
                key: cmsBind.key,
                value: uploadData.filename
            })
        });

        window.location.reload();
      } catch (err) {
        console.error("❌ Upload Error:", err);
        alert("Fout bij uploaden: " + err.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const finalSrc = (src && !src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:'))
    ? `${import.meta.env.BASE_URL}images/${src}`.replace(/\/+/g, '/')
    : src;

  const isVideo = src && (src.endsWith('.mp4') || src.endsWith('.webm'));

  const renderMedia = () => {
    if (isVideo) return <video src={finalSrc} className={className} autoPlay muted loop playsInline {...props} />;
    if (!src) return <div className={`bg-slate-200 flex items-center justify-center text-slate-400 ${className}`}>🖼️</div>;
    return <img src={finalSrc} alt={alt} className={className} {...props} />;
  };

  if (!isDev) return renderMedia();

  return (
    <div
      className={`relative group ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {renderMedia()}
      <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center transition-opacity duration-300 pointer-events-none" style={{ opacity: isHovering || isUploading ? 1 : 0 }}>
        <div className="bg-black/80 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase border border-white/20">
          {isUploading ? "Uploaden..." : "Bestand Hier Slepen"}
        </div>
      </div>
    </div>
  );
}
