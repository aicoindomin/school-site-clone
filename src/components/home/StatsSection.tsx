import { GraduationCap, Users, Award, Calendar, TrendingUp } from "lucide-react";
import { useTranslatedTexts } from "@/components/TranslatedText";

const stats = [
  {
    icon: Calendar,
    value: "15+",
    label: "Years of Excellence",
    description: "Established in 2009",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: Users,
    value: "500+",
    label: "Students",
    description: "Growing every year",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    icon: GraduationCap,
    value: "50+",
    label: "Qualified Teachers",
    description: "Dedicated faculty",
    color: "from-violet-400 to-violet-600",
  },
  {
    icon: Award,
    value: "95%",
    label: "Pass Rate",
    description: "Academic excellence",
    color: "from-amber-400 to-orange-500",
  },
];

export function StatsSection() {
  const labels = useTranslatedTexts(stats.map(s => s.label));
  const descriptions = useTranslatedTexts(stats.map(s => s.description));

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient opacity-90" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-black/10 rounded-full blur-3xl" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      
      <div className="container relative">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <TrendingUp className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Our Achievements</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Numbers That <span className="text-secondary">Speak</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            A legacy of excellence reflected in our growing community
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`group relative animate-fade-in-up stagger-${index + 1}`}
              style={{ animationFillMode: 'both' }}
            >
              {/* Card with glass effect */}
              <div className="relative p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/10 overflow-hidden">
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`w-18 h-18 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <stat.icon className="w-9 h-9 text-white" />
                </div>
                
                {/* Value with animation */}
                <p className="font-display text-5xl md:text-6xl font-bold text-white mb-3 group-hover:scale-105 transition-transform duration-300 text-center">
                  {stat.value}
                </p>
                
                {/* Label */}
                <p className="text-lg font-semibold text-white mb-1 text-center">{labels[index]}</p>
                
                {/* Description */}
                <p className="text-white/60 text-sm text-center">{descriptions[index]}</p>
                
                {/* Decorative line */}
                <div className="mt-6 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
