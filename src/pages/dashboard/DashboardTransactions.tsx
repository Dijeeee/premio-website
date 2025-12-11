import { useState } from "react";
import { FileText, Download, Calendar, CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30"><CheckCircle className="h-3 w-3 mr-1" />Aktif</Badge>;
    case "expired":
      return <Badge variant="secondary" className="bg-muted text-muted-foreground"><Clock className="h-3 w-3 mr-1" />Kadaluarsa</Badge>;
    case "cancelled":
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Dibatalkan</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function DashboardTransactions() {
  const { transactions, loading } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const generateInvoice = (transaction: Transaction) => {
    const invoiceContent = `
=====================================
           INVOICE PREMIO
=====================================

No. Invoice: INV-${transaction.id.slice(0, 8).toUpperCase()}
Tanggal: ${format(new Date(transaction.created_at), "dd MMMM yyyy, HH:mm", { locale: id })}

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
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Riwayat Transaksi</h1>
        <p className="text-sm text-muted-foreground">Lihat semua riwayat pembelian dan unduh invoice</p>
      </div>

      {transactions.length === 0 ? (
        <Card variant="glass" className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Belum Ada Transaksi</h3>
          <p className="text-sm text-muted-foreground">Mulai belanja untuk melihat riwayat transaksi</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <Card key={transaction.id} variant="glass" className="overflow-hidden hover:shadow-glow transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Product Logo */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${transaction.product_logo_color} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-bold text-sm">{transaction.product_logo}</span>
                  </div>

                  {/* Transaction Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-semibold text-sm md:text-base">{transaction.product_name}</h3>
                        <p className="text-xs text-muted-foreground">Paket {transaction.plan_label}</p>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(transaction.created_at), "dd MMM yyyy", { locale: id })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        <span className="font-semibold text-foreground">{formatPrice(transaction.price)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Detail
                    </Button>
                    <Button
                      variant="premium"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => generateInvoice(transaction)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Invoice
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              {/* Product Info */}
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedTransaction.product_logo_color} flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{selectedTransaction.product_logo}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{selectedTransaction.product_name}</h3>
                  <p className="text-sm text-muted-foreground">Paket {selectedTransaction.plan_label}</p>
                </div>
              </div>

              <Separator />

              {/* Invoice Details */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">No. Invoice</span>
                  <span className="font-mono">INV-{selectedTransaction.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal Pembelian</span>
                  <span>{format(new Date(selectedTransaction.created_at), "dd MMMM yyyy, HH:mm", { locale: id })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Berlaku Hingga</span>
                  <span>{format(new Date(selectedTransaction.expires_at), "dd MMMM yyyy", { locale: id })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
              </div>

              <Separator />

              {/* Payment Details */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(selectedTransaction.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Diskon</span>
                  <span>Rp 0</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(selectedTransaction.price)}</span>
                </div>
              </div>

              {/* Download Button */}
              <Button
                variant="premium"
                className="w-full"
                onClick={() => generateInvoice(selectedTransaction)}
              >
                <Download className="h-4 w-4 mr-2" />
                Unduh Invoice
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
