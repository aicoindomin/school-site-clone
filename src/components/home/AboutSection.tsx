import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const features = [
  "ICSE & ISC Board Affiliation",
  "Experienced & Caring Faculty",
  "Modern Smart Classrooms",
  "State-of-the-art Sports Facilities",
  "Rich Co-curricular Programs",
  "Character Building Focus",
];

export function AboutSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-elegant">
              <img
                src="/placeholder.svg"
                alt="School campus"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Stats Card */}
            <div className="absolute -bottom-6 -right-6 bg-card rounded-2xl shadow-elegant p-6 hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="font-display text-2xl font-bold text-primary-foreground">40+</span>
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">Years</p>
                  <p className="text-muted-foreground text-sm">of Excellence</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="inline-block text-primary font-medium text-sm uppercase tracking-wider mb-4">
              About Our School
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Building Tomorrow's Leaders Today
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Calcutta Public School is a premier educational institution dedicated to 
              nurturing young minds and shaping future leaders. Established with a vision 
              to provide holistic education, we combine academic excellence with character 
              building, sports, and extracurricular activities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
