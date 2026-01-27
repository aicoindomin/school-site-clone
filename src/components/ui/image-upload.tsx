import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  acceptVideo?: boolean;
}

export function ImageUpload({ value, onChange, folder = "general", className, acceptVideo = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const acceptTypes = acceptVideo ? "video/*" : "image/*";
  const fileTypeLabel = acceptVideo ? "video" : "image";

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    
    if (acceptVideo && !isVideo) {
      toast({ title: "Please select a video file", variant: "destructive" });
      return;
    }
    
    if (!acceptVideo && !isImage) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }

    // Validate file size (5MB for images, 50MB for videos)
    const maxSize = acceptVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({ title: `File must be less than ${acceptVideo ? '50MB' : '5MB'}`, variant: "destructive" });
      return;
    }

    setUploading(true);

    try {
      // Create a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("school-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        toast({ title: "Failed to upload image", description: error.message, variant: "destructive" });
        return;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("school-images")
        .getPublicUrl(data.path);

      setPreview(urlData.publicUrl);
      onChange(urlData.publicUrl);
      toast({ title: "Image uploaded successfully" });
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Failed to upload image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <Label className="mb-2 block">Image</Label>
      
      {/* URL Input - Primary method for Hostinger hosting */}
      <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-700 mb-2 font-medium">
          📁 Paste image URL from Hostinger (public_html/assets/):
        </p>
        <Input
          placeholder="https://yourdomain.com/assets/image.jpg"
          value={value}
          onChange={(e) => {
            setPreview(e.target.value);
            onChange(e.target.value);
          }}
          className="text-sm bg-white"
        />
      </div>

      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground text-center px-2">Or upload to cloud storage</span>
            </>
          )}
        </div>
      )}

      <Input
        ref={inputRef}
        type="file"
        accept={acceptTypes}
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
      />
    </div>
  );
}
