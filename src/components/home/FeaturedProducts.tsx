import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Download, ArrowRight, ShoppingCart, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { products, formatPrice } from "@/data/products";
import { cn } from "@/lib/utils";

export function FeaturedProducts() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedPlan, setSelectedPlan] = useState<Record<string, "weekly" | "monthly" | "yearly">>({});

  const getPlan = (productId: string) => selectedPlan[productId] || "monthly";

  const handleAddToCart = (product: typeof products[0], e: React.MouseEvent) => {
    e.preventDefault();
    const plan = getPlan(product.id);
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

  const handleToggleWishlist = (product: typeof products[0], e: React.MouseEvent) => {
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

  const handlePlanChange = (productId: string, plan: "weekly" | "monthly" | "yearly", e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedPlan((prev) => ({ ...prev, [productId]: plan }));
  };

  return (
    <section className="py-10 md:py-14 bg-muted/30 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-0.5">
              Produk <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Unggulan</span>
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">Terlaris dengan harga terbaik</p>
          </div>
          <Link to="/produk">
            <Button variant="outline" size="sm" className="group h-8 text-xs">
              Semua
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {products.slice(0, 8).map((product, index) => (
            <Card
              key={product.id}
              variant="glass"
              className="group overflow-hidden hover:shadow-glow transition-all duration-300 relative animate-slide-up flex flex-col"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Discount Badge */}
              <Badge variant="destructive" className="absolute top-2 left-2 text-[10px] z-10 font-bold">
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
                {/* Image */}
                <div className="relative h-24 sm:h-28 md:h-32 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <div className={`absolute bottom-2 left-2 w-8 h-8 md:w-9 md:h-9 rounded-lg bg-gradient-to-br ${product.logoColor} flex items-center justify-center shadow-lg border-2 border-background`}>
                    <span className="text-white font-bold text-[10px] md:text-xs">{product.logo}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-2.5 md:p-3">
                  <h3 className="font-bold text-xs md:text-sm mb-0.5 group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[9px] md:text-[10px] text-muted-foreground mb-2 line-clamp-2 min-h-[24px] leading-relaxed">
                    {product.description}
                  </p>
                  
                  {/* Rating & Downloads */}
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-semibold">{product.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Download className="h-2.5 w-2.5" />
                      <span className="text-[9px]">{product.downloads}</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Plan Selection */}
              <div className="px-2.5 md:px-3">
                <div className="flex gap-0.5 mb-2">
                  {(["weekly", "monthly", "yearly"] as const).map((plan) => (
                    <button
                      key={plan}
                      onClick={(e) => handlePlanChange(product.id, plan, e)}
                      className={cn(
                        "flex-1 py-1 text-[9px] md:text-[10px] rounded-md border transition-all font-medium",
                        getPlan(product.id) === plan
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      {plan === "weekly" ? "Minggu" : plan === "monthly" ? "Bulan" : "Tahun"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="px-2.5 pb-2.5 md:px-3 md:pb-3">
                <div className="flex flex-col gap-0.5 mb-2">
                  <span className="text-[9px] text-muted-foreground line-through">
                    {formatPrice(product.originalPrices[getPlan(product.id)])}
                  </span>
                  <span className="font-bold text-sm md:text-base bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {formatPrice(product.prices[getPlan(product.id)])}
                  </span>
                </div>
                <Button
                  variant="premium"
                  size="sm"
                  className="w-full h-8 text-[10px] md:text-xs font-semibold"
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Keranjang
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}