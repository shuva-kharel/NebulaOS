import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { fs } from "@/os/fs";
import { Save, FileText, Eye, Edit3 } from "lucide-react";

export default function NotepadApp() {
  const [path, setPath] = useState<string>("/home/user/document.md");
  const [content, setContent] = useState<string>("# Welcome to NebulaOS Notepad\n\nThis is a **markdown** editor with live preview!\n\n## Features\n- Rich text editing\n- Markdown preview\n- File system integration\n\n> Start typing to see the magic happen!");
  const [activeTab, setActiveTab] = useState<string>("edit");

  useEffect(() => {
    try {
      const fileContent = fs.readFile(path);
      setContent(fileContent);
    } catch {
      // File doesn't exist, keep default content
    }
  }, [path]);

  const save = () => {
    fs.writeFile(path, content);
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 text-brand">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 text-brand-2">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-foreground">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/gim, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-brand pl-4 italic text-muted-foreground my-2">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/\n/gim, '<br>');
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b bg-background/70 backdrop-blur-md">
        <Input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="w-72 bg-background/90 hover:bg-background/95 transition-all duration-300"
          placeholder="File path"
        />
        <Button variant="secondary" onClick={save} className="hover-scale">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mx-2 mt-2">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="flex-1 p-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full resize-none font-mono text-sm bg-background/60 backdrop-blur-sm border-border/50"
              placeholder="Start typing your markdown here..."
            />
          </TabsContent>
          
          <TabsContent value="preview" className="flex-1 p-4 overflow-auto">
            <div className="prose prose-sm max-w-none">
              <div 
                className="text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Status bar */}
      <div className="p-2 text-xs text-muted-foreground border-t bg-background/70 backdrop-blur-md flex justify-between">
        <span>Lines: {content.split('\n').length}</span>
        <span>Characters: {content.length}</span>
        <span className="text-brand">
          <FileText className="h-3 w-3 inline mr-1" />
          Markdown
        </span>
      </div>
    </div>
  );
}