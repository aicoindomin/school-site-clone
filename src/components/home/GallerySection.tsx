import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import yogaImg from "@/assets/gallery/yoga.jpg";

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
}

export function GallerySection() {
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error && data) {
        setGalleryImages(data);
      }
      setLoading(false);
    };

    fetchGallery();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-2">Memories & Moments</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Photo Gallery
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">Memories & Moments</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Photo Gallery
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="relative group overflow-hidden rounded-lg aspect-square"
            >
              <img
                src={image.image_url || yogaImg}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs text-white/70 mb-1">{image.category}</p>
                <h3 className="text-white font-medium">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline">
            <Link to="/gallery">
              View Full Gallery
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
