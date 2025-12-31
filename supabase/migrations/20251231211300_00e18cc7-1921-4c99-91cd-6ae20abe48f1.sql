-- Useful Links table
CREATE TABLE public.useful_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.useful_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Useful links viewable by everyone" ON public.useful_links
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage useful links" ON public.useful_links
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Quick Links table
CREATE TABLE public.quick_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quick links viewable by everyone" ON public.quick_links
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage quick links" ON public.quick_links
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Top Achievers table
CREATE TABLE public.top_achievers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  class_label TEXT NOT NULL,
  position TEXT NOT NULL DEFAULT '1st',
  image_url TEXT,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.top_achievers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Top achievers viewable by everyone" ON public.top_achievers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage top achievers" ON public.top_achievers
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Class Routine table
CREATE TABLE public.class_routine (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_name TEXT NOT NULL,
  day_of_week TEXT NOT NULL,
  period_number INTEGER NOT NULL,
  subject TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  teacher_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.class_routine ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Class routine viewable by everyone" ON public.class_routine
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage class routine" ON public.class_routine
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Holidays table
CREATE TABLE public.holidays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  holiday_date DATE NOT NULL,
  description TEXT,
  holiday_type TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Holidays viewable by everyone" ON public.holidays
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage holidays" ON public.holidays
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Website Content table (for About, Contact, Academics, etc.)
CREATE TABLE public.website_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Website content viewable by everyone" ON public.website_content
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage website content" ON public.website_content
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Faculty/Students table (extends staff concept)
CREATE TABLE public.faculty (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  department TEXT,
  qualification TEXT,
  image_url TEXT,
  email TEXT,
  phone TEXT,
  bio TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty viewable by everyone" ON public.faculty
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage faculty" ON public.faculty
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  section TEXT,
  roll_number TEXT,
  image_url TEXT,
  parent_name TEXT,
  admission_year INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students viewable by everyone" ON public.students
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage students" ON public.students
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_useful_links_updated_at BEFORE UPDATE ON public.useful_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quick_links_updated_at BEFORE UPDATE ON public.quick_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_top_achievers_updated_at BEFORE UPDATE ON public.top_achievers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_class_routine_updated_at BEFORE UPDATE ON public.class_routine
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_holidays_updated_at BEFORE UPDATE ON public.holidays
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_website_content_updated_at BEFORE UPDATE ON public.website_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON public.faculty
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default website content sections
INSERT INTO public.website_content (section_key, title, content) VALUES
  ('about', 'About Us', 'Balisai Public School content here...'),
  ('contact', 'Contact Us', 'Contact information content...'),
  ('academics', 'Academics', 'Academic programs content...'),
  ('admission', 'Admission', 'Admission information content...'),
  ('careers', 'Careers', 'Career opportunities content...');