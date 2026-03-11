import { useState, useEffect } from 'react'
import { ApiService } from '../services/ApiService'

export default function StorageView() {
  const [storageData, setStorageData] = useState([])
  const [systemStatus, setSystemStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refresh()
  }, [])

  const refresh = async () => {
    setLoading(true)
    try {
      const [storage, status] = await Promise.all([
        ApiService.getStorageStatus(),
        ApiService.getSystemStatus()
      ])
      setStorageData(storage || [])
      setSystemStatus(status)
    } catch (e) { console.error("Storage fetch failed") }
    setLoading(false)
  }

  const totalSavable = storageData
    .filter(s => s.policy === 'dormant' && s.hydration === 'hydrated')
    .reduce((acc, s) => acc + (s.storage - 10), 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-athena-panel p-5 border border-athena-border rounded-sm flex items-center gap-4">
          <div className="text-2xl opacity-50">💾</div>
          <div>
            <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Disk Usage</h4>
            <p className="text-xl font-black text-white">{systemStatus?.percent || '0%'}</p>
          </div>
        </div>
        <div className="bg-athena-panel p-5 border border-athena-border rounded-sm flex items-center gap-4">
          <div className="text-2xl opacity-50">♻️</div>
          <div>
            <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Savable</h4>
            <p className="text-xl font-black text-emerald-500">{totalSavable} MB</p>
          </div>
        </div>
        <button 
          onClick={() => ApiService.pruneStorage().then(refresh)}
          className="bg-[#21262d] border border-athena-border text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest rounded-sm shadow-sm"
        >
           🧹 PRUNE DORMANT SITES
        </button>
      </div>

      <div className="bg-athena-panel border border-athena-border rounded-sm overflow-hidden">
        <table className="w-full text-left text-[12px]">
          <thead className="bg-black/20 border-b border-athena-border">
            <tr>
              <th className="px-5 py-3 font-black text-slate-500 uppercase tracking-widest text-[9px]">Site Identity</th>
              <th className="px-5 py-3 font-black text-slate-500 uppercase tracking-widest text-[9px]">Status</th>
              <th className="px-5 py-3 font-black text-slate-500 uppercase tracking-widest text-[9px]">Size</th>
              <th className="px-5 py-3 font-black text-slate-500 uppercase tracking-widest text-[9px]">Policy</th>
              <th className="px-5 py-3 font-black text-slate-500 uppercase tracking-widest text-[9px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-athena-border/30">
            {storageData.map((site, idx) => {
              const needsAction = (site.policy === 'dormant' && site.hydration === 'hydrated');
              return (
                <tr key={idx} className={`hover:bg-white/5 transition-colors ${needsAction ? 'bg-amber-500/5' : ''}`}>
                  <td className="px-5 py-3 font-bold text-slate-300">{site.site}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm border uppercase ${site.hydration === 'hydrated' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5' : 'text-slate-500 border-athena-border bg-slate-800'}`}>
                      {site.hydration}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-500">{site.storage} MB</td>
                  <td className="px-5 py-3">
                    <select 
                      value={site.policy}
                      onChange={(e) => ApiService.setStoragePolicy(site.site, e.target.value).then(refresh)}
                      className="bg-black/40 border border-athena-border rounded px-2 py-1 text-[10px] font-bold text-slate-400 outline-none focus:border-athena-accent"
                    >
                      <option value="dormant">🌵 DORMANT</option>
                      <option value="hydrated">💧 HYDRATED</option>
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <button 
                      onClick={() => ApiService.enforceStoragePolicy(site.site).then(refresh)}
                      className={`px-3 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all ${needsAction ? 'bg-amber-500 text-white shadow-lg shadow-amber-900/20' : 'bg-[#21262d] border border-athena-border text-slate-500 hover:text-white'}`}
                    >
                      {needsAction ? '⚡ ENFORCE' : 'SYNC'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
