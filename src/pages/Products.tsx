import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Star, Download, Search, ShoppingCart, Grid, List, Heart } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { products, formatPrice, type Product } from "@/data/products";
import { cn } from "@/lib/utils";

const categoryFilters = ["Semua", "Streaming", "Productivity", "AI Tools", "Musik", "Editing", "Design"];

export default function Products() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("kategori") || "Semua";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory === "Semua" ? "Semua" : initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Record<string, "weekly" | "monthly" | "yearly">>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Semua" || product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
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

  const handleToggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        logo: product.logo,
        logoColor: product.logoColor,
        image: product.image,
        category: product.category,
        price: product.prices.monthly,
      });
    }
  };

  const getPlan = (productId: string) => selectedPlan[productId] || "monthly";

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16 md:pt-20 pb-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="py-4 md:py-6">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">
              Semua <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Produk</span>
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">Pilih aplikasi premium favoritmu</p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col gap-3 mb-5">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari aplikasi..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="pl-10 h-10 w-full" 
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide flex-1">
                {categoryFilters.map((cat) => (
                  <Button 
                    key={cat} 
                    variant={selectedCategory === cat ? "premium" : "outline"} 
                    size="sm" 
                    onClick={() => setSelectedCategory(cat)} 
                    className="whitespace-nowrap h-9 text-xs px-3 flex-shrink-0"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              <div className="flex gap-1 shrink-0 self-end sm:self-auto">
                <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" className="h-9 w-9" onClick={() => setViewMode("grid")}>
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" className="h-9 w-9" onClick={() => setViewMode("list")}>
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 md:gap-3">
              {filteredProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  variant="glass" 
                  className="group overflow-hidden hover:shadow-glow transition-all duration-300 relative animate-slide-up flex flex-col" 
                  style={{ animationDelay: `${index * 25}ms` }}
                >
                  {product.popular && <Badge variant="premium" className="absolute top-2 left-2 text-[10px] z-10">Hot</Badge>}
                  
                  {/* Wishlist Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "absolute top-2 right-2 h-6 w-6 z-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background",
                      isInWishlist(product.id) && "text-destructive"
                    )}
                    onClick={(e) => handleToggleWishlist(product, e)}
                  >
                    <Heart className={cn("h-3 w-3", isInWishlist(product.id) && "fill-current")} />
                  </Button>

                  <Link to={`/produk/${product.id}`} className="block flex-1">
                    <div className="relative h-20 sm:h-24 md:h-28 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      <div className={`absolute bottom-2 left-2 w-6 h-6 md:w-7 md:h-7 rounded-md bg-gradient-to-br ${product.logoColor} flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-[8px] md:text-[10px]">{product.logo}</span>
                      </div>
                    </div>
                    <div className="p-2 md:p-2.5">
                      <h3 className="font-semibold text-[11px] md:text-xs mb-0.5 line-clamp-1">{product.name}</h3>
                      <p className="text-[9px] md:text-[10px] text-muted-foreground mb-1.5 line-clamp-2 min-h-[24px] leading-relaxed">{product.description}</p>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                          <span className="text-[9px] md:text-[10px]">{product.rating}</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-muted-foreground">
                          <Download className="h-2.5 w-2.5" />
                          <span className="text-[9px] md:text-[10px]">{product.downloads}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Plan Selection */}
                  <div className="flex gap-0.5 px-2 md:px-2.5 mb-1.5">
                    {(["weekly", "monthly", "yearly"] as const).map((plan) => (
                      <button 
                        key={plan} 
                        onClick={() => setSelectedPlan((p) => ({ ...p, [product.id]: plan }))} 
                        className={cn(
                          "flex-1 py-1 text-[8px] md:text-[9px] rounded-md border transition-all font-medium",
                          getPlan(product.id) === plan 
                            ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        )}
                      >
                        {plan === "weekly" ? "1 Minggu" : plan === "monthly" ? "1 Bulan" : "1 Tahun"}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between gap-1.5 px-2 pb-2 md:px-2.5 md:pb-2.5">
                    <span className="font-bold text-[10px] md:text-xs bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {formatPrice(product.prices[getPlan(product.id)])}
                    </span>
                    <Button variant="premium" size="sm" className="h-6 w-6 p-0" onClick={(e) => handleAddToCart(product, e)}>
                      <ShoppingCart className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <Card key={product.id} variant="glass" className="group overflow-hidden hover:shadow-glow transition-all p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-xs md:text-sm line-clamp-1">{product.name}</h3>
                        {product.popular && <Badge variant="premium" className="text-[8px] md:text-[10px]">Hot</Badge>}
                      </div>
                      <p className="text-[10px] md:text-xs text-muted-foreground mb-1">{product.category}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5 md:h-3 md:w-3 fill-amber-400 text-amber-400" />
                          <span className="text-[10px] md:text-xs">{product.rating}</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-muted-foreground">
                          <Download className="h-2.5 w-2.5 md:h-3 md:w-3" />
                          <span className="text-[10px] md:text-xs">{product.downloads}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="font-bold text-xs md:text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {formatPrice(product.prices[getPlan(product.id)])}
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn("h-7 w-7", isInWishlist(product.id) && "text-destructive")}
                          onClick={(e) => handleToggleWishlist(product, e)}
                        >
                          <Heart className={cn("h-3 w-3", isInWishlist(product.id) && "fill-current")} />
                        </Button>
                        <Button variant="premium" size="sm" className="h-7 text-[10px] md:text-xs" onClick={(e) => handleAddToCart(product, e)}>
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Tambah
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">Tidak ada produk ditemukan</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}