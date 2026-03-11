import { useState, useEffect } from 'react'
import { ApiService } from '../services/ApiService'

export default function RepositoriesView() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refresh()
  }, [])

  const refresh = async () => {
    setLoading(true)
    try {
      const data = await ApiService.getRepositories()
      setRepos(data || [])
    } catch (e) { console.error("GitHub fetch failed") }
    setLoading(false)
  }

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / 86400000);
    if (diffDays === 0) return 'Vandaag';
    if (diffDays === 1) return 'Gisteren';
    return date.toLocaleDateString('nl-BE');
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Totaal Remote" value={repos.length} />
        <StatCard label="Live Pages" value={repos.filter(r => !r.isPrivate).length} color="text-emerald-500" />
        <StatCard label="Private Assets" value={repos.filter(r => r.isPrivate).length} color="text-athena-accent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {repos.map((repo, idx) => (
          <div key={idx} className={`bg-athena-panel p-4 rounded-sm border border-athena-border flex flex-col gap-4 group transition-all hover:border-athena-accent ${!repo.isPrivate ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-slate-700'}`}>
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-2">
                  <span className="text-lg">🐙</span>
                  <h4 className="font-bold text-white tracking-tight group-hover:text-athena-accent transition-colors truncate max-w-[120px]" title={repo.name}>{repo.name}</h4>
               </div>
               <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm border uppercase ${repo.isPrivate ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-emerald-500/5 text-emerald-500 border-emerald-500/30'}`}>
                  {repo.isPrivate ? 'PRIV' : 'LIVE'}
               </span>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-500 font-medium">
               <p className="flex items-center gap-2">
                  <span className="opacity-30">🕒</span> {getTimeAgo(repo.updatedAt)}
               </p>
               {!repo.isPrivate && (
                  <p className="text-emerald-600/80 flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter">
                     <span>✓</span> Pages Active
                  </p>
               )}
            </div>

            <div className="flex gap-1.5 pt-3 border-t border-athena-border/50 mt-auto">
               <a href={repo.url} target="_blank" className="flex-1 bg-[#21262d] border border-athena-border text-slate-400 text-[9px] font-black uppercase py-1.5 rounded text-center hover:text-white transition-colors">
                  REPO
               </a>
               {!repo.isPrivate && (
                  <a href={`https://${repo.owner}.github.io/${repo.name}/`} target="_blank" className="flex-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase py-1.5 rounded text-center hover:bg-emerald-500 hover:text-white transition-all">
                     LIVE
                  </a>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, value, color = "text-white" }) {
  return (
    <div className="bg-athena-panel p-4 border border-athena-border rounded-sm">
      <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</h4>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  )
}
