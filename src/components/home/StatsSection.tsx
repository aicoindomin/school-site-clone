import { GraduationCap, Users, Award, Calendar } from "lucide-react";

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
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8" />
              </div>
              <p className="font-display text-4xl font-bold mb-2">{stat.value}</p>
              <p className="text-lg font-medium mb-1">{stat.label}</p>
              <p className="text-primary-foreground/70 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
