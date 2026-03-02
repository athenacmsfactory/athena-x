import React, { useState, useEffect, useRef } from 'react';

const VisualEditor = ({ item, selectedSite, onSave, onCancel, onUpload }) => {
  const labelRef = useRef(null);
  const urlRef = useRef(null);
  const [allSites, setAllSites] = useState([]);
  
  const initialValueData = item.value || item.currentValue || '';
  const dockType = item.dockType || item.dataType || 'text';
  const isLink = dockType === 'link';
  const isMedia = dockType === 'media' || (!isLink && item.binding?.key?.toLowerCase().includes('image'));

  const resolvedLabel = typeof initialValueData === 'object' ? (initialValueData.label || '') : initialValueData;
  const resolvedUrl = typeof initialValueData === 'object' ? (initialValueData.url || '') : (item.url || '');

  const [value, setValue] = useState(typeof initialValueData === 'object' ? '' : initialValueData);
  const [linkData, setLinkData] = useState({ label: resolvedLabel, url: resolvedUrl });

  // [v33 Debug Bridge]: Luister naar antwoorden van de site
  useEffect(() => {
    const handleSyncResponse = (event) => {
      const { type, key, value: siteValue, fullRow } = event.data;
      if (type === 'SITE_SYNC_RESPONSE') {
        console.log('🏁 [VisualEditor] Received live data from site:', siteValue);
        
        if (isLink) {
          // Als de site een object stuurt, pak de url. Anders check of er een sibling key is.
          let foundUrl = (typeof siteValue === 'object' && siteValue !== null) ? siteValue.url : null;
          if (!foundUrl && fullRow) {
            foundUrl = fullRow[`${key}_url`] || fullRow['cta_url'] || fullRow['url'];
          }

          if (foundUrl && urlRef.current) {
            urlRef.current.value = foundUrl;
            setLinkData(prev => ({ ...prev, url: foundUrl }));
          }
        }
      }
    };

    window.addEventListener('message', handleSyncResponse);
    return () => window.removeEventListener('message', handleSyncResponse);
  }, [isLink]);

  // Vraag de site om de actuele data (On-Demand Sync)
  const requestSiteSync = () => {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      console.log('❓ [VisualEditor] Asking site for current data state...');
      iframe.contentWindow.postMessage({
        type: 'DOCK_REQUEST_SYNC',
        file: item.binding?.file,
        index: item.binding?.index,
        key: item.binding?.key
      }, '*');
    }
  };

  useEffect(() => {
    if (labelRef.current) labelRef.current.value = linkData.label;
    if (urlRef.current) urlRef.current.value = linkData.url;
    if (isLink) fetch('./sites.json').then(r => r.json()).then(d => setAllSites(d));
    
    // Automatische sync-vraag bij openen
    const timer = setTimeout(requestSiteSync, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    const finalData = isLink ? {
      label: labelRef.current ? labelRef.current.value : linkData.label,
      url: urlRef.current ? urlRef.current.value : linkData.url
    } : value;
    onSave(finalData, {});
  };

  const getPreviewUrl = (filename) => {
    if (!filename) return '';
    if (filename.startsWith('http')) return filename;
    
    // Construct URL from selected site
    const baseUrl = selectedSite?.url || '';
    const cleanBase = baseUrl.replace(/\/$/, '');
    return `${cleanBase}/images/${filename}`.replace(/\/+/g, '/').replace('http:/', 'http://').replace('https:/', 'https://');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Use the upload logic from DockFrame if available or a direct upload
    const formData = new FormData();
    formData.append('file', file);

    const baseUrl = selectedSite?.url || '';
    const cleanBase = baseUrl.replace(/\/$/, '');
    const uploadUrl = `${cleanBase}/__athena/upload`;

    try {
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'X-Filename': file.name },
        body: file
      });
      const data = await res.json();
      if (data.success) {
        setValue(data.filename);
        // Direct save for media usually feels better
        // onUpload(data.filename);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload mislukt.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in duration-150">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Editor v33</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark"></i></button>
        </div>

        <div className="p-8 space-y-6">
          {isLink ? (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Button Label</label>
                <input 
                  ref={labelRef}
                  type="text" 
                  defaultValue={linkData.label}
                  className="w-full p-4 bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold outline-none"
                />
              </div>
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black uppercase text-slate-400">URL / Link Target</label>
                <input 
                  ref={urlRef}
                  type="text" 
                  defaultValue={linkData.url}
                  onFocus={requestSiteSync} // DIT IS DE KEY: Vraag bij klik!
                  className="w-full p-4 bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#anchor or https://..."
                />
                <button 
                  onClick={requestSiteSync}
                  className="absolute right-4 bottom-4 text-[10px] text-blue-500 font-bold hover:underline"
                >
                  <i className="fa-solid fa-rotate mr-1"></i> SYNC
                </button>
              </div>
              {allSites.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <label className="text-[10px] font-black uppercase text-blue-500">Quick Select</label>
                  <select 
                    onChange={(e) => { if(urlRef.current) urlRef.current.value = e.target.value; }}
                    className="w-full p-3 bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs outline-none"
                  >
                    <option value="" className="dark:bg-black">-- Kies een site --</option>
                    {allSites.filter(s => s.liveUrl).map(s => (
                      <option key={s.id} value={s.liveUrl} className="dark:bg-black">{s.name} ({s.liveUrl})</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          ) : isMedia ? (
            <div className="space-y-4">
              <div className="aspect-video bg-slate-100 dark:bg-black rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center group relative">
                {value ? (
                  <img src={getPreviewUrl(value)} alt="Preview" className="max-h-full object-contain" />
                ) : (
                  <div className="text-slate-400">Geen afbeelding</div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold uppercase text-xs">
                  Upload Nieuw
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Bestandsnaam</label>
                <input 
                  type="text" 
                  value={value} 
                  onChange={(e) => setValue(e.target.value)} 
                  className="w-full p-4 bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-mono text-xs" 
                />
              </div>
            </div>
          ) : (
            <textarea 
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-6 bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-700 rounded-2xl min-h-[200px] text-slate-900 dark:text-white resize-none outline-none"
            />
          )}
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
          <button onClick={onCancel} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">Cancel</button>
          <button onClick={handleSave} className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all">SAVE CHANGES</button>
        </div>
      </div>
    </div>
  );
};

export default VisualEditor;
