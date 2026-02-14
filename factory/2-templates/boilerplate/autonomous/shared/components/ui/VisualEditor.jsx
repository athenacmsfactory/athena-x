import React, { useState, useEffect } from 'react';

/**
 * VisualEditor (Autonomous Version)
 * Wordt direct binnen de autonome site gebruikt voor per-item styling en tekst.
 */
const VisualEditor = ({ item, onSave, onCancel }) => {
  const [value, setValue] = useState(item.currentValue || '');
  const [formatting, setFormatting] = useState(item.currentFormatting || {
    bold: false,
    italic: false,
    fontSize: '16px',
    textAlign: 'left',
    fontFamily: 'sans-serif'
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const isMedia = item.binding?.key?.toLowerCase().includes('image') || 
                  item.binding?.key?.toLowerCase().includes('afbeelding') ||
                  item.binding?.key?.toLowerCase().includes('foto') ||
                  item.binding?.key?.toLowerCase().includes('video');

  const isVideo = value?.endsWith('.mp4') || value?.endsWith('.webm') || value?.endsWith('.mov');

  useEffect(() => {
    setValue(item.currentValue || '');
    if (item.currentFormatting) {
        setFormatting(item.currentFormatting);
    }
  }, [item]);

  const handleSave = () => {
    onSave(value, formatting);
  };

  const toggleFormat = (key) => {
    setFormatting(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateFormat = (key, val) => {
    setFormatting(prev => ({ ...prev, [key]: val }));
  };

  const fonts = [
    { name: 'Default', value: 'inherit' },
    { name: 'Sans Serif', value: 'sans-serif' },
    { name: 'Serif', value: 'serif' },
    { name: 'Monospace', value: 'monospace' },
    { name: 'Inter', value: 'Inter' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Playfair Display', value: 'Playfair Display' },
    { name: 'Montserrat', value: 'Montserrat' }
  ];

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px', '64px'];

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!isMedia) return;

    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    try {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const url = `${baseUrl}__athena/upload`.replace(/\/+/g, '/');

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'x-filename': file.name },
        body: file
      });

      const data = await res.json();
      if (data.success) {
        setValue(data.filename);
      }
    } catch (err) {
      console.error("❌ Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 p-6 border border-slate-200 dark:border-slate-700"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            <i className={`fa-solid ${isMedia ? 'fa-photo-film' : 'fa-pen-to-square'} mr-2 text-blue-500`}></i>
            {isMedia ? 'Change Media' : 'Edit Text'}
          </h3>
          <button 
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="mb-6">
          <label className="text-xs uppercase font-bold text-slate-400 mb-2 block">
            {item.binding.key} <span className="text-slate-300 font-normal">({item.binding.file})</span>
          </label>
          
          {isMedia ? (
            <div className="space-y-4">
              <div 
                className={`aspect-video rounded-xl overflow-hidden flex flex-col items-center justify-center border-4 border-dashed transition-all duration-300 ${isDragging ? 'bg-blue-100 border-blue-500 scale-105' : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700'}`}
              >
                {isUploading ? (
                    <div className="text-center">
                        <i className="fa-solid fa-circle-notch fa-spin text-blue-500 text-3xl mb-2"></i>
                        <p className="text-sm font-bold text-slate-600">Uploading...</p>
                    </div>
                ) : (
                    <>
                        {isVideo ? (
                             <video 
                                src={`${import.meta.env.BASE_URL}images/${value}`.replace(/\/+/g, '/')}
                                className="w-full h-full object-contain"
                                controls
                                autoPlay
                                muted
                                loop
                             />
                        ) : (
                             <img 
                                src={value?.startsWith('http') ? value : `${import.meta.env.BASE_URL}images/${value || 'placeholder.jpg'}`.replace(/\/+/g, '/')} 
                                alt="Preview" 
                                className="max-h-[180px] max-w-full object-contain mb-2" 
                             />
                        )}
                    </>
                )}
              </div>
              <input 
                type="text" 
                value={value} 
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-slate-900 dark:text-slate-100"
                placeholder="Or paste a URL..."
              />
            </div>
          ) : (
             <div className="space-y-4">
               {/* Formatting Toolbar */}
               <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
                 {/* Font Family */}
                 <select 
                    value={formatting.fontFamily}
                    onChange={(e) => updateFormat('fontFamily', e.target.value)}
                    className="text-xs p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded focus:outline-none"
                 >
                    {fonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                 </select>

                 {/* Font Size */}
                 <select 
                    value={formatting.fontSize}
                    onChange={(e) => updateFormat('fontSize', e.target.value)}
                    className="text-xs p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded focus:outline-none w-20"
                 >
                    {fontSizes.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>

                 <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>

                 {/* Bold / Italic */}
                 <button 
                    onClick={() => toggleFormat('bold')}
                    className={`p-1.5 rounded transition-colors ${formatting.bold ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                    title="Bold"
                 >
                    <i className="fa-solid fa-bold"></i>
                 </button>
                 <button 
                    onClick={() => toggleFormat('italic')}
                    className={`p-1.5 rounded transition-colors ${formatting.italic ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                    title="Italic"
                 >
                    <i className="fa-solid fa-italic"></i>
                 </button>

                 <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>

                 {/* Alignment */}
                 <button 
                    onClick={() => updateFormat('textAlign', 'left')}
                    className={`p-1.5 rounded transition-colors ${formatting.textAlign === 'left' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                    title="Align Left"
                 >
                    <i className="fa-solid fa-align-left"></i>
                 </button>
                 <button 
                    onClick={() => updateFormat('textAlign', 'center')}
                    className={`p-1.5 rounded transition-colors ${formatting.textAlign === 'center' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                    title="Align Center"
                 >
                    <i className="fa-solid fa-align-center"></i>
                 </button>
                 <button 
                    onClick={() => updateFormat('textAlign', 'right')}
                    className={`p-1.5 rounded transition-colors ${formatting.textAlign === 'right' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                    title="Align Right"
                 >
                    <i className="fa-solid fa-align-right"></i>
                 </button>
               </div>

               <textarea 
                 value={value}
                 onChange={(e) => setValue(e.target.value)}
                 className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[150px] text-base leading-relaxed resize-none text-slate-900 dark:text-slate-100"
                 style={{
                    fontWeight: formatting.bold ? 'bold' : 'normal',
                    fontStyle: formatting.italic ? 'italic' : 'normal',
                    fontSize: formatting.fontSize,
                    textAlign: formatting.textAlign,
                    fontFamily: formatting.fontFamily === 'inherit' ? 'sans-serif' : formatting.fontFamily
                 }}
                 autoFocus
               />
             </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isUploading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualEditor;
