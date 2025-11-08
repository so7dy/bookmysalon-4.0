import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";
import LogoOption2 from "@/components/logos/LogoOption2";

interface NavigationProps {
  isLoggedIn?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

export default function Navigation({ isLoggedIn = false, onLogin, onLogout }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const handleGetStarted = () => {
    console.log('Get Started triggered');
    setLocation('/configure');
  };

  const handleLogout = () => {
    console.log('Logout triggered');
    onLogout?.();
  };

  const navItems = [
    { name: 'Home', href: '/', hash: null },
    { name: 'Businesses', href: '/businesses', hash: null },
    { name: 'Blog', href: '/blog', hash: null },
    { name: 'Contact', href: '/contact', hash: null },
    { name: 'ROI Calculator', href: '/', hash: 'roi-calculator' },
    { name: 'Pricing', href: '/', hash: 'pricing' },
    { name: 'FAQ', href: '/', hash: 'faq' },
  ];

  const handleNavClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    if (item.hash) {
      // Hash-based navigation (scroll to section)
      e.preventDefault();
      
      // Navigate to home if not already there
      if (location !== '/') {
        setLocation('/');
        // Wait for navigation, then scroll
        setTimeout(() => {
          const element = document.getElementById(item.hash!);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        // Already on home page, just scroll
        const element = document.getElementById(item.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setIsMenuOpen(false);
    } else {
      // Regular page navigation - scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hide navigation items on form pages (keep only logo and get started button)
  const hideNavItems = location === '/get-started' || location === '/thank-you' || location === '/configure' || location === '/lead-thank-you';

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" onClick={handleLogoClick} className="hover-elevate px-2 py-1 rounded-md transition-all" data-testid="link-logo">
            <LogoOption2 />
          </Link>

          {/* Desktop Navigation */}
          {!hideNavItems && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className="text-foreground hover:text-primary transition-colors duration-200 hover-elevate px-3 py-2 rounded-md"
                  data-testid={`link-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* Get Started / Auth Buttons */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <ThemeToggle />
              {isLoggedIn ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  data-testid="button-logout"
                >
                  Logout
                </Button>
                <div className="w-8 h-8 bg-primary rounded-full glow-primary"></div>
              </>
            ) : (
              <>
                <Button 
                  variant="default" 
                  size="sm"
                  className="glow-primary"
                  onClick={handleGetStarted}
                  data-testid="button-get-started"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

            {/* Mobile Menu Button */}
            {!hideNavItems && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && !hideNavItems && (
          <div className="md:hidden py-4 border-t border-border fade-in">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className="text-foreground hover:text-primary transition-colors duration-200 px-3 py-2 rounded-md hover-elevate"
                  data-testid={`link-mobile-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-3 border-t border-border space-y-3">
                <div className="flex items-center justify-between px-3">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                {isLoggedIn ? (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={handleLogout}
                    data-testid="button-mobile-logout"
                  >
                    Logout
                  </Button>
                ) : (
                  <Button 
                    variant="default" 
                    className="w-full glow-primary"
                    onClick={handleGetStarted}
                    data-testid="button-mobile-get-started"
                  >
                    Get Started
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}