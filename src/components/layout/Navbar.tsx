import { useState, useEffect, useMemo, Dispatch, SetStateAction } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Mail, Bell, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslatedTexts } from "@/components/TranslatedText";
import { LiquidButton } from "@/components/ui/LiquidButton";

// Mobile nav item component with proper dropdown state
function MobileNavItem({
  item,
  t,
  isActive,
  handleNavClick,
  setIsOpen,
}: {
  item: { title: string; href: string; submenu?: { title: string; href: string }[] };
  t: Record<string, string>;
  isActive: (path: string) => boolean;
  handleNavClick: (href: string) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (item.submenu) {
    return (
      <div>
        <LiquidButton
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
        >
          <span>{t[item.title] || item.title}</span>
          <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isExpanded && "rotate-180")} />
        </LiquidButton>
        {isExpanded && (
          <div className="pl-4 mt-2 space-y-2 animate-fade-in">
            {item.submenu.map((subItem) =>
              subItem.href.includes("#") ? (
                <button
                  key={subItem.title}
                  onClick={() => {
                    handleNavClick(subItem.href);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left p-3 text-sm rounded-xl transition-all duration-200 bg-white/60 hover:bg-primary/10 hover:text-primary text-foreground shadow-sm"
                >
                  {t[subItem.title] || subItem.title}
                </button>
              ) : (
                <Link
                  key={subItem.title}
                  to={subItem.href}
                  className={cn(
                    "block p-3 text-sm rounded-xl transition-all duration-200 bg-white/60 hover:bg-primary/10 hover:text-primary text-foreground shadow-sm",
                    isActive(subItem.href) && "bg-primary/10 text-primary"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {t[subItem.title] || subItem.title}
                </Link>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link to={item.href} onClick={() => setIsOpen(false)}>
      <LiquidButton isActive={isActive(item.href)} className="w-full">
        {t[item.title] || item.title}
      </LiquidButton>
    </Link>
  );
}

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
  { title: "Holidays", href: "/holidays" },
  { title: "Contact", href: "/contact" },
  {
    title: "Others",
    href: "#",
    submenu: [
      { title: "Gallery", href: "/gallery" },
      { title: "Admission", href: "/admission" },
      { title: "Careers", href: "/careers" },
      { title: "Class Routine", href: "/routine" },
      { title: "Exam Results", href: "/results" },
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
    const texts = ["Home", "About", "Faculty", "Students", "Holidays", "Contact", "Others", "Notice", "Login", "Overview", "Mission & Vision", "Secretary's Message", "Headmaster's Message", "Gallery", "Admission", "Careers", "Class Routine", "Exam Results", "Balisai Public School", "Patnahat, Balisai, Ramnagar, Purba Medinipur", "Contact Us"];
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
      {/* Header with Logo and School Info - Premium Cosmic/Space Theme */}
      <div className="header-cosmic relative overflow-hidden">
        {/* Animated cosmic background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#0d1942] to-[#0a0e27]" />
        
        {/* Stars layer */}
        <div className="absolute inset-0 stars-layer" />
        
        {/* Animated aurora/wave effect */}
        <div className="absolute inset-0 aurora-wave" />
        <div className="absolute inset-0 aurora-wave-2" />
        
        {/* Glowing particles */}
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse opacity-50" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }} />
        
        <div className="container py-6 relative z-10">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-5 group">
              {/* Logo with premium glow effect */}
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 opacity-60 blur-md group-hover:opacity-80 transition-opacity duration-500 animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-40" />
                <img 
                  src={logo} 
                  alt="Balisai Public School" 
                  className="relative w-20 h-20 md:w-24 md:h-24 rounded-full shadow-2xl group-hover:scale-105 transition-transform duration-500 ring-2 ring-cyan-400/40" 
                />
              </div>
              <div className="space-y-1">
                <h1 className="font-display text-2xl md:text-4xl font-bold text-white tracking-wide drop-shadow-[0_0_15px_rgba(100,200,255,0.5)]">
                  {t["Balisai Public School"]}
                </h1>
                <p className="text-cyan-200/90 text-sm md:text-base font-medium tracking-wide">
                  {t["Patnahat, Balisai, Ramnagar, Purba Medinipur"]}
                </p>
                <p className="text-blue-300/70 text-xs md:text-sm tracking-widest">
                  Estd. 2009 | Reg No: S/1L/69181
                </p>
              </div>
            </Link>
            
            {/* Contact info with premium styling */}
            <div className="hidden lg:flex flex-col items-end gap-3">
              <a href="tel:9732743315" className="flex items-center gap-3 text-white/90 hover:text-cyan-300 transition-all duration-300 group">
                <span className="text-sm font-medium tracking-wide">9732743315 / 9083317144</span>
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-cyan-500/30 group-hover:shadow-[0_0_20px_rgba(0,200,255,0.4)] transition-all duration-300 ring-1 ring-white/20">
                  <Phone className="w-4 h-4" />
                </div>
              </a>
              <a href="mailto:info@balisaipublicschool.in" className="flex items-center gap-3 text-white/90 hover:text-cyan-300 transition-all duration-300 group">
                <span className="text-sm font-medium tracking-wide">info@balisaipublicschool.in</span>
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-cyan-500/30 group-hover:shadow-[0_0_20px_rgba(0,200,255,0.4)] transition-all duration-300 ring-1 ring-white/20">
                  <Mail className="w-4 h-4" />
                </div>
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom glowing line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
      </div>

      {/* Navigation Bar - Liquid Button Style */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          "bg-gradient-to-b from-[#E8F4FC] to-[#D6ECFA]",
          scrolled && "shadow-lg shadow-primary/10"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 py-2">
          <nav className="flex items-center justify-between">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center w-full">
              <NavigationMenu className="w-full">
                <NavigationMenuList className="gap-1.5 w-full justify-start flex-nowrap">
                  {navItems.map((item) => (
                    <NavigationMenuItem key={item.title}>
                      {item.submenu ? (
                        <div className="relative group/dropdown">
                          <LiquidButton
                            isActive={isActive(item.href)}
                            className="flex items-center gap-1"
                          >
                            {t[item.title] || item.title}
                            <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover/dropdown:rotate-180" />
                          </LiquidButton>
                          <div className={cn(
                            "absolute z-50 pt-3 opacity-0 pointer-events-none group-hover/dropdown:opacity-100 group-hover/dropdown:pointer-events-auto transition-all duration-300 group-hover/dropdown:translate-y-0 translate-y-3",
                            item.title === "Others" ? "right-0" : "left-0"
                          )}
                          style={{ top: '100%' }}
                          >
                            <ul className="grid w-[220px] gap-1 p-3 rounded-2xl border-0 shadow-2xl bg-gradient-to-b from-white to-blue-50/80 backdrop-blur-xl">
                              {item.submenu.map((subItem, subIndex) => (
                                <li key={subItem.title} className={`animate-fade-in stagger-${subIndex + 1}`}>
                                  {subItem.href.includes("#") ? (
                                    <button
                                      onClick={() => handleNavClick(subItem.href)}
                                      className="block w-full text-left select-none rounded-xl p-3 text-sm leading-none no-underline outline-none transition-all duration-200 hover:bg-primary/10 hover:text-primary text-foreground hover:translate-x-1 hover:shadow-md"
                                    >
                                      {t[subItem.title] || subItem.title}
                                    </button>
                                  ) : (
                                    <Link
                                      to={subItem.href}
                                      className={cn(
                                        "block select-none rounded-xl p-3 text-sm leading-none no-underline outline-none transition-all duration-200 hover:bg-primary/10 hover:text-primary text-foreground hover:translate-x-1 hover:shadow-md",
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
                        <Link to={item.href}>
                          <LiquidButton isActive={isActive(item.href)}>
                            {t[item.title] || item.title}
                          </LiquidButton>
                        </Link>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
              
              <div className="flex items-center gap-3 ml-auto">
                <LanguageSwitcher />
                <Link to="/notices">
                  <LiquidButton className="!bg-gradient-to-br !from-amber-100 !to-orange-200" isActive={isActive('/notices')}>
                    <Bell className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-700">{t["Notice"]}</span>
                  </LiquidButton>
                </Link>
                <Link to="/admin">
                  <LiquidButton className="!bg-gradient-to-br !from-emerald-100 !to-green-200">
                    <LogIn className="w-4 h-4 text-green-600" />
                    <span className="text-green-700">{t["Login"]}</span>
                  </LiquidButton>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <LiquidButton
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </LiquidButton>
          </nav>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden pb-6 animate-fade-in">
              <div className="flex flex-col gap-3 pt-4">
                {navItems.map((item) => (
                  <MobileNavItem
                    key={item.title}
                    item={item}
                    t={t}
                    isActive={isActive}
                    handleNavClick={handleNavClick}
                    setIsOpen={setIsOpen}
                  />
                ))}
                <div className="pt-4 border-t border-primary/20 mt-2 flex gap-3">
                  <Link to="/notices" onClick={() => setIsOpen(false)} className="flex-1">
                    <LiquidButton className="w-full justify-center !bg-gradient-to-br !from-amber-100 !to-orange-200">
                      <Bell className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-700">{t["Notice"]}</span>
                    </LiquidButton>
                  </Link>
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="flex-1">
                    <LiquidButton className="w-full justify-center !bg-gradient-to-br !from-emerald-100 !to-green-200">
                      <LogIn className="w-4 h-4 text-green-600" />
                      <span className="text-green-700">{t["Login"]}</span>
                    </LiquidButton>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
