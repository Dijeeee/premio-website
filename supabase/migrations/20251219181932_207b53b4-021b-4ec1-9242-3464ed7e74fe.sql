-- Allow anyone to read profiles (for avatar display in reviews)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Anyone can view profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Add unique constraint on review_likes for proper upsert
ALTER TABLE public.review_likes DROP CONSTRAINT IF EXISTS review_likes_unique;
ALTER TABLE public.review_likes ADD CONSTRAINT review_likes_unique UNIQUE (review_id, user_id, is_website_review);