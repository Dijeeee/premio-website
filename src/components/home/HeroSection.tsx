import { Search, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
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
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-8 animate-slide-up animation-delay-200">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari Netflix, Canva, ChatGPT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-28 h-12 md:h-14 text-sm md:text-base rounded-xl border-2 bg-card shadow-lg focus:shadow-glow"
              />
              <Button type="submit" variant="premium" className="absolute right-1.5 h-9 md:h-11 px-4 md:px-6 text-sm">
                Cari
              </Button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up animation-delay-300">
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
