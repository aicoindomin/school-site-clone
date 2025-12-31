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
      <DialogContent className="max-w-2xl w-[90vw] p-0 border-0 bg-transparent overflow-hidden [&>button]:hidden">
        <VisuallyHidden>
          <DialogTitle>Admission Open 2026</DialogTitle>
        </VisuallyHidden>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-white/90 hover:bg-white p-2 shadow-lg transition-all hover:scale-110"
          aria-label="Close popup"
        >
          <X className="w-6 h-6 text-gray-800" />
        </button>

        <div className="relative">
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
