import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "next-themes";
import { useRetroMode } from "@/hooks/useRetroMode";
import { Palette, Sun, Moon, Monitor, Zap } from "lucide-react";

const themes = [
  { id: "light", name: "Light", icon: <Sun className="h-4 w-4" /> },
  { id: "dark", name: "Dark", icon: <Moon className="h-4 w-4" /> },
  { id: "system", name: "System", icon: <Monitor className="h-4 w-4" /> }
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { retro, toggleRetro } = useRetroMode();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover-scale rounded-md px-2 py-1 border hover:border-brand/50 hover:bg-brand/10 transition-all duration-300 glow-effect"
          aria-label="Theme switcher"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm mb-2">Theme</h4>
            <div className="grid grid-cols-3 gap-1">
              {themes.map((t) => (
                <Button
                  key={t.id}
                  variant={theme === t.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setTheme(t.id);
                    setOpen(false);
                  }}
                  className="flex flex-col gap-1 h-auto py-2 hover-scale"
                >
                  {t.icon}
                  <span className="text-xs">{t.name}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-3">
            <h4 className="font-medium text-sm mb-2">Effects</h4>
            <Button
              variant={retro ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                toggleRetro();
                setOpen(false);
              }}
              className="w-full justify-start hover-scale"
            >
              <Zap className="h-4 w-4 mr-2" />
              Retro Mode
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}