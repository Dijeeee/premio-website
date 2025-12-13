import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Wallet, Building2, Check, ShieldCheck, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
import { toast } from "sonner";

// Note: Success notification removed - PaymentSuccess page handles celebration

const paymentMethods = [
  { id: "gopay", name: "GoPay", icon: Wallet, color: "from-blue-500 to-cyan-500" },
  { id: "ovo", name: "OVO", icon: Wallet, color: "from-purple-500 to-violet-500" },
  { id: "dana", name: "DANA", icon: Wallet, color: "from-blue-600 to-blue-500" },
  { id: "bca", name: "BCA Virtual Account", icon: Building2, color: "from-blue-700 to-blue-600" },
  { id: "mandiri", name: "Mandiri VA", icon: Building2, color: "from-yellow-500 to-amber-500" },
  { id: "card", name: "Kartu Kredit/Debit", icon: CreditCard, color: "from-slate-600 to-slate-500" },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

function getExpiryDate(plan: string) {
  const now = new Date();
  switch (plan) {
    case 'weekly':
      return new Date(now.setDate(now.getDate() + 7)).toISOString();
    case 'monthly':
      return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
    case 'yearly':
      return new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();
    default:
      return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
  }
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { createTransaction } = useTransactions();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/auth");
      return;
    }

    if (!selectedPayment) {
      toast.error("Pilih metode pembayaran");
      return;
    }
    if (!email) {
      toast.error("Masukkan email Anda");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create transactions for each item
      for (const item of items) {
        await createTransaction({
          product_id: item.id,
          product_name: item.name,
          product_logo: item.logo,
          product_logo_color: item.logoColor,
          plan: item.plan,
          plan_label: item.planLabel,
          price: item.price,
          status: 'active',
          expires_at: getExpiryDate(item.plan)
        });
      }

      clearCart();
      navigate("/pembayaran-berhasil");
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShieldCheck className="h-20 w-20 text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Keranjang Kosong</h2>
              <p className="text-muted-foreground mb-6">Tambahkan produk untuk melanjutkan checkout</p>
              <Link to="/produk">
                <Button variant="premium">Lihat Produk</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="py-6">
            <Link to="/produk" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left - Form */}
            <div className="lg:col-span-3 space-y-4">
              {/* Email */}
              <Card variant="glass" className="p-4 md:p-5">
                <h3 className="font-semibold mb-3">Email Aktivasi</h3>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-2">Detail aktivasi akan dikirim ke email ini</p>
              </Card>

              {/* Payment Methods */}
              <Card variant="glass" className="p-4 md:p-5">
                <h3 className="font-semibold mb-4">Metode Pembayaran</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 text-left relative ${
                        selectedPayment === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {selectedPayment === method.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center mb-2`}>
                        <method.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-xs font-medium line-clamp-1">{method.name}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right - Summary */}
            <div className="lg:col-span-2">
              <Card variant="premium" className="p-4 md:p-5 sticky top-24">
                <h3 className="font-semibold mb-4">Ringkasan Pesanan</h3>

                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.plan}`} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.logoColor} flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">{item.logo}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.planLabel}</p>
                      </div>
                      <span className="text-sm font-medium">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Diskon</span>
                    <span className="text-emerald-500">-Rp 0</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>

                <Button
                  variant="premium"
                  className="w-full mt-6"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Memproses...
                    </>
                  ) : (
                    "Bayar Sekarang"
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Pembayaran aman & terenkripsi</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
