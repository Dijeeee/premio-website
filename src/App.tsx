import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Reviews from "./pages/Reviews";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Dashboard from "./pages/Dashboard";
import TransactionDetail from "./pages/dashboard/TransactionDetail";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <CartDrawer />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/register" element={<Auth defaultMode="register" />} />
                  <Route path="/produk" element={<Products />} />
                  <Route path="/produk/:id" element={<ProductDetail />} />
                  <Route path="/kategori" element={<Categories />} />
                  <Route path="/review" element={<Reviews />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/pembayaran-berhasil" element={<PaymentSuccess />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/keranjang" element={<Dashboard />} />
                  <Route path="/dashboard/langganan" element={<Dashboard />} />
                  <Route path="/dashboard/transaksi" element={<Dashboard />} />
                  <Route path="/dashboard/transaksi/:id" element={<TransactionDetail />} />
                  <Route path="/dashboard/profil" element={<Dashboard />} />
                  <Route path="/dashboard/pengaturan" element={<Dashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;