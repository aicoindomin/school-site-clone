import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import admissionImg from "@/assets/admission-popup.png";

export function AdmissionPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup this session
    const hasSeenPopup = sessionStorage.getItem("admissionPopupSeen");
    if (hasSeenPopup) return;

    // Show popup after 5 seconds (no auto-close - user must click X)
    const showTimer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem("admissionPopupSeen", "true");
    }, 5000);

    return () => {
      clearTimeout(showTimer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl w-[90vw] p-0 border-0 bg-transparent overflow-visible [&>button]:hidden">
        <VisuallyHidden>
          <DialogTitle>Admission Open 2026</DialogTitle>
        </VisuallyHidden>
        
        {/* Close button - prominently visible outside the image */}
        <button
          onClick={handleClose}
          className="absolute -right-2 -top-2 md:-right-4 md:-top-4 z-[100] rounded-full bg-red-600 hover:bg-red-700 p-2.5 md:p-3 shadow-2xl transition-all hover:scale-110 border-4 border-white ring-4 ring-red-600/30"
          aria-label="Close popup"
          style={{ boxShadow: '0 4px 20px rgba(220, 38, 38, 0.5)' }}
        >
          <X className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={3} />
        </button>

        <div className="relative rounded-lg overflow-hidden">
          {/* Admission Image Only */}
          <img
            src={admissionImg}
            alt="Admission Open - Balisai Public School 2026"
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
