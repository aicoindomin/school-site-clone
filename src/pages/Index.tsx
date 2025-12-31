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
  AdmissionPopup,
} from "@/components/home";

const Index = () => {
  return (
    <MainLayout>
      <AdmissionPopup />
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
