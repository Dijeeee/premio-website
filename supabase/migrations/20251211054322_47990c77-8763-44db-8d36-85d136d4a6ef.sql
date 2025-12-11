-- Create table to track user likes on reviews (both product and website reviews)
CREATE TABLE public.review_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id uuid NOT NULL,
  user_id uuid NOT NULL,
  is_website_review boolean NOT NULL DEFAULT false,
  is_like boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(review_id, user_id, is_website_review)
);

-- Enable RLS
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view review likes"
ON public.review_likes
FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own likes"
ON public.review_likes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own likes"
ON public.review_likes
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
ON public.review_likes
FOR DELETE
USING (auth.uid() = user_id);

-- Add dislikes column to reviews and website_reviews
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS dislikes integer DEFAULT 0;
ALTER TABLE public.website_reviews ADD COLUMN IF NOT EXISTS dislikes integer DEFAULT 0;

-- Enable realtime for review_likes
ALTER PUBLICATION supabase_realtime ADD TABLE public.review_likes;