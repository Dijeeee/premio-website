import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Sun,
  Moon,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Produk", href: "/admin/produk" },
  { icon: Users, label: "Pengguna", href: "/admin/pengguna" },
  { icon: CreditCard, label: "Transaksi", href: "/admin/transaksi" },
  { icon: BarChart3, label: "Laporan", href: "/admin/laporan" },
  { icon: Settings, label: "Pengaturan", href: "/admin/pengaturan" },
];

const stats = [
  { label: "Total Pendapatan", value: "Rp 125.8M", change: "+12.5%", trend: "up", icon: DollarSign },
  { label: "Total Transaksi", value: "2,458", change: "+8.2%", trend: "up", icon: ShoppingCart },
  { label: "Pengguna Baru", value: "1,247", change: "+15.3%", trend: "up", icon: Users },
  { label: "Produk Aktif", value: "186", change: "-2.1%", trend: "down", icon: Package },
];

const recentTransactions = [
  { id: "TRX-001", user: "Sarah W.", email: "sarah@email.com", product: "Netflix Premium", amount: 85000, status: "success", date: "2 menit lalu" },
  { id: "TRX-002", user: "Andi P.", email: "andi@email.com", product: "Canva Pro", amount: 75000, status: "pending", date: "15 menit lalu" },
  { id: "TRX-003", user: "Maya S.", email: "maya@email.com", product: "Spotify Premium", amount: 55000, status: "success", date: "1 jam lalu" },
  { id: "TRX-004", user: "Reza M.", email: "reza@email.com", product: "ChatGPT Plus", amount: 180000, status: "failed", date: "2 jam lalu" },
  { id: "TRX-005", user: "Dina K.", email: "dina@email.com", product: "Adobe CC", amount: 280000, status: "success", date: "3 jam lalu" },
];

const topProducts = [
  { name: "Netflix Premium", sales: 1250, revenue: "106.25M", growth: 15.2 },
  { name: "Canva Pro", sales: 980, revenue: "73.5M", growth: 12.8 },
  { name: "Spotify Premium", sales: 850, revenue: "46.75M", growth: 8.5 },
  { name: "ChatGPT Plus", sales: 720, revenue: "129.6M", growth: 22.4 },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function AdminDashboard() {
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
            <div>
              <span className="text-xl font-bold premio-gradient-text">Premio</span>
              <Badge variant="secondary" className="ml-2 text-xs">Admin</Badge>
            </div>
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
                placeholder="Cari produk, pengguna, atau transaksi..."
                className="pl-12 w-96"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="premium" size="sm" className="hidden md:flex">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Produk
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-premio-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">AD</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard Admin</h1>
            <p className="text-muted-foreground">Overview performa bisnis Premio</p>
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
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    stat.trend === "up" ? "text-emerald-500" : "text-destructive"
                  )}>
                    {stat.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <Card variant="glass" className="lg:col-span-2 animate-slide-up animation-delay-200">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold">Transaksi Terbaru</h2>
                <Button variant="ghost" size="sm">
                  Lihat Semua
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Pengguna</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Produk</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Jumlah</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4 text-sm font-mono">{tx.id}</td>
                        <td className="p-4">
                          <div className="text-sm font-medium">{tx.user}</div>
                          <div className="text-xs text-muted-foreground">{tx.email}</div>
                        </td>
                        <td className="p-4 text-sm">{tx.product}</td>
                        <td className="p-4 text-sm font-medium">{formatPrice(tx.amount)}</td>
                        <td className="p-4">
                          <Badge
                            variant={
                              tx.status === "success" ? "success" :
                              tx.status === "pending" ? "warning" : "destructive"
                            }
                          >
                            {tx.status === "success" ? "Sukses" :
                             tx.status === "pending" ? "Pending" : "Gagal"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Top Products */}
            <Card variant="glass" className="animate-slide-up animation-delay-300">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold">Produk Terlaris</h2>
              </div>
              <div className="p-4 space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-premio-gradient flex items-center justify-center text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.sales} penjualan</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Rp {product.revenue}</div>
                      <div className="text-xs text-emerald-500">+{product.growth}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
