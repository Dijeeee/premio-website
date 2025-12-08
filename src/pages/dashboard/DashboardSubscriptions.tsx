import { CreditCard, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const subscriptions = [
  { name: "Netflix Premium", logo: "N", color: "from-red-600 to-red-500", expiry: "5 Jan 2025", status: "active", plan: "Bulanan", price: 54000 },
  { name: "Canva Pro", logo: "C", color: "from-cyan-500 to-blue-500", expiry: "1 Jan 2025", status: "active", plan: "Tahunan", price: 150000 },
  { name: "Spotify Premium", logo: "S", color: "from-green-500 to-green-400", expiry: "28 Des 2024", status: "expiring", plan: "Bulanan", price: 25000 },
  { name: "ChatGPT Plus", logo: "G", color: "from-emerald-500 to-teal-500", expiry: "15 Jan 2025", status: "active", plan: "Bulanan", price: 299000 },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

export function DashboardSubscriptions() {
  const activeCount = subscriptions.filter(s => s.status === "active").length;
  const expiringCount = subscriptions.filter(s => s.status === "expiring").length;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Langganan Saya</h1>
        <p className="text-sm text-muted-foreground">Kelola semua langganan aplikasi Anda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card variant="glass" className="p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold">{activeCount}</div>
          <div className="text-xs text-muted-foreground">Aktif</div>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-2">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold">{expiringCount}</div>
          <div className="text-xs text-muted-foreground">Segera Berakhir</div>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mx-auto mb-2">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold">{subscriptions.length}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </Card>
      </div>

      {/* Subscriptions List */}
      <Card variant="glass">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Daftar Langganan</h2>
        </div>
        <div className="divide-y divide-border">
          {subscriptions.map((sub, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sub.color} flex items-center justify-center shrink-0`}>
                <span className="text-white font-bold">{sub.logo}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{sub.name}</div>
                <div className="text-sm text-muted-foreground">Paket {sub.plan}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {sub.status === "expiring" && (
                    <span className="text-amber-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Berakhir: {sub.expiry}
                    </span>
                  )}
                  {sub.status === "active" && `Berakhir: ${sub.expiry}`}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {formatPrice(sub.price)}
                </div>
                <Badge variant={sub.status === "active" ? "success" : "warning"} className="mt-1">
                  {sub.status === "active" ? "Aktif" : "Segera Berakhir"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Empty State for no subscriptions */}
      {subscriptions.length === 0 && (
        <Card variant="glass" className="p-12 text-center">
          <CreditCard className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-semibold mb-2">Belum ada langganan</h3>
          <p className="text-sm text-muted-foreground mb-4">Mulai berlangganan aplikasi premium sekarang</p>
          <Button variant="premium">Jelajahi Produk</Button>
        </Card>
      )}
    </>
  );
}
