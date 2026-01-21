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

      {/* Navigation Bar - Modern glassmorphism */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          scrolled 
            ? "bg-white/90 dark:bg-background/90 backdrop-blur-xl shadow-lg shadow-foreground/5" 
            : "bg-accent"
        )}
      >
        <div className="container">
          <nav className="flex items-center justify-between">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center w-full">
              <NavigationMenu className="w-full">
                <NavigationMenuList className="gap-0 w-full justify-start">
                  {navItems.map((item, index) => (
                    <NavigationMenuItem key={item.title}>
                      {item.submenu ? (
                        <div className="relative group/dropdown">
                          <button
                            className={cn(
                              "inline-flex items-center bg-transparent px-4 py-4 h-auto text-sm font-medium transition-all duration-300",
                              scrolled 
                                ? "text-foreground hover:text-primary hover:bg-primary/5" 
                                : "text-white hover:bg-white/20",
                              isActive(item.href) && (scrolled ? "text-primary bg-primary/5" : "bg-white/20")
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
                            "absolute z-50 pt-2 opacity-0 pointer-events-none group-hover/dropdown:opacity-100 group-hover/dropdown:pointer-events-auto transition-all duration-300 group-hover/dropdown:translate-y-0 translate-y-2",
                            item.title === "Others" ? "right-0" : "left-0"
                          )}
                          style={{ top: '100%' }}
                          >
                            <ul className="grid w-[220px] gap-1 p-2 glass-strong rounded-xl border-0 shadow-2xl">
                              {item.submenu.map((subItem, subIndex) => (
                                <li key={subItem.title} className={`animate-fade-in stagger-${subIndex + 1}`}>
                                  {subItem.href.includes("#") ? (
                                    <button
                                      onClick={() => handleNavClick(subItem.href)}
                                      className="block w-full text-left select-none rounded-lg p-3 text-sm leading-none no-underline outline-none transition-all duration-200 hover:bg-primary/10 hover:text-primary text-foreground hover:translate-x-1"
                                    >
                                      {t[subItem.title] || subItem.title}
                                    </button>
                                  ) : (
                                    <Link
                                      to={subItem.href}
                                      className={cn(
                                        "block select-none rounded-lg p-3 text-sm leading-none no-underline outline-none transition-all duration-200 hover:bg-primary/10 hover:text-primary text-foreground hover:translate-x-1",
                                        isActive(subItem.href) && "bg-primary/10 text-primary"
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
                            "px-4 py-4 text-sm font-medium transition-all duration-300 block relative",
                            scrolled 
                              ? "text-foreground hover:text-primary" 
                              : "text-white hover:bg-white/20",
                            isActive(item.href) && (scrolled 
                              ? "text-primary after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-0.5 after:bg-primary after:rounded-full" 
                              : "bg-white/20")
                          )}
                        >
                          {t[item.title] || item.title}
                        </Link>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
              
              <div className="flex items-center gap-2 ml-auto">
                <LanguageSwitcher />
                <Button 
                  asChild 
                  className={cn(
                    "rounded-xl font-semibold transition-all duration-300 shadow-lg",
                    scrolled 
                      ? "bg-secondary hover:bg-secondary/90 text-white shadow-secondary/20" 
                      : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                  )}
                >
                  <Link to="/notices" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    {t["Notice"]}
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className={cn(
                    "rounded-xl font-semibold transition-all duration-300 shadow-lg",
                    scrolled 
                      ? "bg-primary hover:bg-primary/90 text-white shadow-primary/20" 
                      : "bg-secondary hover:bg-secondary/90 text-white"
                  )}
                >
                  <Link to="/admin" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    {t["Login"]}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={cn(
                "lg:hidden p-3 rounded-xl transition-all duration-300",
                scrolled 
                  ? "text-foreground hover:bg-primary/10" 
                  : "text-white hover:bg-white/20"
              )}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className={cn(
              "lg:hidden pb-6 animate-fade-in",
              scrolled ? "text-foreground" : "text-white"
            )}>
              <div className="flex flex-col gap-2 pt-4">
                {navItems.map((item) => (
                  <div key={item.title}>
                    {item.submenu ? (
                      <details className="group">
                        <summary className={cn(
                          "flex items-center justify-between cursor-pointer p-3 rounded-xl transition-colors",
                          scrolled ? "hover:bg-primary/10" : "hover:bg-white/20"
                        )}>
                          <span className="font-medium">{t[item.title] || item.title}</span>
                          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="pl-4 mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            subItem.href.includes("#") ? (
                              <button
                                key={subItem.title}
                                onClick={() => {
                                  handleNavClick(subItem.href);
                                  setIsOpen(false);
                                }}
                                className={cn(
                                  "block w-full text-left p-3 text-sm rounded-lg transition-colors",
                                  scrolled ? "text-muted-foreground hover:text-primary hover:bg-primary/5" : "text-white/80 hover:text-white hover:bg-white/10"
                                )}
                              >
                                {t[subItem.title] || subItem.title}
                              </button>
                            ) : (
                              <Link
                                key={subItem.title}
                                to={subItem.href}
                                className={cn(
                                  "block p-3 text-sm rounded-lg transition-colors",
                                  scrolled ? "text-muted-foreground hover:text-primary hover:bg-primary/5" : "text-white/80 hover:text-white hover:bg-white/10"
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
                          "block p-3 rounded-xl transition-colors font-medium",
                          scrolled ? "hover:bg-primary/10 hover:text-primary" : "hover:bg-white/20"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {t[item.title] || item.title}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-4 border-t border-white/20 mt-2 flex gap-3">
                  <Button asChild className="flex-1 bg-secondary hover:bg-secondary/90 text-white rounded-xl shadow-lg">
                    <Link to="/notices" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2">
                      <Bell className="w-4 h-4" />
                      {t["Notice"]}
                    </Link>
                  </Button>
                  <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg">
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2">
                      <LogIn className="w-4 h-4" />
                      {t["Login"]}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
