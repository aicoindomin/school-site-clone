import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  return (
    <MainLayout>
      <section id="contact-info" className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get in touch with Balisai Public School
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Address</h3>
                <p className="text-muted-foreground text-sm">
                  Patnahat, Balisai, Ramnagar<br />
                  Purba Medinipur, West Bengal
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Phone</h3>
                <div className="text-muted-foreground text-sm space-y-1">
                  <p><a href="tel:9732743315" className="hover:text-primary transition-colors">9732743315</a></p>
                  <p><a href="tel:9083317144" className="hover:text-primary transition-colors">9083317144</a></p>
                  <p><a href="tel:9800640998" className="hover:text-primary transition-colors">9800640998</a></p>
                  <p><a href="tel:9093775146" className="hover:text-primary transition-colors">9093775146</a></p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Email</h3>
                <p className="text-muted-foreground text-sm">
                  <a 
                    href="mailto:info@balisaipublicschool.in" 
                    className="hover:text-primary transition-colors"
                  >
                    info@balisaipublicschool.in
                  </a>
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">School Timing</h3>
                <p className="text-muted-foreground text-sm">
                  Monday - Saturday<br />
                  9:00 AM - 4:00 PM
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
