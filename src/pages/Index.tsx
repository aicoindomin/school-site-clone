import { MainLayout } from "@/components/layout";
import {
  HeroSection,
  CategoriesSection,
  FunctionariesSection,
  ResultsSection,
  GallerySection,
  VirtualTourSection,
  AboutSection,
  FeePaymentSection,
  CTASection,
} from "@/components/home";

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <CategoriesSection />
      <AboutSection />
      <FunctionariesSection />
      <VirtualTourSection />
      <GallerySection />
      <ResultsSection />
      <FeePaymentSection />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
