import { MainLayout } from "@/components/layout/MainLayout";
import {
  HeroSlider3D,
  NoticesSection,
  AboutSection,
  GallerySection,
  StatsSection,
  CTASection,
  TopAchieversSection,
  LeadershipSection,
} from "@/components/home";

const Index = () => {
  return (
    <MainLayout>
      <HeroSlider3D />
      <NoticesSection />
      <LeadershipSection />
      <AboutSection />
      <StatsSection />
      <TopAchieversSection />
      <GallerySection />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
