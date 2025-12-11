import { X, ShoppingCart, Trash2, ArrowRight, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

export function CartDrawer() {
  const { items, removeFromCart, isCartOpen, setIsCartOpen, totalPrice, totalItems } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[100] transition-opacity duration-300",
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-background z-[101] shadow-2xl transition-transform duration-300 flex flex-col",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Keranjang Belanja</h2>
              <p className="text-xs text-muted-foreground">{totalItems} item</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Items */}
        <ScrollArea className="flex-1 p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)] text-center">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                <Package className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Keranjang Kosong</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-[200px]">
                Belum ada item di keranjang. Yuk mulai belanja!
              </p>
              <Link to="/produk" onClick={() => setIsCartOpen(false)}>
                <Button variant="premium" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Jelajahi Produk
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <Card 
                  key={`${item.id}-${item.plan}`} 
                  variant="glass"
                  className="p-3 animate-slide-up hover:shadow-md transition-shadow"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.logoColor} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <span className="text-white font-bold text-lg">{item.logo}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary font-medium">
                        {item.planLabel}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {formatPrice(item.price)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-destructive hover:underline flex items-center gap-1 ml-auto mt-1 hover:bg-destructive/10 px-2 py-1 rounded-md transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-muted-foreground">Total Pembayaran</span>
                <p className="text-xs text-muted-foreground">{totalItems} item</p>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <Link to="/checkout" onClick={() => setIsCartOpen(false)} className="block">
              <Button variant="premium" className="w-full" size="lg">
                Checkout Sekarang
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
