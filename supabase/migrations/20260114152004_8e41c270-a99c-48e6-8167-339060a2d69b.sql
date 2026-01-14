-- Add Bengali translation columns to key content tables
-- These columns store manually written Bengali content from admin panel

-- Notices table
ALTER TABLE public.notices 
ADD COLUMN IF NOT EXISTS title_bn TEXT,
ADD COLUMN IF NOT EXISTS content_bn TEXT;

-- Career openings table
ALTER TABLE public.career_openings 
ADD COLUMN IF NOT EXISTS title_bn TEXT,
ADD COLUMN IF NOT EXISTS department_bn TEXT,
ADD COLUMN IF NOT EXISTS description_bn TEXT,
ADD COLUMN IF NOT EXISTS requirements_bn TEXT;

-- Faculty table
ALTER TABLE public.faculty 
ADD COLUMN IF NOT EXISTS name_bn TEXT,
ADD COLUMN IF NOT EXISTS designation_bn TEXT,
ADD COLUMN IF NOT EXISTS department_bn TEXT,
ADD COLUMN IF NOT EXISTS qualification_bn TEXT,
ADD COLUMN IF NOT EXISTS bio_bn TEXT;

-- Students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS name_bn TEXT,
ADD COLUMN IF NOT EXISTS class_bn TEXT,
ADD COLUMN IF NOT EXISTS parent_name_bn TEXT;

-- Holidays table
ALTER TABLE public.holidays 
ADD COLUMN IF NOT EXISTS title_bn TEXT,
ADD COLUMN IF NOT EXISTS description_bn TEXT;

-- Gallery table
ALTER TABLE public.gallery 
ADD COLUMN IF NOT EXISTS title_bn TEXT,
ADD COLUMN IF NOT EXISTS description_bn TEXT,
ADD COLUMN IF NOT EXISTS category_bn TEXT;

-- Results table
ALTER TABLE public.results 
ADD COLUMN IF NOT EXISTS student_name_bn TEXT,
ADD COLUMN IF NOT EXISTS class_name_bn TEXT,
ADD COLUMN IF NOT EXISTS exam_type_bn TEXT;

-- Top achievers table
ALTER TABLE public.top_achievers 
ADD COLUMN IF NOT EXISTS student_name_bn TEXT,
ADD COLUMN IF NOT EXISTS class_label_bn TEXT,
ADD COLUMN IF NOT EXISTS position_bn TEXT;

-- Website content table
ALTER TABLE public.website_content 
ADD COLUMN IF NOT EXISTS title_bn TEXT,
ADD COLUMN IF NOT EXISTS content_bn TEXT,
ADD COLUMN IF NOT EXISTS meta_description_bn TEXT;

-- Key functionaries table
ALTER TABLE public.key_functionaries 
ADD COLUMN IF NOT EXISTS name_bn TEXT,
ADD COLUMN IF NOT EXISTS designation_bn TEXT;