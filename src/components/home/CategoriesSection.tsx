import { Link } from "react-router-dom";
import { BookOpen, Trophy, Music, Palette, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    title: "Academics",
    description: "Excellence in ICSE & ISC curriculum with dedicated faculty",
    icon: BookOpen,
    href: "/academics",
    color: "bg-primary",
  },
  {
    title: "Sports",
    description: "State-of-the-art facilities for football, cricket, and more",
    icon: Trophy,
    href: "/gallery?category=sports",
    color: "bg-accent",
  },
  {
    title: "Co-curricular",
    description: "Music, dance, drama, and leadership programs",
    icon: Music,
    href: "/gallery?category=activities",
    color: "bg-school-burgundy",
  },
  {
    title: "Arts & Culture",
    description: "Nurturing creativity through visual and performing arts",
    icon: Palette,
    href: "/gallery?category=events",
    color: "bg-secondary",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Student Life
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the diverse opportunities that await at Calcutta Public School
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link key={category.title} to={category.href}>
              <Card 
                className="group hover-lift cursor-pointer h-full border-0 shadow-elegant overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl ${category.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
