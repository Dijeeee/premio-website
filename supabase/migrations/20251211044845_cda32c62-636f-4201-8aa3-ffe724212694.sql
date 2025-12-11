-- Create review_replies table for reply functionality
CREATE TABLE public.review_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.review_replies ENABLE ROW LEVEL SECURITY;

-- Anyone can view replies
CREATE POLICY "Anyone can view review replies"
ON public.review_replies
FOR SELECT
USING (true);

-- Users can create their own replies
CREATE POLICY "Users can create their own replies"
ON public.review_replies
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own replies
CREATE POLICY "Users can delete their own replies"
ON public.review_replies
FOR DELETE
USING (auth.uid() = user_id);

-- Create website_review_replies table
CREATE TABLE public.website_review_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES public.website_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.website_review_replies ENABLE ROW LEVEL SECURITY;

-- Anyone can view replies
CREATE POLICY "Anyone can view website review replies"
ON public.website_review_replies
FOR SELECT
USING (true);

-- Users can create their own replies
CREATE POLICY "Users can create their own website replies"
ON public.website_review_replies
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own replies
CREATE POLICY "Users can delete their own website replies"
ON public.website_review_replies
FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.review_replies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.website_review_replies;