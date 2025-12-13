import { CreditCard, CheckCircle, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTransactions } from "@/hooks/useTransactions";
import { Skeleton } from "@/components/ui/skeleton";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export function DashboardSubscriptions() {
  const { transactions, loading, getActiveSubscriptions, getExpiredSubscriptions } = useTransactions();
  
  const activeSubscriptions = getActiveSubscriptions();
  const expiredSubscriptions = getExpiredSubscriptions();
  
  // Check for subscriptions expiring within 7 days
  const expiringSubscriptions = activeSubscriptions.filter(t => {
    const expiryDate = new Date(t.expires_at);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  });

  const getStatusInfo = (transaction: typeof transactions[0]) => {
    const expiryDate = new Date(transaction.expires_at);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (expiryDate <= now || transaction.status === 'expired') {
      return { status: 'expired', label: 'Berakhir', variant: 'destructive' as const };
    }
    if (daysUntilExpiry <= 7) {
      return { status: 'expiring', label: 'Segera Berakhir', variant: 'warning' as const };
    }
    return { status: 'active', label: 'Aktif', variant: 'success' as const };
  };

  if (loading) {
    return (
      <>
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </>
    );
  }

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
          <div className="text-2xl font-bold">{activeSubscriptions.length}</div>
          <div className="text-xs text-muted-foreground">Aktif</div>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-2">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold">{expiringSubscriptions.length}</div>
          <div className="text-xs text-muted-foreground">Segera Berakhir</div>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mx-auto mb-2">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold">{transactions.length}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </Card>
      </div>

      {/* Subscriptions List */}
      {transactions.length > 0 ? (
        <Card variant="glass">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Daftar Langganan</h2>
          </div>
          <div className="divide-y divide-border">
            {transactions.map((transaction) => {
              const statusInfo = getStatusInfo(transaction);
              return (
                <div key={transaction.id} className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${transaction.product_logo_color} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-bold">{transaction.product_logo}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{transaction.product_name}</div>
                    <div className="text-sm text-muted-foreground">Paket {transaction.plan_label}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {statusInfo.status === "expiring" && (
                        <span className="text-amber-500 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Berakhir: {formatDate(transaction.expires_at)}
                        </span>
                      )}
                      {statusInfo.status === "active" && `Berakhir: ${formatDate(transaction.expires_at)}`}
                      {statusInfo.status === "expired" && (
                        <span className="text-destructive">Berakhir pada: {formatDate(transaction.expires_at)}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {formatPrice(transaction.price)}
                    </div>
                    <Badge variant={statusInfo.variant} className="mt-1">
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card variant="glass" className="p-12 text-center">
          <CreditCard className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-semibold mb-2">Belum ada langganan</h3>
          <p className="text-sm text-muted-foreground mb-4">Mulai berlangganan aplikasi premium sekarang</p>
          <Link to="/produk">
            <Button variant="premium">Jelajahi Produk</Button>
          </Link>
        </Card>
      )}
    </>
  );
}
