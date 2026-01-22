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
            slidesPerView={5}
            loop={true}
            loopAdditionalSlides={3}
            speed={600}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 80,
              depth: 200,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              320: {
                slidesPerView: 1.5,
                coverflowEffect: {
                  stretch: 40,
                  depth: 100,
                },
              },
              640: {
                slidesPerView: 3,
                coverflowEffect: {
                  stretch: 60,
                  depth: 150,
                },
              },
              1024: {
                slidesPerView: 5,
                coverflowEffect: {
                  stretch: 80,
                  depth: 200,
                },
              },
            }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="gallery-swiper h-[400px] md:h-[500px] lg:h-[550px] pt-6"
          >
            {galleryImages.map((image) => (
              <SwiperSlide
                key={image.id}
                className="gallery-slide"
              >
                <img
                  src={image.image_url}
                  alt={image.title}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-2xl"
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
        .gallery-swiper {
          padding: 30px 0 50px;
        }
        .gallery-swiper .swiper-wrapper {
          transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .gallery-swiper .gallery-slide {
          width: 280px;
          height: 350px;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
          border: 3px solid transparent;
        }
        @media (min-width: 768px) {
          .gallery-swiper .gallery-slide {
            width: 320px;
            height: 420px;
          }
        }
        @media (min-width: 1024px) {
          .gallery-swiper .gallery-slide {
            width: 350px;
            height: 460px;
          }
        }
        .gallery-swiper .swiper-slide-active .gallery-slide,
        .gallery-swiper .swiper-slide-active {
          border-color: hsl(var(--primary));
          box-shadow: 
            0 15px 50px rgba(0, 0, 0, 0.35),
            0 0 30px hsla(var(--primary), 0.3);
        }
        .gallery-swiper .swiper-slide img {
          transition: transform 0.5s ease;
        }
        .gallery-swiper .swiper-slide-active img {
          transform: scale(1.02);
        }
        .gallery-swiper .swiper-pagination {
          bottom: 0 !important;
        }
        .gallery-swiper .swiper-pagination-bullet {
          background: hsl(var(--muted-foreground));
          opacity: 0.4;
          width: 12px;
          height: 12px;
          transition: all 0.4s ease;
        }
        .gallery-swiper .swiper-pagination-bullet-active {
          background: hsl(var(--primary));
          opacity: 1;
          width: 32px;
          border-radius: 6px;
        }
        .gallery-swiper .swiper-slide-shadow-left,
        .gallery-swiper .swiper-slide-shadow-right {
          border-radius: 20px;
          background: linear-gradient(to right, rgba(0,0,0,0.4), transparent);
        }
        .gallery-swiper .swiper-slide-shadow-right {
          background: linear-gradient(to left, rgba(0,0,0,0.4), transparent);
        }
      `}</style>
    </section>
  );
}
