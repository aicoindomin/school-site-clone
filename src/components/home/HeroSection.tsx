import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('/placeholder.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground/90 text-sm mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Admissions Open for 2024-25
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6 animate-slide-up">
            Shaping{" "}
            <span className="text-secondary">Bright</span>
            <br />
            Futures Together
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl animate-slide-up stagger-1" style={{ opacity: 0 }}>
            Empowering young minds with excellence in academics, sports, 
            and character building. Join our legacy of success.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-2" style={{ opacity: 0 }}>
            <Button
              asChild
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base px-8"
            >
              <Link to="/admission">
                Apply for Admission
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base"
            >
              <a href="#virtual-tour">
                <Play className="mr-2 w-5 h-5" />
                Virtual Tour
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-primary-foreground/20 animate-fade-in stagger-3" style={{ opacity: 0 }}>
            <div>
              <p className="font-display text-3xl md:text-4xl font-bold text-secondary">40+</p>
              <p className="text-sm text-primary-foreground/70 mt-1">Years of Excellence</p>
            </div>
            <div>
              <p className="font-display text-3xl md:text-4xl font-bold text-secondary">5000+</p>
              <p className="text-sm text-primary-foreground/70 mt-1">Students</p>
            </div>
            <div>
              <p className="font-display text-3xl md:text-4xl font-bold text-secondary">98%</p>
              <p className="text-sm text-primary-foreground/70 mt-1">Pass Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
