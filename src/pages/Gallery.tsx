import { useState, useEffect, useMemo, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useTranslatedTexts } from "@/components/TranslatedText";
import { GalleryVideoPlayer } from "@/components/ui/GalleryVideoPlayer";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  media_type: string | null;
}

const Gallery = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

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

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("id, title, image_url, media_type")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setGallery(data);
      }
      setLoading(false);
    };

    fetchGallery();
  }, []);

  const openLightbox = (index: number) => {
    if (swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.stop();
    }
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    if (swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.start();
    }
  };

  return (
    <MainLayout>
      <section className="py-16 bg-gradient-to-b from-background to-muted/30 min-h-screen">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t["Photo Gallery"]}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t["Memories and moments from our school"]}
            </p>
            <div className="accent-bar w-24 mx-auto mt-6" />
          </div>

          {loading ? (
            <div className="h-[500px] flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : gallery.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {t["No gallery images available"]}
            </div>
          ) : (
            <div className="gallery-page-swiper-container max-w-[1440px] mx-auto px-4 overflow-hidden">
              <Swiper
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                loop={gallery.length > 3}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                  slideShadows: true,
                }}
                pagination={{
                  clickable: true,
                }}
                modules={[EffectCoverflow, Pagination, Autoplay]}
                className="gallery-page-swiper h-[450px] md:h-[600px] pt-6"
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
              >
                {gallery.map((item, index) => (
                  <SwiperSlide
                    key={item.id}
                    className="!w-[280px] !h-[380px] md:!w-[400px] md:!h-[540px] rounded-2xl overflow-hidden cursor-pointer"
                    onClick={() => openLightbox(index)}
                  >
                    {item.media_type === "video" ? (
                      <GalleryVideoPlayer
                        src={item.image_url}
                        title={item.title}
                        className="w-full h-full"
                      />
                    ) : (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-2xl border-2 border-transparent transition-all duration-300"
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Lightbox */}
              <GalleryLightbox
                items={gallery}
                currentIndex={lightboxIndex}
                isOpen={lightboxOpen}
                onClose={closeLightbox}
                onNavigate={setLightboxIndex}
              />
            </div>
          )}
        </div>

        {/* Custom styles for Swiper */}
        <style>{`
          .gallery-page-swiper .swiper-slide {
            transition: all 0.3s ease;
          }
          .gallery-page-swiper .swiper-slide-active img {
            border-color: hsl(var(--primary)) !important;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          }
          .gallery-page-swiper .swiper-pagination {
            bottom: 0 !important;
          }
          .gallery-page-swiper .swiper-pagination-bullet {
            background: hsl(var(--muted-foreground));
            opacity: 0.5;
            width: 10px;
            height: 10px;
            transition: all 0.3s ease;
          }
          .gallery-page-swiper .swiper-pagination-bullet-active {
            background: hsl(var(--primary));
            opacity: 1;
            width: 24px;
            border-radius: 5px;
          }
          .gallery-page-swiper .swiper-slide-shadow-left,
          .gallery-page-swiper .swiper-slide-shadow-right {
            border-radius: 16px;
          }
        `}</style>
      </section>
    </MainLayout>
  );
};

export default Gallery;