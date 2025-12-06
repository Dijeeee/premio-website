import { Link } from "react-router-dom";
import { Star, Download, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const products = [
  {
    id: "netflix-premium",
    name: "Netflix Premium",
    logo: "N",
    logoColor: "from-red-600 to-red-500",
    category: "Streaming",
    rating: 4.9,
    downloads: "50K+",
    prices: { weekly: 25000, monthly: 85000, yearly: 850000 },
    popular: true,
  },
  {
    id: "canva-pro",
    name: "Canva Pro",
    logo: "C",
    logoColor: "from-cyan-500 to-blue-500",
    category: "Design",
    rating: 4.8,
    downloads: "45K+",
    prices: { weekly: 20000, monthly: 75000, yearly: 750000 },
    popular: true,
  },
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    logo: "G",
    logoColor: "from-emerald-500 to-teal-500",
    category: "AI Tools",
    rating: 4.9,
    downloads: "40K+",
    prices: { weekly: 50000, monthly: 180000, yearly: 1800000 },
    popular: false,
  },
  {
    id: "spotify-premium",
    name: "Spotify Premium",
    logo: "S",
    logoColor: "from-green-500 to-green-400",
    category: "Musik",
    rating: 4.8,
    downloads: "60K+",
    prices: { weekly: 15000, monthly: 55000, yearly: 550000 },
    popular: true,
  },
  {
    id: "capcut-pro",
    name: "CapCut Pro",
    logo: "CC",
    logoColor: "from-slate-700 to-slate-600",
    category: "Editing",
    rating: 4.7,
    downloads: "35K+",
    prices: { weekly: 18000, monthly: 65000, yearly: 650000 },
    popular: false,
  },
  {
    id: "adobe-creative",
    name: "Adobe Creative Cloud",
    logo: "Ai",
    logoColor: "from-red-500 to-rose-500",
    category: "Design",
    rating: 4.9,
    downloads: "30K+",
    prices: { weekly: 75000, monthly: 280000, yearly: 2800000 },
    popular: true,
  },
  {
    id: "notion-pro",
    name: "Notion Pro",
    logo: "N",
    logoColor: "from-slate-800 to-slate-700",
    category: "Productivity",
    rating: 4.8,
    downloads: "25K+",
    prices: { weekly: 15000, monthly: 55000, yearly: 550000 },
    popular: false,
  },
  {
    id: "disney-plus",
    name: "Disney+ Premium",
    logo: "D+",
    logoColor: "from-blue-600 to-indigo-600",
    category: "Streaming",
    rating: 4.7,
    downloads: "38K+",
    prices: { weekly: 22000, monthly: 80000, yearly: 800000 },
    popular: false,
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export function FeaturedProducts() {
  return (
    <section className="py-20 md:py-32 bg-muted/30 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-up">
              Produk <span className="premio-gradient-text">Unggulan</span>
            </h2>
            <p className="text-muted-foreground animate-slide-up animation-delay-100">
              Aplikasi premium terlaris dengan harga terbaik
            </p>
          </div>
          <Link to="/produk" className="mt-4 md:mt-0">
            <Button variant="outline" className="group">
              Lihat Semua
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Link
              key={product.id}
              to={`/produk/${product.id}`}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Card
                variant="premium"
                className="group p-6 h-full hover:scale-[1.02] cursor-pointer"
              >
                {/* Popular Badge */}
                {product.popular && (
                  <Badge className="absolute top-4 right-4 bg-premio-gradient text-primary-foreground border-0">
                    Populer
                  </Badge>
                )}

                {/* Logo */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.logoColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <span className="text-white font-bold text-xl">{product.logo}</span>
                </div>

                {/* Info */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span className="text-sm">{product.downloads}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold premio-gradient-text">
                      {formatPrice(product.prices.monthly)}
                    </span>
                    <span className="text-sm text-muted-foreground">/bulan</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mulai dari {formatPrice(product.prices.weekly)}/minggu
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
