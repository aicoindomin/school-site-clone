-- Create telegram_settings table for storing Telegram bot configuration
CREATE TABLE public.telegram_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_token TEXT NOT NULL,
  chat_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.telegram_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access (needed for admission form)
CREATE POLICY "Anyone can read telegram settings" 
ON public.telegram_settings 
FOR SELECT 
USING (true);

-- Only admins can modify
CREATE POLICY "Admins can manage telegram settings" 
ON public.telegram_settings 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Drop the whatsapp_settings table since we're replacing it with Telegram
DROP TABLE IF EXISTS public.whatsapp_settings;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_telegram_settings_updated_at
BEFORE UPDATE ON public.telegram_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();