import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import BootScreen from "@/components/boot/BootScreen";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Preload critical resources
    const preloadResources = async () => {
      // Simulate resource loading
      await new Promise(resolve => setTimeout(resolve, 100));
    };

    preloadResources();
  }, []);

  const handleBootComplete = () => {
    setIsBooting(false);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          {isBooting && <BootScreen onBootComplete={handleBootComplete} />}
          
          {showContent && (
            <div className="animate-in fade-in duration-500 theme-transition">
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </div>
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};


export default App;
