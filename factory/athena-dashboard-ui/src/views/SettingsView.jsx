import { useState, useEffect } from 'react'
import { ApiService } from '../services/ApiService'

export default function SettingsView() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    refresh()
  }, [])

  const refresh = async () => {
    setLoading(true)
    try {
      const data = await ApiService.getConfig()
      setConfig(data || {})
    } catch (e) { console.error("Config fetch failed") }
    setLoading(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await ApiService.updateConfig(config)
      if (res.success) alert("Configuratie opgeslagen!")
      else alert("Fout bij opslaan: " + res.error)
    } catch (e) { alert("Netwerkfout.") }
    setSaving(false)
  }

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold animate-pulse">Configuratie laden...</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
       <div className="bg-athena-panel border border-athena-border p-6 rounded-sm shadow-sm flex justify-between items-center">
        <div>
          <h3 className="text-white font-bold text-lg leading-tight">Fabrieksinstellingen</h3>
          <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">Globale configuratie & API Keys</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-athena-accent text-white text-[11px] font-black uppercase rounded shadow-lg shadow-blue-900/20 disabled:opacity-50"
        >
          {saving ? 'Opslaan...' : 'Systeem Bijwerken'}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* AI Configuration Group */}
        <div className="bg-athena-panel border border-athena-border rounded-sm overflow-hidden">
           <div className="bg-black/20 px-6 py-3 border-b border-athena-border">
              <span className="text-[11px] font-black text-athena-accent uppercase tracking-widest">AI & Intelligence</span>
           </div>
           <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Primair Model</label>
                  <select 
                    value={config.AI_MODEL || 'gemini-1.5-flash'}
                    onChange={e => setConfig({...config, AI_MODEL: e.target.value})}
                    className="w-full bg-black/40 border border-athena-border rounded px-3 py-2 text-sm text-slate-300 outline-none focus:border-athena-accent"
                  >
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Snel)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Slim)</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash (v8.7+)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">AI Provider</label>
                  <input 
                    type="text"
                    value={config.AI_PROVIDER || 'google'}
                    onChange={e => setConfig({...config, AI_PROVIDER: e.target.value})}
                    className="w-full bg-black/40 border border-athena-border rounded px-3 py-2 text-sm text-slate-300 outline-none focus:border-athena-accent"
                  />
                </div>
              </div>
              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gemini API Key</label>
                  <input 
                    type="password"
                    value={config.GEMINI_API_KEY || ''}
                    placeholder="••••••••••••••••••••••••••••••"
                    onChange={e => setConfig({...config, GEMINI_API_KEY: e.target.value})}
                    className="w-full bg-black/40 border border-athena-border rounded px-3 py-2 text-sm text-athena-accent font-mono outline-none focus:border-athena-accent"
                  />
                  <p className="text-[10px] text-slate-600 italic">Deze sleutel wordt veilig versleuteld opgeslagen op de backend.</p>
              </div>
           </div>
        </div>

        {/* Workspace Configuration */}
        <div className="bg-athena-panel border border-athena-border rounded-sm overflow-hidden">
           <div className="bg-black/20 px-6 py-3 border-b border-athena-border">
              <span className="text-[11px] font-black text-athena-accent uppercase tracking-widest">Workspace & Paden</span>
           </div>
           <div className="p-6 space-y-4">
              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base URL</label>
                  <input 
                    type="text"
                    value={config.BASE_URL || 'http://localhost:5001'}
                    onChange={e => setConfig({...config, BASE_URL: e.target.value})}
                    className="w-full bg-black/40 border border-athena-border rounded px-3 py-2 text-sm text-slate-400 font-mono outline-none focus:border-athena-accent"
                  />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-black/20 p-4 rounded border border-athena-border/50">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Port UI</p>
                    <p className="text-lg font-black text-slate-300">5001</p>
                 </div>
                 <div className="bg-black/20 p-4 rounded border border-athena-border/50">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Port API</p>
                    <p className="text-lg font-black text-slate-300">5000</p>
                 </div>
              </div>
           </div>
        </div>
      </form>
    </div>
  )
}
