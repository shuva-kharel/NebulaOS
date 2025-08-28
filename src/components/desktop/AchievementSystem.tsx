import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Target } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface AchievementSystemProps {
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

const ACHIEVEMENTS_KEY = "nebula-achievements";

const IconMap = {
  Target,
  Star,
  Zap,
  Trophy
};

export default function AchievementSystem({ onAchievementUnlocked }: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first-ls",
      title: "Explorer",
      description: "Used 'ls' command for the first time",
      icon: "Target",
      unlocked: false
    },
    {
      id: "master-cat",
      title: "Cat Master",
      description: "Used 'cat' command 10 times",
      icon: "Star",
      unlocked: false
    },
    {
      id: "file-creator",
      title: "File Creator",
      description: "Created your first file with 'touch'",
      icon: "Zap",
      unlocked: false
    },
    {
      id: "directory-master",
      title: "Directory Master",
      description: "Created 5 directories",
      icon: "Trophy",
      unlocked: false
    },
    {
      id: "chaos-survivor",
      title: "Chaos Survivor",
      description: "Survived the rm -rf / chaos mode",
      icon: "Trophy",
      unlocked: false
    }
  ]);

  const [commandCounts, setCommandCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load achievements from localStorage
    const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const loadedAchievements = (data.achievements || achievements).map((achievement: any) => ({
          ...achievement,
          unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
        }));
        setAchievements(loadedAchievements);
        setCommandCounts(data.commandCounts || {});
      } catch {
        // Invalid data, use defaults
      }
    }
  }, []);

  useEffect(() => {
    // Save achievements to localStorage
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify({
      achievements,
      commandCounts
    }));
  }, [achievements, commandCounts]);

  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === id && !achievement.unlocked) {
        const unlocked = { ...achievement, unlocked: true, unlockedAt: new Date() };
        onAchievementUnlocked?.(unlocked);
        return unlocked;
      }
      return achievement;
    }));
  };

  const trackCommand = (command: string) => {
    setCommandCounts(prev => {
      const newCounts = { ...prev, [command]: (prev[command] || 0) + 1 };
      
      // Check for achievements
      if (command === 'ls' && newCounts.ls === 1) {
        unlockAchievement('first-ls');
      }
      if (command === 'cat' && newCounts.cat === 10) {
        unlockAchievement('master-cat');
      }
      if (command === 'touch' && newCounts.touch === 1) {
        unlockAchievement('file-creator');
      }
      if (command === 'mkdir' && newCounts.mkdir === 5) {
        unlockAchievement('directory-master');
      }
      
      return newCounts;
    });
  };

  const unlockChaosAchievement = () => {
    unlockAchievement('chaos-survivor');
  };

  // Expose functions globally for terminal to use
  useEffect(() => {
    (window as any).nebulaAchievements = {
      trackCommand,
      unlockChaosAchievement
    };
  }, []);

  return (
    <div className="hidden">
      {/* This component manages achievements in the background */}
    </div>
  );
}

export function AchievementToast({ achievement }: { achievement: Achievement }) {
  const IconComponent = IconMap[achievement.icon as keyof typeof IconMap];
  
  return (
    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-brand/20 to-brand-2/20 border border-brand/30 rounded-lg backdrop-blur-md">
      <div className="flex-shrink-0 w-10 h-10 bg-brand/20 rounded-full flex items-center justify-center">
        <IconComponent className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="h-4 w-4 text-brand" />
          <span className="font-semibold text-brand">Achievement Unlocked!</span>
        </div>
        <h4 className="font-medium">{achievement.title}</h4>
        <p className="text-sm text-muted-foreground">{achievement.description}</p>
      </div>
    </div>
  );
}

export function AchievementPanel() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const loadedAchievements = (data.achievements || []).map((achievement: any) => ({
          ...achievement,
          unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
        }));
        setAchievements(loadedAchievements);
      } catch {
        // Invalid data
      }
    }
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-brand" />
        <h3 className="font-semibold">Achievements</h3>
        <Badge variant="secondary">{unlockedCount}/{achievements.length}</Badge>
      </div>
      
      <div className="space-y-2">
        {achievements.map(achievement => {
          const IconComponent = IconMap[achievement.icon as keyof typeof IconMap];
          
          return (
            <div
              key={achievement.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                achievement.unlocked
                  ? 'bg-brand/10 border-brand/30 text-foreground'
                  : 'bg-muted/50 border-border/50 text-muted-foreground'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                achievement.unlocked ? 'bg-brand/20' : 'bg-muted'
              }`}>
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{achievement.title}</h4>
                <p className="text-sm opacity-80">{achievement.description}</p>
                {achievement.unlockedAt && (
                  <p className="text-xs opacity-60 mt-1">
                    Unlocked {achievement.unlockedAt.toLocaleDateString()}
                  </p>
                )}
              </div>
              {achievement.unlocked && (
                <Trophy className="h-4 w-4 text-brand" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}