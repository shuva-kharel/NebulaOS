import { useEffect, useState } from "react";
import { Code2, MonitorCog, SunMoon, TerminalSquare, Globe, Trophy } from "lucide-react";
import { useTheme } from "next-themes";
import { useRetroMode } from "@/hooks/useRetroMode";
import ThemeSwitcher from "./ThemeSwitcher";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AchievementPanel } from "./AchievementSystem";

type TaskbarProps = {
  windows: { id: string; title: string; minimized?: boolean }[];
  activeId: string | null;
  onToggleMin: (id: string) => void;
  launchTerminal: () => void;
  launchEditor: () => void;
  launchBrowser: () => void;
};

export default function Taskbar(props: TaskbarProps) {
  const { theme, setTheme } = useTheme();
  const { retro, toggleRetro } = useRetroMode();
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mx-6 mb-6 rounded-2xl glass-surface animate-slide-in-bottom shadow-2xl">
      <div className="flex items-center gap-4 px-4 py-3">
        <button onClick={props.launchTerminal} className="hover-scale rounded-lg px-3 py-2 border hover:border-brand/60 hover:bg-brand/15 transition-all duration-300 hover:glow-effect" aria-label="Launch Terminal">
          <TerminalSquare className="h-4 w-4" />
        </button>
        <button onClick={props.launchEditor} className="hover-scale rounded-lg px-3 py-2 border hover:border-brand/60 hover:bg-brand/15 transition-all duration-300 hover:glow-effect" aria-label="Launch Code Editor">
          <Code2 className="h-4 w-4" />
        </button>
        <button onClick={props.launchBrowser} className="hover-scale rounded-lg px-3 py-2 border hover:border-brand/60 hover:bg-brand/15 transition-all duration-300 hover:glow-effect" aria-label="Launch Browser">
          <Globe className="h-4 w-4" />
        </button>

        <div className="flex-1 flex items-center gap-3 overflow-x-auto">
          {props.windows.map((w) => (
            <button
              key={w.id}
              onClick={() => props.onToggleMin(w.id)}
              className={`px-4 py-2 rounded-lg border transition-all duration-300 hover-scale ${
                props.activeId === w.id && !w.minimized 
                  ? 'bg-brand/25 border-brand/60 text-brand glow-effect shadow-lg' 
                  : 'bg-background/60 hover:bg-brand/15 hover:border-brand/40 hover:glow-effect'
              }`}
              title={w.title}
            >
              {w.title}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button className="hover-scale rounded-lg px-3 py-2 border hover:border-brand/60 hover:bg-brand/15 transition-all duration-300 hover:glow-effect" aria-label="Achievements">
                <Trophy className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end" side="top">
              <AchievementPanel />
            </PopoverContent>
          </Popover>
          
          <ThemeSwitcher />
          
          <button
            onClick={toggleRetro}
            className={`hover-scale rounded-lg px-3 py-2 border transition-all duration-300 ${
              retro 
                ? 'bg-brand/25 border-brand/60 text-brand glow-effect shadow-lg' 
                : 'hover:border-brand/60 hover:bg-brand/15 hover:glow-effect'
            }`}
            aria-label="Toggle retro mode"
            title="Retro-Futurism Mode"
          >
            <MonitorCog className="h-4 w-4" />
          </button>
          
          <div className="text-sm tabular-nums text-muted-foreground min-w-[80px] text-right font-mono">
            {time}
          </div>
        </div>
      </div>
    </div>
  );
}
