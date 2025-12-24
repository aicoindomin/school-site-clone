import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Calendar, FileText, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import heroImg1 from "@/assets/slider/hero-bg.jpg";
import heroImg2 from "@/assets/slider/event.jpg";
import heroImg3 from "@/assets/slider/independence-day.jpg";
import heroImg4 from "@/assets/slider/parade.jpg";

const slides = [
  {
    image: heroImg1,
    title: "Annual Cultural Program 2025",
    subtitle: "Celebrating Excellence in Arts & Culture",
  },
  {
    image: heroImg2,
    title: "Basanta Utsav 2025",
    subtitle: "Welcoming Spring with Joy and Color",
  },
  {
    image: heroImg3,
    title: "Independence Day Celebration",
    subtitle: "Honoring Our Nation's Pride",
  },
  {
    image: heroImg4,
    title: "Republic Day Parade",
    subtitle: "Students Showcasing Patriotism",
  },
];

const functionaries = [
  {
    title: "Chairman",
    name: "To be updated",
    image: "/placeholder.svg",
    link: "/about/chairman-message",
  },
  {
    title: "Principal",
    name: "To be updated",
    image: "/placeholder.svg",
    link: "/about/principal-message",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="bg-muted py-6">
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Slider */}
          <div className="lg:col-span-2 relative rounded-lg overflow-hidden shadow-lg">
            <div className="relative aspect-[16/10] bg-foreground">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                      {slide.title}
                    </h2>
                    <p className="text-white/80">{slide.subtitle}</p>
                  </div>
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors shadow-md"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 text-foreground" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors shadow-md"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 text-foreground" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Functionaries */}
            {functionaries.map((person, index) => (
              <Card key={index} className="overflow-hidden hover-lift">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={person.image}
                      alt={person.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold text-primary">
                      {person.title}
                    </h3>
                    <p className="text-foreground font-medium">{person.name}</p>
                    <Link
                      to={person.link}
                      className="text-primary hover:text-primary/80 text-sm inline-flex items-center gap-1 mt-1"
                    >
                      Read profile...
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                asChild
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground"
              >
                <Link to="/routine">
                  <Calendar className="w-6 h-6" />
                  <span>Class Routine</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground"
              >
                <Link to="/results">
                  <FileText className="w-6 h-6" />
                  <span>Results</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
