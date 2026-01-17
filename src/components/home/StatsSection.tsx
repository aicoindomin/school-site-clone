import { GraduationCap, Users, Award, Calendar } from "lucide-react";
import { TranslatedText, useTranslatedTexts } from "@/components/TranslatedText";

const stats = [
  {
    icon: Calendar,
    value: "15+",
    label: "Years of Excellence",
    description: "Established in 2009",
  },
  {
    icon: Users,
    value: "500+",
    label: "Students",
    description: "Growing every year",
  },
  {
    icon: GraduationCap,
    value: "50+",
    label: "Qualified Teachers",
    description: "Dedicated faculty",
  },
  {
    icon: Award,
    value: "95%",
    label: "Pass Rate",
    description: "Academic excellence",
  },
];

export function StatsSection() {
  const labels = useTranslatedTexts(stats.map(s => s.label));
  const descriptions = useTranslatedTexts(stats.map(s => s.description));

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-primary" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container relative">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-inner-glow">
                <stat.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <p className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-2 group-hover:scale-105 transition-transform">
                {stat.value}
              </p>
              <p className="text-lg font-medium text-primary-foreground mb-1">{labels[index]}</p>
              <p className="text-primary-foreground/70 text-sm">{descriptions[index]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
