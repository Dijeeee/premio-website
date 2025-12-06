import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Star, Download, Search, Filter, ShoppingCart, Check } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";

const allProducts = [
  { id: "netflix-premium", name: "Netflix Premium", logo: "N", logoColor: "from-red-600 to-red-500", category: "Streaming", rating: 4.9, downloads: "50K+", prices: { weekly: 25000, monthly: 85000, yearly: 850000 }, popular: true },
  { id: "canva-pro", name: "Canva Pro", logo: "C", logoColor: "from-cyan-500 to-blue-500", category: "Productivity", rating: 4.8, downloads: "45K+", prices: { weekly: 20000, monthly: 75000, yearly: 750000 }, popular: true },
  { id: "chatgpt-plus", name: "ChatGPT Plus", logo: "G", logoColor: "from-emerald-500 to-teal-500", category: "AI Tools", rating: 4.9, downloads: "40K+", prices: { weekly: 50000, monthly: 180000, yearly: 1800000 }, popular: true },
  { id: "spotify-premium", name: "Spotify Premium", logo: "S", logoColor: "from-green-500 to-green-400", category: "Musik", rating: 4.8, downloads: "60K+", prices: { weekly: 15000, monthly: 55000, yearly: 550000 }, popular: true },
  { id: "capcut-pro", name: "CapCut Pro", logo: "CC", logoColor: "from-slate-700 to-slate-600", category: "Editing", rating: 4.7, downloads: "35K+", prices: { weekly: 18000, monthly: 65000, yearly: 650000 }, popular: false },
  { id: "adobe-creative", name: "Adobe Creative Cloud", logo: "Ai", logoColor: "from-red-500 to-rose-500", category: "Design", rating: 4.9, downloads: "30K+", prices: { weekly: 75000, monthly: 280000, yearly: 2800000 }, popular: true },
  { id: "notion-pro", name: "Notion Pro", logo: "N", logoColor: "from-slate-800 to-slate-700", category: "Productivity", rating: 4.8, downloads: "25K+", prices: { weekly: 15000, monthly: 55000, yearly: 550000 }, popular: false },
  { id: "disney-plus", name: "Disney+ Premium", logo: "D+", logoColor: "from-blue-600 to-indigo-600", category: "Streaming", rating: 4.7, downloads: "38K+", prices: { weekly: 22000, monthly: 80000, yearly: 800000 }, popular: false },
  { id: "midjourney", name: "Midjourney", logo: "MJ", logoColor: "from-indigo-500 to-purple-500", category: "AI Tools", rating: 4.8, downloads: "28K+", prices: { weekly: 45000, monthly: 160000, yearly: 1600000 }, popular: true },
  { id: "figma-pro", name: "Figma Pro", logo: "F", logoColor: "from-violet-500 to-purple-500", category: "Design", rating: 4.9, downloads: "22K+", prices: { weekly: 35000, monthly: 120000, yearly: 1200000 }, popular: false },
  { id: "grammarly", name: "Grammarly Premium", logo: "G", logoColor: "from-green-600 to-emerald-600", category: "Productivity", rating: 4.7, downloads: "32K+", prices: { weekly: 20000, monthly: 70000, yearly: 700000 }, popular: false },
  { id: "youtube-premium", name: "YouTube Premium", logo: "YT", logoColor: "from-red-600 to-red-500", category: "Streaming", rating: 4.8, downloads: "55K+", prices: { weekly: 18000, monthly: 65000, yearly: 650000 }, popular: true },
];

const categoryFilters = ["Semua", "Streaming", "Productivity", "AI Tools", "Musik", "Editing", "Design"];

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

export default function Products() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("kategori") || "Semua";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory === "Semua" ? "Semua" : initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Record<string, "weekly" | "monthly" | "yearly">>({});
  const { addToCart } = useCart();

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = selectedCategory === "Semua" || product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: typeof allProducts[0], e: React.MouseEvent) => {
    e.preventDefault();
    const plan = selectedPlan[product.id] || "monthly";
    const planLabels = { weekly: "Mingguan", monthly: "Bulanan", yearly: "Tahunan" };
    addToCart({
      id: product.id,
      name: product.name,
      logo: product.logo,
      logoColor: product.logoColor,
      category: product.category,
      price: product.prices[plan],
      plan,
      planLabel: planLabels[plan],
    });
  };

  const getPlan = (productId: string) => selectedPlan[productId] || "monthly";

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="py-6 md:py-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Semua <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Produk</span>
            </h1>
            <p className="text-muted-foreground">Pilih aplikasi premium favoritmu</p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Cari aplikasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {categoryFilters.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "premium" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="whitespace-nowrap"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredProducts.map((product, index) => (
              <Card
                key={product.id}
                variant="glass"
                className="group p-4 h-full hover:shadow-glow transition-all duration-300 relative overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {product.popular && (
                  <Badge variant="premium" className="absolute top-2 right-2 text-xs">Hot</Badge>
                )}

                <Link to={`/produk/${product.id}`}>
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${product.logoColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <span className="text-white font-bold text-sm md:text-base">{product.logo}</span>
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

                {/* Plan Selection */}
                <div className="flex gap-1 mb-3">
                  {(["weekly", "monthly", "yearly"] as const).map((plan) => (
                    <button
                      key={plan}
                      onClick={() => setSelectedPlan((p) => ({ ...p, [product.id]: plan }))}
                      className={`flex-1 py-1.5 text-xs rounded-lg border transition-all ${
                        getPlan(product.id) === plan
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {plan === "weekly" ? "1M" : plan === "monthly" ? "1B" : "1T"}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm md:text-base bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {formatPrice(product.prices[getPlan(product.id)])}
                  </span>
                  <Button
                    variant="premium"
                    size="sm"
                    className="h-8 px-3"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Tidak ada produk ditemukan</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
