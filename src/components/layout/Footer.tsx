import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, GraduationCap, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const quickLinks = [
  { title: "About Us", href: "/about" },
  { title: "Academics", href: "/academics" },
  { title: "Gallery", href: "/gallery" },
  { title: "Admission", href: "/admission" },
  { title: "Careers", href: "/careers" },
  { title: "Contact", href: "/contact" },
];

const resourceLinks = [
  { title: "School Calendar", href: "/academics/calendar" },
  { title: "Rules & Regulations", href: "/academics/rules" },
  { title: "Fee Payment", href: "/admission#fee-payment" },
  { title: "Results", href: "/#results" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* School Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">Calcutta Public School</h3>
                <p className="text-sm text-primary-foreground/70">Shaping Bright Futures</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              A premier educational institution committed to excellence in academics, 
              sports, and character building since 1985.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-secondary" />
                <span className="text-sm text-primary-foreground/80">
                  123 Education Lane,<br />
                  Kolkata, West Bengal 700001
                </span>
              </li>
              <li>
                <a href="tel:+913323456789" className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  <Phone className="w-5 h-5 text-secondary" />
                  +91 33 2345 6789
                </a>
              </li>
              <li>
                <a href="mailto:info@cps.edu.in" className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  <Mail className="w-5 h-5 text-secondary" />
                  info@cps.edu.in
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/70">
            © {new Date().getFullYear()} Calcutta Public School. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/70">
            <Link to="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-secondary transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
