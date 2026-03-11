import { useState, useEffect } from 'react'
import { ApiService } from '../services/ApiService'

export default function TodoView() {
  const [todoContent, setTodoContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refresh()
  }, [])

  const refresh = async () => {
    setLoading(true)
    try {
      // We halen de TODO content op via de API
      const res = await fetch('/api/system/todo');
      const data = await res.json();
      setTodoContent(data.content || '# Geen taken gevonden.');
    } catch (e) { console.error("Todo fetch failed") }
    setLoading(false)
  }

  // Simpele markdown-achtige parser voor de lijst
  const lines = todoContent.split('\n').filter(line => line.trim() !== '');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-athena-panel border border-athena-border p-6 rounded-sm flex justify-between items-center shadow-sm">
        <div>
          <h3 className="text-white font-bold text-lg leading-tight">Focus & Roadmap</h3>
          <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">Project Status: v8.7 Development</p>
        </div>
        <button 
          onClick={refresh}
          className="px-4 py-2 bg-athena-accent text-white text-[11px] font-black uppercase rounded shadow-lg shadow-blue-900/20"
        >
          Update Roadmap
        </button>
      </div>

      <div className="bg-athena-panel border border-athena-border rounded-sm overflow-hidden shadow-xl">
        <div className="bg-black/20 px-6 py-3 border-b border-athena-border flex justify-between items-center">
           <span className="text-[11px] font-black text-athena-accent uppercase tracking-widest">Active Tasks</span>
           <span className="text-[10px] text-slate-500 font-mono">factory/TASKS/_TODO.md</span>
        </div>
        
        <div className="p-6 space-y-4 font-sans text-[13px] leading-relaxed">
          {lines.map((line, idx) => {
            if (line.startsWith('#')) return <h4 key={idx} className="text-athena-accent font-black uppercase tracking-tight text-sm mt-4 mb-2">{line.replace(/#/g, '').trim()}</h4>;
            if (line.startsWith('- [ ]')) return (
              <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 border border-athena-border rounded hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="w-4 h-4 rounded-sm border-2 border-slate-600 flex-shrink-0 group-hover:border-athena-accent transition-colors"></div>
                <span className="text-slate-300">{line.replace('- [ ]', '').trim()}</span>
              </div>
            );
            if (line.startsWith('- [x]')) return (
              <div key={idx} className="flex items-center gap-3 p-3 bg-black/20 border border-athena-border/50 rounded opacity-50 grayscale">
                <div className="w-4 h-4 rounded-sm bg-athena-accent flex items-center justify-center text-[10px] text-white">✓</div>
                <span className="text-slate-400 line-through">{line.replace('- [x]', '').trim()}</span>
              </div>
            );
            return <p key={idx} className="text-slate-500 pl-2 border-l-2 border-athena-border ml-1">{line}</p>;
          })}
        </div>
      </div>

      <div className="bg-indigo-900/10 border border-indigo-500/20 p-6 rounded-sm">
         <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
            <span>🗺️</span> Strategisch Traject
         </h4>
         <p className="text-slate-400 text-sm leading-relaxed">
            Je bevindt je momenteel in de afrondende fase van de <strong>Dashboard Decoupling (v8.7)</strong>. 
            De volgende strategische stap is de integratie van de <strong>AI Content Waterfall</strong> om sites volledig autonoom te vullen met hoogwaardige content.
         </p>
      </div>
    </div>
  )
}
