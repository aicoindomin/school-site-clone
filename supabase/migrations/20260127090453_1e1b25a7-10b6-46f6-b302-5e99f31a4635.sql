-- Update storage bucket to allow video files
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
    file_size_limit = 52428800  -- 50MB for videos
WHERE id = 'school-images';