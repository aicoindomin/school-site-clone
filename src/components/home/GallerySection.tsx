import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import yogaImg from "@/assets/gallery/yoga.jpg";
import artImg from "@/assets/gallery/art_display.jpg";
import craft1Img from "@/assets/gallery/craft1.jpg";
import craft2Img from "@/assets/gallery/craft2.jpg";
import heroImg from "@/assets/slider/hero-bg.jpg";
import paradeImg from "@/assets/slider/parade.jpg";

const galleryImages = [
  { src: yogaImg, title: "Yoga Day Celebration", category: "Events" },
  { src: artImg, title: "Student Artwork", category: "Art" },
  { src: craft1Img, title: "Creative Crafts", category: "Art" },
  { src: craft2Img, title: "Recycled Art", category: "Art" },
  { src: heroImg, title: "Annual Function", category: "Events" },
  { src: paradeImg, title: "Independence Day", category: "Events" },
];

export function GallerySection() {
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
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-lg aspect-square"
            >
              <img
                src={image.src}
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
