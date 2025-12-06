import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Download,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  Clock,
  CheckCircle,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/data/products";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ShoppingBag, label: "Keranjang", href: "/dashboard/keranjang" },
  { icon: CreditCard, label: "Langganan", href: "/dashboard/langganan" },
  { icon: Download, label: "Download", href: "/dashboard/download" },
  { icon: User, label: "Profil", href: "/dashboard/profil" },
  { icon: Settings, label: "Pengaturan", href: "/dashboard/pengaturan" },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { items, totalItems, totalPrice } = useCart();
  const location = useLocation();

  const stats = [
    { label: "Di Keranjang", value: totalItems.toString(), icon: ShoppingBag, color: "from-blue-500 to-cyan-500" },
    { label: "Langganan Aktif", value: "3", icon: CheckCircle, color: "from-emerald-500 to-teal-500" },
    { label: "Menunggu", value: "1", icon: Clock, color: "from-amber-500 to-orange-500" },
    { label: "Total Download", value: "12", icon: Download, color: "from-purple-500 to-violet-500" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-14 px-4 flex items-center justify-between border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Premio</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
                {link.label === "Keranjang" && totalItems > 0 && (
                  <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5">{totalItems}</Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-destructive h-9">
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 px-4 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-30">
          <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-xs">JD</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold mb-1">Selamat Datang, John! 👋</h1>
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
                {items.map((item) => (
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

          {/* Recent Subscriptions */}
          <Card variant="glass">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold">Langganan Aktif</h2>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                Lihat Semua <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="divide-y divide-border">
              {[
                { name: "Netflix Premium", logo: "N", color: "from-red-600 to-red-500", expiry: "5 Jan 2025", status: "active" },
                { name: "Canva Pro", logo: "C", color: "from-cyan-500 to-blue-500", expiry: "1 Jan 2025", status: "active" },
                { name: "Spotify Premium", logo: "S", color: "from-green-500 to-green-400", expiry: "28 Des 2024", status: "expiring" },
              ].map((sub, i) => (
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
        </main>
      </div>
    </div>
  );
}
