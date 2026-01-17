import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Youtube } from "lucide-react";
import { TranslatedText, useTranslatedTexts } from "@/components/TranslatedText";
import logo from "@/assets/logo.png";

const quickLinks = [
  { title: "About Us", href: "/about" },
  { title: "Admission", href: "/admission" },
  { title: "Gallery", href: "/gallery" },
  { title: "Contact", href: "/contact" },
  { title: "Careers", href: "/careers" },
];

const academicLinks = [
  { title: "Class Routine", href: "/routine" },
  { title: "Exam Results", href: "/results" },
  { title: "Holidays", href: "/holidays" },
  { title: "Faculty", href: "/faculty" },
  { title: "Students", href: "/students" },
];

export function Footer() {
  const quickLinkTexts = useTranslatedTexts(quickLinks.map(l => l.title));
  const academicLinkTexts = useTranslatedTexts(academicLinks.map(l => l.title));

  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container py-14 relative">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* School Info */}
          <div>
            <Link to="/" className="flex items-center gap-4 mb-5 group">
              <div className="relative">
                <img src={logo} alt="Balisai Public School" className="w-16 h-16 rounded-full bg-white p-1 shadow-lg group-hover:scale-105 transition-transform" />
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-30 blur-sm transition-opacity" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">Balisai Public School</h3>
                <p className="text-xs text-muted-foreground">Estd. 2009</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              <TranslatedText>Nurturing young minds and building a foundation for a brighter future through quality education and holistic development.</TranslatedText>
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/p/Balisai-Public-School-Patnahat-Balisai-Purba-Medinipur-100090241681438/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-primary hover:shadow-glow flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl bg-white/10 hover:bg-destructive hover:shadow-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-secondary rounded-full" />
              <TranslatedText>Quick Links</TranslatedText>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={link.title}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 group-hover:bg-primary transition-colors" />
                    {quickLinkTexts[index]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academics */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-secondary rounded-full" />
              <TranslatedText>Academics</TranslatedText>
            </h4>
            <ul className="space-y-3">
              {academicLinks.map((link, index) => (
                <li key={link.title}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 group-hover:bg-primary transition-colors" />
                    {academicLinkTexts[index]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-secondary rounded-full" />
              <TranslatedText>Contact Us</TranslatedText>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed">Patnahat, Balisai, Ramnagar,<br />Purba Medinipur, West Bengal</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground">
                  <a href="tel:9732743315" className="hover:text-primary transition-colors">9732743315</a><br />
                  <a href="tel:9083317144" className="hover:text-primary transition-colors">9083317144</a>
                </div>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <a href="mailto:info@balisaipublicschool.in" className="text-sm text-muted-foreground hover:text-primary transition-colors">info@balisaipublicschool.in</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 relative">
        <div className="container py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Balisai Public School. <TranslatedText>All rights reserved.</TranslatedText></p>
            <p className="flex items-center gap-2">
              <span className="w-6 h-0.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] rounded-full" />
              Reg No: S/1L/69181
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
