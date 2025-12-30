import { supabase } from '@/integrations/supabase/client';

interface CreateNotificationParams {
  userId: string; // The user to receive the notification
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export async function createNotification({ userId, title, message, type }: CreateNotificationParams) {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        is_read: false
      });

    if (error) {
      console.error('Error creating notification:', error);
    }
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

export async function notifyReviewLike(
  reviewOwnerId: string,
  likerName: string,
  isLike: boolean,
  reviewType: 'product' | 'website'
) {
  const actionText = isLike ? 'menyukai' : 'tidak menyukai';
  const reviewTypeText = reviewType === 'website' ? 'ulasan website' : 'ulasan produk';
  
  await createNotification({
    userId: reviewOwnerId,
    title: isLike ? 'Ulasan Anda Disukai!' : 'Reaksi pada Ulasan Anda',
    message: `${likerName} ${actionText} ${reviewTypeText} Anda.`,
    type: isLike ? 'success' : 'info'
  });
}

export async function notifyReviewReply(
  reviewOwnerId: string,
  replierName: string,
  reviewType: 'product' | 'website'
) {
  const reviewTypeText = reviewType === 'website' ? 'ulasan website' : 'ulasan produk';
  
  await createNotification({
    userId: reviewOwnerId,
    title: 'Balasan Baru!',
    message: `${replierName} membalas ${reviewTypeText} Anda.`,
    type: 'info'
  });
}