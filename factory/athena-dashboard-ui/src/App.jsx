import { useState, useEffect } from 'react'
import { ApiService } from './services/ApiService'
import { useToast } from './services/ToastContext'
import SiteCard from './components/SiteCard'
import ServersView from './views/ServersView'
import ProjectsView from './views/ProjectsView'
import StorageView from './views/StorageView'
import RepositoriesView from './views/RepositoriesView'
import SiteTypesView from './views/SiteTypesView'
import TodoView from './views/TodoView'
import SettingsView from './views/SettingsView'
import ToolsView from './views/ToolsView'
import GeneratorModal from './components/GeneratorModal'
import MarketingModal from './components/MarketingModal'
import BlogModal from './components/BlogModal'
import './index.css'

function App() {
  const { addToast } = useToast()
  const [currentView, setCurrentView] = useState('sites')
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)
  const [isMarketingOpen, setIsMarketingOpen] = useState(false)
  const [selectedMarketingSite, setSelectedMarketingSite] = useState('')
  const [isBlogOpen, setIsBlogOpen] = useState(false)
  const [selectedBlogSite, setSelectedBlogSite] = useState('')
  
  const [sites, setSites] = useState([])
  const [activeServers, setActiveServers] = useState([])
  const [systemStatus, setSystemStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refreshData()
    const interval = setInterval(refreshServers, 5000)
    return () => clearInterval(interval)
  }, [])

  const refreshServers = async () => {
    try {
      const data = await ApiService.getActiveServers()
      setActiveServers(data.servers || [])
    } catch (e) { console.error("Server check failed") }
  }

  const refreshData = async () => {
    setLoading(true)
    try {
      const [siteData, statusData, serverData] = await Promise.all([
        ApiService.getSites(),
        ApiService.getSystemStatus(),
        ApiService.getActiveServers()
      ])
      setSites(siteData)
      setSystemStatus(statusData)
      setActiveServers(serverData.servers || [])
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const startTool = async (name, url) => {
    addToast(`Starten van ${name}...`, 'info')
    await ApiService.runScript(`start-${name.toLowerCase().replace(' ', '-')}`)
    window.open(url, '_blank')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-athena-darker text-athena-text-main">
      {/* SIDEBAR */}
      <aside className="w-[180px] bg-athena-panel border-r border-athena-border flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-athena-border flex items-center gap-2.5">
          <div className="w-8 h-8 bg-athena-accent rounded flex items-center justify-center font-bold text-white text-lg">A</div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-tight">ATHENA</h1>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">v8.7 PRO</span>
          </div>
        </div>
        
        <nav className="flex-1 p-1.5 space-y-0.5 overflow-y-auto mt-2 custom-scrollbar">
          <NavBtn id="sites" label="Sites" icon="🌐" active={currentView === 'sites'} onClick={() => setCurrentView('sites')} />
          <NavBtn id="projects" label="Data Hub" icon="📁" active={currentView === 'projects'} onClick={() => setCurrentView('projects')} />
          <NavBtn id="sitetypes" label="SiteTypes" icon="🧩" active={currentView === 'sitetypes'} onClick={() => setCurrentView('sitetypes')} />
          
          <div className="h-px bg-athena-border my-2 mx-2 opacity-50"></div>
          
          <NavBtn id="repositories" label="GitHub" icon="🐙" active={currentView === 'repositories'} onClick={() => setCurrentView('repositories')} />
          <NavBtn id="servers" label="Servers" icon="🖥️" active={currentView === 'servers'} onClick={() => setCurrentView('servers')} />
          
          <div className="h-px bg-athena-border my-2 mx-2 opacity-50"></div>
          
          <NavBtn id="storage" label="Opslag" icon="💾" active={currentView === 'storage'} onClick={() => setCurrentView('storage')} />
          <NavBtn id="tools" label="Tools" icon="🛠️" active={currentView === 'tools'} onClick={() => setCurrentView('tools')} />
          <NavBtn id="todo" label="Roadmap" icon="🗺️" active={currentView === 'todo'} onClick={() => setCurrentView('todo')} />
          <NavBtn id="settings" label="Settings" icon="⚙️" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />

          <div className="mt-6 pt-2 border-t border-athena-border/30">
             <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest px-3 mb-2">Snelle Tools</p>
             <ActionBtn label="DOCK" icon="⚓" onClick={() => startTool('Dock', 'http://localhost:5002')} />
             <ActionBtn label="REVIEW" icon="⚖️" onClick={() => window.open('http://localhost:5000/reviewer.html', '_blank')} />
             <ActionBtn label="LAYOUT" icon="🎨" onClick={() => startTool('Layout Editor', 'http://localhost:5003')} />
          </div>
        </nav>

        <div className="p-3 border-t border-athena-border bg-black/10">
           <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1 px-1">
              <span>DISK</span>
              <span>{systemStatus?.percent || '0%'}</span>
           </div>
           <div className="w-full h-1 bg-black rounded-full overflow-hidden border border-athena-border/30">
              <div className="h-full bg-athena-accent transition-all duration-1000" style={{ width: systemStatus?.percent || '0%' }}></div>
           </div>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden bg-athena-dark">
        <header className="h-12 bg-athena-panel border-b border-athena-border px-5 flex justify-between items-center flex-shrink-0 shadow-sm">
          <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider">{currentView.replace('-', ' ')}</h2>
          <div className="flex gap-2">
             <button 
              onClick={refreshData}
              className="px-3 py-1.5 text-[11px] font-bold bg-[#21262d] border border-athena-border text-slate-400 hover:text-athena-accent rounded transition-colors"
            >
              REFRESH
            </button>
            <button 
              onClick={() => setIsGeneratorOpen(true)}
              className="px-3 py-1.5 text-[11px] font-black bg-athena-accent text-white rounded hover:brightness-110 transition-all shadow-lg shadow-blue-900/20 uppercase tracking-widest"
            >
              NIEUWE SITE
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
          <div className="max-w-[1400px] mx-auto">
            {currentView === 'sites' && (
               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                     <StatBox label="Geregistreerde Sites" value={sites.length} />
                     <StatBox label="Online (Dev)" value={activeServers.filter(s => !s.isSystem).length} color="text-emerald-500" />
                     <StatBox label="Live op GitHub" value={sites.filter(s => s.status === 'live').length} color="text-athena-accent" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {sites.map((site, idx) => (
                      <SiteCard 
                        key={idx} 
                        site={site} 
                        activeServer={activeServers.find(s => s.siteName === site.name)}
                        onRefresh={refreshData}
                        onSEO={(name) => { setSelectedMarketingSite(name); setIsMarketingOpen(true); }}
                        onBlog={(name) => { setSelectedBlogSite(name); setIsBlogOpen(true); }}
                      />
                    ))}
                  </div>
               </div>
            )}

            {currentView === 'projects' && <ProjectsView />}
            {currentView === 'servers' && <ServersView />}
            {currentView === 'storage' && <StorageView />}
            {currentView === 'tools' && <ToolsView />}
            {currentView === 'repositories' && <RepositoriesView />}
            {currentView === 'sitetypes' && <SiteTypesView />}
            {currentView === 'todo' && <TodoView />}
            {currentView === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      <GeneratorModal isOpen={isGeneratorOpen} onClose={() => setIsGeneratorOpen(false)} onRefresh={refreshData} />
      <MarketingModal isOpen={isMarketingOpen} siteName={selectedMarketingSite} onClose={() => setIsMarketingOpen(false)} />
      <BlogModal isOpen={isBlogOpen} siteName={selectedBlogSite} onClose={() => setIsBlogOpen(false)} />
    </div>
  )
}

function NavBtn({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-all text-left group ${
        active ? 'bg-[#21262d] text-athena-accent border border-athena-border shadow-inner' : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className={`text-sm ${active ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>{icon}</span>
      <span className="text-[12.5px] font-medium">{label}</span>
    </button>
  )
}

function ActionBtn({ label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-1.5 text-slate-500 hover:text-athena-accent transition-colors group"
    >
      <span className="text-xs opacity-50 group-hover:opacity-100">{icon}</span>
      <span className="text-[11px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  )
}

function StatBox({ label, value, color = "text-white" }) {
  return (
    <div className="bg-athena-panel border border-athena-border p-4 rounded-sm">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  )
}

export default App
