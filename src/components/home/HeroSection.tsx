import { Search, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchFocused(false);
    navigate(`/produk/${productId}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/produk?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-1/3 left-1/4 w-64 md:w-80 h-64 md:h-80 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-64 md:w-80 h-64 md:h-80 bg-accent/20 rounded-full blur-3xl animate-float animation-delay-300" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Platform Premium #1 Indonesia</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up leading-tight">
            Aplikasi Premium,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Harga Terbaik</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto animate-slide-up animation-delay-100">
            Lisensi resmi, aktivasi instan, dan dukungan 24/7.
          </p>

          {/* Search Bar */}
          <div ref={searchRef} className="relative max-w-xl mx-auto mb-8 animate-slide-up animation-delay-200">
            <form onSubmit={handleSearch}>
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari Netflix, Canva, ChatGPT..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="pl-12 pr-28 h-12 md:h-14 text-sm md:text-base rounded-xl border-2 bg-card shadow-lg focus:shadow-glow"
                />
                <Button type="submit" variant="premium" className="absolute right-1.5 h-9 md:h-11 px-4 md:px-6 text-sm">
                  Cari
                </Button>
              </div>
            </form>

            {/* Search Results - only show when there's a query */}
            {isSearchFocused && searchQuery.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-[60] animate-scale-in max-h-72">
                {searchResults.length > 0 && (
                  <div className="max-h-56 overflow-y-auto">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelectProduct(product.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-all duration-200 text-left"
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${product.logoColor} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-bold text-xs">{product.logo}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.category}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Tidak ada hasil untuk "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CTA Buttons - positioned below search with margin */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up animation-delay-300 relative mt-4">
            <Button variant="premium" size="lg" className="group w-full sm:w-auto" onClick={() => navigate("/produk")}>
              Mulai Belanja
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => navigate("/kategori")}>
              Lihat Kategori
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-4 gap-4 md:gap-8 animate-fade-in animation-delay-400">
            {[
              { value: "50K+", label: "Pengguna" },
              { value: "500+", label: "Aplikasi" },
              { value: "99%", label: "Puas" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
