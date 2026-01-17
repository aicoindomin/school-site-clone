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
      <section id="gallery" className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="container relative">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
              <span className="text-sm font-medium text-primary">
                <TranslatedText>Memories & Moments</TranslatedText>
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              <TranslatedText>Photo Gallery</TranslatedText>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-muted animate-pulse rounded-2xl" />)}
          </div>
        </div>
      </section>
    );
  }

  if (galleryImages.length === 0) return null;

  return (
    <section id="gallery" className="section-padding relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      <div className="absolute top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
            <span className="text-sm font-medium text-primary">
              <TranslatedText>Memories & Moments</TranslatedText>
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            <TranslatedText>Photo Gallery</TranslatedText>
          </h2>
          <div className="accent-bar w-20 mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {galleryImages.map((image, idx) => (
            <div 
              key={image.id} 
              className={`group relative overflow-hidden rounded-2xl aspect-square card-3d stagger-${(idx % 6) + 1}`}
              style={{ animationFillMode: 'both' }}
            >
              <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front - Image */}
                <div className="absolute inset-0 [backface-visibility:hidden]">
                  <img 
                    src={image.image_url || yogaImg} 
                    alt={image.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                {/* Back - Info */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground flex flex-col items-center justify-center p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <h3 className="font-display font-semibold text-lg text-center mb-3">{image.title}</h3>
                  <span className="px-3 py-1 text-xs bg-white/20 rounded-full backdrop-blur-sm mb-3">{image.category}</span>
                  {image.description && (
                    <p className="text-sm text-center text-primary-foreground/85 line-clamp-3 leading-relaxed">{image.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="glass-card hover:bg-primary hover:text-primary-foreground transition-all duration-300 group">
            <Link to="/gallery">
              <TranslatedText>View Full Gallery</TranslatedText>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
