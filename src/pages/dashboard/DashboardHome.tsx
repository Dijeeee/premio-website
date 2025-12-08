import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Download,
  CheckCircle,
  Clock,
  Package,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";

interface DashboardHomeProps {
  userName: string;
}

export function DashboardHome({ userName }: DashboardHomeProps) {
  const { items, totalItems, totalPrice } = useCart();

  const stats = [
    { label: "Di Keranjang", value: totalItems.toString(), icon: ShoppingBag, color: "from-blue-500 to-cyan-500" },
    { label: "Langganan Aktif", value: "3", icon: CheckCircle, color: "from-emerald-500 to-teal-500" },
    { label: "Menunggu", value: "1", icon: Clock, color: "from-amber-500 to-orange-500" },
    { label: "Total Download", value: "12", icon: Download, color: "from-purple-500 to-violet-500" },
  ];

  const subscriptions = [
    { name: "Netflix Premium", logo: "N", color: "from-red-600 to-red-500", expiry: "5 Jan 2025", status: "active" },
    { name: "Canva Pro", logo: "C", color: "from-cyan-500 to-blue-500", expiry: "1 Jan 2025", status: "active" },
    { name: "Spotify Premium", logo: "S", color: "from-green-500 to-green-400", expiry: "28 Des 2024", status: "expiring" },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Selamat Datang, {userName}! 👋</h1>
        <p className="text-sm text-muted-foreground">Ringkasan aktivitas akun Anda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} variant="glass" className="p-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Cart Items (Synced) */}
      <Card variant="glass" className="mb-6">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <Package className="h-4 w-4" />
            Keranjang Anda ({totalItems})
          </h2>
          {totalItems > 0 && (
            <Link to="/checkout">
              <Button variant="premium" size="sm" className="h-8 text-xs">
                Checkout {formatPrice(totalPrice)}
              </Button>
            </Link>
          )}
        </div>
        
        {items.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground mb-3">Keranjang kosong</p>
            <Link to="/produk">
              <Button variant="outline" size="sm">Jelajahi Produk</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {items.slice(0, 3).map((item) => (
              <div key={`${item.id}-${item.plan}`} className="p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.logoColor} flex items-center justify-center shrink-0`}>
                  <span className="text-white font-bold">{item.logo}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.category} • {item.planLabel}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {formatPrice(item.price)}
                  </div>
                  <Badge variant="success" className="text-[10px]">Siap Beli</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Subscriptions */}
      <Card variant="glass">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Langganan Aktif</h2>
          <Link to="/dashboard/langganan">
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              Lihat Semua <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="divide-y divide-border">
          {subscriptions.map((sub, i) => (
            <div key={i} className="p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${sub.color} flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">{sub.logo}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{sub.name}</div>
                <div className="text-xs text-muted-foreground">Berakhir: {sub.expiry}</div>
              </div>
              <Badge variant={sub.status === "active" ? "success" : "warning"} className="text-[10px]">
                {sub.status === "active" ? "Aktif" : "Segera Berakhir"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
