-- Remove the public access policy for telegram_settings
-- Only admins should be able to read and manage this table
DROP POLICY IF EXISTS "Anyone can read telegram settings" ON public.telegram_settings;

-- Ensure only admins can read telegram settings
CREATE POLICY "Only admins can read telegram settings"
ON public.telegram_settings
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Ensure only admins can manage telegram settings (if not already exists)
DROP POLICY IF EXISTS "Admin users can manage telegram settings" ON public.telegram_settings;

CREATE POLICY "Admin users can manage telegram settings"
ON public.telegram_settings
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));