
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onBack?: () => void;
  autoPlay?: boolean;
}

const VideoPlayer = ({ videoUrl, title, onBack, autoPlay = false }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Control visibility timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(timer);
      setShowControls(true);
      
      if (isPlaying) {
        timer = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };
    
    resetTimer();
    
    const playerElement = playerRef.current;
    if (playerElement) {
      playerElement.addEventListener('mousemove', resetTimer);
      playerElement.addEventListener('click', resetTimer);
    }
    
    return () => {
      clearTimeout(timer);
      if (playerElement) {
        playerElement.removeEventListener('mousemove', resetTimer);
        playerElement.removeEventListener('click', resetTimer);
      }
    };
  }, [isPlaying]);
  
  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration);
    const onEnded = () => setIsPlaying(false);
    
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('ended', onEnded);
    
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('ended', onEnded);
    };
  }, []);
  
  // Play/pause control
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.play().catch(error => {
        console.error('Failed to play:', error);
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);
  
  // Volume control
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.volume = volume;
    setIsMuted(volume === 0);
  }, [volume]);
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Toggle play/pause
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };
  
  // Seek video
  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = value[0];
    setCurrentTime(value[0]);
  };
  
  // Toggle mute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMuted) {
      setVolume(1);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };
  
  // Volume change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };
  
  // Toggle fullscreen
  const toggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!document.fullscreenElement) {
      if (playerRef.current?.requestFullscreen) {
        await playerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  return (
    <div 
      ref={playerRef}
      className="relative w-full h-full rounded-lg overflow-hidden bg-black"
      onDoubleClick={toggleFullscreen}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        onClick={togglePlay}
        playsInline
      />
      
      {/* Video overlay for controls */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-300 flex flex-col justify-between",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Top controls */}
        <div className="p-4 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center">
            {onBack && (
              <button 
                onClick={() => onBack()} 
                className="mr-2 rounded-full p-1 hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
            )}
            <h2 className="text-white font-medium truncate">{title}</h2>
          </div>
        </div>
        
        {/* Middle play/pause button */}
        {!isPlaying && (
          <button 
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform hover:scale-110"
          >
            <Play className="h-10 w-10 text-white" fill="white" />
          </button>
        )}
        
        {/* Bottom controls */}
        <div className="p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex flex-col space-y-2">
            {/* Progress bar */}
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.01}
              onValueChange={handleSeek}
              className="w-full"
            />
            
            {/* Controls row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={togglePlay}
                  className="rounded-full p-1 hover:bg-white/10 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-white" />
                  ) : (
                    <Play className="h-5 w-5 text-white" />
                  )}
                </button>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={toggleMute}
                    className="rounded-full p-1 hover:bg-white/10 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5 text-white" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-white" />
                    )}
                  </button>
                  
                  <Slider
                    value={[volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>
                
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <button 
                onClick={toggleFullscreen}
                className="rounded-full p-1 hover:bg-white/10 transition-colors"
              >
                <Maximize className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
