import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Transaction {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_logo: string;
  product_logo_color: string;
  plan: string;
  plan_label: string;
  price: number;
  status: 'active' | 'expired' | 'cancelled';
  created_at: string;
  expires_at: string;
}

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    } else {
      setTransactions([]);
      setLoading(false);
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData = (data || []).map(t => ({
        ...t,
        status: t.status as 'active' | 'expired' | 'cancelled'
      }));
      
      setTransactions(typedData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          user_id: user.id
        });

      if (error) throw error;
      
      await fetchTransactions();
      toast.success('Transaksi berhasil!');
      return { error: null };
    } catch (error: any) {
      toast.error('Gagal membuat transaksi');
      return { error };
    }
  };

  const getActiveSubscriptions = () => {
    return transactions.filter(t => t.status === 'active' && new Date(t.expires_at) > new Date());
  };

  const getExpiredSubscriptions = () => {
    return transactions.filter(t => t.status === 'expired' || new Date(t.expires_at) <= new Date());
  };

  return {
    transactions,
    loading,
    createTransaction,
    getActiveSubscriptions,
    getExpiredSubscriptions,
    refetch: fetchTransactions
  };
}
