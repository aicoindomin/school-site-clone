import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Trophy, Heart, Sparkles } from "lucide-react";
import { useTranslatedTexts } from "@/components/TranslatedText";

const features = [
  {
    icon: BookOpen,
    title: "Quality Education",
    description: "Comprehensive curriculum with modern teaching methods",
    color: "from-blue-500 to-blue-600",
    shadow: "shadow-blue-500/20",
  },
  {
    icon: Users,
    title: "Experienced Faculty",
    description: "Dedicated teachers committed to student success",
    color: "from-purple-500 to-purple-600",
    shadow: "shadow-purple-500/20",
  },
  {
    icon: Trophy,
    title: "Co-curricular Activities",
    description: "Sports, arts, and cultural programs for holistic development",
    color: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
  },
  {
    icon: Heart,
    title: "Value-Based Learning",
    description: "Instilling moral values and ethics in young minds",
    color: "from-rose-500 to-pink-600",
    shadow: "shadow-rose-500/20",
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
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-70" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl float-bubble" />
      <div className="absolute bottom-20 -left-20 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl float-bubble-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl" />
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card mb-8">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm font-semibold text-primary">{t["Welcome to"]}</span>
            </div>
            
            {/* Title with gradient */}
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
                {t["Balisai Public School"]}
              </span>
            </h2>
            
            {/* Accent bar */}
            <div className="accent-bar w-24 mb-8" />
            
            {/* Description */}
            <p className="text-muted-foreground mb-5 leading-relaxed text-lg">
              {t["Established in 2009, Balisai Public School has been a beacon of quality education in Purba Medinipur district. We are committed to nurturing young minds and preparing students for the challenges of tomorrow."]}
            </p>
            <p className="text-muted-foreground mb-10 leading-relaxed text-lg">
              {t["Our school provides a balanced education that emphasizes academic excellence alongside co-curricular activities. We believe in developing well-rounded individuals who can contribute positively to society."]}
            </p>
            
            {/* CTA Button */}
            <Button asChild size="lg" className="btn-primary text-base group">
              <Link to="/about">
                {t["Learn More About Us"]}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
              </Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`premium-card p-6 hover-shadow-3d group animate-fade-in-up stagger-${index + 1}`}
                style={{ animationFillMode: 'both' }}
              >
                {/* Icon with gradient background */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {t[feature.title] || feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {t[feature.description] || feature.description}
                </p>
                
                {/* Hover indicator */}
                <div className="mt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
