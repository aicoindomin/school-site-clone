import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Eye } from "lucide-react";
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
      <section id="gallery" className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="container relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
              <Camera className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                <TranslatedText>Memories & Moments</TranslatedText>
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              <TranslatedText>Photo Gallery</TranslatedText>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (galleryImages.length === 0) return null;

  return (
    <section id="gallery" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      <div className="absolute top-20 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl float-bubble" />
      <div className="absolute bottom-20 -left-20 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl float-bubble-delayed" />
      
      <div className="container relative">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card mb-6">
            <Camera className="w-4 h-4 text-secondary" />
            <span className="text-sm font-semibold text-primary">
              <TranslatedText>Memories & Moments</TranslatedText>
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            <TranslatedText>Photo Gallery</TranslatedText>
          </h2>
          <div className="accent-bar w-24 mx-auto" />
        </div>

        {/* Gallery Grid with 3D flip effect */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 mb-12">
          {galleryImages.map((image, idx) => (
            <div 
              key={image.id} 
              className={`group relative overflow-hidden rounded-2xl aspect-square cursor-pointer animate-fade-in-up stagger-${(idx % 6) + 1}`}
              style={{ 
                animationFillMode: 'both',
                perspective: '1000px'
              }}
            >
              <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front - Image */}
                <div className="absolute inset-0 [backface-visibility:hidden]">
                  <img 
                    src={image.image_url || yogaImg} 
                    alt={image.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <div className="flex items-center gap-2 text-white">
                      <Eye className="w-5 h-5" />
                      <span className="font-medium">View Details</span>
                    </div>
                  </div>
                </div>
                
                {/* Back - Info */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent text-white flex flex-col items-center justify-center p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <h3 className="font-display font-bold text-xl text-center mb-3 line-clamp-2">{image.title}</h3>
                  <span className="px-4 py-1.5 text-xs bg-white/20 rounded-full backdrop-blur-sm mb-4 font-medium">{image.category}</span>
                  {image.description && (
                    <p className="text-sm text-center text-white/90 line-clamp-3 leading-relaxed">{image.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button asChild size="lg" className="btn-primary text-base group">
            <Link to="/gallery">
              <TranslatedText>View Full Gallery</TranslatedText>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
