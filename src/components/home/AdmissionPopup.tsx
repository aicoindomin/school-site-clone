import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import admissionImg from "@/assets/admission-popup.jpg";

export function AdmissionPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if user has already seen the popup this session
      const hasSeenPopup = sessionStorage.getItem("admissionPopupSeen");
      if (!hasSeenPopup) {
        setIsOpen(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("admissionPopupSeen", "true");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 border-0 bg-transparent overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Admission Information 2026</DialogTitle>
        </VisuallyHidden>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-2 top-2 z-50 rounded-full bg-white/90 hover:bg-white p-2 shadow-lg transition-all hover:scale-110"
          aria-label="Close popup"
        >
          <X className="w-6 h-6 text-gray-800" />
        </button>

        <div className="relative">
          {/* Admission Image */}
          <img
            src={admissionImg}
            alt="Admission Notice 2026"
            className="w-full h-auto rounded-lg"
          />

          {/* Bengali Text Overlay */}
          <div className="bg-white rounded-lg p-4 md:p-6 max-h-[60vh] overflow-y-auto mt-2">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 text-center">
              ভর্তি সংক্রান্ত তথ্য - ২০২৬ শিক্ষাবর্ষ
            </h2>
            
            <p className="text-sm md:text-base text-foreground mb-4 leading-relaxed">
              2026 সালের শিক্ষাবর্ষে বালিসাই পাবলিক স্কুলে (প্রাক-প্রাথমিক থেকে পঞ্চম শ্রেণী) শিশুদের ভর্তির বয়স এবং তার জন্ম তারিখ নিম্নে উল্লিখিত করা হইল।
            </p>

            <div className="space-y-3 text-sm md:text-base text-foreground">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-semibold text-primary">(১) প্রাক প্রাথমিকে (Prep - I)</p>
                <p>ভর্তির জন্য শিশুর জন্ম তারিখ 02.01.2022 থেকে 01.01.2023এর মধ্যে হতে হবে অর্থাৎ শিশুর বয়স হতে হবে ৩ বছর অথবা ৩ বছরের বেশি কিন্তু ৪ বছরের কম</p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="font-semibold text-primary">(২) প্রাক প্রাথমিকে (K.G - I)</p>
                <p>ভর্তির জন্য শিশুর জন্ম তারিখ 02.01.2021থেকে 01.01.2022 এর মধ্যে হতে হবে অর্থাৎ শিশুর বয়স হতে হবে ৪ বছর অথবা ৪ বছরের বেশি কিন্তু ৫ বছরের কম</p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="font-semibold text-primary">(৩) প্রাক প্রাথমিকে (K.G - II)</p>
                <p>ভর্তির জন্য শিশুর জন্ম তারিখ 02.01.2020 থেকে 01.01.2021 এর মধ্যে হতে হবে অর্থাৎ শিশুর বয়স হতে হবে ৫ বছর অথবা ৫ বছরের বেশি কিন্তু ৬ বছরের কম।</p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="font-semibold text-primary">(৪) প্রথম শ্রেণীতে (I)</p>
                <p>ভর্তির জন্য শিশুর জন্ম তারিখ 02.01.2019 থেকে 01.01.2020 এর মধ্যে হতে হবে অর্থাৎ শিশুর বয়স হতে হবে ৬ বছর অথবা ৬ বছরের বেশি কিন্তু ৭ বছরের কম।</p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="font-semibold text-primary">(৫) দ্বিতীয় শ্রেণীতে (II)</p>
                <p>ভর্তির জন্য শিশুর জন্ম তারিখ 02.01.2018 থেকে 01.01.2019 এর মধ্যে হতে হবে অর্থাৎ শিশুর বয়স হতে হবে ৭ বছর অথবা ৭ বছরের বেশি কিন্তু ৮ বছরের কম।</p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="font-semibold text-primary">(৬) তৃতীয় শ্রেণীতে (III)</p>
                <p>ভর্তির জন্য শিশুর জন্ম তারিখ 02.01.2017 থেকে 01.01.2018 এর মধ্যে হতে হবে অর্থাৎ শিশুর বয়স হতে হবে ৮ বছর অথবা ৮ বছরের বেশি কিন্তু ৯ বছরের কম।</p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="font-semibold text-primary">(৭) চতুর্থ শ্রেণীতে (IV)</p>
                <p>ভর্তির জন্য শিশুর জন্ম তারিখ 02.01.2016 থেকে 01.01.2017 এর মধ্যে হতে হবে অর্থাৎ শিশুর বয়স হতে হবে ৯ বছর অথবা ৯ বছরের বেশি কিন্তু ১০ বছরের কম।</p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="font-semibold text-primary">(৮) পঞ্চম শ্রেণীতে (V)</p>
                <p>ভর্তির জন্য শিশুর জন্ম তারিখ 02.01.2015 থেকে 01.01.2016 এর মধ্যে হতে হবে অর্থাৎ শিশুর বয়স হতে হবে ১০ বছর অথবা ১০ বছরের বেশি কিন্তু ১১ বছরের কম।</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
