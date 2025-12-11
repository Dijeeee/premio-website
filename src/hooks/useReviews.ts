import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  rating: number;
  content: string;
  likes: number;
  created_at: string;
  updated_at: string;
  user_name?: string;
}

export interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

export function useReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('reviews-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews'
        },
        () => {
          fetchReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchReviews]);

  const createReview = async (review: {
    product_id: string;
    product_name: string;
    rating: number;
    content: string;
  }) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      return { error: new Error('Not authenticated') };
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          ...review,
          user_id: user.id,
          likes: 0
        });

      if (error) throw error;
      
      toast.success('Review berhasil ditambahkan!');
      return { error: null };
    } catch (error: any) {
      toast.error('Gagal menambahkan review');
      return { error };
    }
  };

  const updateReview = async (reviewId: string, updates: Partial<Review>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', reviewId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast.success('Review berhasil diperbarui');
      return { error: null };
    } catch (error: any) {
      toast.error('Gagal memperbarui review');
      return { error };
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast.success('Review berhasil dihapus');
      return { error: null };
    } catch (error: any) {
      toast.error('Gagal menghapus review');
      return { error };
    }
  };

  // Like review - optimistic update (actual persistence would need an RPC function)
  const likeReview = async (reviewId: string) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) return;

      // Optimistic update for instant feedback
      setReviews(prev => prev.map(r => 
        r.id === reviewId ? { ...r, likes: (r.likes || 0) + 1 } : r
      ));

      // Note: Full like persistence would require a database function
      // For now, likes persist until page refresh
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  const getReviewsByRating = (rating: number) => {
    return reviews.filter(r => r.rating === rating);
  };

  const getAverageRating = useCallback(() => {
    if (reviews.length === 0) return "0.0";
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  // Calculate rating distribution with percentages
  const getRatingDistribution = useMemo((): RatingDistribution[] => {
    const total = reviews.length;
    if (total === 0) {
      return [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: 0,
        percentage: 0
      }));
    }

    return [5, 4, 3, 2, 1].map(rating => {
      const count = reviews.filter(r => r.rating === rating).length;
      const percentage = Math.round((count / total) * 100);
      return { rating, count, percentage };
    });
  }, [reviews]);

  // Calculate satisfaction percentage (4-5 stars)
  const getSatisfactionPercentage = useMemo(() => {
    if (reviews.length === 0) return 0;
    const satisfied = reviews.filter(r => r.rating >= 4).length;
    return Math.round((satisfied / reviews.length) * 100);
  }, [reviews]);

  return {
    reviews,
    loading,
    createReview,
    updateReview,
    deleteReview,
    likeReview,
    getReviewsByRating,
    getAverageRating,
    getRatingDistribution,
    getSatisfactionPercentage,
    refetch: fetchReviews
  };
}
