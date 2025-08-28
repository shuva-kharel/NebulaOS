import React, { useState } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCcw, Home, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fs } from '@/os/fs';

export default function BrowserApp() {
  const [url, setUrl] = useState('https://www.google.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');
  const [isLoading, setIsLoading] = useState(false);
  const [localContent, setLocalContent] = useState<string>('');
  const [isLocalFile, setIsLocalFile] = useState(false);

  const handleNavigate = () => {
    if (url) {
      setIsLoading(true);
      
      // Check if it's a local file path
      if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
        try {
          const content = fs.readFile(url);
          setLocalContent(content);
          setIsLocalFile(true);
          setCurrentUrl(url);
        } catch (error) {
          setLocalContent(`<html><body><h1>File Not Found</h1><p>Could not load: ${url}</p></body></html>`);
          setIsLocalFile(true);
          setCurrentUrl(url);
        }
      } else {
        // Handle external URLs - ensure they have a proper protocol
        let finalUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          finalUrl = 'https://' + url;
        }
        setIsLocalFile(false);
        setCurrentUrl(finalUrl);
      }
      
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };

  const handleHome = () => {
    setUrl('https://www.google.com');
    setIsLocalFile(false);
    handleNavigate();
  };

  const loadSampleHTML = () => {
    const sampleHTML = `<!DOCTYPE html>
<html>
<head>
    <title>NebulaOS Sample Page</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px; }
        h1 { color: #fff; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
        .feature { margin: 20px 0; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to NebulaOS Browser!</h1>
        <div class="feature">
            <h3>✨ Local HTML Support</h3>
            <p>This page is loaded from the virtual file system. You can create and edit HTML files using the Notepad app!</p>
        </div>
        <div class="feature">
            <h3>🌐 Web Browsing</h3>
            <p>Navigate to any website by entering a URL in the address bar above.</p>
        </div>
        <div class="feature">
            <h3>📁 File System Integration</h3>
            <p>Use paths like /home/user/mypage.html to load local files.</p>
        </div>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                console.log('NebulaOS Browser - Local HTML loaded successfully!');
            });
        </script>
    </div>
</body>
</html>`;
    
    // Save sample HTML to file system
    fs.writeFile('/home/user/sample.html', sampleHTML);
    setUrl('/home/user/sample.html');
    handleNavigate();
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Navigation Bar */}
      <div className="flex items-center gap-2 p-3 border-b border-border bg-card/70 backdrop-blur-md">
        <Button variant="ghost" size="sm" disabled>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" disabled>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleHome}>
          <Home className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={loadSampleHTML} title="Load Sample HTML">
          <FileText className="w-4 h-4" />
        </Button>
        
        <div className="flex-1 flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter URL or file path (e.g., /home/user/file.html)..."
            className="flex-1"
          />
          <Button onClick={handleNavigate} size="sm">
            Go
          </Button>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        )}
        
        {isLocalFile ? (
          <iframe
            srcDoc={localContent}
            className="w-full h-full border-0 bg-background"
            title="Local HTML Content"
            sandbox="allow-scripts allow-forms"
          />
        ) : (
          <iframe
            src={currentUrl}
            className="w-full h-full border-0 bg-background"
            title="Browser Content"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        )}
      </div>
      
      {/* Status Bar */}
      <div className="px-3 py-1 text-xs text-muted-foreground border-t border-border bg-card/50 backdrop-blur-sm">
        {isLocalFile ? `Local File: ${currentUrl}` : `Web: ${currentUrl}`}
      </div>
    </div>
  );
}