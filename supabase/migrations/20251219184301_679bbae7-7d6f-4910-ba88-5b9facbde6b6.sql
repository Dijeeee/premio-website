-- Create function to update review likes count (bypasses RLS with SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.update_review_likes(
  p_review_id uuid,
  p_likes integer,
  p_dislikes integer,
  p_is_website_review boolean DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_is_website_review THEN
    UPDATE website_reviews 
    SET likes = p_likes, dislikes = p_dislikes 
    WHERE id = p_review_id;
  ELSE
    UPDATE reviews 
    SET likes = p_likes, dislikes = p_dislikes 
    WHERE id = p_review_id;
  END IF;
END;
$$;