import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
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
      {/* Header with Logo and School Info */}
      <div className="bg-primary text-primary-foreground">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-4">
              <img src={logo} alt="Balisai Public School" className="w-16 h-16 rounded-full bg-white p-1" />
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">
                  Balisai Public School
                </h1>
                <p className="text-primary-foreground/80 text-sm">
                  Patnahat, Balisai, Ramnagar, Purba Medinipur
                </p>
                <p className="text-primary-foreground/80 text-xs">
                  Estd. 2009 | Reg No: S/1L/69181
                </p>
              </div>
            </Link>
            <div className="hidden lg:flex flex-col items-end gap-1">
              <a href="tel:9732743315" className="flex items-center gap-2 hover:text-secondary transition-colors text-sm">
                <Phone className="w-4 h-4" />
                9732743315 / 9083317144
              </a>
              <a href="mailto:info@balisaipublicschool.in" className="flex items-center gap-2 hover:text-secondary transition-colors text-sm">
                <Mail className="w-4 h-4" />
                info@balisaipublicschool.in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 bg-[hsl(120,60%,35%)]",
          scrolled && "shadow-elegant"
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
                        <div className="relative group">
                          <button
                            className={cn(
                              "inline-flex items-center bg-transparent text-white hover:bg-white/20 rounded-none px-4 py-3 h-auto text-sm font-medium transition-colors",
                              isActive(item.href) && "bg-white/20"
                            )}
                          >
                            {item.title}
                            <svg
                              className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-hover:rotate-180"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <div className={cn(
                            "absolute top-full z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150",
                            item.title === "Others" ? "right-0" : "left-0"
                          )}>
                            {/* Invisible bridge to prevent gap-related hover loss */}
                            <div className="h-2" />
                            <ul className="grid w-[200px] gap-1 p-2 bg-white shadow-lg rounded-md border">
                              {item.submenu.map((subItem) => (
                                <li key={subItem.title}>
                                  {subItem.href.includes("#") ? (
                                    <button
                                      onClick={() => handleNavClick(subItem.href)}
                                      className={cn(
                                        "block w-full text-left select-none rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-primary text-foreground"
                                      )}
                                    >
                                      {subItem.title}
                                    </button>
                                  ) : (
                                    <Link
                                      to={subItem.href}
                                      className={cn(
                                        "block select-none rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-primary text-foreground",
                                        isActive(subItem.href) && "bg-muted text-primary"
                                      )}
                                    >
                                      {subItem.title}
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
                            "px-4 py-3 text-sm font-medium transition-colors hover:bg-white/20 text-white block",
                            isActive(item.href) && "bg-white/20"
                          )}
                        >
                          {item.title}
                        </Link>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
              
              <div className="flex items-center gap-1 ml-auto">
                <LanguageSwitcher />
                <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white rounded-none">
                  <Link to="/notices">Notice</Link>
                </Button>
                <Button asChild className="bg-sky-500 hover:bg-sky-600 text-white rounded-none border-0">
                  <Link to="/admin">Login</Link>
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden pb-4 animate-fade-in">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <div key={item.title}>
                    {item.submenu ? (
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-white/20 transition-colors text-white">
                          <span className="font-medium">{item.title}</span>
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
                                className="block w-full text-left p-2 text-sm text-white/80 hover:text-white transition-colors"
                              >
                                {subItem.title}
                              </button>
                            ) : (
                              <Link
                                key={subItem.title}
                                to={subItem.href}
                                className="block p-2 text-sm text-white/80 hover:text-white transition-colors"
                                onClick={() => setIsOpen(false)}
                              >
                                {subItem.title}
                              </Link>
                            )
                          ))}
                        </div>
                      </details>
                    ) : (
                      <Link
                        to={item.href}
                        className="block p-3 rounded-lg hover:bg-white/20 transition-colors font-medium text-white"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.title}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-4 border-t border-white/20 mt-2 flex gap-2">
                  <Button asChild className="flex-1 bg-orange-500 text-white">
                    <Link to="/notices" onClick={() => setIsOpen(false)}>
                      Notice
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1 border-white text-white hover:bg-white hover:text-primary">
                    <Link to="/admin" onClick={() => setIsOpen(false)}>
                      Login
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
