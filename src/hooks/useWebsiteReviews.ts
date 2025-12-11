import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface WebsiteReview {
  id: string;
  user_id: string;
  user_name: string | null;
  rating: number;
  content: string;
  likes: number | null;
  created_at: string;
  updated_at: string;
}

export interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

export function useWebsiteReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<WebsiteReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('website_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching website reviews:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
    
    const channel = supabase
      .channel('website-reviews-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'website_reviews'
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
    rating: number;
    content: string;
  }) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      return { error: new Error('Not authenticated') };
    }

    try {
      // Get user profile for name
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      const { error } = await supabase
        .from('website_reviews')
        .insert({
          ...review,
          user_id: user.id,
          user_name: profile?.full_name || user.email?.split('@')[0] || 'Pengguna',
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

  const deleteReview = async (reviewId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('website_reviews')
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

  const likeReview = async (reviewId: string) => {
    setReviews(prev => prev.map(r => 
      r.id === reviewId ? { ...r, likes: (r.likes || 0) + 1 } : r
    ));
  };

  const getAverageRating = useCallback(() => {
    if (reviews.length === 0) return "0.0";
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

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

  const getSatisfactionPercentage = useMemo(() => {
    if (reviews.length === 0) return 0;
    const satisfied = reviews.filter(r => r.rating >= 4).length;
    return Math.round((satisfied / reviews.length) * 100);
  }, [reviews]);

  return {
    reviews,
    loading,
    createReview,
    deleteReview,
    likeReview,
    getAverageRating,
    getRatingDistribution,
    getSatisfactionPercentage,
    refetch: fetchReviews
  };
}
