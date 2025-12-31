import { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import heroImg1 from "@/assets/slider/hero-bg.jpg";
import heroImg2 from "@/assets/slider/event.jpg";
import heroImg3 from "@/assets/slider/independence-day.jpg";
import heroImg4 from "@/assets/slider/parade.jpg";
import chairmanImg from "@/assets/leadership/chairman.png";
import principalImg from "@/assets/leadership/principal.png";

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
    name: "Puspendu Sekhar Dey",
    image: chairmanImg,
    link: "#leadership-section",
  },
  {
    title: "Principal",
    name: "Puspendu Pradhan",
    image: principalImg,
    link: "#leadership-section",
  },
];

// 3D Cube Grid Configuration
const GRID_COLS = 8;
const GRID_ROWS = 5;

interface CubeProps {
  index: number;
  row: number;
  col: number;
  currentImage: string;
  nextImage: string;
  isTransitioning: boolean;
  transitionPhase: 'idle' | 'explode' | 'reform';
}

function Cube3D({ index, row, col, currentImage, nextImage, isTransitioning, transitionPhase }: CubeProps) {
  const delay = (row + col) * 50 + Math.random() * 100;
  
  const randomRotateX = useMemo(() => (Math.random() - 0.5) * 720, []);
  const randomRotateY = useMemo(() => (Math.random() - 0.5) * 720, []);
  const randomRotateZ = useMemo(() => (Math.random() - 0.5) * 360, []);
  const randomTranslateX = useMemo(() => (Math.random() - 0.5) * 400, []);
  const randomTranslateY = useMemo(() => (Math.random() - 0.5) * 400, []);
  const randomTranslateZ = useMemo(() => Math.random() * 500 + 200, []);

  const cubeWidth = 100 / GRID_COLS;
  const cubeHeight = 100 / GRID_ROWS;

  const getTransform = () => {
    if (transitionPhase === 'explode') {
      return `
        translate3d(${randomTranslateX}px, ${randomTranslateY}px, ${randomTranslateZ}px)
        rotateX(${randomRotateX}deg)
        rotateY(${randomRotateY}deg)
        rotateZ(${randomRotateZ}deg)
        scale(0.3)
      `;
    }
    return 'translate3d(0, 0, 0) rotateX(0) rotateY(0) rotateZ(0) scale(1)';
  };

  const getOpacity = () => {
    if (transitionPhase === 'explode') return 0;
    return 1;
  };

  return (
    <div
      className="absolute transition-all ease-out"
      style={{
        width: `calc(${cubeWidth}% + 1px)`,
        height: `calc(${cubeHeight}% + 1px)`,
        left: `${col * cubeWidth}%`,
        top: `${row * cubeHeight}%`,
        transform: getTransform(),
        opacity: getOpacity(),
        transitionDuration: transitionPhase === 'explode' ? '800ms' : '600ms',
        transitionDelay: transitionPhase === 'explode' ? `${delay}ms` : `${(GRID_COLS + GRID_ROWS - row - col) * 30}ms`,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Cube Face */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: transitionPhase === 'idle' ? '0' : '2px',
          boxShadow: transitionPhase === 'idle' 
            ? 'none' 
            : '0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3)',
        }}
      >
        <div
          className="absolute"
          style={{
            width: `${GRID_COLS * 100}%`,
            height: `${GRID_ROWS * 100}%`,
            left: `${-col * 100}%`,
            top: `${-row * 100}%`,
            backgroundImage: `url(${transitionPhase === 'reform' ? nextImage : currentImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
      
      {/* Neon Edge Glow - Only during transition */}
      {isTransitioning && transitionPhase !== 'idle' && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-sm"
          style={{
            border: '1px solid rgba(0, 255, 255, 0.6)',
            boxShadow: `
              inset 0 0 10px rgba(0, 255, 255, 0.3),
              0 0 5px rgba(0, 255, 255, 0.5)
            `,
          }}
        />
      )}
    </div>
  );
}

export function HeroSlider3D() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(1);
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'explode' | 'reform'>('idle');
  const [displayedSlide, setDisplayedSlide] = useState(0);

  const startTransition = useCallback((newSlide: number) => {
    if (transitionPhase !== 'idle') return;
    
    setNextSlide(newSlide);
    setTransitionPhase('explode');
    
    // After explode animation, start reform
    setTimeout(() => {
      setDisplayedSlide(newSlide);
      setTransitionPhase('reform');
    }, 1200);
    
    // After reform, go back to idle
    setTimeout(() => {
      setCurrentSlide(newSlide);
      setTransitionPhase('idle');
    }, 2200);
  }, [transitionPhase]);

  const goToNext = useCallback(() => {
    const next = (currentSlide + 1) % slides.length;
    startTransition(next);
  }, [currentSlide, startTransition]);

  const goToPrev = useCallback(() => {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    startTransition(prev);
  }, [currentSlide, startTransition]);

  const goToSlide = useCallback((index: number) => {
    if (index !== currentSlide) {
      startTransition(index);
    }
  }, [currentSlide, startTransition]);

  useEffect(() => {
    const timer = setInterval(goToNext, 6000);
    return () => clearInterval(timer);
  }, [goToNext]);

  // Generate cube grid
  const cubes = useMemo(() => {
    const cubeArray = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        cubeArray.push({ row, col, index: row * GRID_COLS + col });
      }
    }
    return cubeArray;
  }, []);

  return (
    <section className="bg-muted py-6">
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main 3D Slider */}
          <div className="lg:col-span-2 relative rounded-lg overflow-hidden shadow-2xl">
            {/* Neon Border Glow */}
            <div 
              className="absolute -inset-1 rounded-xl opacity-75 blur-sm z-0"
              style={{
                background: 'linear-gradient(45deg, #00ffff, #ff00ff, #00ffff)',
                animation: 'neonPulse 3s ease-in-out infinite',
              }}
            />
            
            <div 
              className="relative aspect-[16/10] bg-black rounded-lg overflow-hidden z-10"
              style={{ perspective: '1500px' }}
            >
              {/* 3D Cube Grid */}
              <div 
                className="absolute inset-0"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {cubes.map((cube) => (
                  <Cube3D
                    key={cube.index}
                    index={cube.index}
                    row={cube.row}
                    col={cube.col}
                    currentImage={slides[displayedSlide].image}
                    nextImage={slides[nextSlide].image}
                    isTransitioning={transitionPhase !== 'idle'}
                    transitionPhase={transitionPhase}
                  />
                ))}
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-20" />
              
              {/* Content Overlay */}
              <div 
                className={`absolute bottom-0 left-0 right-0 p-6 z-30 transition-all duration-500 ${
                  transitionPhase === 'explode' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
              >
                <h2 
                  className="font-display text-2xl md:text-3xl font-bold mb-2 text-white"
                  style={{
                    textShadow: '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(255, 0, 255, 0.5)',
                  }}
                >
                  {slides[displayedSlide].title}
                </h2>
                <p 
                  className="text-white/90"
                  style={{
                    textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
                  }}
                >
                  {slides[displayedSlide].subtitle}
                </p>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={goToPrev}
                disabled={transitionPhase !== 'idle'}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all z-30 disabled:opacity-50"
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '2px solid rgba(0, 255, 255, 0.5)',
                  boxShadow: '0 0 15px rgba(0, 255, 255, 0.5), inset 0 0 10px rgba(0, 255, 255, 0.2)',
                }}
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                disabled={transitionPhase !== 'idle'}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all z-30 disabled:opacity-50"
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '2px solid rgba(255, 0, 255, 0.5)',
                  boxShadow: '0 0 15px rgba(255, 0, 255, 0.5), inset 0 0 10px rgba(255, 0, 255, 0.2)',
                }}
                aria-label="Next slide"
              >
                <svg className="w-6 h-6 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Neon Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    disabled={transitionPhase !== 'idle'}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === displayedSlide ? 'scale-125' : 'hover:scale-110'
                    }`}
                    style={{
                      background: index === displayedSlide 
                        ? 'linear-gradient(45deg, #00ffff, #ff00ff)' 
                        : 'rgba(255, 255, 255, 0.4)',
                      boxShadow: index === displayedSlide 
                        ? '0 0 15px #00ffff, 0 0 30px #ff00ff' 
                        : 'none',
                    }}
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
              <Card 
                key={index} 
                className="overflow-hidden hover-lift border-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(255, 0, 255, 0.05))',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), 0 0 30px rgba(0, 255, 255, 0.1)',
                }}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div 
                    className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                    style={{
                      border: '2px solid rgba(0, 255, 255, 0.3)',
                      boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
                    }}
                  >
                    <img
                      src={person.image}
                      alt={person.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 
                      className="font-display text-xl font-semibold text-primary"
                      style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.3)' }}
                    >
                      {person.title}
                    </h3>
                    <p className="text-foreground font-medium">{person.name}</p>
                    <a
                      href={person.link}
                      className="text-primary hover:text-primary/80 text-sm inline-flex items-center gap-1 mt-1 transition-all hover:gap-2"
                    >
                      Read message
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                asChild
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 border-2 transition-all hover:scale-105"
                style={{
                  borderColor: 'rgba(0, 255, 255, 0.3)',
                  background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.05), transparent)',
                }}
              >
                <Link to="/routine">
                  <Calendar className="w-6 h-6 text-cyan-500" />
                  <span>Class Routine</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 border-2 transition-all hover:scale-105"
                style={{
                  borderColor: 'rgba(255, 0, 255, 0.3)',
                  background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.05), transparent)',
                }}
              >
                <Link to="/results">
                  <FileText className="w-6 h-6 text-fuchsia-500" />
                  <span>Results</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Neon Animation Styles */}
      <style>{`
        @keyframes neonPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </section>
  );
}
