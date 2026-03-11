import { useState } from 'react'
import { ApiService } from '../services/ApiService'
import { useToast } from '../services/ToastContext'

export default function BlogModal({ isOpen, siteName, onClose }) {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [topic, setTodo] = useState('')
  const [results, setResults] = useState(null)

  const handleGenerate = async () => {
    if (!topic) return addToast("Voer een onderwerp in.", "error")
    setLoading(true)
    try {
      addToast(`AI schrijft blog artikelen over '${topic}'...`, 'info')
      const res = await ApiService.generateBlog(siteName, topic)
      if (res.success) {
        setResults(res.articles)
        addToast("Blog artikelen succesvol toegevoegd aan de site!", "success")
      } else {
        addToast("Fout bij schrijven: " + res.error, "error")
      }
    } catch (e) { addToast("Netwerkfout.", "error") }
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border border-athena-border rounded-sm w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="bg-athena-panel p-5 border-b border-athena-border flex justify-between items-center">
           <div>
              <h3 className="text-white font-bold text-lg leading-tight uppercase tracking-tight">AI Blog Generator</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Automatische content creatie voor: {siteName}</p>
           </div>
           <button onClick={onClose} className="text-slate-500 hover:text-white text-xl">✕</button>
        </div>

        <div className="p-8 space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-athena-accent uppercase tracking-widest">Onderwerp / Focus</label>
              <div className="flex gap-2">
                 <input 
                    type="text" 
                    placeholder="Bv: De voordelen van cloud architectuur voor KMO's"
                    value={topic}
                    onChange={e => setTodo(e.target.value)}
                    className="flex-1 bg-black/40 border border-athena-border rounded-sm px-4 py-3 text-[13px] text-white outline-none focus:border-athena-accent"
                 />
                 <button 
                    onClick={handleGenerate}
                    disabled={loading}
                    className="px-6 bg-athena-accent text-white text-[11px] font-black uppercase rounded shadow-lg shadow-blue-900/20 disabled:opacity-50"
                 >
                    {loading ? 'SCHRIJVEN...' : '⚡ SCHRIJF'}
                 </button>
              </div>
           </div>

           {results && (
             <div className="space-y-4 animate-fadeIn">
                <h4 className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Gegenereerde Artikelen:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                   {results.map((art, i) => (
                     <div key={i} className="bg-white/5 border border-athena-border p-3 rounded-sm">
                        <p className="text-white font-bold text-xs uppercase tracking-tight">{art.title}</p>
                        <p className="text-slate-500 text-[10px] mt-1 line-clamp-1 italic">{art.summary}</p>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {!results && !loading && (
             <div className="bg-indigo-900/10 border border-indigo-500/20 p-5 rounded-sm flex items-start gap-4">
                <div className="text-2xl">✍️</div>
                <p className="text-slate-400 text-xs leading-relaxed italic">
                   De AI zal 3 unieke artikelen genereren, inclusief metadata en afbeelding-prompts, en deze direct toevoegen aan de lokale database van je website.
                </p>
             </div>
           )}
        </div>

        <div className="bg-athena-panel p-5 border-t border-athena-border flex justify-end">
           <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-[#21262d] border border-athena-border text-slate-400 text-[11px] font-black uppercase rounded hover:text-white transition-colors"
           >
              SLUITEN
           </button>
        </div>
      </div>
    </div>
  )
}
