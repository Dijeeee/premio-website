import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Download, Shield, Check, Play, ShoppingCart, Heart, Share2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { products, getProductById, formatPrice } from "@/data/products";
import { toast } from "sonner";

const productData = {
  "netflix-premium": {
    name: "Netflix Premium",
    logo: "N",
    logoColor: "from-red-600 to-red-500",
    category: "Streaming",
    rating: 4.9,
    reviews: 2456,
    downloads: "50K+",
    description: "Nikmati ribuan film dan serial TV terbaik dari seluruh dunia dengan kualitas Ultra HD 4K.",
    features: [
      "Streaming tanpa iklan",
      "Kualitas Ultra HD 4K + HDR",
      "Download untuk ditonton offline",
      "Hingga 4 perangkat bersamaan",
      "Akses semua konten original",
      "Profil terpisah untuk keluarga",
    ],
    prices: {
      weekly: { price: 25000, originalPrice: 35000 },
      monthly: { price: 85000, originalPrice: 120000 },
      yearly: { price: 850000, originalPrice: 1200000 },
    },
  },
  "canva-pro": {
    name: "Canva Pro",
    logo: "C",
    logoColor: "from-cyan-500 to-blue-500",
    category: "Design",
    rating: 4.8,
    reviews: 1823,
    downloads: "45K+",
    description: "Canva Pro adalah platform desain lengkap untuk membuat konten visual profesional.",
    features: [
      "100+ juta foto & video premium",
      "610K+ template premium",
      "Background remover",
      "Brand kit & font custom",
      "Magic resize",
      "Kolaborasi tim real-time",
    ],
    prices: {
      weekly: { price: 20000, originalPrice: 30000 },
      monthly: { price: 75000, originalPrice: 100000 },
      yearly: { price: 750000, originalPrice: 1000000 },
    },
  },
};

type ProductId = keyof typeof productData;

const relatedProducts = [
  { id: "disney-plus", name: "Disney+", logo: "D+", color: "from-blue-600 to-indigo-600", price: 80000 },
  { id: "hbo-max", name: "HBO Max", logo: "H", color: "from-purple-600 to-violet-600", price: 90000 },
  { id: "prime-video", name: "Prime Video", logo: "P", color: "from-cyan-500 to-blue-500", price: 70000 },
];

const reviews = [
  { id: 1, name: "Sarah W.", avatar: "S", rating: 5, date: "2 hari lalu", content: "Proses aktivasi sangat cepat!" },
  { id: 2, name: "Andi P.", avatar: "A", rating: 5, date: "1 minggu lalu", content: "Harga jauh lebih murah." },
  { id: 3, name: "Maya S.", avatar: "M", rating: 4, date: "2 minggu lalu", content: "Kualitas streaming excellent." },
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedPlan, setSelectedPlan] = useState<"weekly" | "monthly" | "yearly">("monthly");

  // Get product from centralized data first
  const productFromData = getProductById(id || "");
  const productFromLocal = productData[id as ProductId];
  
  // Helper to get price (handles both data structures)
  const getPrice = (plan: "weekly" | "monthly" | "yearly"): number => {
    if (productFromData) {
      return productFromData.prices[plan];
    }
    if (productFromLocal) {
      return productFromLocal.prices[plan].price;
    }
    return productData["netflix-premium"].prices[plan].price;
  };

  const getOriginalPrice = (plan: "weekly" | "monthly" | "yearly"): number => {
    if (productFromData) {
      return productFromData.originalPrices[plan];
    }
    if (productFromLocal) {
      return productFromLocal.prices[plan].originalPrice;
    }
    return productData["netflix-premium"].prices[plan].originalPrice;
  };

  // Normalize product data
  const product = {
    name: productFromData?.name || productFromLocal?.name || productData["netflix-premium"].name,
    logo: productFromData?.logo || productFromLocal?.logo || productData["netflix-premium"].logo,
    logoColor: productFromData?.logoColor || productFromLocal?.logoColor || productData["netflix-premium"].logoColor,
    category: productFromData?.category || productFromLocal?.category || productData["netflix-premium"].category,
    rating: productFromData?.rating || productFromLocal?.rating || productData["netflix-premium"].rating,
    downloads: productFromData?.downloads || productFromLocal?.downloads || productData["netflix-premium"].downloads,
    description: productFromData?.description || productFromLocal?.description || productData["netflix-premium"].description,
    image: productFromData?.image || "",
    reviews: productFromLocal?.reviews || 1000,
    features: productFromLocal?.features || [
      "Akses premium tanpa batas",
      "Fitur eksklusif tersedia",
      "Support prioritas 24/7",
      "Update otomatis",
      "Multi-device support",
      "Garansi 100%",
    ],
  };

  const plans: Array<{ key: "weekly" | "monthly" | "yearly"; label: string; price: number; originalPrice: number; popular?: boolean; save?: string }> = [
    { key: "weekly", label: "Mingguan", price: getPrice("weekly"), originalPrice: getOriginalPrice("weekly") },
    { key: "monthly", label: "Bulanan", price: getPrice("monthly"), originalPrice: getOriginalPrice("monthly"), popular: true },
    { key: "yearly", label: "Tahunan", price: getPrice("yearly"), originalPrice: getOriginalPrice("yearly"), save: "30%" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-8">
              <Card variant="glass" className="p-8 animate-fade-in">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${product.logoColor} flex items-center justify-center flex-shrink-0 shadow-xl`}>
                    <span className="text-white font-bold text-5xl">{product.logo}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="secondary" className="mb-3">{product.category}</Badge>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => {
                            const productId = id || "netflix-premium";
                            if (isInWishlist(productId)) {
                              removeFromWishlist(productId);
                            } else {
                              addToWishlist({
                                id: productId,
                                name: product.name,
                                logo: product.logo,
                                logoColor: product.logoColor,
                                image: product.image,
                                category: product.category,
                                price: getPrice(selectedPlan),
                              });
                            }
                          }}
                        >
                          <Heart className={`h-5 w-5 ${isInWishlist(id || "") ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                        <Button variant="outline" size="icon"><Share2 className="h-5 w-5" /></Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{product.rating}</span>
                        <span className="text-muted-foreground">({product.reviews} ulasan)</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Download className="h-5 w-5" />
                        <span>{product.downloads}</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-500">
                        <Shield className="h-5 w-5" />
                        <span className="font-medium">Lisensi Resmi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Tabs defaultValue="description" className="animate-slide-up">
                <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="description" className="rounded-lg">Deskripsi</TabsTrigger>
                  <TabsTrigger value="features" className="rounded-lg">Fitur</TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-lg">Ulasan</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-6">
                  <Card variant="glass" className="p-6">
                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                    <div className="mt-6 relative rounded-2xl overflow-hidden bg-muted aspect-video flex items-center justify-center group cursor-pointer">
                      <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="h-8 w-8 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="features" className="mt-6">
                  <Card variant="glass" className="p-6">
                    <h3 className="font-semibold mb-4">Fitur Utama</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Check className="h-4 w-4 text-emerald-500" />
                          </div>
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="reviews" className="mt-6 space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} variant="glass" className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <span className="text-primary-foreground font-semibold">{review.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-semibold">{review.name}</span>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <p className="text-muted-foreground">{review.content}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card variant="premium" className="p-6 sticky top-24 animate-slide-up">
                <h3 className="font-semibold mb-4">Pilih Paket</h3>
                <div className="space-y-3 mb-6">
                  {plans.map((plan) => (
                    <button
                      key={plan.key}
                      onClick={() => setSelectedPlan(plan.key)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left relative ${
                        selectedPlan === plan.key ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      {plan.popular && <Badge variant="premium" className="absolute -top-2 right-4 text-xs">Populer</Badge>}
                      {plan.save && <Badge variant="success" className="absolute -top-2 right-4 text-xs">Hemat {plan.save}</Badge>}
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{plan.label}</span>
                        <div className="text-right">
                          <div className="font-bold text-lg">{formatPrice(plan.price)}</div>
                          <div className="text-xs text-muted-foreground line-through">{formatPrice(plan.originalPrice)}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-muted/50 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {formatPrice(getPrice(selectedPlan))}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="premium" 
                  className="w-full mb-3" 
                  size="lg"
                  onClick={() => {
                    const productId = id || "netflix-premium";
                    addToCart({
                      id: productId,
                      name: product.name,
                      logo: product.logo,
                      logoColor: product.logoColor,
                      category: product.category,
                      price: getPrice(selectedPlan),
                      plan: selectedPlan,
                      planLabel: selectedPlan === "weekly" ? "1 Minggu" : selectedPlan === "monthly" ? "1 Bulan" : "1 Tahun",
                    });
                    navigate("/checkout");
                  }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Beli Sekarang
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    const productId = id || "netflix-premium";
                    addToCart({
                      id: productId,
                      name: product.name,
                      logo: product.logo,
                      logoColor: product.logoColor,
                      category: product.category,
                      price: getPrice(selectedPlan),
                      plan: selectedPlan,
                      planLabel: selectedPlan === "weekly" ? "1 Minggu" : selectedPlan === "monthly" ? "1 Bulan" : "1 Tahun",
                    });
                  }}
                >
                  Tambah ke Keranjang
                </Button>
                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  {["Aktivasi instan", "Garansi 100%", "Support 24/7"].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <section className="mt-20">
            <h2 className="text-2xl font-bold mb-8">Produk Serupa</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((prod) => (
                <Link key={prod.id} to={`/produk/${prod.id}`}>
                  <Card variant="glass" className="p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${prod.color} flex items-center justify-center`}>
                        <span className="text-white font-bold text-xl">{prod.logo}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{prod.name}</h3>
                        <p className="text-primary font-bold">{formatPrice(prod.price)}/bulan</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
