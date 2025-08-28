import { Rnd } from "react-rnd";
import { ReactNode, useCallback } from "react";
import { X, Minus } from "lucide-react";

export type WindowProps = {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized?: boolean;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onDragStop: (id: string, x: number, y: number) => void;
  onResizeStop: (id: string, width: number, height: number) => void;
  children: ReactNode;
};

export function DesktopWindow(props: WindowProps) {
  const {
    id, title, x, y, width, height, zIndex, minimized,
    onFocus, onClose, onMinimize, onDragStop, onResizeStop, children
  } = props;

  const handleFocus = useCallback(() => onFocus(id), [id, onFocus]);

  if (minimized) return null;

  return (
    <Rnd
      default={{ x, y, width, height }}
      bounds="parent"
      minWidth={320}
      minHeight={200}
      style={{ zIndex }}
      onMouseDown={handleFocus}
      onDragStop={(e, d) => onDragStop(id, d.x, d.y)}
      onResizeStop={(e, dir, ref, delta, position) => {
        onResizeStop(id, ref.offsetWidth, ref.offsetHeight);
        onDragStop(id, position.x, position.y);
      }}
      dragHandleClassName="window-drag-handle"
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      resizeHandleStyles={{
        bottomRight: {
          bottom: 0,
          right: 0,
          width: '20px',
          height: '20px',
          cursor: 'se-resize'
        }
      }}
      className="glass-surface rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-brand/30 transition-all duration-300 animate-slide-in-bottom"
    >
      <div className="window-drag-handle flex items-center justify-between px-4 py-3 border-b border-border/60 bg-background/80 backdrop-blur-lg cursor-move">
        <div className="font-semibold select-none truncate pr-2 text-foreground">{title}</div>
        <div className="flex items-center gap-3">
          <button 
            aria-label="Minimize" 
            onClick={() => onMinimize(id)} 
            className="hover-scale rounded-lg px-2 py-1 border border-border hover:border-brand/60 hover:bg-brand/15 transition-all duration-200 hover:glow-effect cursor-pointer"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Minus className="h-4 w-4" />
          </button>
          <button 
            aria-label="Close" 
            onClick={() => onClose(id)} 
            className="hover-scale rounded-lg px-2 py-1 border border-border hover:border-destructive/60 hover:bg-destructive/15 transition-all duration-200 hover:shadow-lg hover:shadow-destructive/25 cursor-pointer"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="h-[calc(100%-52px)] bg-card/98 backdrop-blur-sm">{children}</div>
    </Rnd>
  );
}
