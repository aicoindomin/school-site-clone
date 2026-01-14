import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TranslationProvider } from "@/hooks/useTranslation";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Faculty from "./pages/Faculty";
import Students from "./pages/Students";
import Results from "./pages/Results";
import ClassRoutine from "./pages/ClassRoutine";
import Holidays from "./pages/Holidays";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Admission from "./pages/Admission";
import Careers from "./pages/Careers";
import Notices from "./pages/Notices";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TranslationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/about" element={<About />} />
            <Route path="/about/mission" element={<About />} />
            <Route path="/about/chairman-message" element={<About />} />
            <Route path="/about/principal-message" element={<About />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/students" element={<Students />} />
            <Route path="/results" element={<Results />} />
            <Route path="/routine" element={<ClassRoutine />} />
            <Route path="/holidays" element={<Holidays />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/notices" element={<Notices />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </TranslationProvider>
  </QueryClientProvider>
);

export default App;
