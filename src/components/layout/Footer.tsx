import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Youtube, Heart, ArrowRight } from "lucide-react";
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
    <footer className="relative overflow-hidden">
      {/* Cosmic Background - Same as Header */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1942] via-[#0a0e27] to-[#050814]" />
      
      {/* Animated Stars Layer */}
      <div className="absolute inset-0 stars-layer opacity-60" />
      
      {/* Aurora Waves - Top */}
      <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
        <div className="aurora-wave-footer" />
      </div>
      
      {/* Subtle Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="container py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* School Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-4 mb-6 group">
              <div className="relative">
                {/* Metallic ring effect */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 opacity-60 blur-sm group-hover:opacity-80 transition-opacity" />
                <div className="relative">
                  <img 
                    src={logo} 
                    alt="Balisai Public School" 
                    className="w-20 h-20 rounded-2xl bg-white p-2 shadow-xl group-hover:scale-105 transition-transform relative z-10" 
                  />
                  {/* Pulsing glow */}
                  <div className="absolute inset-0 rounded-2xl bg-cyan-400/30 animate-pulse blur-md" />
                </div>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-white">Balisai Public School</h3>
                <p className="text-xs text-cyan-300/70 mt-1">Estd. 2009 | Excellence in Education</p>
              </div>
            </Link>
            <p className="text-slate-400 mb-6 leading-relaxed">
              <TranslatedText>Nurturing young minds and building a foundation for a brighter future through quality education and holistic development.</TranslatedText>
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/p/Balisai-Public-School-Patnahat-Balisai-Purba-Medinipur-100090241681438/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 group"
              >
                <Facebook className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-red-600 hover:border-red-500 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/30 group"
              >
                <Youtube className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6 flex items-center gap-3 text-white">
              <span className="w-10 h-1 bg-gradient-to-r from-cyan-400 to-transparent rounded-full" />
              <TranslatedText>Quick Links</TranslatedText>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={link.title}>
                  <Link 
                    to={link.href} 
                    className="text-slate-400 hover:text-cyan-300 transition-all duration-300 inline-flex items-center gap-3 group hover:translate-x-2"
                  >
                    <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-all -ml-6 group-hover:ml-0" />
                    {quickLinkTexts[index]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academics */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6 flex items-center gap-3 text-white">
              <span className="w-10 h-1 bg-gradient-to-r from-blue-400 to-transparent rounded-full" />
              <TranslatedText>Academics</TranslatedText>
            </h4>
            <ul className="space-y-3">
              {academicLinks.map((link, index) => (
                <li key={link.title}>
                  <Link 
                    to={link.href} 
                    className="text-slate-400 hover:text-blue-300 transition-all duration-300 inline-flex items-center gap-3 group hover:translate-x-2"
                  >
                    <ArrowRight className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-all -ml-6 group-hover:ml-0" />
                    {academicLinkTexts[index]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6 flex items-center gap-3 text-white">
              <span className="w-10 h-1 bg-gradient-to-r from-emerald-400 to-transparent rounded-full" />
              <TranslatedText>Contact Us</TranslatedText>
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 group-hover:scale-105 transition-all">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-slate-400 leading-relaxed pt-1">
                  Patnahat, Balisai, Ramnagar,<br />
                  Purba Medinipur, West Bengal
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 group-hover:scale-105 transition-all">
                  <Phone className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-slate-400">
                  <a href="tel:9732743315" className="hover:text-cyan-300 transition-colors block">9732743315</a>
                  <a href="tel:9083317144" className="hover:text-cyan-300 transition-colors block">9083317144</a>
                </div>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 group-hover:scale-105 transition-all">
                  <Mail className="w-5 h-5 text-emerald-400" />
                </div>
                <a href="mailto:info@balisaipublicschool.in" className="text-slate-400 hover:text-cyan-300 transition-colors">
                  info@balisaipublicschool.in
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 relative z-10">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p className="flex items-center gap-2">
              © {new Date().getFullYear()} Balisai Public School. 
              <TranslatedText>All rights reserved.</TranslatedText>
            </p>
            <p className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> in India
              </span>
              <span className="w-12 h-1 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
              <span className="text-slate-500">Reg No: S/1L/69181</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
