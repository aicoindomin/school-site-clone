import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface GalleryVideoPlayerProps {
  src: string;
  title: string;
  className?: string;
}

export function GalleryVideoPlayer({ src, title, className = "" }: GalleryVideoPlayerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Attempt to play the video when it's loaded
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay was prevented, that's okay
      });
    }
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        ref={videoRef}
        src={src}
        title={title}
        className="w-full h-full object-cover rounded-2xl"
        loop
        muted={isMuted}
        playsInline
        autoPlay
      />
      
      {/* Volume button - always visible on hover */}
      <button
        onClick={toggleMute}
        className={`absolute bottom-3 right-3 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:bg-black/80 hover:scale-110 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>
      
      {/* Video indicator badge */}
      <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        VIDEO
      </div>
    </div>
  );
}
