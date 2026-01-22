import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TranslatedText } from "@/components/TranslatedText";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
}

export function GallerySection() {
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("id, title, image_url")
        .order("created_at", { ascending: false })
        .limit(8);
      if (!error && data) setGalleryImages(data);
      setLoading(false);
    };
    fetchGallery();
  }, []);

  if (loading) {
    return (
      <section id="gallery" className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <div className="text-center mb-12">
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
          <div className="h-[500px] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (galleryImages.length === 0) return null;

  return (
    <section id="gallery" className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
      {/* Background decoration */}
      <div className="absolute top-20 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-20 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl" />

      <div className="container relative">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
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

        {/* 3D Coverflow Swiper */}
        <div className="gallery-swiper-container max-w-[1440px] mx-auto px-4 overflow-hidden">
          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            loop={galleryImages.length > 3}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
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
            className="gallery-swiper h-[450px] md:h-[550px] pt-6"
            onSlideChange={(swiper) => {
              // Click to center functionality
              const slides = swiper.slides;
              slides.forEach((slide, index) => {
                slide.onclick = () => {
                  swiper.slideToLoop(index);
                };
              });
            }}
          >
            {galleryImages.map((image) => (
              <SwiperSlide
                key={image.id}
                className="!w-[280px] !h-[380px] md:!w-[370px] md:!h-[500px] rounded-2xl overflow-hidden"
              >
                <img
                  src={image.image_url}
                  alt={image.title}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-2xl border-2 border-transparent transition-all duration-300 swiper-slide-image"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Button asChild size="lg" className="btn-primary text-base group">
            <Link to="/gallery">
              <TranslatedText>View Full Gallery</TranslatedText>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Custom styles for Swiper */}
      <style>{`
        .gallery-swiper .swiper-slide {
          transition: all 0.3s ease;
        }
        .gallery-swiper .swiper-slide-active img {
          border-color: hsl(var(--primary)) !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        .gallery-swiper .swiper-pagination {
          bottom: 0 !important;
        }
        .gallery-swiper .swiper-pagination-bullet {
          background: hsl(var(--muted-foreground));
          opacity: 0.5;
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
        }
        .gallery-swiper .swiper-pagination-bullet-active {
          background: hsl(var(--primary));
          opacity: 1;
          width: 24px;
          border-radius: 5px;
        }
        .gallery-swiper .swiper-slide-shadow-left,
        .gallery-swiper .swiper-slide-shadow-right {
          border-radius: 16px;
        }
      `}</style>
    </section>
  );
}
