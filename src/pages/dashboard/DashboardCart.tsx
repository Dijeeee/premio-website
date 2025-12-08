import { Link } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";

export function DashboardCart() {
  const { items, totalItems, totalPrice, removeFromCart } = useCart();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Keranjang Belanja</h1>
        <p className="text-sm text-muted-foreground">Kelola item di keranjang Anda</p>
      </div>

      <Card variant="glass">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            {totalItems} Item
          </h2>
          {totalItems > 0 && (
            <Link to="/checkout">
              <Button variant="premium" size="sm">
                Checkout - {formatPrice(totalPrice)}
              </Button>
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold mb-2">Keranjang kosong</h3>
            <p className="text-sm text-muted-foreground mb-4">Belum ada produk di keranjang Anda</p>
            <Link to="/produk">
              <Button variant="premium">Jelajahi Produk</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div key={`${item.id}-${item.plan}`} className="p-4 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.logoColor} flex items-center justify-center shrink-0`}>
                  <span className="text-white font-bold text-lg">{item.logo}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-muted-foreground">{item.category}</div>
                  <Badge variant="secondary" className="mt-1">{item.planLabel}</Badge>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {formatPrice(item.price)}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive mt-1"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <Link to="/checkout" className="block">
              <Button variant="premium" className="w-full">
                Lanjutkan ke Checkout
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </>
  );
}
