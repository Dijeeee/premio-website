-- Create website_reviews table for Premio website reviews
CREATE TABLE public.website_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_name TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.website_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view website reviews
CREATE POLICY "Anyone can view website reviews"
ON public.website_reviews
FOR SELECT
USING (true);

-- Users can create their own website reviews
CREATE POLICY "Users can create their own website reviews"
ON public.website_reviews
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own website reviews
CREATE POLICY "Users can update their own website reviews"
ON public.website_reviews
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own website reviews
CREATE POLICY "Users can delete their own website reviews"
ON public.website_reviews
FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.website_reviews;