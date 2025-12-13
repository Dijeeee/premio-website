import { Link } from "react-router-dom";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  Package,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useTransactions } from "@/hooks/useTransactions";
import { formatPrice } from "@/data/products";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardHomeProps {
  userName: string;
}

export function DashboardHome({ userName }: DashboardHomeProps) {
  const { items, totalItems, totalPrice } = useCart();
  const { transactions, loading, getActiveSubscriptions } = useTransactions();
  
  const activeSubscriptions = getActiveSubscriptions();
  
  // Pending = transactions from last 24 hours
  const pendingCount = transactions.filter(t => {
    const createdAt = new Date(t.created_at);
    const now = new Date();
    const hoursSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    return hoursSinceCreated <= 24;
  }).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const stats = [
    { label: "Di Keranjang", value: totalItems.toString(), icon: ShoppingBag, color: "from-blue-500 to-cyan-500" },
    { label: "Langganan Aktif", value: loading ? "-" : activeSubscriptions.length.toString(), icon: CheckCircle, color: "from-emerald-500 to-teal-500" },
    { label: "Transaksi Baru", value: loading ? "-" : pendingCount.toString(), icon: Clock, color: "from-amber-500 to-orange-500" },
    { label: "Total Transaksi", value: loading ? "-" : transactions.length.toString(), icon: CreditCard, color: "from-purple-500 to-violet-500" },
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
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : activeSubscriptions.length === 0 ? (
          <div className="p-8 text-center">
            <CreditCard className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground mb-3">Belum ada langganan aktif</p>
            <Link to="/produk">
              <Button variant="outline" size="sm">Mulai Berlangganan</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {activeSubscriptions.slice(0, 3).map((sub) => (
              <div key={sub.id} className="p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${sub.product_logo_color} flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{sub.product_logo}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{sub.product_name}</div>
                  <div className="text-xs text-muted-foreground">Berakhir: {formatDate(sub.expires_at)}</div>
                </div>
                <Badge variant="success" className="text-[10px]">Aktif</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
