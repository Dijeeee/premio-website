import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { products, formatPrice } from "@/data/products";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: typeof items[0]) => {
    const product = products.find(p => p.id === item.id);
    if (product) {
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
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              <Heart className="inline-block h-7 w-7 mr-2 text-primary" />
              Wishlist Saya
            </h1>
            <p className="text-muted-foreground text-sm">
              {items.length} produk dalam wishlist
            </p>
          </div>

          {items.length === 0 ? (
            <Card variant="glass" className="p-8 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold mb-2">Wishlist Kosong</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Belum ada produk di wishlist. Yuk tambahkan produk favoritmu!
              </p>
              <Link to="/produk">
                <Button variant="premium">Lihat Produk</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {items.map((item) => (
                <Card key={item.id} variant="glass" className="overflow-hidden group">
                  <Link to={`/produk/${item.id}`}>
                    <div className="relative h-28 md:h-36 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      <div className={`absolute bottom-2 left-2 w-8 h-8 rounded-lg bg-gradient-to-br ${item.logoColor} flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-xs">{item.logo}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{item.category}</p>
                    <p className="font-bold text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="premium"
                        size="sm"
                        className="flex-1 h-8 text-xs"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Beli
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
