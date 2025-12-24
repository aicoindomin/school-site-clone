import { MainLayout } from "@/components/layout/MainLayout";
import {
  HeroSlider3D,
  NoticesSection,
  AboutSection,
  GallerySection,
  StatsSection,
  CTASection,
} from "@/components/home";

const Index = () => {
  return (
    <MainLayout>
      <HeroSlider3D />
      <NoticesSection />
      <AboutSection />
      <StatsSection />
      <GallerySection />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
