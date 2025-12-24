import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, MapPin, Clock } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 bg-gradient-hero text-primary-foreground">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* CTA Content */}
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Admissions Open for 2025-26
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Give your child the gift of quality education. Join Balisai Public School 
              and become part of our growing family of achievers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link to="/admission">
                  Apply for Admission
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          {/* Contact Info Cards */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Our Location</h3>
                  <p className="text-primary-foreground/80">
                    Patnahat, Balisai, Ramnagar<br />
                    Purba Medinipur, West Bengal
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Contact Numbers</h3>
                  <p className="text-primary-foreground/80">
                    <a href="tel:9732743315" className="hover:text-secondary transition-colors">9732743315</a>
                    {" / "}
                    <a href="tel:9083317144" className="hover:text-secondary transition-colors">9083317144</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">School Timing</h3>
                  <p className="text-primary-foreground/80">
                    Monday - Saturday<br />
                    9:00 AM - 4:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
