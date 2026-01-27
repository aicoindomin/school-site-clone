import { useState, useRef, useEffect } from "react";
import { X, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  media_type: string | null;
}

interface GalleryLightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryLightbox({ 
  items, 
  currentIndex, 
  isOpen, 
  onClose, 
  onNavigate 
}: GalleryLightboxProps) {
  const [isMuted, setIsMuted] = useState(false); // Start unmuted for lightbox
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentItem = items[currentIndex];

  useEffect(() => {
    if (isOpen && currentItem?.media_type === "video" && videoRef.current) {
      // Play video when lightbox opens
      videoRef.current.play().catch(() => {});
    }
  }, [isOpen, currentIndex, currentItem]);

  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    onNavigate(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    onNavigate(newIndex);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  if (!currentItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>{currentItem.title}</DialogTitle>
        </VisuallyHidden>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Media content */}
        <div className="w-full h-[85vh] flex items-center justify-center p-4">
          {currentItem.media_type === "video" ? (
            <div className="relative max-w-full max-h-full">
              <video
                ref={videoRef}
                src={currentItem.image_url}
                className="max-w-full max-h-[80vh] rounded-lg"
                loop
                muted={isMuted}
                playsInline
                autoPlay
                controls={false}
              />
              {/* Volume button for video */}
              <button
                onClick={toggleMute}
                className="absolute bottom-4 right-4 z-10 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
            </div>
          ) : (
            <img
              src={currentItem.image_url}
              alt={currentItem.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          )}
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white text-lg font-semibold text-center">
            {currentItem.title}
          </h3>
          <p className="text-white/60 text-sm text-center mt-1">
            {currentIndex + 1} / {items.length}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
