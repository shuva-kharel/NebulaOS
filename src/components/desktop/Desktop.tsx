import WindowManager from "@/components/desktop/WindowManager";
import { useTheme } from "next-themes";
import { useRetroMode } from "@/hooks/useRetroMode";

export default function Desktop() {
  const { theme } = useTheme();
  const { retro } = useRetroMode();
  
  // Enhanced background selection for better light mode
  const getBackground = () => {
    if (theme === 'light') return 'bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/30';
    if (theme === 'dark') return 'bg-gradient-to-br from-slate-900 via-blue-950/50 to-slate-900';
    return 'bg-gradient-to-br from-slate-100 via-blue-50 to-emerald-50'; // system default
  };

  return (
    <div className={`relative min-h-screen ${getBackground()} animate-fade-in transition-all duration-500`}>
      {retro && <div className="scanline-overlay absolute inset-0 opacity-60" aria-hidden="true" />}
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-brand/40 rounded-full animate-float shadow-lg shadow-brand/20" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-brand-2/50 rounded-full animate-float shadow-lg shadow-brand-2/20" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-brand/30 rounded-full animate-float shadow-lg shadow-brand/20" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-brand-2/40 rounded-full animate-float shadow-lg shadow-brand-2/20" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-brand/35 rounded-full animate-float shadow-lg shadow-brand/20" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/6 right-1/2 w-1.5 h-1.5 bg-brand-2/45 rounded-full animate-float shadow-lg shadow-brand-2/20" style={{ animationDelay: '2.5s' }} />
      </div>
      
      <main className="relative h-screen">
        <WindowManager />
      </main>
    </div>
  );
}
