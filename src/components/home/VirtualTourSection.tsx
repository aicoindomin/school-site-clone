import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function VirtualTourSection() {
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    async function fetchVideoUrl() {
      const { data, error } = await supabase
        .from("school_settings")
        .select("value")
        .eq("key", "virtual_tour_url")
        .maybeSingle();

      if (!error && data) {
        setVideoUrl(data.value || "");
      }
    }

    fetchVideoUrl();
  }, []);

  if (!videoUrl) return null;

  return (
    <section id="virtual-tour" className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Virtual Tour
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience our campus from anywhere in the world
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-elegant">
            <iframe
              src={videoUrl}
              title="Virtual Tour"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
