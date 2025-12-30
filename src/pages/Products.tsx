import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Star, Download, Search, ShoppingCart, Heart, SlidersHorizontal, ChevronDown } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categoryFilters = ["Semua", "Streaming", "Productivity", "AI Tools", "Musik", "Editing", "Design"];

type SortOption = "popular" | "rating-high" | "rating-low" | "price-high" | "price-low" | "name-asc" | "name-desc";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Paling Populer" },
  { value: "rating-high", label: "Rating Tertinggi" },
  { value: "rating-low", label: "Rating Terendah" },
  { value: "price-high", label: "Harga Tertinggi" },
  { value: "price-low", label: "Harga Terendah" },
  { value: "name-asc", label: "Nama A-Z" },
  { value: "name-desc", label: "Nama Z-A" },
];

export default function Products() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("kategori") || "Semua";
  
  // Map URL category to proper category name
  const mapCategoryFromUrl = (urlCategory: string): string => {
    if (urlCategory === "Semua") return "Semua";
    const categoryMap: Record<string, string> = {
      "streaming": "Streaming",
      "productivity": "Productivity", 
      "ai tools": "AI Tools",
      "musik": "Musik",
      "editing": "Editing",
      "design": "Design",
      "cloud": "Cloud Storage",
      "development": "Development"
    };
    return categoryMap[urlCategory.toLowerCase()] || urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1);
  };
  
  const [selectedCategory, setSelectedCategory] = useState(mapCategoryFromUrl(initialCategory));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Record<string, "weekly" | "monthly" | "yearly">>({});
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesCategory = selectedCategory === "Semua" || product.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Sort products
    switch (sortBy) {
      case "popular":
        filtered = filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || parseInt(b.downloads) - parseInt(a.downloads));
        break;
      case "rating-high":
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-low":
        filtered = filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "price-high":
        filtered = filtered.sort((a, b) => b.prices.monthly - a.prices.monthly);
        break;
      case "price-low":
        filtered = filtered.sort((a, b) => a.prices.monthly - b.prices.monthly);
        break;
      case "name-asc":
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    const plan = selectedPlan[product.id] || "monthly";
    const planLabels = { weekly: "1 Minggu", monthly: "1 Bulan", yearly: "1 Tahun" };
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

  const currentSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || "Urutkan";

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
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari aplikasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 w-full"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 gap-2 shrink-0">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="hidden sm:inline">{currentSortLabel}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={cn(sortBy === option.value && "bg-primary/10 text-primary")}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
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
          </div>

          {/* Products Grid - Same design as FeaturedProducts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {filteredAndSortedProducts.map((product, index) => (
              <Card
                key={product.id}
                variant="glass"
                className="group overflow-hidden hover:shadow-glow transition-all duration-300 relative animate-slide-up flex flex-col"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Discount Badge */}
                <Badge variant="premium" className="absolute top-2 left-2 text-[10px] z-10">
                  -{product.discount}%
                </Badge>

                {/* Wishlist Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute top-2 right-2 h-7 w-7 z-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background",
                    isInWishlist(product.id) && "text-destructive"
                  )}
                  onClick={(e) => handleToggleWishlist(product, e)}
                >
                  <Heart className={cn("h-3.5 w-3.5", isInWishlist(product.id) && "fill-current")} />
                </Button>

                <Link to={`/produk/${product.id}`} className="block flex-1">
                  {/* Product Image */}
                  <div className="relative h-24 sm:h-28 md:h-32 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    <div
                      className={`absolute bottom-2 left-2 w-8 h-8 md:w-9 md:h-9 rounded-lg bg-gradient-to-br ${product.logoColor} flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-white font-bold text-[10px] md:text-xs">{product.logo}</span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-2.5 md:p-3">
                    <h3 className="font-semibold text-xs md:text-sm mb-0.5 line-clamp-1">{product.name}</h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground mb-2 line-clamp-2 min-h-[28px] leading-relaxed">
                      {product.description}
                    </p>

                    {/* Rating & Downloads */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] md:text-xs font-medium">{product.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Download className="h-3 w-3" />
                        <span className="text-[10px] md:text-xs">{product.downloads}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Plan Selection */}
                <div className="flex gap-1 px-2.5 md:px-3 mb-2">
                  {(["weekly", "monthly", "yearly"] as const).map((plan) => (
                    <button
                      key={plan}
                      onClick={() => setSelectedPlan((p) => ({ ...p, [product.id]: plan }))}
                      className={cn(
                        "flex-1 py-1.5 text-[9px] md:text-[10px] rounded-lg border transition-all font-medium",
                        getPlan(product.id) === plan
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      {plan === "weekly" ? "1 Minggu" : plan === "monthly" ? "1 Bulan" : "1 Tahun"}
                    </button>
                  ))}
                </div>

                {/* Price & Cart */}
                <div className="flex items-center justify-between gap-2 px-2.5 pb-2.5 md:px-3 md:pb-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-muted-foreground line-through">
                      {formatPrice(product.originalPrices[getPlan(product.id)])}
                    </span>
                    <span className="font-bold text-xs md:text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {formatPrice(product.prices[getPlan(product.id)])}
                    </span>
                  </div>
                  <Button variant="premium" size="sm" className="h-8 px-3 text-xs" onClick={(e) => handleAddToCart(product, e)}>
                    <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                    <span className="hidden sm:inline">Tambah</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredAndSortedProducts.length === 0 && (
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
