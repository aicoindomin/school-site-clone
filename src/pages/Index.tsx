import { MainLayout } from "@/components/layout/MainLayout";
import {
  HeroSlider,
  NoticesSection,
  AboutSection,
  GallerySection,
  StatsSection,
  CTASection,
} from "@/components/home";

const Index = () => {
  return (
    <MainLayout>
      <HeroSlider />
      <NoticesSection />
      <AboutSection />
      <StatsSection />
      <GallerySection />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
