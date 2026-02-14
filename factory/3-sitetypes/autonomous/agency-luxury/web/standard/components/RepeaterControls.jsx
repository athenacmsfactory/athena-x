import React from 'react';

/**
 * RepeaterControls
 * Geeft acties voor individuele items in een lijst (Verwijderen, Verbergen, Dupliceren).
 */
export default function RepeaterControls({ file, index, isHidden, onAction }) {
  if (!import.meta.env.DEV) return null;

  const performAction = async (action) => {
    if (action === 'delete' && !confirm("Weet je zeker dat je dit item wilt verwijderen?")) return;
    
    try {
      const res = await fetch((import.meta.env.BASE_URL + '__athena/update-json').replace(/\\/g, '/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file, index, action })
      });
      const data = await res.json();
      if (data.success) window.location.reload();
    } catch (err) {
      console.error("❌ Fout bij uitvoeren actie:", err);
    }
  };

  const toggleHide = async () => {
    try {
      await fetch((import.meta.env.BASE_URL + '__athena/update-json').replace(/\\/g, '/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            file, 
            index, 
            key: '_hidden', 
            value: !isHidden 
        })
      });
      window.location.reload();
    } catch (err) {
      console.error("❌ Fout bij verbergen item:", err);
    }
  };

  return (
    <div className="absolute top-2 left-2 z-[70] flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleHide(); }}
        className={`p-1.5 rounded-lg border border-white/20 shadow-lg transition-all ${isHidden ? 'bg-orange-500 text-white' : 'bg-slate-800/80 text-white hover:bg-slate-700'}`}
        title={isHidden ? "Toon Item" : "Verberg Item"}
      >
        <i className={`fa-solid ${isHidden ? 'fa-eye-slash' : 'fa-eye'} text-[10px]`}></i>
      </button>
      
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); performAction('duplicate'); }}
        className="p-1.5 bg-slate-800/80 text-white rounded-lg border border-white/20 shadow-lg hover:bg-blue-600 transition-all"
        title="Dupliceer Item"
      >
        <i className="fa-solid fa-copy text-[10px]"></i>
      </button>

      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); performAction('delete'); }}
        className="p-1.5 bg-red-600 text-white rounded-lg border border-white/20 shadow-lg hover:bg-red-700 transition-all"
        title="Verwijder Item"
      >
        <i className="fa-solid fa-trash-can text-[10px]"></i>
      </button>
    </div>
  );
}
