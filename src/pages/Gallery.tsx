import { useState, useEffect, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useTranslatedTexts, useDynamicTranslation } from "@/components/TranslatedText";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
}

const Gallery = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Static text translations
  const textsToTranslate = useMemo(() => [
    "Photo Gallery",
    "Memories and moments from our school",
    "No gallery images available"
  ], []);

  const translatedTexts = useTranslatedTexts(textsToTranslate);
  
  const t = useMemo(() => {
    const map: Record<string, string> = {};
    textsToTranslate.forEach((text, index) => {
      map[text] = translatedTexts[index] || text;
    });
    return map;
  }, [textsToTranslate, translatedTexts]);

  // Translate dynamic content
  const translatedGallery = useDynamicTranslation(gallery, ["title", "description", "category"]);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setGallery(data);
      }
      setLoading(false);
    };

    fetchGallery();
  }, []);

  return (
    <MainLayout>
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t["Photo Gallery"]}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t["Memories and moments from our school"]}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : translatedGallery.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {t["No gallery images available"]}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {translatedGallery.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative overflow-hidden rounded-lg aspect-square [perspective:1000px]"
                >
                  <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Front - Image */}
                    <div className="absolute inset-0 [backface-visibility:hidden]">
                      <img
                        src={gallery[index].image_url}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Back - Details */}
                    <div className="absolute inset-0 bg-primary text-primary-foreground flex flex-col items-center justify-center p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <h3 className="font-semibold text-lg text-center mb-2">{image.title}</h3>
                      <p className="text-xs text-primary-foreground/70 mb-2">{image.category}</p>
                      {image.description && (
                        <p className="text-sm text-center text-primary-foreground/80 line-clamp-4">
                          {image.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Gallery;