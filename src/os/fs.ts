export type FileNode = { type: 'file'; content: string };
export type DirNode = { type: 'dir'; children: Record<string, NodeEntry> };
export type NodeEntry = FileNode | DirNode;

const FS_KEY = 'nebula-fs-v1';

function defaultFS(): DirNode {
  return {
    type: 'dir',
    children: {
      home: {
        type: 'dir',
        children: {
          user: {
            type: 'dir',
            children: {
              'README.md': {
                type: 'file',
                content:
`# Welcome to NebulaOS

Type 'help' in the Terminal to see available commands.

Try:
- ls, cd, pwd
- mkdir sandbox && cd sandbox
- touch hello.txt && echo "hi" > hello.txt
- cat hello.txt
- js 1 + 2 * 3
`
              },
              'notes.js': { type: 'file', content: 'console.log("NebulaOS ready")' },
            },
          },
        },
      },
    },
  };
}

function load(): DirNode {
  try {
    const raw = localStorage.getItem(FS_KEY);
    if (!raw) return defaultFS();
    const parsed = JSON.parse(raw) as DirNode;
    return parsed;
  } catch {
    return defaultFS();
  }
}

function save(root: DirNode) {
  localStorage.setItem(FS_KEY, JSON.stringify(root));
}

function splitPath(path: string): string[] {
  const clean = path.replace(/\\+/g, '/').replace(/\s+/g, ' ').trim();
  const parts = clean.split('/').filter(Boolean);
  return parts;
}

function resolve(root: DirNode, path: string): { parent: DirNode | null; name: string; node: NodeEntry | null } {
  if (path === '/' || path === '') return { parent: null, name: '', node: root };
  const parts = splitPath(path);
  let current: DirNode = root;
  for (let i = 0; i < parts.length; i++) {
    const name = parts[i];
    const node = current.children[name];
    if (!node) return { parent: i === parts.length - 1 ? current : null, name, node: null };
    if (i === parts.length - 1) return { parent: current, name, node };
    if (node.type !== 'dir') return { parent: null, name, node: null };
    current = node;
  }
  return { parent: null, name: '', node: null };
}

export const fs = {
  root: undefined as unknown as DirNode,
  init() {
    this.root = load();
  },
  persist() {
    save(this.root);
  },
  list(path: string): { name: string; type: 'file' | 'dir' }[] {
    const res = resolve(this.root, path);
    const node = res.node;
    if (!node || node.type !== 'dir') return [];
    return Object.entries(node.children).map(([name, entry]) => ({ name, type: entry.type }));
  },
  mkdir(path: string) {
    const res = resolve(this.root, path);
    if (res.node) throw new Error('Already exists');
    if (!res.parent) throw new Error('Invalid path');
    res.parent.children[res.name] = { type: 'dir', children: {} };
    this.persist();
  },
  touch(path: string) {
    const res = resolve(this.root, path);
    if (res.node) throw new Error('Already exists');
    if (!res.parent) throw new Error('Invalid path');
    res.parent.children[res.name] = { type: 'file', content: '' };
    this.persist();
  },
  rm(path: string) {
    const res = resolve(this.root, path);
    if (!res.parent || !res.name) throw new Error('Invalid path');
    delete res.parent.children[res.name];
    this.persist();
  },
  readFile(path: string): string {
    const res = resolve(this.root, path);
    if (!res.node || res.node.type !== 'file') throw new Error('Not a file');
    return res.node.content;
  },
  writeFile(path: string, content: string) {
    const res = resolve(this.root, path);
    if (!res.node) {
      // create file recursively if parent exists
      const parts = splitPath(path);
      const dirPath = '/' + parts.slice(0, -1).join('/');
      const fileName = parts[parts.length - 1];
      const p = resolve(this.root, dirPath);
      if (!p.node || p.node.type !== 'dir') throw new Error('No such directory');
      p.node.children[fileName] = { type: 'file', content };
    } else {
      if (res.node.type !== 'file') throw new Error('Path is a directory');
      res.node.content = content;
    }
    this.persist();
  },
  exists(path: string): boolean {
    return !!resolve(this.root, path).node;
  },
};

// Initialize on module import for simplicity
fs.init();
