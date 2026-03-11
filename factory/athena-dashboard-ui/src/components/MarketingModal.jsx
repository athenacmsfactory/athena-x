import { useState, useEffect } from 'react'
import { ApiService } from '../services/ApiService'
import { useToast } from '../services/ToastContext'

export default function MarketingModal({ isOpen, siteName, onClose }) {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [seoData, setSeoData] = useState(null)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      addToast(`AI genereert SEO metadata voor ${siteName}...`, 'info')
      const res = await ApiService.generateSEO(siteName)
      if (res.success) {
        setSeoData(res.seo)
        addToast("SEO metadata succesvol gegenereerd!", "success")
      } else {
        addToast("Fout bij genereren: " + res.error, "error")
      }
    } catch (e) { addToast("Netwerkfout.", "error") }
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border border-athena-border rounded-sm w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="bg-athena-panel p-5 border-b border-athena-border flex justify-between items-center">
           <div>
              <h3 className="text-white font-bold text-lg leading-tight uppercase tracking-tight">Marketing & SEO</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Site: {siteName}</p>
           </div>
           <button onClick={onClose} className="text-slate-500 hover:text-white text-xl">✕</button>
        </div>

        <div className="p-8 space-y-6">
           {!seoData ? (
             <div className="text-center py-10 space-y-4">
                <div className="text-5xl opacity-20">📊</div>
                <p className="text-slate-400 text-sm italic">Nog geen SEO data gegenereerd voor dit project.</p>
                <button 
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-8 py-3 bg-athena-accent text-white text-[11px] font-black uppercase rounded shadow-lg shadow-blue-900/20 hover:brightness-110 disabled:opacity-50 transition-all"
                >
                  {loading ? 'ANALISEREN...' : '⚡ GENEREER SEO METADATA'}
                </button>
             </div>
           ) : (
             <div className="space-y-5 animate-fadeIn">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-athena-accent uppercase tracking-widest">Meta Title</label>
                   <input 
                      type="text" 
                      readOnly 
                      value={seoData.title || ''}
                      className="w-full bg-black/40 border border-athena-border rounded-sm px-3 py-2 text-[13px] text-white font-bold"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-athena-accent uppercase tracking-widest">Meta Description</label>
                   <textarea 
                      readOnly 
                      rows={3}
                      value={seoData.description || ''}
                      className="w-full bg-black/40 border border-athena-border rounded-sm px-3 py-2 text-[12px] text-slate-300 leading-relaxed resize-none"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-athena-accent uppercase tracking-widest">Keywords</label>
                   <div className="flex flex-wrap gap-1.5">
                      {seoData.keywords?.split(',').map((kw, i) => (
                        <span key={i} className="bg-athena-accent/10 border border-athena-accent/30 text-athena-accent text-[9px] font-black px-2 py-0.5 rounded-sm uppercase">{kw.trim()}</span>
                      ))}
                   </div>
                </div>

                <div className="pt-4 border-t border-athena-border/50">
                   <button 
                      onClick={handleGenerate}
                      className="w-full py-2 bg-[#21262d] border border-athena-border text-slate-400 text-[10px] font-black uppercase hover:text-white transition-colors"
                   >
                      Opnieuw Genereren
                   </button>
                </div>
             </div>
           )}
        </div>

        <div className="bg-athena-panel p-5 border-t border-athena-border flex justify-end">
           <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-athena-accent text-white text-[11px] font-black uppercase rounded shadow-lg shadow-blue-900/20"
           >
              SLUITEN
           </button>
        </div>
      </div>
    </div>
  )
}
