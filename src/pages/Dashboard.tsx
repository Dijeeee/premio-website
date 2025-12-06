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
  Search,
  Sun,
  Moon,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ShoppingBag, label: "Pembelian", href: "/dashboard/pembelian" },
  { icon: CreditCard, label: "Langganan", href: "/dashboard/langganan" },
  { icon: Download, label: "Download", href: "/dashboard/download" },
  { icon: User, label: "Profil", href: "/dashboard/profil" },
  { icon: Settings, label: "Pengaturan", href: "/dashboard/pengaturan" },
];

const recentPurchases = [
  {
    id: 1,
    name: "Netflix Premium",
    logo: "N",
    color: "from-red-600 to-red-500",
    date: "5 Des 2024",
    price: 85000,
    status: "active",
    expiry: "5 Jan 2025",
  },
  {
    id: 2,
    name: "Canva Pro",
    logo: "C",
    color: "from-cyan-500 to-blue-500",
    date: "1 Des 2024",
    price: 75000,
    status: "active",
    expiry: "1 Jan 2025",
  },
  {
    id: 3,
    name: "Spotify Premium",
    logo: "S",
    color: "from-green-500 to-green-400",
    date: "28 Nov 2024",
    price: 55000,
    status: "expired",
    expiry: "28 Des 2024",
  },
];

const stats = [
  { label: "Total Pembelian", value: "15", icon: ShoppingBag, color: "from-blue-500 to-cyan-500" },
  { label: "Langganan Aktif", value: "5", icon: CheckCircle, color: "from-emerald-500 to-teal-500" },
  { label: "Menunggu Aktivasi", value: "2", icon: Clock, color: "from-amber-500 to-orange-500" },
  { label: "Total Download", value: "28", icon: Download, color: "from-purple-500 to-violet-500" },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-premio-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold premio-gradient-text">Premio</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive">
            <LogOut className="h-5 w-5 mr-3" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-20 px-4 md:px-8 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Cari produk atau transaksi..."
                className="pl-12 w-80"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-premio-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">JD</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Selamat Datang, John! 👋</h1>
            <p className="text-muted-foreground">Berikut ringkasan aktivitas akun Anda</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                variant="glass"
                className="p-6 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Recent Purchases */}
          <Card variant="glass" className="animate-slide-up animation-delay-200">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold">Pembelian Terbaru</h2>
              <Link to="/dashboard/pembelian">
                <Button variant="ghost" size="sm">
                  Lihat Semua
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentPurchases.map((purchase) => (
                <div key={purchase.id} className="p-6 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${purchase.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-xl">{purchase.logo}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold mb-1">{purchase.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Dibeli: {purchase.date} • Berakhir: {purchase.expiry}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold mb-1">{formatPrice(purchase.price)}</div>
                    <Badge variant={purchase.status === "active" ? "success" : "destructive"}>
                      {purchase.status === "active" ? "Aktif" : "Kadaluarsa"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
