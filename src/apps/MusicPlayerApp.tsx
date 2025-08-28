import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Upload } from "lucide-react";

interface Track {
  id: string;
  name: string;
  url: string;
  duration: number;
}

export default function MusicPlayerApp() {
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: "demo1",
      name: "NebulaOS Theme (Demo)",
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
      duration: 30
    }
  ]);
  const [currentTrack, setCurrentTrack] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>([75]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      nextTrack();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.volume = volume[0] / 100;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setCurrentTime(0);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setCurrentTime(0);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        const audio = new Audio(url);
        
        audio.addEventListener('loadedmetadata', () => {
          const newTrack: Track = {
            id: Date.now().toString(),
            name: file.name.replace(/\.[^/.]+$/, ""),
            url: url,
            duration: audio.duration
          };
          
          setTracks(prev => [...prev, newTrack]);
        });
      }
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTrackData = tracks[currentTrack];

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-background to-background/80">
      <audio
        ref={audioRef}
        src={currentTrackData?.url}
        onLoadedData={() => setCurrentTime(0)}
      />

      {/* Header */}
      <div className="p-4 border-b bg-background/70 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-brand" />
            <h2 className="font-semibold">Music Player</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="hover-scale"
          >
            <Upload className="h-4 w-4 mr-2" />
            Add Music
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Now Playing */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-brand/20 to-brand-2/20 flex items-center justify-center mb-6 animate-pulse-glow">
          <Music className="h-24 w-24 text-brand/60" />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">
            {currentTrackData?.name || "No track selected"}
          </h3>
          <p className="text-muted-foreground">NebulaOS Music Player</p>
        </div>

        {/* Progress */}
        <div className="w-full max-w-md mb-6">
          <Slider
            value={[currentTime]}
            max={currentTrackData?.duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentTrackData?.duration || 0)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevTrack}
            className="hover-scale"
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button
            variant="default"
            size="icon"
            onClick={togglePlay}
            className="w-12 h-12 rounded-full hover-scale button-modern"
            disabled={!currentTrackData}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextTrack}
            className="hover-scale"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-full max-w-xs">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={volume}
            max={100}
            step={1}
            onValueChange={setVolume}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-8">{volume[0]}%</span>
        </div>
      </div>

      {/* Playlist */}
      <div className="border-t bg-background/70 backdrop-blur-md max-h-32 overflow-y-auto">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`p-2 cursor-pointer hover:bg-accent/50 transition-colors ${
              index === currentTrack ? 'bg-brand/10 border-l-2 border-brand' : ''
            }`}
            onClick={() => setCurrentTrack(index)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm truncate">{track.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatTime(track.duration)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}