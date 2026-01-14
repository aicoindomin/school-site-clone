import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TranslatedText } from "@/components/TranslatedText";
import yogaImg from "@/assets/gallery/yoga.jpg";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
}

export function GallerySection() {
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false }).limit(6);
      if (!error && data) setGalleryImages(data);
      setLoading(false);
    };
    fetchGallery();
  }, []);

  if (loading) {
    return (
      <section id="gallery" className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-2">
              <TranslatedText>Memories & Moments</TranslatedText>
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              <TranslatedText>Photo Gallery</TranslatedText>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />)}
          </div>
        </div>
      </section>
    );
  }

  if (galleryImages.length === 0) return null;

  return (
    <section id="gallery" className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">
            <TranslatedText>Memories & Moments</TranslatedText>
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            <TranslatedText>Photo Gallery</TranslatedText>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {galleryImages.map((image) => (
            <div key={image.id} className="group relative overflow-hidden rounded-lg aspect-square [perspective:1000px]">
              <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="absolute inset-0 [backface-visibility:hidden]">
                  <img src={image.image_url || yogaImg} alt={image.title} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-primary text-primary-foreground flex flex-col items-center justify-center p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <h3 className="font-semibold text-lg text-center mb-2">{image.title}</h3>
                  <p className="text-xs text-primary-foreground/70 mb-2">{image.category}</p>
                  {image.description && <p className="text-sm text-center text-primary-foreground/80 line-clamp-3">{image.description}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline">
            <Link to="/gallery">
              <TranslatedText>View Full Gallery</TranslatedText>
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
