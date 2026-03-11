import { useState, useEffect } from 'react'
import { ApiService } from '../services/ApiService'

export default function GeneratorModal({ isOpen, onClose, onRefresh }) {
  const [step, setStep] = useState(1)
  const [projects, setProjects] = useState([])
  const [siteTypes, setSiteTypes] = useState([])
  
  // Form State
  const [selectedProject, setSelectedProject] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [siteName, setSiteName] = useState('')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const loadData = async () => {
    const [projData, typeData] = await Promise.all([
      ApiService.getProjects(),
      fetch('/api/sitetypes').then(res => res.json())
    ])
    setProjects(projData)
    setSiteTypes(typeData)
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await ApiService.runScript('generate-site', [selectedProject, siteName, selectedType])
      if (res.success) {
        alert("✅ Site succesvol gegenereerd!")
        onRefresh()
        onClose()
      } else {
        alert("❌ Fout: " + res.error)
      }
    } catch (e) { alert("Netwerkfout bij generatie.") }
    setGenerating(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border border-athena-border rounded-sm w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-athena-panel p-5 border-b border-athena-border flex justify-between items-center">
           <div>
              <h3 className="text-white font-bold text-lg leading-tight uppercase tracking-tight">AI Site Generator</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Stap {step} van 3: {step === 1 ? 'Data Ingestie' : step === 2 ? 'Configuratie' : 'Generatie'}</p>
           </div>
           <button onClick={onClose} className="text-slate-500 hover:text-white text-xl">✕</button>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 overflow-y-auto space-y-6">
           {step === 1 && (
             <div className="space-y-4 animate-fadeIn">
                <label className="block text-[10px] font-black text-athena-accent uppercase tracking-widest">Selecteer Data Bron (Input Folder)</label>
                <div className="grid grid-cols-1 gap-2">
                   {projects.map(p => (
                     <button 
                        key={p}
                        onClick={() => { setSelectedProject(p); setSiteName(`${p}-site`); setStep(2); }}
                        className={`text-left p-4 rounded-sm border ${selectedProject === p ? 'bg-athena-accent/10 border-athena-accent text-white' : 'bg-black/20 border-athena-border text-slate-400 hover:border-slate-500'} transition-all flex justify-between items-center group`}
                     >
                        <span className="font-bold text-[13px]">{p.replace(/-/g, ' ').toUpperCase()}</span>
                        <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">SELECTEER ➔</span>
                     </button>
                   ))}
                </div>
             </div>
           )}

           {step === 2 && (
             <div className="space-y-6 animate-fadeIn">
                <div className="space-y-2">
                   <label className="block text-[10px] font-black text-athena-accent uppercase tracking-widest">Website Naam</label>
                   <input 
                      type="text" 
                      value={siteName}
                      onChange={e => setSiteName(e.target.value)}
                      className="w-full bg-black/40 border border-athena-border rounded-sm px-4 py-3 text-white font-bold outline-none focus:border-athena-accent"
                   />
                </div>
                <div className="space-y-2">
                   <label className="block text-[10px] font-black text-athena-accent uppercase tracking-widest">Selecteer Blueprint (SiteType)</label>
                   <div className="grid grid-cols-2 gap-2">
                      {siteTypes.map(t => (
                        <button 
                           key={t.name}
                           onClick={() => setSelectedType(t.name)}
                           className={`p-3 rounded-sm border text-[11px] font-black uppercase tracking-tighter transition-all ${selectedType === t.name ? 'bg-athena-accent text-white border-athena-accent' : 'bg-black/20 border-athena-border text-slate-500 hover:text-slate-300'}`}
                        >
                           {t.name.replace(/-/g, ' ')}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
           )}

           {step === 3 && (
             <div className="space-y-6 text-center py-8 animate-fadeIn">
                <div className="text-5xl mb-4">🚀</div>
                <h4 className="text-white font-black text-xl uppercase italic">Klaar voor lancering</h4>
                <div className="bg-black/20 p-6 border border-athena-border rounded-sm text-left inline-block w-full max-w-sm mx-auto space-y-2">
                   <p className="text-xs text-slate-500">PROJECT: <span className="text-white font-bold">{selectedProject}</span></p>
                   <p className="text-xs text-slate-500">SITE NAAM: <span className="text-white font-bold">{siteName}</span></p>
                   <p className="text-xs text-slate-500">BLUEPRINT: <span className="text-athena-accent font-bold uppercase">{selectedType}</span></p>
                </div>
                <p className="text-slate-500 text-xs italic">De AI zal nu de data parsen en de volledige React omgeving opbouwen.</p>
             </div>
           )}
        </div>

        {/* Footer */}
        <div className="bg-athena-panel p-5 border-t border-athena-border flex justify-between items-center">
           {step > 1 ? (
             <button onClick={() => setStep(step - 1)} className="text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors">← Terug</button>
           ) : <div />}
           
           {step < 3 ? (
             <button 
                disabled={step === 2 && (!siteName || !selectedType)}
                onClick={() => setStep(step + 1)} 
                className="px-6 py-2.5 bg-athena-accent text-white text-[11px] font-black uppercase rounded shadow-lg shadow-blue-900/20 disabled:opacity-30 transition-all"
             >
                Volgende Stap →
             </button>
           ) : (
             <button 
                disabled={generating}
                onClick={handleGenerate}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-black uppercase rounded shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-3"
             >
                {generating ? 'GENEREREN...' : '⚡ START GENERATIE'}
             </button>
           )}
        </div>
      </div>
    </div>
  )
}
