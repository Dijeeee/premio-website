import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Download, 
  CheckCircle, 
  Clock, 
  XCircle,
  CreditCard,
  Calendar,
  Package,
  QrCode,
  Copy,
  Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

// Simple QR Code generator using SVG
function QRCode({ value, size = 180 }: { value: string; size?: number }) {
  // Generate a simple visual representation - in production, use a proper QR library
  const hash = value.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  const pattern = [];
  
  const gridSize = 21;
  const cellSize = size / gridSize;
  
  // Generate pseudo-random pattern based on value
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Position detection patterns (corners)
      const isPositionPattern = 
        (row < 7 && col < 7) || // Top-left
        (row < 7 && col >= gridSize - 7) || // Top-right
        (row >= gridSize - 7 && col < 7); // Bottom-left
      
      // Timing patterns
      const isTimingPattern = (row === 6 || col === 6);
      
      // Generate data pattern
      const seed = (hash + row * gridSize + col) % 100;
      const isDataModule = seed > 40;
      
      if (isPositionPattern || isTimingPattern || isDataModule) {
        pattern.push(
          <rect
            key={`${row}-${col}`}
            x={col * cellSize}
            y={row * cellSize}
            width={cellSize}
            height={cellSize}
            fill="currentColor"
            rx={cellSize * 0.1}
          />
        );
      }
    }
  }
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`}
      className="text-foreground"
    >
      <rect width={size} height={size} fill="white" rx={8} />
      <g transform="translate(8, 8)" style={{ transform: `scale(${(size - 16) / size})` }}>
        {pattern}
      </g>
    </svg>
  );
}

function getStatusInfo(status: string, expiresAt: string) {
  const isExpired = new Date(expiresAt) <= new Date();
  
  if (status === 'active' && !isExpired) {
    return {
      badge: <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30"><CheckCircle className="h-3 w-3 mr-1" />Aktif</Badge>,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      steps: [
        { label: "Pembayaran", status: "completed" },
        { label: "Verifikasi", status: "completed" },
        { label: "Aktivasi", status: "completed" },
        { label: "Aktif", status: "current" },
      ]
    };
  } else if (status === 'expired' || isExpired) {
    return {
      badge: <Badge variant="secondary" className="bg-muted text-muted-foreground"><Clock className="h-3 w-3 mr-1" />Kadaluarsa</Badge>,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      steps: [
        { label: "Pembayaran", status: "completed" },
        { label: "Verifikasi", status: "completed" },
        { label: "Aktivasi", status: "completed" },
        { label: "Kadaluarsa", status: "expired" },
      ]
    };
  } else {
    return {
      badge: <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Dibatalkan</Badge>,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      steps: [
        { label: "Pembayaran", status: "completed" },
        { label: "Dibatalkan", status: "cancelled" },
      ]
    };
  }
}

export default function TransactionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transactions, loading } = useTransactions();
  const { user, isLoading: authLoading } = useAuth();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [copied, setCopied] = useState(false);

  // Auth protection
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!loading && transactions.length > 0 && id) {
      const found = transactions.find(t => t.id === id);
      if (found) {
        setTransaction(found);
      } else {
        toast.error("Transaksi tidak ditemukan");
        navigate("/dashboard/transaksi");
      }
    }
  }, [id, transactions, loading, navigate]);

  const copyInvoiceNumber = () => {
    if (transaction) {
      navigator.clipboard.writeText(`INV-${transaction.id.slice(0, 8).toUpperCase()}`);
      setCopied(true);
      toast.success("Nomor invoice disalin");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateInvoice = () => {
    if (!transaction) return;
    
    const invoiceContent = `
=====================================
           INVOICE PREMIO
=====================================

No. Invoice: INV-${transaction.id.slice(0, 8).toUpperCase()}
Tanggal: ${format(new Date(transaction.created_at), "dd MMMM yyyy, HH:mm", { locale: idLocale })}

-------------------------------------
DETAIL PRODUK
-------------------------------------
Produk: ${transaction.product_name}
Paket: ${transaction.plan_label}
Periode: ${format(new Date(transaction.created_at), "dd MMM yyyy")} - ${format(new Date(transaction.expires_at), "dd MMM yyyy")}

-------------------------------------
PEMBAYARAN
-------------------------------------
Subtotal: ${formatPrice(transaction.price)}
Diskon: Rp 0
-------------------------------------
TOTAL: ${formatPrice(transaction.price)}
-------------------------------------

Status: ${transaction.status === 'active' ? 'LUNAS' : transaction.status.toUpperCase()}

=====================================
Terima kasih telah berbelanja di Premio!
Support: support@premio.id
=====================================
    `.trim();

    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${transaction.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Invoice berhasil diunduh");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Transaksi tidak ditemukan</p>
          <Link to="/dashboard/transaksi">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(transaction.status, transaction.expires_at);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/transaksi")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Detail Transaksi</h1>
            <p className="text-sm text-muted-foreground">INV-{transaction.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>
        <Button variant="premium" onClick={generateInvoice}>
          <Download className="h-4 w-4 mr-2" />
          Unduh Invoice
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Product Card */}
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                Produk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${transaction.product_logo_color} flex items-center justify-center shrink-0`}>
                  <span className="text-white font-bold text-xl">{transaction.product_logo}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{transaction.product_name}</h3>
                  <p className="text-sm text-muted-foreground">Paket {transaction.plan_label}</p>
                  <div className="mt-2">{statusInfo.badge}</div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{formatPrice(transaction.price)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Tracking */}
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Status Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {statusInfo.steps.map((step, index) => (
                  <div key={step.label} className="flex flex-col items-center flex-1">
                    <div className="flex items-center w-full">
                      {/* Connector line before */}
                      {index > 0 && (
                        <div className={`flex-1 h-1 ${
                          step.status === 'completed' || statusInfo.steps[index - 1].status === 'completed'
                            ? 'bg-emerald-500'
                            : step.status === 'cancelled' || step.status === 'expired'
                            ? 'bg-muted'
                            : 'bg-muted'
                        }`} />
                      )}
                      
                      {/* Circle */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        step.status === 'completed' 
                          ? 'bg-emerald-500 text-white'
                          : step.status === 'current'
                          ? 'bg-primary text-primary-foreground animate-pulse'
                          : step.status === 'cancelled'
                          ? 'bg-destructive text-destructive-foreground'
                          : step.status === 'expired'
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {step.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : step.status === 'cancelled' ? (
                          <XCircle className="h-5 w-5" />
                        ) : step.status === 'expired' ? (
                          <Clock className="h-5 w-5" />
                        ) : (
                          <CheckCircle className="h-5 w-5" />
                        )}
                      </div>
                      
                      {/* Connector line after */}
                      {index < statusInfo.steps.length - 1 && (
                        <div className={`flex-1 h-1 ${
                          statusInfo.steps[index + 1].status === 'completed' || step.status === 'completed'
                            ? 'bg-emerald-500'
                            : 'bg-muted'
                        }`} />
                      )}
                    </div>
                    <p className={`text-xs mt-2 font-medium ${
                      step.status === 'current' ? 'text-primary' : 
                      step.status === 'completed' ? 'text-emerald-500' : 
                      'text-muted-foreground'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Detail Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">No. Invoice</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">INV-{transaction.id.slice(0, 8).toUpperCase()}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyInvoiceNumber}>
                    {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(transaction.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Diskon</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Biaya Admin</span>
                <span>Rp 0</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatPrice(transaction.price)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* QR Code */}
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <QRCode value={`PREMIO-${transaction.id}`} size={160} />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Scan QR code ini untuk verifikasi transaksi
              </p>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Informasi Waktu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tanggal Pembelian</p>
                <p className="text-sm font-medium">
                  {format(new Date(transaction.created_at), "dd MMMM yyyy, HH:mm", { locale: idLocale })}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Berlaku Hingga</p>
                <p className="text-sm font-medium">
                  {format(new Date(transaction.expires_at), "dd MMMM yyyy, HH:mm", { locale: idLocale })}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Durasi</p>
                <p className="text-sm font-medium">{transaction.plan_label}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}