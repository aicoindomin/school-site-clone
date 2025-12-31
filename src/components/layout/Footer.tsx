import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Youtube } from "lucide-react";
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
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Balisai Public School" className="w-14 h-14 rounded-full bg-white p-1" />
              <div>
                <h3 className="font-display text-lg font-bold">Balisai Public School</h3>
                <p className="text-xs text-muted-foreground">Estd. 2009</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Nurturing young minds and building a foundation for a brighter future through quality education and holistic development.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.title}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Academics</h4>
            <ul className="space-y-2">
              {academicLinks.map((link) => (
                <li key={link.title}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Patnahat, Balisai, Ramnagar,<br />Purba Medinipur, West Bengal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <a href="tel:9732743315" className="hover:text-primary transition-colors">9732743315</a><br />
                  <a href="tel:9083317144" className="hover:text-primary transition-colors">9083317144</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:info@balisaipublicschool.in" className="text-sm text-muted-foreground hover:text-primary transition-colors">info@balisaipublicschool.in</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Balisai Public School. All rights reserved.</p>
            <p>Reg No: S/1L/69181</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
