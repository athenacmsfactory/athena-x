import { useState, useEffect } from 'react'
import { ApiService } from '../services/ApiService'
import { useToast } from '../services/ToastContext'

export default function ServersView() {
  const { addToast } = useToast()
  const [activeServers, setActiveServers] = useState([])
  const [loading, setLoading] = useState(true)

  const systemServers = [
    { id: 'api', label: 'Athena API', port: 5000, icon: '🔌', script: 'start-api' },
    { id: 'dashboard', label: 'Athena Dashboard', port: 5001, icon: '🔱', script: 'start-dashboard' },
    { id: 'dock', label: 'Athena Dock', port: 5002, icon: '⚓', script: 'start-dock' },
    { id: 'layout', label: 'Layout Editor', port: 5003, icon: '🎨', script: 'start-layout-editor' },
    { id: 'media', label: 'Media Visualizer', port: 5004, icon: '🖼️', script: 'start-media-server' },
  ]

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 5000)
    return () => clearInterval(interval)
  }, [])

  const refresh = async () => {
    try {
      const data = await ApiService.getActiveServers()
      setActiveServers(data.servers || [])
    } catch (e) { console.error("Server fetch failed") }
    setLoading(false)
  }

  const handleStart = async (script) => {
    addToast(`Starten van proces...`, 'info');
    await ApiService.runScript(script);
    setTimeout(refresh, 1000);
  }

  const handleStop = async (port) => {
    addToast(`Stoppen van proces op poort ${port}...`, 'info');
    await ApiService.stopSiteServer(port);
    setTimeout(refresh, 1000);
  }

  const isOnline = (port) => activeServers.some(s => s.port === port)

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 border-b border-athena-border pb-2">Systeem Kern</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {systemServers.map(server => (
            <ServerCard 
              key={server.id}
              {...server}
              online={isOnline(server.port)}
              onStart={() => handleStart(server.script)}
              onStop={() => handleStop(server.port)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 border-b border-athena-border pb-2">Actieve Site Servers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeServers.filter(s => !systemServers.some(ss => ss.port === s.port)).map((server, idx) => (
            <ServerCard 
              key={idx}
              label={server.siteName}
              port={server.port}
              icon="🌐"
              online={true}
              url={server.url}
              onStop={() => handleStop(server.port)}
            />
          ))}
          {activeServers.filter(s => !systemServers.some(ss => ss.port === s.port)).length === 0 && (
            <div className="col-span-full py-12 border border-dashed border-athena-border rounded bg-black/10 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
               Geen actieve site previews
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ServerCard({ label, port, icon, online, url, onStart, onStop }) {
  return (
    <div className={`bg-athena-panel p-4 rounded-sm border border-athena-border transition-all flex flex-col gap-4 group ${online ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-slate-700 opacity-50'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded flex items-center justify-center text-xl bg-black/20 border border-athena-border/50`}>
            {icon}
          </div>
          <div>
            <h4 className="font-bold text-white text-[13px] group-hover:text-athena-accent transition-colors">{label}</h4>
            <p className="text-[10px] text-slate-500 font-mono tracking-tighter">PORT: {port}</p>
          </div>
        </div>
        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm border uppercase tracking-tighter ${online ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5' : 'text-slate-500 border-slate-700 bg-slate-800'}`}>
          {online ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>

      <div className="flex gap-1.5 border-t border-athena-border/30 pt-3">
        {online ? (
          <>
            {url && <a href={url} target="_blank" className="flex-1 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase rounded-sm text-center hover:bg-emerald-500 hover:text-white transition-all">OPEN</a>}
            <button onClick={onStop} className="flex-1 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[9px] font-black uppercase rounded-sm hover:bg-rose-500 hover:text-white transition-all tracking-widest">STOP</button>
          </>
        ) : (
          <button onClick={onStart} className="flex-1 py-1.5 bg-athena-accent/10 border border-athena-accent/30 text-athena-accent text-[9px] font-black uppercase rounded-sm hover:bg-athena-accent hover:text-white transition-all tracking-widest italic">START PROCESS</button>
        )}
      </div>
    </div>
  )
}
