import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/kategori", label: "Kategori" },
  { href: "/produk", label: "Produk" },
  { href: "/review", label: "Review" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { totalItems, setIsCartOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:block">Premio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  location.pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button variant="ghost" size="icon" className="h-9 w-9 relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Button>

            <div className="hidden md:flex items-center gap-2 ml-1">
              <Link to="/login">
                <Button variant="ghost" size="sm">Masuk</Button>
              </Link>
              <Link to="/register">
                <Button variant="premium" size="sm">Daftar</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-border animate-slide-down">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                    location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-3 px-1">
                <Link to="/login" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Masuk</Button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="premium" size="sm" className="w-full">Daftar</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
