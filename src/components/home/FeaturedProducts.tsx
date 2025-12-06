import { Link } from "react-router-dom";
import { Star, Download, ArrowRight, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { products, formatPrice } from "@/data/products";

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
    <section className="py-10 md:py-14 bg-muted/30 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {products.slice(0, 8).map((product, index) => (
            <Card
              key={product.id}
              variant="glass"
              className="group overflow-hidden hover:shadow-glow transition-all duration-300 relative animate-slide-up"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {product.popular && (
                <Badge variant="premium" className="absolute top-2 right-2 text-[10px] z-10">Hot</Badge>
              )}

              <Link to={`/produk/${product.id}`} className="block">
                {/* Image */}
                <div className="relative h-24 md:h-32 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <div className={`absolute bottom-2 left-2 w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${product.logoColor} flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-xs">{product.logo}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-2.5 md:p-3">
                  <h3 className="font-semibold text-xs md:text-sm mb-0.5 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground mb-1.5">{product.category}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-medium">{product.rating}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-muted-foreground">
                      <Download className="h-2.5 w-2.5" />
                      <span className="text-[10px]">{product.downloads}</span>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="flex items-center justify-between gap-1.5 px-2.5 pb-2.5 md:px-3 md:pb-3">
                <span className="font-bold text-xs bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {formatPrice(product.prices.monthly)}
                </span>
                <Button
                  variant="premium"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  <ShoppingCart className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
