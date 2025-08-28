import { useEffect, useMemo, useRef, useState } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { fs } from "@/os/fs";
import ChaosMode from "@/components/desktop/ChaosMode";

const PROMPT = "nebula@os";

function joinPath(cwd: string, path: string) {
  if (path.startsWith('/')) return path;
  const parts = (cwd + '/' + path).split('/').filter(Boolean);
  const stack: string[] = [];
  for (const p of parts) {
    if (p === '.') continue;
    if (p === '..') stack.pop();
    else stack.push(p);
  }
  return '/' + stack.join('/');
}

export default function TerminalApp() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const [cwd, setCwd] = useState<string>("/home/user");
  const [showChaos, setShowChaos] = useState<boolean>(false);

  const prompt = useMemo(() => `${PROMPT}:${cwd}$ `, [cwd]);

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      convertEol: true,
      fontFamily: 'ui-monospace, Menlo, Monaco, Consolas, monospace',
      theme: { background: '#00000000' },
    });
    termRef.current = term;
    term.open(containerRef.current!);

    const writePrompt = () => term.write(`\r\n${prompt}`);

    const print = (text: string = "") => term.writeln(text);

    const handleCommand = (line: string) => {
      const [cmd, ...args] = line.trim().split(/\s+/);
      
      // Track command for achievements
      if ((window as any).nebulaAchievements) {
        (window as any).nebulaAchievements.trackCommand(cmd);
      }
      
      try {
        switch (cmd) {
          case 'help':
            print('Commands: help, ls, cd, pwd, cat, echo, touch, mkdir, rm, clear, sudo, js');
            break;
          case 'ls': {
            const p = args[0] ? joinPath(cwd, args[0]) : cwd;
            const entries = fs.list(p);
            print(entries.map(e => e.type === 'dir' ? e.name + '/' : e.name).join('  '));
            break; }
          case 'cd': {
            const p = joinPath(cwd, args[0] || '/home/user');
            if (fs.exists(p)) setCwd(p);
            else print('No such file or directory');
            break; }
          case 'pwd':
            print(cwd);
            break;
          case 'cat': {
            const p = joinPath(cwd, args[0] || '');
            try { print(fs.readFile(p)); } catch { print('Not a file'); }
            break; }
          case 'echo': {
            const out = args.join(' ');
            const redirect = out.match(/^(.*)\s>\s(.+)$/);
            if (redirect) {
              const [, content, file] = redirect;
              const p = joinPath(cwd, file);
              fs.writeFile(p, content);
            } else {
              print(out);
            }
            break; }
          case 'touch': {
            const p = joinPath(cwd, args[0] || '');
            fs.touch(p);
            break; }
          case 'mkdir': {
            const p = joinPath(cwd, args[0] || '');
            fs.mkdir(p);
            break; }
          case 'rm': {
            const p = joinPath(cwd, args[0] || '');
            fs.rm(p);
            break; }
          case 'clear':
            term.clear();
            break;
          case 'sudo':
            print('Password: ******');
            setTimeout(() => print('Access Denied… just kidding 😄'), 300);
            break;
          case 'rm':
            if (args.includes('-rf') && args.includes('/')) {
              setShowChaos(true);
              return;
            }
            const p = joinPath(cwd, args[0] || '');
            fs.rm(p);
            break;
          case 'js': {
            const code = args.join(' ');
            try {
              // eslint-disable-next-line no-new-func
              const res = Function(`"use strict"; return (${code})`)();
              print(String(res));
            } catch (e: any) { print('Error: ' + e.message); }
            break; }
          case '': break;
          default:
            print(`Command not found: ${cmd}`);
        }
      } catch (e: any) {
        print('Error: ' + (e.message || String(e)));
      }
    };

    let buffer = '';
    term.write(prompt);
    const keyListener = term.onData((data) => {
      const code = data.charCodeAt(0);
      if (data === '\u0003') { // Ctrl+C
        term.write('^C');
        buffer = '';
        term.write(`\r\n${prompt}`);
        return;
      }
      if (data === '\r') { // Enter
        handleCommand(buffer);
        buffer = '';
        term.write(`\r\n${prompt}`);
        return;
      }
      if (code === 127) { // Backspace
        if (buffer.length > 0) {
          buffer = buffer.slice(0, -1);
          term.write('\b \b');
        }
        return;
      }
      if (code < 32) return; // ignore control
      buffer += data;
      term.write(data);
    });

    return () => {
      keyListener.dispose();
      term.dispose();
    };
  }, [prompt, cwd]);

  const handleChaosComplete = () => {
    setShowChaos(false);
    if ((window as any).nebulaAchievements) {
      (window as any).nebulaAchievements.unlockChaosAchievement();
    }
  };

  return (
    <div className="w-full h-full p-2">
      <div ref={containerRef} className="w-full h-full" />
      {showChaos && <ChaosMode onComplete={handleChaosComplete} />}
    </div>
  );
}
