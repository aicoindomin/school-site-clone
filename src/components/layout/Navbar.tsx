import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Mail, GraduationCap } from "lucide-react";
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

const navItems = [
  {
    title: "About CPS",
    href: "/about",
    submenu: [
      { title: "Overview", href: "/about" },
      { title: "Mission & Vision", href: "/about/mission" },
      { title: "Chairman's Message", href: "/about/chairman-message" },
      { title: "Principal's Message", href: "/about/principal-message" },
    ],
  },
  {
    title: "Academics",
    href: "/academics",
    submenu: [
      { title: "CISCE Information", href: "/academics" },
      { title: "Rules & Regulations", href: "/academics/rules" },
      { title: "School Calendar", href: "/academics/calendar" },
    ],
  },
  { title: "Gallery", href: "/gallery" },
  { title: "Admission", href: "/admission" },
  { title: "Careers", href: "/careers" },
  { title: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block bg-primary text-primary-foreground py-2">
        <div className="container flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+913323456789" className="flex items-center gap-2 hover:text-secondary transition-colors">
              <Phone className="w-4 h-4" />
              +91 33 2345 6789
            </a>
            <a href="mailto:info@cps.edu.in" className="flex items-center gap-2 hover:text-secondary transition-colors">
              <Mail className="w-4 h-4" />
              info@cps.edu.in
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admission" className="hover:text-secondary transition-colors">
              Apply Now
            </Link>
            <span className="text-primary-foreground/50">|</span>
            <Link to="/admin" className="hover:text-secondary transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-card/95 backdrop-blur-md shadow-elegant"
            : "bg-card"
        )}
      >
        <div className="container">
          <nav className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display text-xl font-bold text-foreground">
                  Calcutta Public School
                </h1>
                <p className="text-xs text-muted-foreground">Shaping Bright Futures</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <NavigationMenu>
                <NavigationMenuList className="gap-1">
                  {navItems.map((item) => (
                    <NavigationMenuItem key={item.title}>
                      {item.submenu ? (
                        <>
                          <NavigationMenuTrigger
                            className={cn(
                              "bg-transparent hover:bg-muted",
                              isActive(item.href) && "text-primary"
                            )}
                          >
                            {item.title}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid w-[200px] gap-1 p-2">
                              {item.submenu.map((subItem) => (
                                <li key={subItem.title}>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      to={subItem.href}
                                      className={cn(
                                        "block select-none rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-primary",
                                        isActive(subItem.href) && "bg-muted text-primary"
                                      )}
                                    >
                                      {subItem.title}
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <Link
                          to={item.href}
                          className={cn(
                            "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                            isActive(item.href) ? "text-primary" : "text-foreground"
                          )}
                        >
                          {item.title}
                        </Link>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>

              <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link to="/admission">Apply Now</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
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
                        <summary className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-muted transition-colors">
                          <span className="font-medium">{item.title}</span>
                          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="pl-4 mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.title}
                              to={subItem.href}
                              className="block p-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      </details>
                    ) : (
                      <Link
                        to={item.href}
                        className="block p-3 rounded-lg hover:bg-muted transition-colors font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.title}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-4 border-t border-border mt-2">
                  <Button asChild className="w-full bg-secondary text-secondary-foreground">
                    <Link to="/admission" onClick={() => setIsOpen(false)}>
                      Apply Now
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full mt-2">
                    <Link to="/admin" onClick={() => setIsOpen(false)}>
                      Admin Login
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
