-- Add unique constraint for review_likes upsert
ALTER TABLE public.review_likes DROP CONSTRAINT IF EXISTS review_likes_unique_user_review;
ALTER TABLE public.review_likes ADD CONSTRAINT review_likes_unique_user_review UNIQUE (review_id, user_id, is_website_review);