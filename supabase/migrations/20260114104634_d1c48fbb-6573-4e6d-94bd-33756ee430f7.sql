-- Add whatsapp_settings table for admin configuration
CREATE TABLE public.whatsapp_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp_number TEXT NOT NULL,
  api_key TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.whatsapp_settings ENABLE ROW LEVEL SECURITY;

-- Public read for active settings (needed for frontend to get the number)
CREATE POLICY "Anyone can read active whatsapp settings"
ON public.whatsapp_settings FOR SELECT
USING (is_active = true);

-- Admin can manage settings
CREATE POLICY "Admins can manage whatsapp settings"
ON public.whatsapp_settings FOR ALL
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_whatsapp_settings_updated_at
BEFORE UPDATE ON public.whatsapp_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.whatsapp_settings (whatsapp_number, is_active) VALUES ('9732743315', true);

-- Make email optional in admission_inquiries table
ALTER TABLE public.admission_inquiries ALTER COLUMN email DROP NOT NULL;