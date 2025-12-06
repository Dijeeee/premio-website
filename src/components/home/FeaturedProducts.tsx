import { Link } from "react-router-dom";
import { Star, Download, ArrowRight, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

const products = [
  { id: "netflix-premium", name: "Netflix Premium", logo: "N", logoColor: "from-red-600 to-red-500", category: "Streaming", rating: 4.9, downloads: "50K+", prices: { weekly: 25000, monthly: 85000, yearly: 850000 }, popular: true },
  { id: "canva-pro", name: "Canva Pro", logo: "C", logoColor: "from-cyan-500 to-blue-500", category: "Design", rating: 4.8, downloads: "45K+", prices: { weekly: 20000, monthly: 75000, yearly: 750000 }, popular: true },
  { id: "chatgpt-plus", name: "ChatGPT Plus", logo: "G", logoColor: "from-emerald-500 to-teal-500", category: "AI Tools", rating: 4.9, downloads: "40K+", prices: { weekly: 50000, monthly: 180000, yearly: 1800000 }, popular: false },
  { id: "spotify-premium", name: "Spotify Premium", logo: "S", logoColor: "from-green-500 to-green-400", category: "Musik", rating: 4.8, downloads: "60K+", prices: { weekly: 15000, monthly: 55000, yearly: 550000 }, popular: true },
  { id: "capcut-pro", name: "CapCut Pro", logo: "CC", logoColor: "from-slate-700 to-slate-600", category: "Editing", rating: 4.7, downloads: "35K+", prices: { weekly: 18000, monthly: 65000, yearly: 650000 }, popular: false },
  { id: "adobe-creative", name: "Adobe CC", logo: "Ai", logoColor: "from-red-500 to-rose-500", category: "Design", rating: 4.9, downloads: "30K+", prices: { weekly: 75000, monthly: 280000, yearly: 2800000 }, popular: true },
  { id: "notion-pro", name: "Notion Pro", logo: "N", logoColor: "from-slate-800 to-slate-700", category: "Productivity", rating: 4.8, downloads: "25K+", prices: { weekly: 15000, monthly: 55000, yearly: 550000 }, popular: false },
  { id: "disney-plus", name: "Disney+", logo: "D+", logoColor: "from-blue-600 to-indigo-600", category: "Streaming", rating: 4.7, downloads: "38K+", prices: { weekly: 22000, monthly: 80000, yearly: 800000 }, popular: false },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

export function FeaturedProducts() {
  const { addToCart } = useCart();

  const handleAddToCart = (product: typeof products[0], e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      logo: product.logo,
      logoColor: product.logoColor,
      category: product.category,
      price: product.prices.monthly,
      plan: "monthly",
      planLabel: "Bulanan",
    });
  };

  return (
    <section className="py-12 md:py-16 bg-muted/30 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1">
              Produk <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Unggulan</span>
            </h2>
            <p className="text-sm text-muted-foreground">Terlaris dengan harga terbaik</p>
          </div>
          <Link to="/produk">
            <Button variant="outline" size="sm" className="group">
              Semua
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {products.map((product, index) => (
            <Card
              key={product.id}
              variant="glass"
              className="group p-3 md:p-4 h-full hover:shadow-glow transition-all duration-300 relative overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {product.popular && (
                <Badge variant="premium" className="absolute top-2 right-2 text-xs">Hot</Badge>
              )}

              <Link to={`/produk/${product.id}`}>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${product.logoColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <span className="text-white font-bold text-xs md:text-sm">{product.logo}</span>
                </div>
                <h3 className="font-semibold text-sm md:text-base mb-0.5 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Download className="h-3 w-3" />
                    <span className="text-xs">{product.downloads}</span>
                  </div>
                </div>
              </Link>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
                <span className="font-bold text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {formatPrice(product.prices.monthly)}
                </span>
                <Button
                  variant="premium"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
