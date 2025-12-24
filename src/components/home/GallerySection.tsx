import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Image } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
}

export function GallerySection() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error && data) {
        setImages(data);
      }
      setLoading(false);
    }

    fetchGallery();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Photo Glimpses
            </h2>
            <p className="text-muted-foreground">
              Capturing memorable moments from our school life
            </p>
          </div>
          <Button asChild variant="outline" className="group">
            <Link to="/gallery">
              View All Photos
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
            ))
          ) : images.length > 0 ? (
            images.map((item, index) => (
              <Card 
                key={item.id}
                className="group overflow-hidden border-0 shadow-elegant hover-lift cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0 relative aspect-[4/3]">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <span className="inline-block px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-2 capitalize">
                      {item.category}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-primary-foreground">
                      {item.title}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No gallery images available yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
