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
    const texts = ["Home", "About", "Faculty", "Students", "Holidays", "Contact", "Others", "Notice", "Login", "Overview", "Mission & Vision", "Secretary's Message", "Headmaster's Message", "Gallery", "Admission", "Careers", "Class Routine", "Exam Results", "Balisai Public School", "Patnahat, Balisai, Ramnagar, Purba Medinipur"];
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

      {/* Navigation Bar - Liquid Button Style */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          "bg-gradient-to-b from-[#E8F4FC] to-[#D6ECFA]",
          scrolled && "shadow-lg shadow-primary/10"
        )}
      >
        <div className="container py-2">
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
