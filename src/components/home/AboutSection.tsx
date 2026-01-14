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
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <p className="text-primary font-medium mb-2">{t["Welcome to"]}</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t["Balisai Public School"]}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {t["Established in 2009, Balisai Public School has been a beacon of quality education in Purba Medinipur district. We are committed to nurturing young minds and preparing students for the challenges of tomorrow."]}
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {t["Our school provides a balanced education that emphasizes academic excellence alongside co-curricular activities. We believe in developing well-rounded individuals who can contribute positively to society."]}
            </p>
            <Button asChild>
              <Link to="/about">
                {t["Learn More About Us"]}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-xl shadow-sm hover-lift"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {t[feature.title] || feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
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
