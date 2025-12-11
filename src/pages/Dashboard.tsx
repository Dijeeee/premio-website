import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  FileText,
  Download,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DashboardHome } from "./dashboard/DashboardHome";
import { DashboardCart } from "./dashboard/DashboardCart";
import { DashboardSubscriptions } from "./dashboard/DashboardSubscriptions";
import DashboardTransactions from "./dashboard/DashboardTransactions";
import { DashboardDownloads } from "./dashboard/DashboardDownloads";
import { DashboardProfile } from "./dashboard/DashboardProfile";
import { DashboardSettings } from "./dashboard/DashboardSettings";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", page: "home" },
  { icon: ShoppingBag, label: "Keranjang", href: "/dashboard/keranjang", page: "cart" },
  { icon: CreditCard, label: "Langganan", href: "/dashboard/langganan", page: "subscriptions" },
  { icon: FileText, label: "Transaksi", href: "/dashboard/transaksi", page: "transactions" },
  { icon: Download, label: "Download", href: "/dashboard/download", page: "downloads" },
  { icon: User, label: "Profil", href: "/dashboard/profil", page: "profile" },
  { icon: Settings, label: "Pengaturan", href: "/dashboard/pengaturan", page: "settings" },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const { user, isLoading, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  // Close notification panel on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine current page from URL
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "home";
    if (path.includes("keranjang")) return "cart";
    if (path.includes("langganan")) return "subscriptions";
    if (path.includes("transaksi")) return "transactions";
    if (path.includes("download")) return "downloads";
    if (path.includes("profil")) return "profile";
    if (path.includes("pengaturan")) return "settings";
    return "home";
  };

  const currentPage = getCurrentPage();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    toast.success("Berhasil logout");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.email?.split("@")[0] || "User";

  const renderContent = () => {
    switch (currentPage) {
      case "cart":
        return <DashboardCart />;
      case "subscriptions":
        return <DashboardSubscriptions />;
      case "transactions":
        return <DashboardTransactions />;
      case "downloads":
        return <DashboardDownloads />;
      case "profile":
        return <DashboardProfile />;
      case "settings":
        return <DashboardSettings />;
      default:
        return <DashboardHome userName={userName} />;
    }
  };

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
            <img src="/premio-logo.png" alt="Premio" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Premio</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
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

        <div className="p-3 border-t border-border space-y-2">
          <div className="px-3 py-2 text-sm text-muted-foreground truncate">
            {user.email}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-muted-foreground hover:text-destructive h-9"
            onClick={handleLogout}
          >
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
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <div ref={notificationRef} className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 relative"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
              <NotificationPanel 
                isOpen={isNotificationOpen} 
                onClose={() => setIsNotificationOpen(false)} 
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-xs">{userName.substring(0, 2).toUpperCase()}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
