-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger for new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create key_functionaries table (school leadership)
CREATE TABLE public.key_functionaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.key_functionaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Functionaries are viewable by everyone" ON public.key_functionaries
FOR SELECT USING (true);

CREATE POLICY "Admins can manage functionaries" ON public.key_functionaries
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create results table (toppers)
CREATE TABLE public.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    exam_type TEXT NOT NULL, -- ICSE, ISC, etc.
    year INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    rank INTEGER,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Results are viewable by everyone" ON public.results
FOR SELECT USING (true);

CREATE POLICY "Admins can manage results" ON public.results
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create gallery table
CREATE TABLE public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- events, sports, academics, activities
    image_url TEXT NOT NULL,
    description TEXT,
    event_date DATE,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery is viewable by everyone" ON public.gallery
FOR SELECT USING (true);

CREATE POLICY "Admins can manage gallery" ON public.gallery
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create pages table (for dynamic content)
CREATE TABLE public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT,
    meta_description TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published pages are viewable by everyone" ON public.pages
FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all pages" ON public.pages
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create admission_inquiries table
CREATE TABLE public.admission_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    grade_applying TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending', -- pending, contacted, enrolled, rejected
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admission_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit inquiries" ON public.admission_inquiries
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view and manage inquiries" ON public.admission_inquiries
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create career_openings table
CREATE TABLE public.career_openings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.career_openings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active openings are viewable by everyone" ON public.career_openings
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage openings" ON public.career_openings
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create job_applications table
CREATE TABLE public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opening_id UUID REFERENCES public.career_openings(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    resume_url TEXT,
    cover_letter TEXT,
    status TEXT DEFAULT 'received', -- received, reviewing, interviewed, hired, rejected
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit applications" ON public.job_applications
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view and manage applications" ON public.job_applications
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create contact_messages table
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view and manage messages" ON public.contact_messages
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create school_settings table
CREATE TABLE public.school_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are viewable by everyone" ON public.school_settings
FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.school_settings
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert default school settings
INSERT INTO public.school_settings (key, value) VALUES
('school_name', 'Calcutta Public School'),
('tagline', 'Shaping Bright Futures'),
('address', '123 Education Lane, Kolkata, West Bengal 700001'),
('phone', '+91 33 2345 6789'),
('email', 'info@cps.edu.in'),
('about_short', 'A premier educational institution committed to excellence in academics, sports, and character building.'),
('virtual_tour_url', 'https://www.youtube.com/embed/dQw4w9WgXcQ');

-- Insert sample data for key functionaries
INSERT INTO public.key_functionaries (name, designation, order_index) VALUES
('Dr. Rajesh Kumar', 'Chairman', 1),
('Mrs. Sunita Sharma', 'Principal', 2),
('Mr. Anil Gupta', 'Vice Principal', 3),
('Dr. Priya Singh', 'Academic Director', 4);

-- Insert sample results
INSERT INTO public.results (student_name, exam_type, year, percentage, rank, is_featured) VALUES
('Ananya Roy', 'ICSE', 2024, 98.8, 1, true),
('Rahul Sharma', 'ICSE', 2024, 97.6, 2, true),
('Priya Patel', 'ISC', 2024, 97.2, 1, true),
('Arjun Singh', 'ISC', 2024, 96.8, 2, true);

-- Insert sample gallery items
INSERT INTO public.gallery (title, category, image_url, is_featured) VALUES
('Annual Sports Day 2024', 'sports', '/placeholder.svg', true),
('Science Exhibition', 'academics', '/placeholder.svg', true),
('Cultural Festival', 'events', '/placeholder.svg', true),
('Art Workshop', 'activities', '/placeholder.svg', true);

-- Insert sample pages
INSERT INTO public.pages (slug, title, content, is_published) VALUES
('about', 'About Us', 'Calcutta Public School is a premier educational institution dedicated to nurturing young minds and shaping future leaders. Established with a vision to provide holistic education, we combine academic excellence with character building, sports, and extracurricular activities.', true),
('mission', 'Mission & Vision', 'Our mission is to provide quality education that empowers students to become responsible global citizens. We envision a learning community where every student discovers their potential and develops the skills needed for the 21st century.', true),
('chairman-message', 'Chairman''s Message', 'Dear Students and Parents, Welcome to Calcutta Public School. Education is not just about acquiring knowledge; it is about developing character, building resilience, and preparing for a life of purpose and meaning.', true),
('principal-message', 'Principal''s Message', 'At Calcutta Public School, we believe every child is unique and capable of achieving greatness. Our dedicated faculty works tirelessly to create an environment where curiosity thrives and potential flourishes.', true);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_key_functionaries_updated_at
    BEFORE UPDATE ON public.key_functionaries
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_results_updated_at
    BEFORE UPDATE ON public.results
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON public.pages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admission_inquiries_updated_at
    BEFORE UPDATE ON public.admission_inquiries
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_career_openings_updated_at
    BEFORE UPDATE ON public.career_openings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON public.job_applications
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_school_settings_updated_at
    BEFORE UPDATE ON public.school_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();