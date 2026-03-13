import { ApiService } from '../services/ApiService';
import { useToast } from '../services/ToastContext';

export default function LegacySiteCard({ site, activeServer, onRefresh }) {
  const { addToast } = useToast();
  const isRunning = !!activeServer;
  const isStatic = site.siteType === 'static-legacy';

  const handleStart = async () => {
    try {
      addToast(`Site ${site.name} aan het opstarten...`, 'info');
      await ApiService.startSiteDev(site.name);
      setTimeout(onRefresh, 1000);
    } catch (e) {
      addToast("Fout bij opstarten: " + e.message, 'error');
    }
  };

  const handleStop = async () => {
    if (!activeServer) return;
    try {
      addToast(`Server op poort ${activeServer.port} stoppen...`, 'info');
      await ApiService.stopSiteServer(activeServer.port);
      setTimeout(onRefresh, 1000);
    } catch (e) {
      addToast("Fout bij stoppen: " + e.message, 'error');
    }
  };

  const handleAthenify = async () => {
    if (!confirm(`Wil je een geathenafieerde versie van '${site.name}' aanmaken? De originele site blijft behouden.`)) return;
    try {
      addToast(`Athenify proces gestart voor ${site.name}...`, 'info');
      const res = await ApiService.athenifySite(site.name);
      if (res.success) {
        addToast(`Nieuwe site '${res.newName}' aangemaakt!`, 'success');
        onRefresh();
      } else {
        addToast("Athenify mislukt: " + res.error, 'error');
      }
    } catch (e) {
      addToast("Athenify fout: " + e.message, 'error');
    }
  };

  // Uniform button style for a cleaner look
  const btnClass = "py-2 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-[#21262d] border border-athena-border text-slate-400 hover:text-white hover:border-slate-500 hover:bg-[#30363d]";
  const activeBtnClass = "py-2 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white";

  return (
    <div className={`bg-athena-panel border border-athena-border rounded-sm transition-all flex flex-col min-h-[140px] group relative ${isRunning ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-slate-700'}`}>
      
      {/* Header */}
      <div className="p-3 pb-2 flex justify-between items-start">
        <div className="space-y-0.5 truncate">
          <h3 className="font-bold text-white text-[13px] tracking-tight group-hover:text-athena-accent transition-colors truncate">{site.name}</h3>
          <p className="text-[9px] text-slate-500 font-bold uppercase flex items-center gap-2 tracking-tighter">
             <span className={isStatic ? 'text-blue-400/80' : 'text-teal-400/80'}>{isStatic ? 'STATIC SITE' : 'VITE APPLICATION'}</span>
             {site.deployData?.liveUrl && (
               <a href={site.deployData.liveUrl} target="_blank" rel="noopener noreferrer" className="text-athena-accent hover:text-white transition-colors" title="Open Live Site">
                 <span className="text-[9px]">↗️</span>
               </a>
             )}
             <span className="font-mono bg-black/30 px-1 rounded text-slate-500">:{activeServer?.port || site.port || '---'}</span>
          </p>
        </div>
        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isRunning ? 'bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-slate-800'}`}></div>
      </div>

      {/* Grid of Actions */}
      <div className="px-3 pb-3 grid grid-cols-2 gap-1.5 mt-auto">
        <button 
          onClick={isRunning ? () => window.open(activeServer.url, '_blank') : handleStart}
          className={isRunning ? activeBtnClass : btnClass}
        >
          {isRunning ? '↗️ OPEN' : '▶️ VIEW'}
        </button>

        <button 
          onClick={() => alert(`Map: sites-external/${site.name}`)}
          className={btnClass}
        >
          📂 EXPLORE
        </button>

        <button 
          onClick={handleAthenify}
          className={btnClass}
        >
          ✨ ATHENIFY
        </button>

        <button 
          onClick={handleStop}
          disabled={!isRunning}
          className={`${btnClass} ${!isRunning ? 'opacity-10 grayscale cursor-not-allowed border-transparent' : 'text-rose-500/70 hover:bg-rose-500 hover:text-white'}`}
        >
          🛑 STOP
        </button>
      </div>
    </div>
  );
}
