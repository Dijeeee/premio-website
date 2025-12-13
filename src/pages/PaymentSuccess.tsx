import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Download, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
import confetti from "canvas-confetti";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

export default function PaymentSuccess() {
  const { user } = useAuth();
  const { transactions } = useTransactions();
  const navigate = useNavigate();
  const [latestTransaction, setLatestTransaction] = useState<typeof transactions[0] | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    // Get latest transaction
    if (transactions.length > 0) {
      const latest = transactions.reduce((a, b) => 
        new Date(a.created_at) > new Date(b.created_at) ? a : b
      );
      setLatestTransaction(latest);
    }
  }, [transactions]);

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 3,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.1, 0.5) },
        colors: ['#6366f1', '#8b5cf6', '#a855f7', '#06b6d4', '#10b981']
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card variant="glass" className="w-full max-w-md p-6 md:p-8 text-center animate-scale-in">
        {/* Success Icon */}
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full animate-pulse opacity-30" />
          <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
          Pembayaran Berhasil!
        </h1>
        <p className="text-muted-foreground mb-6">
          Terima kasih atas pembelian Anda. Langganan Anda telah aktif.
        </p>

        {/* Transaction Details */}
        {latestTransaction && (
          <Card className="bg-muted/50 p-4 mb-6 text-left">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${latestTransaction.product_logo_color} flex items-center justify-center`}>
                <span className="text-white font-bold">{latestTransaction.product_logo}</span>
              </div>
              <div>
                <div className="font-semibold">{latestTransaction.product_name}</div>
                <div className="text-sm text-muted-foreground">{latestTransaction.plan_label}</div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-emerald-500">Aktif</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal Pembelian</span>
                <span className="font-medium">{formatDate(latestTransaction.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Berlaku Hingga</span>
                <span className="font-medium">{formatDate(latestTransaction.expires_at)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-semibold">Total Pembayaran</span>
                <span className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {formatPrice(latestTransaction.price)}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Info Box */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 text-left">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <Download className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="font-medium text-sm mb-1">Langkah Selanjutnya</div>
              <p className="text-xs text-muted-foreground">
                Detail aktivasi telah dikirim ke email Anda. Cek folder inbox atau spam untuk instruksi lengkap.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link to="/dashboard/langganan" className="block">
            <Button variant="premium" className="w-full" size="lg">
              <CreditCard className="h-4 w-4 mr-2" />
              Lihat Langganan Saya
            </Button>
          </Link>
          <Link to="/produk" className="block">
            <Button variant="outline" className="w-full">
              Lanjut Belanja
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Transaction ID */}
        {latestTransaction && (
          <p className="text-xs text-muted-foreground mt-6">
            ID Transaksi: {latestTransaction.id.slice(0, 8).toUpperCase()}
          </p>
        )}
      </Card>
    </div>
  );
}