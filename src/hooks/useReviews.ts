import { useState, useEffect } from 'react';
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

export function useReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
    subscribeToReviews();
  }, []);

  const fetchReviews = async () => {
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
  };

  const subscribeToReviews = () => {
    const channel = supabase
      .channel('reviews-changes')
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
  };

  const createReview = async (review: {
    product_id: string;
    product_name: string;
    rating: number;
    content: string;
  }) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          ...review,
          user_id: user.id,
          likes: 0
        });

      if (error) throw error;
      
      await fetchReviews();
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
      
      await fetchReviews();
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
      
      await fetchReviews();
      toast.success('Review berhasil dihapus');
      return { error: null };
    } catch (error: any) {
      toast.error('Gagal menghapus review');
      return { error };
    }
  };

  const likeReview = async (reviewId: string) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) return;

      const { error } = await supabase
        .from('reviews')
        .update({ likes: (review.likes || 0) + 1 })
        .eq('id', reviewId);

      if (error) throw error;
      await fetchReviews();
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  const getReviewsByRating = (rating: number) => {
    return reviews.filter(r => r.rating === rating);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return {
    reviews,
    loading,
    createReview,
    updateReview,
    deleteReview,
    likeReview,
    getReviewsByRating,
    getAverageRating,
    refetch: fetchReviews
  };
}
