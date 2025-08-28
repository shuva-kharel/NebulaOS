import { useEffect, useState } from "react";

interface ChaosModeProps {
  onComplete: () => void;
}

export default function ChaosMode({ onComplete }: ChaosModeProps) {
  const [stage, setStage] = useState(0);
  const [glitchText, setGlitchText] = useState("SYSTEM MELTDOWN INITIATED...");

  const messages = [
    "SYSTEM MELTDOWN INITIATED...",
    "DELETING SYSTEM FILES...",
    "CORRUPTING MEMORY...",
    "FRAGMENTING DISK...",
    "OVERHEATING CPU...",
    "JUST KIDDING! 😄",
    "NebulaOS is perfectly safe!",
    "Thanks for trying rm -rf /"
  ];

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    
    // Text progression
    const textInterval = setInterval(() => {
      setStage(prev => {
        if (prev < messages.length - 1) {
          setGlitchText(messages[prev + 1]);
          return prev + 1;
        }
        return prev;
      });
    }, 1000);
    intervals.push(textInterval);

    // Glitch effect
    const glitchInterval = setInterval(() => {
      const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      let glitched = "";
      for (let i = 0; i < glitchText.length; i++) {
        if (Math.random() < 0.1) {
          glitched += chars[Math.floor(Math.random() * chars.length)];
        } else {
          glitched += glitchText[i];
        }
      }
      setGlitchText(glitched);
      
      setTimeout(() => setGlitchText(messages[stage] || messages[0]), 100);
    }, 200);
    intervals.push(glitchInterval);

    // Complete after 8 seconds
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => {
      intervals.forEach(clearInterval);
      clearTimeout(completeTimeout);
    };
  }, [stage, glitchText, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Glitch overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 animate-pulse" />
        <div className="absolute inset-0 bg-black/50" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,0,0,0.1) 2px,
            rgba(255,0,0,0.1) 4px
          )`
        }} />
      </div>

      {/* Scanlines */}
      <div className="absolute inset-0 opacity-30">
        <div className="scanline-overlay h-full w-full" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4 animate-pulse">💀</div>
          <h1 className="text-4xl font-bold text-red-500 mb-4 animate-bounce">
            CRITICAL ERROR
          </h1>
        </div>

        <div className="font-mono text-xl text-green-400 mb-8 min-h-[2rem]">
          {glitchText}
        </div>

        {/* Fake progress bars */}
        <div className="space-y-4 max-w-md mx-auto">
          <div className="text-left text-sm text-red-400">
            Deleting /usr/bin... {Math.min(stage * 12, 100)}%
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(stage * 12, 100)}%` }}
            />
          </div>
          
          <div className="text-left text-sm text-red-400">
            Corrupting /home... {Math.min(stage * 15, 100)}%
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(stage * 15, 100)}%` }}
            />
          </div>
        </div>

        {stage >= 5 && (
          <div className="mt-8 animate-fade-in">
            <div className="text-2xl mb-4">🎉</div>
            <p className="text-green-400 text-lg">
              Your system is completely safe!
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              This was just a harmless prank. NebulaOS runs in your browser!
            </p>
          </div>
        )}
      </div>

      {/* Glitch effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-red-500/20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 10 + 2}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 1 + 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}