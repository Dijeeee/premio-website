import { useState } from "react";
import { Star, ThumbsUp, MessageCircle, Filter, User } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const reviews = [
  { id: 1, name: "Sarah Wijaya", avatar: "SW", color: "from-pink-500 to-rose-500", rating: 5, product: "Netflix Premium", date: "2 hari lalu", content: "Proses aktivasi sangat cepat! Dalam 5 menit akun sudah aktif. Kualitas streaming 4K tanpa buffering. Recommended banget!", likes: 42, verified: true },
  { id: 2, name: "Andi Pratama", avatar: "AP", color: "from-blue-500 to-cyan-500", rating: 5, product: "Adobe Creative Cloud", date: "3 hari lalu", content: "Sudah 2 tahun berlangganan Adobe CC melalui Premio. Harganya jauh lebih hemat dibanding langganan langsung. Customer service sangat responsif.", likes: 38, verified: true },
  { id: 3, name: "Dina Kusuma", avatar: "DK", color: "from-purple-500 to-violet-500", rating: 5, product: "Canva Pro", date: "5 hari lalu", content: "Canva Pro dengan harga terbaik! Tidak perlu ribet dengan pembayaran internasional. Semua bisa dibeli dengan mudah.", likes: 35, verified: true },
  { id: 4, name: "Reza Mahendra", avatar: "RM", color: "from-emerald-500 to-teal-500", rating: 5, product: "ChatGPT Plus", date: "1 minggu lalu", content: "ChatGPT Plus dengan harga kompetitif. Yang paling saya suka adalah garansi seumur hidup untuk setiap pembelian. Highly recommended!", likes: 56, verified: true },
  { id: 5, name: "Maya Santoso", avatar: "MS", color: "from-amber-500 to-orange-500", rating: 4, product: "Grammarly Premium", date: "1 minggu lalu", content: "Grammarly Premium membantu tulisan saya jadi lebih profesional. Terima kasih Premio untuk harga yang sangat bersahabat!", likes: 28, verified: true },
  { id: 6, name: "Budi Setiawan", avatar: "BS", color: "from-red-500 to-pink-500", rating: 5, product: "Spotify Premium", date: "2 minggu lalu", content: "Langganan Spotify Premium paling murah yang pernah saya temukan. Aktivasi cepat dan tidak ada masalah selama pemakaian.", likes: 44, verified: true },
  { id: 7, name: "Lina Hartono", avatar: "LH", color: "from-indigo-500 to-purple-500", rating: 5, product: "Figma Pro", date: "2 minggu lalu", content: "Figma Pro dengan harga student-friendly! Sangat membantu untuk project design kampus. Support tim Premio sangat helpful.", likes: 31, verified: true },
  { id: 8, name: "Kevin Tanaka", avatar: "KT", color: "from-cyan-500 to-blue-500", rating: 5, product: "Midjourney", date: "3 minggu lalu", content: "Midjourney subscription yang affordable! Hasil generate image sangat bagus untuk content creation. Proses pembelian mudah.", likes: 49, verified: true },
];

const stats = [
  { value: "4.9", label: "Rating" },
  { value: "50K+", label: "Reviews" },
  { value: "99%", label: "Puas" },
];

export default function Reviews() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="py-6 md:py-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Ulasan <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Pelanggan</span>
            </h1>
            <p className="text-muted-foreground">Apa kata mereka tentang Premio</p>
          </div>

          {/* Stats */}
          <Card variant="glass" className="p-4 md:p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {["all", "5", "4", "3"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "premium" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className="whitespace-nowrap"
              >
                {f === "all" ? "Semua" : (
                  <span className="flex items-center gap-1">
                    {f} <Star className="h-3 w-3 fill-current" />
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews
              .filter((r) => filter === "all" || r.rating.toString() === filter)
              .map((review, index) => (
                <Card
                  key={review.id}
                  variant="glass"
                  className="p-4 md:p-5 animate-slide-up hover:shadow-glow transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-semibold text-sm">{review.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm md:text-base">{review.name}</span>
                        {review.verified && <Badge variant="success" className="text-xs">Verified</Badge>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{review.product}</span>
                        <span>•</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{review.content}</p>

                  <div className="flex items-center gap-4 pt-2 border-t border-border">
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{review.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>Balas</span>
                    </button>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
