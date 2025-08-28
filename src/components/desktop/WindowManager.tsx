import { useEffect, useMemo, useState } from "react";
import { DesktopWindow } from "@/components/desktop/Window";
import TerminalApp from "@/apps/TerminalApp";
import CodeEditorApp from "@/apps/CodeEditorApp";
import BrowserApp from "@/apps/BrowserApp";
import NotepadApp from "@/apps/NotepadApp";
import MusicPlayerApp from "@/apps/MusicPlayerApp";
import ImageViewerApp from "@/apps/ImageViewerApp";
import { Code2, TerminalSquare, Globe, FileText, Music, Image, Trophy } from "lucide-react";
import Taskbar from "./Taskbar";
import AchievementSystem, { AchievementToast } from "./AchievementSystem";
import { toast } from "@/components/ui/sonner";

export type AppType = 'terminal' | 'editor' | 'browser' | 'notepad' | 'music' | 'image';

type Win = {
  id: string;
  type: AppType;
  title: string;
  x: number; y: number; width: number; height: number;
  z: number; minimized?: boolean;
};

let zTop = 10;

export default function WindowManager() {
  const [wins, setWins] = useState<Win[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    if (wins.length === 0) open('terminal');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = (type: AppType) => {
    const id = `${type}-${Date.now()}`;
    const dimensions = {
      terminal: { width: 640, height: 420 },
      editor: { width: 820, height: 520 },
      browser: { width: 900, height: 600 },
      notepad: { width: 700, height: 500 },
      music: { width: 500, height: 600 },
      image: { width: 800, height: 600 }
    };
    
    const titles = {
      terminal: 'Terminal',
      editor: 'Code Editor',
      browser: 'Browser',
      notepad: 'Notepad',
      music: 'Music Player',
      image: 'Image Viewer'
    };
    
    const base = dimensions[type] || { width: 640, height: 420 };
    const win: Win = {
      id, type,
      title: titles[type] || 'Application',
      x: 60 + Math.random() * 40, y: 60 + Math.random() * 40,
      width: base.width, height: base.height,
      z: ++zTop,
    };
    setWins((w) => [...w, win]);
    setActive(id);
  };

  const close = (id: string) => setWins((w) => w.filter(win => win.id !== id));
  const minimize = (id: string) => setWins((w) => w.map(win => win.id === id ? { ...win, minimized: !win.minimized } : win));
  const focus = (id: string) => {
    setWins((w) => w.map(win => win.id === id ? { ...win, z: ++zTop } : win));
    setActive(id);
  };
  const move = (id: string, x: number, y: number) => setWins((w) => w.map(win => win.id === id ? { ...win, x, y } : win));
  const resize = (id: string, width: number, height: number) => setWins((w) => w.map(win => win.id === id ? { ...win, width, height } : win));

  const icons = useMemo(() => ([
    { id: 'i-terminal', label: 'Terminal', icon: <TerminalSquare className="h-8 w-8" />, action: () => open('terminal') },
    { id: 'i-editor', label: 'Code Editor', icon: <Code2 className="h-8 w-8" />, action: () => open('editor') },
    { id: 'i-browser', label: 'Browser', icon: <Globe className="h-8 w-8" />, action: () => open('browser') },
    { id: 'i-notepad', label: 'Notepad', icon: <FileText className="h-8 w-8" />, action: () => open('notepad') },
    { id: 'i-music', label: 'Music Player', icon: <Music className="h-8 w-8" />, action: () => open('music') },
    { id: 'i-image', label: 'Image Viewer', icon: <Image className="h-8 w-8" />, action: () => open('image') },
  ]), []);

  const handleAchievementUnlocked = (achievement: any) => {
    toast.custom((t) => <AchievementToast achievement={achievement} />, {
      duration: 4000,
    });
  };

  const renderApp = (type: AppType) => {
    switch (type) {
      case 'terminal': return <TerminalApp />;
      case 'editor': return <CodeEditorApp />;
      case 'browser': return <BrowserApp />;
      case 'notepad': return <NotepadApp />;
      case 'music': return <MusicPlayerApp />;
      case 'image': return <ImageViewerApp />;
      default: return <div>Unknown app</div>;
    }
  };

  return (
    <div className="relative w-full h-full">
      <AchievementSystem onAchievementUnlocked={handleAchievementUnlocked} />
      
      {/* Desktop shortcuts */}
      <div className="absolute top-6 left-6 grid grid-cols-2 gap-6 animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
        {icons.map((i) => (
          <button key={i.id} onDoubleClick={i.action} className="flex flex-col items-center gap-2 hover-scale group">
            <div className="p-4 rounded-xl border card-modern group-hover:bg-brand/20 group-hover:border-brand/70 transition-all duration-300 group-hover:glow-effect group-hover:animate-pulse-glow shadow-lg">
              {i.icon}
            </div>
            <div className="text-xs text-center max-w-[100px] group-hover:text-brand transition-colors duration-300 group-hover:text-glow font-medium">
              {i.label}
            </div>
          </button>
        ))}
      </div>

      {/* Windows */}
      {wins.map((w) => (
        <DesktopWindow
          key={w.id}
          id={w.id}
          title={w.title}
          x={w.x}
          y={w.y}
          width={w.width}
          height={w.height}
          zIndex={w.z}
          minimized={w.minimized}
          onFocus={focus}
          onClose={close}
          onMinimize={minimize}
          onDragStop={move}
          onResizeStop={resize}
        >
          {renderApp(w.type)}
        </DesktopWindow>
      ))}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0">
        <Taskbar
          windows={wins}
          activeId={active}
          onToggleMin={minimize}
          launchTerminal={() => open('terminal')}
          launchEditor={() => open('editor')}
          launchBrowser={() => open('browser')}
        />
      </div>
    </div>
  );
}
