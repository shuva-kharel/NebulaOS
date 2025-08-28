import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface BootScreenProps {
  onBootComplete: () => void;
}

export default function BootScreen({ onBootComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("Initializing NebulaOS...");
  const [isVisible, setIsVisible] = useState(true);

  const bootMessages = [
    "Initializing NebulaOS...",
    "Loading system modules...",
    "Mounting virtual filesystem...",
    "Starting desktop environment...",
    "Preparing terminal interface...",
    "Loading code editor...",
    "System ready!"
  ];

  useEffect(() => {
    const bootSequence = async () => {
      for (let i = 0; i < bootMessages.length; i++) {
        setCurrentMessage(bootMessages[i]);
        
        // Simulate loading time for each step
        const stepDuration = i === bootMessages.length - 1 ? 300 : 400;
        const targetProgress = ((i + 1) / bootMessages.length) * 100;
        
        // Animate progress bar
        const startProgress = progress;
        const progressDiff = targetProgress - startProgress;
        const steps = 20;
        
        for (let j = 0; j <= steps; j++) {
          await new Promise(resolve => setTimeout(resolve, stepDuration / steps));
          setProgress(startProgress + (progressDiff * j) / steps);
        }
      }

      // Hold on "System ready!" for a moment
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fade out boot screen
      setIsVisible(false);
      
      // Complete boot after fade animation
      setTimeout(() => {
        onBootComplete();
      }, 800);
    };

    bootSequence();
  }, [onBootComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 z-50 bg-background transition-opacity duration-800 opacity-0 pointer-events-none">
        {/* Fade out animation */}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-background to-brand-2/5" />
      
      {/* Scanlines effect for retro feel */}
      <div className="absolute inset-0 opacity-20">
        <div className="scanline-overlay h-full w-full" />
      </div>

      <div className="relative z-10 text-center max-w-md w-full px-8">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand to-brand-2 mb-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand to-brand-2" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand to-brand-2 bg-clip-text text-transparent">
            NebulaOS
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Browser Hacker Sandbox OS
          </p>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          
          <div className="min-h-[1.5rem] flex items-center justify-center">
            <p className="text-sm text-muted-foreground font-mono animate-loading-pulse text-glow">
              {currentMessage}
            </p>
          </div>
          
          <div className="text-xs text-muted-foreground/60 animate-loading-pulse">
            {Math.round(progress)}% Complete
          </div>
        </div>

        {/* Terminal-style cursor */}
        <div className="mt-8 flex justify-center">
          <div className="w-2 h-4 bg-brand animate-pulse glow-effect" />
        </div>
      </div>
    </div>
  );
}