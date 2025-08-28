import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, RotateCw, Download, Upload, Image as ImageIcon } from "lucide-react";

export default function ImageViewerApp() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [zoom, setZoom] = useState<number[]>([100]);
  const [rotation, setRotation] = useState<number>(0);
  const [brightness, setBrightness] = useState<number[]>([100]);
  const [contrast, setContrast] = useState<number[]>([100]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      // Reset transformations
      setZoom([100]);
      setRotation(0);
      setBrightness([100]);
      setContrast([100]);
    }
  };

  const zoomIn = () => setZoom([Math.min(zoom[0] + 25, 500)]);
  const zoomOut = () => setZoom([Math.max(zoom[0] - 25, 25)]);
  const rotate = () => setRotation((prev) => (prev + 90) % 360);

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'image';
    link.click();
  };

  const imageStyle = {
    transform: `scale(${zoom[0] / 100}) rotate(${rotation}deg)`,
    filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%)`,
    transition: 'transform 0.3s ease, filter 0.3s ease'
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b bg-background/70 backdrop-blur-md flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="hover-scale"
        >
          <Upload className="h-4 w-4 mr-2" />
          Load Image
        </Button>
        
        <div className="h-4 w-px bg-border mx-2" />
        
        <Button variant="ghost" size="sm" onClick={zoomOut} className="hover-scale">
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2 min-w-24">
          <Slider
            value={zoom}
            min={25}
            max={500}
            step={25}
            onValueChange={setZoom}
            className="w-20"
          />
          <span className="text-xs text-muted-foreground w-10">{zoom[0]}%</span>
        </div>
        
        <Button variant="ghost" size="sm" onClick={zoomIn} className="hover-scale">
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm" onClick={rotate} className="hover-scale">
          <RotateCw className="h-4 w-4" />
        </Button>
        
        {imageUrl && (
          <Button variant="ghost" size="sm" onClick={downloadImage} className="hover-scale">
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Image manipulation controls */}
      <div className="flex items-center gap-4 p-2 border-b bg-background/50 backdrop-blur-sm text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Brightness:</span>
          <Slider
            value={brightness}
            min={0}
            max={200}
            step={10}
            onValueChange={setBrightness}
            className="w-20"
          />
          <span className="text-xs text-muted-foreground w-10">{brightness[0]}%</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Contrast:</span>
          <Slider
            value={contrast}
            min={0}
            max={200}
            step={10}
            onValueChange={setContrast}
            className="w-20"
          />
          <span className="text-xs text-muted-foreground w-10">{contrast[0]}%</span>
        </div>
      </div>

      {/* Image display area */}
      <div className="flex-1 overflow-auto bg-background/20 backdrop-blur-sm">
        {imageUrl ? (
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={imageUrl}
              alt="Loaded image"
              style={imageStyle}
              className="max-w-none shadow-lg rounded-lg"
              draggable={false}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-16 w-16 text-brand/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Image Loaded</h3>
              <p className="text-muted-foreground mb-4">
                Click "Load Image" to view PNG, JPG, or other image files
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="hover-scale"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      {imageUrl && (
        <div className="p-2 text-xs text-muted-foreground border-t bg-background/70 backdrop-blur-md flex justify-between">
          <span>Zoom: {zoom[0]}% | Rotation: {rotation}°</span>
          <span>Brightness: {brightness[0]}% | Contrast: {contrast[0]}%</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}