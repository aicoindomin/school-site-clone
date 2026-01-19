import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Mail, Bell, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslatedTexts } from "@/components/TranslatedText";

const navItems = [
  { title: "Home", href: "/" },
  {
    title: "About",
    href: "/about",
    submenu: [
      { title: "Overview", href: "/about#overview" },
      { title: "Mission & Vision", href: "/about#mission" },
      { title: "Secretary's Message", href: "/about#secretary-message" },
      { title: "Headmaster's Message", href: "/about#headmaster-message" },
    ],
  },
  { title: "Faculty", href: "/faculty" },
  { title: "Students", href: "/students" },
  { title: "Exam Results", href: "/results" },
  { title: "Class Routine", href: "/routine" },
  { title: "Holidays", href: "/holidays" },
  { title: "Contact", href: "/contact" },
  {
    title: "Others",
    href: "#",
    submenu: [
      { title: "Gallery", href: "/gallery" },
      { title: "Admission", href: "/admission" },
      { title: "Careers", href: "/careers" },
    ],
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Collect all translatable texts
  const textsToTranslate = useMemo(() => {
    const texts = ["Home", "About", "Faculty", "Students", "Exam Results", "Class Routine", "Holidays", "Contact", "Others", "Notice", "Login", "Overview", "Mission & Vision", "Secretary's Message", "Headmaster's Message", "Gallery", "Admission", "Careers", "Balisai Public School", "Patnahat, Balisai, Ramnagar, Purba Medinipur"];
    return texts;
  }, []);
  
  const translatedTexts = useTranslatedTexts(textsToTranslate);
  
  // Create a translation map
  const t = useMemo(() => {
    const map: Record<string, string> = {};
    textsToTranslate.forEach((text, index) => {
      map[text] = translatedTexts[index] || text;
    });
    return map;
  }, [textsToTranslate, translatedTexts]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle hash navigation after page load
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  const isActive = (path: string) => {
    const pathWithoutHash = path.split("#")[0];
    return location.pathname === pathWithoutHash;
  };

  const handleNavClick = (href: string) => {
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      if (location.pathname === path || (path === "/about" && location.pathname === "/about")) {
        // Same page, just scroll
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Different page, navigate first
        navigate(href);
      }
    }
  };

  return (
    <>
      {/* Header with Logo and School Info - Premium glassmorphism style */}
      <div className="bg-gradient-primary relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container py-5 relative">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Balisai Public School" 
                  className="w-18 h-18 md:w-20 md:h-20 rounded-full bg-white p-1.5 shadow-xl group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-secondary to-accent opacity-0 group-hover:opacity-50 blur-md transition-opacity" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                  {t["Balisai Public School"]}
                </h1>
                <p className="text-white/80 text-sm mt-0.5">
                  {t["Patnahat, Balisai, Ramnagar, Purba Medinipur"]}
                </p>
                <p className="text-white/60 text-xs mt-0.5">
                  Estd. 2009 | Reg No: S/1L/69181
                </p>
              </div>
            </Link>
            <div className="hidden lg:flex flex-col items-end gap-2">
              <a href="tel:9732743315" className="flex items-center gap-2 text-white/90 hover:text-secondary transition-colors text-sm group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                9732743315 / 9083317144
              </a>
              <a href="mailto:info@balisaipublicschool.in" className="flex items-center gap-2 text-white/90 hover:text-secondary transition-colors text-sm group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                info@balisaipublicschool.in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Glowing Gradient Style */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500 py-3",
          scrolled 
            ? "bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 shadow-2xl" 
            : "bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900"
        )}
      >
        <div className="container">
          <nav className="flex items-center justify-between">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center w-full gap-4">
              {/* Main nav buttons container with glow effect */}
              <div className="nav-glow-container flex-1">
                {navItems.map((item, index) => (
                  <div key={item.title} className="relative">
                    {item.submenu ? (
                      <div className="relative group/dropdown">
                        <button
                          className={cn(
                            "nav-glow-btn flex items-center gap-1",
                            isActive(item.href) && "active"
                          )}
                        >
                          {t[item.title] || item.title}
                          <svg
                            className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-hover/dropdown:rotate-180"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <div className={cn(
                          "absolute z-50 pt-3 opacity-0 pointer-events-none group-hover/dropdown:opacity-100 group-hover/dropdown:pointer-events-auto transition-all duration-300 group-hover/dropdown:translate-y-0 translate-y-2",
                          item.title === "Others" ? "right-0" : "left-0"
                        )}
                        style={{ top: '100%' }}
                        >
                          <ul className="grid w-[220px] gap-1 p-3 rounded-xl border border-blue-500/20 shadow-2xl"
                            style={{
                              background: 'linear-gradient(135deg, hsl(220 25% 10%) 0%, hsl(217 91% 15%) 100%)',
                              boxShadow: '0 20px 50px hsl(220 25% 5% / 0.8), 0 0 30px hsl(217 91% 50% / 0.2)'
                            }}
                          >
                            {item.submenu.map((subItem, subIndex) => (
                              <li key={subItem.title} className={`animate-fade-in stagger-${subIndex + 1}`}>
                                {subItem.href.includes("#") ? (
                                  <button
                                    onClick={() => handleNavClick(subItem.href)}
                                    className="block w-full text-left select-none rounded-lg p-3 text-sm leading-none no-underline outline-none transition-all duration-200 text-white/80 hover:text-white hover:bg-blue-500/20 hover:translate-x-1"
                                  >
                                    {t[subItem.title] || subItem.title}
                                  </button>
                                ) : (
                                  <Link
                                    to={subItem.href}
                                    className={cn(
                                      "block select-none rounded-lg p-3 text-sm leading-none no-underline outline-none transition-all duration-200 text-white/80 hover:text-white hover:bg-blue-500/20 hover:translate-x-1",
                                      isActive(subItem.href) && "bg-blue-500/30 text-white"
                                    )}
                                  >
                                    {t[subItem.title] || subItem.title}
                                  </Link>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className={cn(
                          "nav-glow-btn block",
                          isActive(item.href) && "active"
                        )}
                      >
                        {t[item.title] || item.title}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <Link to="/notices" className="nav-glow-action notice flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  {t["Notice"]}
                </Link>
                <Link to="/admin" className="nav-glow-action login flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  {t["Login"]}
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-3 rounded-xl transition-all duration-300 text-white hover:bg-white/10"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden pb-6 animate-fade-in">
              {/* Mobile nav with glowing dark theme */}
              <div className="mobile-nav-glow">
                <div className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <div key={item.title}>
                      {item.submenu ? (
                        <details className="group">
                          <summary className="mobile-nav-glow-btn flex items-center justify-between cursor-pointer">
                            <span>{t[item.title] || item.title}</span>
                            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                          </summary>
                          <div className="pl-4 mt-2 space-y-1">
                            {item.submenu.map((subItem) => (
                              subItem.href.includes("#") ? (
                                <button
                                  key={subItem.title}
                                  onClick={() => {
                                    handleNavClick(subItem.href);
                                    setIsOpen(false);
                                  }}
                                  className="block w-full text-left p-3 text-sm rounded-lg transition-colors text-white/70 hover:text-white hover:bg-blue-500/20"
                                >
                                  {t[subItem.title] || subItem.title}
                                </button>
                              ) : (
                                <Link
                                  key={subItem.title}
                                  to={subItem.href}
                                  className={cn(
                                    "block p-3 text-sm rounded-lg transition-colors text-white/70 hover:text-white hover:bg-blue-500/20",
                                    isActive(subItem.href) && "bg-blue-500/30 text-white"
                                  )}
                                  onClick={() => setIsOpen(false)}
                                >
                                  {t[subItem.title] || subItem.title}
                                </Link>
                              )
                            ))}
                          </div>
                        </details>
                      ) : (
                        <Link
                          to={item.href}
                          className={cn(
                            "mobile-nav-glow-btn block",
                            isActive(item.href) && "active"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {t[item.title] || item.title}
                        </Link>
                      )}
                    </div>
                  ))}
                  <div className="pt-4 border-t border-blue-500/20 mt-2 flex gap-3">
                    <Link 
                      to="/notices" 
                      onClick={() => setIsOpen(false)} 
                      className="nav-glow-action notice flex-1 flex items-center justify-center gap-2"
                    >
                      <Bell className="w-4 h-4" />
                      {t["Notice"]}
                    </Link>
                    <Link 
                      to="/admin" 
                      onClick={() => setIsOpen(false)} 
                      className="nav-glow-action login flex-1 flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      {t["Login"]}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
