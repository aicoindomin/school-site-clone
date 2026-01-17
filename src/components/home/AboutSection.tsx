import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Trophy, Heart } from "lucide-react";
import { useTranslatedTexts } from "@/components/TranslatedText";

const features = [
  {
    icon: BookOpen,
    title: "Quality Education",
    description: "Comprehensive curriculum with modern teaching methods",
  },
  {
    icon: Users,
    title: "Experienced Faculty",
    description: "Dedicated teachers committed to student success",
  },
  {
    icon: Trophy,
    title: "Co-curricular Activities",
    description: "Sports, arts, and cultural programs for holistic development",
  },
  {
    icon: Heart,
    title: "Value-Based Learning",
    description: "Instilling moral values and ethics in young minds",
  },
];

export function AboutSection() {
  const textsToTranslate = useMemo(() => [
    "Welcome to",
    "Balisai Public School",
    "Established in 2009, Balisai Public School has been a beacon of quality education in Purba Medinipur district. We are committed to nurturing young minds and preparing students for the challenges of tomorrow.",
    "Our school provides a balanced education that emphasizes academic excellence alongside co-curricular activities. We believe in developing well-rounded individuals who can contribute positively to society.",
    "Learn More About Us",
    "Quality Education",
    "Comprehensive curriculum with modern teaching methods",
    "Experienced Faculty",
    "Dedicated teachers committed to student success",
    "Co-curricular Activities",
    "Sports, arts, and cultural programs for holistic development",
    "Value-Based Learning",
    "Instilling moral values and ethics in young minds",
  ], []);

  const translatedTexts = useTranslatedTexts(textsToTranslate);
  
  const t = useMemo(() => {
    const map: Record<string, string> = {};
    textsToTranslate.forEach((text, index) => {
      map[text] = translatedTexts[index] || text;
    });
    return map;
  }, [textsToTranslate, translatedTexts]);

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-warm opacity-50" />
      <div className="absolute top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <span className="accent-dot animate-pulse" />
              <span className="text-sm font-medium text-primary">{t["Welcome to"]}</span>
            </div>
            
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {t["Balisai Public School"]}
            </h2>
            
            <div className="accent-bar w-20 mb-6" />
            
            <p className="text-muted-foreground mb-5 leading-relaxed text-base md:text-lg">
              {t["Established in 2009, Balisai Public School has been a beacon of quality education in Purba Medinipur district. We are committed to nurturing young minds and preparing students for the challenges of tomorrow."]}
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed text-base md:text-lg">
              {t["Our school provides a balanced education that emphasizes academic excellence alongside co-curricular activities. We believe in developing well-rounded individuals who can contribute positively to society."]}
            </p>
            
            <Button asChild size="lg" className="btn-primary group">
              <Link to="/about">
                {t["Learn More About Us"]}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`glass-card p-6 rounded-2xl card-3d hover-glow stagger-${index + 1}`}
                style={{ animationFillMode: 'both' }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5 shadow-inner-glow">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {t[feature.title] || feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t[feature.description] || feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
