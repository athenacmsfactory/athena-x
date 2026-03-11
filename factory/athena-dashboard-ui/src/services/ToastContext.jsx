import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    
    // Automatisch verwijderen na 4 seconden
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-md w-full">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`p-4 rounded-sm border shadow-2xl flex items-center justify-between cursor-pointer animate-slideIn transition-all hover:scale-[1.02]
              ${toast.type === 'success' ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400' : 
                toast.type === 'error' ? 'bg-rose-950 border-rose-500/50 text-rose-400' : 
                'bg-athena-panel border-athena-border text-slate-300'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">
                {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
              </span>
              <p className="text-[12px] font-bold uppercase tracking-tight leading-tight">{toast.message}</p>
            </div>
            <span className="text-[10px] opacity-30 font-black">✕</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
