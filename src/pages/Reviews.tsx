import { useState, useEffect } from "react";
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Plus, Loader2, Send, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { products } from "@/data/products";
import { useReviews } from "@/hooks/useReviews";
import { useWebsiteReviews } from "@/hooks/useWebsiteReviews";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

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

interface Reply {
  id: string;
  review_id: string;
  user_id: string;
  user_name: string | null;
  content: string;
  created_at: string;
}

export default function Reviews() {
  const { user } = useAuth();
  const {
    reviews, 
    loading: productLoading, 
    createReview, 
    getAverageRating,
    getRatingDistribution,
    getSatisfactionPercentage,
    refetch: refetchProductReviews
  } = useReviews();
  const {
    reviews: websiteReviews,
    loading: websiteLoading,
    createReview: createWebsiteReview,
    getAverageRating: getWebsiteAvgRating,
    getRatingDistribution: getWebsiteRatingDistribution,
    getSatisfactionPercentage: getWebsiteSatisfaction,
    refetch: refetchWebsiteReviews
  } = useWebsiteReviews();

  const [activeTab, setActiveTab] = useState("website");
  const [filter, setFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReview, setNewReview] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userHasReview, setUserHasReview] = useState({ product: false, website: false });
  const [userLikes, setUserLikes] = useState<Record<string, { isLike: boolean | null }>>({});
  
  // Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replies, setReplies] = useState<Record<string, Reply[]>>({});
  const [websiteReplies, setWebsiteReplies] = useState<Record<string, Reply[]>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});

  // Check if user already has a review
  useEffect(() => {
    const checkUserReviews = async () => {
      if (!user) return;
      
      // Check product reviews
      const { data: productReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      // Check website reviews
      const { data: websiteReview } = await supabase
        .from('website_reviews')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      setUserHasReview({
        product: (productReview?.length || 0) > 0,
        website: (websiteReview?.length || 0) > 0
      });
    };
    
    checkUserReviews();
  }, [user, reviews, websiteReviews]);

  // Fetch user likes
  useEffect(() => {
    const fetchUserLikes = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('review_likes')
        .select('review_id, is_like, is_website_review')
        .eq('user_id', user.id);
      
      if (data) {
        const likesMap: Record<string, { isLike: boolean | null }> = {};
        data.forEach(item => {
          likesMap[item.review_id] = { isLike: item.is_like };
        });
        setUserLikes(likesMap);
      }
    };
    
    fetchUserLikes();
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel('review_likes_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'review_likes'
      }, () => {
        fetchUserLikes();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchReplies = async (reviewId: string, isWebsite: boolean) => {
    const tableName = isWebsite ? 'website_review_replies' : 'review_replies';
    setLoadingReplies(prev => ({ ...prev, [reviewId]: true }));
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('review_id', reviewId)
      .order('created_at', { ascending: true });
    
    if (!error && data) {
      if (isWebsite) {
        setWebsiteReplies(prev => ({ ...prev, [reviewId]: data as Reply[] }));
      } else {
        setReplies(prev => ({ ...prev, [reviewId]: data as Reply[] }));
      }
    }
    setLoadingReplies(prev => ({ ...prev, [reviewId]: false }));
  };

  const handleReply = async (reviewId: string, isWebsite: boolean) => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }
    if (!replyContent.trim()) {
      toast.error("Mohon isi balasan Anda");
      return;
    }

    // Get user name from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', user.id)
      .single();

    const tableName = isWebsite ? 'website_review_replies' : 'review_replies';
    
    const { error } = await supabase.from(tableName).insert({
      review_id: reviewId,
      user_id: user.id,
      user_name: profile?.full_name || 'Pengguna',
      content: replyContent
    });

    if (error) {
      toast.error("Gagal mengirim balasan");
      return;
    }

    toast.success("Balasan berhasil dikirim");
    setReplyContent("");
    setReplyingTo(null);
    fetchReplies(reviewId, isWebsite);
  };

  const handleSubmitProductReview = async () => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    if (userHasReview.product) {
      toast.error("Anda sudah memberikan ulasan produk. Setiap akun hanya bisa memberikan 1 ulasan.");
      setIsDialogOpen(false);
      return;
    }

    if (!newReview.trim() || !selectedProduct) {
      toast.error("Mohon lengkapi semua field");
      return;
    }

    setIsSubmitting(true);
    const product = products.find(p => p.name === selectedProduct);
    
    await createReview({
      product_id: product?.id || selectedProduct,
      product_name: selectedProduct,
      rating: newRating,
      content: newReview
    });

    setUserHasReview(prev => ({ ...prev, product: true }));
    setIsDialogOpen(false);
    setNewReview("");
    setSelectedProduct("");
    setNewRating(5);
    setIsSubmitting(false);
  };

  const handleSubmitWebsiteReview = async () => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    if (userHasReview.website) {
      toast.error("Anda sudah memberikan ulasan website. Setiap akun hanya bisa memberikan 1 ulasan.");
      setIsDialogOpen(false);
      return;
    }

    if (!newReview.trim()) {
      toast.error("Mohon isi ulasan Anda");
      return;
    }

    setIsSubmitting(true);
    
    await createWebsiteReview({
      rating: newRating,
      content: newReview
    });

    setUserHasReview(prev => ({ ...prev, website: true }));
    setIsDialogOpen(false);
    setNewReview("");
    setNewRating(5);
    setIsSubmitting(false);
  };

  const handleLikeDislike = async (reviewId: string, isWebsite: boolean, isLike: boolean) => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    const currentLike = userLikes[reviewId];
    const tableName = isWebsite ? 'website_reviews' : 'reviews';
    const currentReview = (isWebsite ? websiteReviews : reviews).find(r => r.id === reviewId);
    
    if (!currentReview) return;

    // Optimistic update
    const originalLikes = userLikes[reviewId];
    
    try {
      if (currentLike?.isLike === isLike) {
        // Remove like/dislike - optimistic update
        setUserLikes(prev => {
          const newLikes = { ...prev };
          delete newLikes[reviewId];
          return newLikes;
        });

        const { error: deleteError } = await supabase.from('review_likes').delete()
          .eq('review_id', reviewId)
          .eq('user_id', user.id);
        
        if (deleteError) throw deleteError;
        
        // Update count
        const updateData = isLike 
          ? { likes: Math.max(0, (currentReview.likes || 1) - 1) }
          : { dislikes: Math.max(0, (currentReview.dislikes || 1) - 1) };
        
        const { error: updateError } = await supabase.from(tableName).update(updateData).eq('id', reviewId);
        if (updateError) throw updateError;
      } else {
        // Optimistic update
        setUserLikes(prev => ({ ...prev, [reviewId]: { isLike } }));

        // First delete existing like/dislike if any
        await supabase.from('review_likes').delete()
          .eq('review_id', reviewId)
          .eq('user_id', user.id);

        // Then insert new like/dislike
        const { error: insertError } = await supabase.from('review_likes').insert({
          review_id: reviewId,
          user_id: user.id,
          is_website_review: isWebsite,
          is_like: isLike
        });
        
        if (insertError) throw insertError;
        
        let updateData: { likes?: number; dislikes?: number } = {};
        
        // Update counts based on previous state
        if (currentLike?.isLike === true && !isLike) {
          // Was like, now dislike
          updateData = { 
            likes: Math.max(0, (currentReview.likes || 1) - 1),
            dislikes: (currentReview.dislikes || 0) + 1 
          };
        } else if (currentLike?.isLike === false && isLike) {
          // Was dislike, now like
          updateData = { 
            likes: (currentReview.likes || 0) + 1,
            dislikes: Math.max(0, (currentReview.dislikes || 1) - 1)
          };
        } else if (isLike) {
          // New like
          updateData = { likes: (currentReview.likes || 0) + 1 };
        } else {
          // New dislike
          updateData = { dislikes: (currentReview.dislikes || 0) + 1 };
        }
        
        const { error: updateError } = await supabase.from(tableName).update(updateData).eq('id', reviewId);
        if (updateError) throw updateError;
      }

      // Refetch reviews to ensure sync
      if (isWebsite) {
        refetchWebsiteReviews();
      } else {
        refetchProductReviews();
      }
    } catch (error) {
      console.error('Like/dislike error:', error);
      // Revert optimistic update on error
      if (originalLikes) {
        setUserLikes(prev => ({ ...prev, [reviewId]: originalLikes }));
      } else {
        setUserLikes(prev => {
          const newLikes = { ...prev };
          delete newLikes[reviewId];
          return newLikes;
        });
      }
      toast.error("Gagal memproses");
    }
  };

  const filteredProductReviews = reviews.filter((r) => filter === "all" || r.rating.toString() === filter);
  const filteredWebsiteReviews = websiteReviews.filter((r) => filter === "all" || r.rating.toString() === filter);

  const getAvatarColor = (index: number) => avatarColors[index % avatarColors.length];
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  const renderStats = (avgRating: string, reviewCount: number, satisfaction: number, distribution: { rating: number; count: number; percentage: number }[]) => (
    <Card variant="glass" className="p-4 md:p-6 mb-6">
      <div className="grid grid-cols-3 gap-4 text-center mb-6">
        <div>
          <div className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{avgRating || "0.0"}</div>
          <div className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">Rating</div>
        </div>
        <div>
          <div className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{reviewCount}</div>
          <div className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">Reviews</div>
        </div>
        <div>
          <div className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{satisfaction}%</div>
          <div className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">Puas</div>
        </div>
      </div>
      
      <div className="space-y-2">
        {distribution.map((item) => (
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
  );

  const renderReviewCard = (review: any, index: number, isWebsite: boolean) => {
    const reviewReplies = isWebsite ? websiteReplies[review.id] : replies[review.id];
    const isLoadingReplies = loadingReplies[review.id];
    const isReplying = replyingTo === review.id;
    const currentUserLike = userLikes[review.id];

    return (
      <Card
        key={review.id}
        variant="glass"
        className="p-3 md:p-4 lg:p-5 animate-slide-up hover:shadow-glow transition-all duration-300"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-start gap-3 mb-3">
          {review.avatar_url ? (
            <img 
              src={review.avatar_url} 
              alt={review.user_name || "User"} 
              className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className={`w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br ${getAvatarColor(index)} flex items-center justify-center flex-shrink-0`}>
              <span className="text-white font-semibold text-xs md:text-sm">
                {review.user_name ? getInitials(review.user_name) : "U"}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm md:text-base">{review.user_name || "Pengguna"}</span>
              <Badge variant="success" className="text-[10px]">Verified</Badge>
            </div>
            <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
              {!isWebsite && <><span>{review.product_name}</span><span>•</span></>}
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
            className={`flex items-center gap-1.5 text-[10px] md:text-xs transition-colors ${currentUserLike?.isLike === true ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            onClick={() => handleLikeDislike(review.id, isWebsite, true)}
          >
            <ThumbsUp className={`h-3.5 w-3.5 md:h-4 md:w-4 ${currentUserLike?.isLike === true ? 'fill-primary' : ''}`} />
            <span>{review.likes || 0}</span>
          </button>
          <button 
            className={`flex items-center gap-1.5 text-[10px] md:text-xs transition-colors ${currentUserLike?.isLike === false ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}
            onClick={() => handleLikeDislike(review.id, isWebsite, false)}
          >
            <ThumbsDown className={`h-3.5 w-3.5 md:h-4 md:w-4 ${currentUserLike?.isLike === false ? 'fill-destructive' : ''}`} />
            <span>{review.dislikes || 0}</span>
          </button>
          <button 
            className="flex items-center gap-1.5 text-[10px] md:text-xs text-muted-foreground hover:text-primary transition-colors"
            onClick={() => {
              if (replyingTo === review.id) {
                setReplyingTo(null);
              } else {
                setReplyingTo(review.id);
                if (!reviewReplies) {
                  fetchReplies(review.id, isWebsite);
                }
              }
            }}
          >
            <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span>Balas</span>
          </button>
        </div>

        {/* Replies Section */}
        {(isReplying || reviewReplies) && (
          <div className="mt-3 pt-3 border-t border-border space-y-3">
            {isLoadingReplies ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Show existing replies */}
                {reviewReplies && reviewReplies.map((reply, replyIndex) => (
                  <div key={reply.id} className="flex items-start gap-2 pl-4 border-l-2 border-primary/20">
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getAvatarColor(replyIndex + 10)} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-semibold text-[10px]">
                        {reply.user_name ? getInitials(reply.user_name) : "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs">{reply.user_name || "Pengguna"}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true, locale: id })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{reply.content}</p>
                    </div>
                  </div>
                ))}

                {/* Reply input */}
                {isReplying && (
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Tulis balasan..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="flex-1 h-9 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleReply(review.id, isWebsite);
                        }
                      }}
                    />
                    <Button 
                      size="sm" 
                      variant="premium" 
                      className="h-9 px-3"
                      onClick={() => handleReply(review.id, isWebsite)}
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-9 px-2"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent("");
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16 md:pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="py-4 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                Ulasan <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Premio</span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">Apa kata mereka tentang Premio</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="premium" className="gap-2 w-full md:w-auto">
                  <Plus className="h-4 w-4" />
                  Tambah Rating
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle>
                    {activeTab === "website" ? "Ulasan Website Premio" : "Ulasan Produk"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  {activeTab === "produk" && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Pilih Produk</label>
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih aplikasi yang dibeli" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.name}>
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded bg-gradient-to-br ${product.logoColor} flex items-center justify-center`}>
                                  <span className="text-white text-[10px] font-bold">{product.logo}</span>
                                </div>
                                <span>{product.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
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
                    <Textarea 
                      placeholder={activeTab === "website" ? "Bagikan pengalaman Anda dengan Website Premio..." : "Bagikan pengalaman Anda..."} 
                      value={newReview} 
                      onChange={(e) => setNewReview(e.target.value)} 
                      rows={4} 
                    />
                  </div>
                  <Button 
                    variant="premium" 
                    className="w-full" 
                    onClick={activeTab === "website" ? handleSubmitWebsiteReview : handleSubmitProductReview}
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

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="website">Website Premio</TabsTrigger>
              <TabsTrigger value="produk">Ulasan Produk</TabsTrigger>
            </TabsList>

            {/* Website Reviews Tab */}
            <TabsContent value="website">
              {renderStats(
                getWebsiteAvgRating(),
                websiteReviews.length,
                getWebsiteSatisfaction,
                getWebsiteRatingDistribution
              )}

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

              {websiteLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {filteredWebsiteReviews.map((review, index) => 
                    renderReviewCard(review, index, true)
                  )}
                </div>
              )}

              {!websiteLoading && filteredWebsiteReviews.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-sm">Tidak ada ulasan dengan rating ini</p>
                </div>
              )}
            </TabsContent>

            {/* Product Reviews Tab */}
            <TabsContent value="produk">
              {renderStats(
                getAverageRating(),
                reviews.length,
                getSatisfactionPercentage,
                getRatingDistribution
              )}

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

              {productLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {filteredProductReviews.map((review, index) => 
                    renderReviewCard(review, index, false)
                  )}
                </div>
              )}

              {!productLoading && filteredProductReviews.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-sm">Tidak ada ulasan dengan rating ini</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
