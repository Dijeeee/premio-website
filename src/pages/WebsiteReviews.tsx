import { useState } from "react";
import { Star, ThumbsUp, MessageCircle, Plus, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useWebsiteReviews } from "@/hooks/useWebsiteReviews";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import premioLogo from "@/assets/premio-logo.png";

const avatarColors = [
  "from-pink-500 to-rose-500",
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-violet-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-red-500 to-pink-500",
  "from-indigo-500 to-purple-500",
  "from-cyan-500 to-blue-500",
];

export default function WebsiteReviews() {
  const { user } = useAuth();
  const { 
    reviews, 
    loading, 
    createReview, 
    likeReview, 
    getAverageRating,
    getRatingDistribution,
    getSatisfactionPercentage
  } = useWebsiteReviews();
  const [filter, setFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReview, setNewReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    if (!newReview.trim()) {
      toast.error("Mohon isi ulasan Anda");
      return;
    }

    setIsSubmitting(true);
    
    await createReview({
      rating: newRating,
      content: newReview
    });

    setIsDialogOpen(false);
    setNewReview("");
    setNewRating(5);
    setIsSubmitting(false);
  };

  const filteredReviews = reviews.filter((r) => filter === "all" || r.rating.toString() === filter);
  const avgRating = getAverageRating();
  const ratingDistribution = getRatingDistribution;
  const satisfactionPercentage = getSatisfactionPercentage;

  const getAvatarColor = (index: number) => avatarColors[index % avatarColors.length];
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  const stats = [
    { value: avgRating || "0.0", label: "Rating" },
    { value: `${reviews.length}`, label: "Reviews" },
    { value: `${satisfactionPercentage}%`, label: "Puas" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16 md:pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="py-4 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={premioLogo} alt="Premio" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">
                  Ulasan <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Website Premio</span>
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">Apa kata mereka tentang Website Premio</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="premium" className="gap-2 w-full md:w-auto">
                  <Plus className="h-4 w-4" />
                  Tambah Ulasan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle>Ulasan Website Premio</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setNewRating(star)} className="p-1 transition-transform hover:scale-110">
                          <Star className={`h-6 w-6 ${star <= newRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ulasan</label>
                    <Textarea placeholder="Bagikan pengalaman Anda menggunakan Website Premio..." value={newReview} onChange={(e) => setNewReview(e.target.value)} rows={4} />
                  </div>
                  <Button 
                    variant="premium" 
                    className="w-full" 
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Kirim Ulasan
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <Card variant="glass" className="p-4 md:p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center gap-2">
                  <span className="text-xs w-8 flex items-center gap-0.5">
                    {item.rating} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {["all", "5", "4", "3", "2", "1"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "premium" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className="whitespace-nowrap flex-shrink-0"
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {filteredReviews.map((review, index) => (
                <Card
                  key={review.id}
                  variant="glass"
                  className="p-3 md:p-4 lg:p-5 animate-slide-up hover:shadow-glow transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br ${getAvatarColor(index)} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-semibold text-xs md:text-sm">
                        {review.user_name ? getInitials(review.user_name) : "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm md:text-base">{review.user_name || "Pengguna"}</span>
                        <Badge variant="success" className="text-[10px]">Verified</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
                        <span>Website Premio</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: id })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 md:h-4 md:w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                      />
                    ))}
                  </div>

                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-3">{review.content}</p>

                  <div className="flex items-center gap-4 pt-2 border-t border-border">
                    <button 
                      className="flex items-center gap-1.5 text-[10px] md:text-xs text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => likeReview(review.id)}
                    >
                      <ThumbsUp className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      <span>{review.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-[10px] md:text-xs text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      <span>Balas</span>
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">Tidak ada ulasan dengan rating ini</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
