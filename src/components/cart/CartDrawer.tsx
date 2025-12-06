import { X, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

export function CartDrawer() {
  const { items, removeFromCart, isCartOpen, setIsCartOpen, totalPrice } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 transition-opacity duration-300",
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 shadow-2xl transition-transform duration-300 flex flex-col",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Keranjang ({items.length})</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Keranjang kosong</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsCartOpen(false)}>
                Mulai Belanja
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.plan}`} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.logoColor} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold">{item.logo}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">{item.planLabel}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatPrice(item.price)}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-destructive hover:underline flex items-center gap-1 ml-auto"
                  >
                    <Trash2 className="h-3 w-3" />
                    Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
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
