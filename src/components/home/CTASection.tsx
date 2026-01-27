import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, MapPin, Clock, BookOpen, ChevronDown } from "lucide-react";
import { useState } from "react";
import { TranslatedText, useTranslatedTexts } from "@/components/TranslatedText";

const admissionCriteria = [
  { grade: "প্রাক প্রাথমিক (Prep - I)", birthDate: "02.01.2022 থেকে 01.01.2023", age: "৩ বছর অথবা ৩ বছরের বেশি কিন্তু ৪ বছরের কম" },
  { grade: "প্রাক প্রাথমিক (K.G - I)", birthDate: "02.01.2021 থেকে 01.01.2022", age: "৪ বছর অথবা ৪ বছরের বেশি কিন্তু ৫ বছরের কম" },
  { grade: "প্রাক প্রাথমিক (K.G - II)", birthDate: "02.01.2020 থেকে 01.01.2021", age: "৫ বছর অথবা ৫ বছরের বেশি কিন্তু ৬ বছরের কম" },
  { grade: "প্রথম শ্রেণী (Class I)", birthDate: "02.01.2019 থেকে 01.01.2020", age: "৬ বছর অথবা ৬ বছরের বেশি কিন্তু ৭ বছরের কম" },
  { grade: "দ্বিতীয় শ্রেণী (Class II)", birthDate: "02.01.2018 থেকে 01.01.2019", age: "৭ বছর অথবা ৭ বছরের বেশি কিন্তু ৮ বছরের কম" },
  { grade: "তৃতীয় শ্রেণী (Class III)", birthDate: "02.01.2017 থেকে 01.01.2018", age: "৮ বছর অথবা ৮ বছরের বেশি কিন্তু ৯ বছরের কম" },
  { grade: "চতুর্থ শ্রেণী (Class IV)", birthDate: "02.01.2016 থেকে 01.01.2017", age: "৯ বছর অথবা ৯ বছরের বেশি কিন্তু ১০ বছরের কম" },
  { grade: "পঞ্চম শ্রেণী (Class V)", birthDate: "02.01.2015 থেকে 01.01.2016", age: "১০ বছর অথবা ১০ বছরের বেশি কিন্তু ১১ বছরের কম" },
];

export function CTASection() {
  const [isHovered, setIsHovered] = useState(false);
  const translatedTexts = useTranslatedTexts([
    "Admissions Open for 2026",
    "Give your child the gift of quality education. Join Balisai Public School and become part of our growing family of achievers.",
    "Apply for Admission",
    "Contact Us",
    "Our Location",
    "Contact Numbers",
    "School Timing",
    "Monday - Saturday"
  ]);

  return (
    <section id="admissions" className="section-padding relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="text-primary-foreground">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-medium">2026 শিক্ষাবর্ষ</span>
            </div>
            
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {translatedTexts[0]}
            </h2>
            <p className="text-primary-foreground/85 mb-8 text-lg leading-relaxed">
              {translatedTexts[1]}
            </p>
            
            {/* Hover Dropdown for Admission Criteria */}
            <div 
              className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-8 border border-white/10 transition-all duration-300 hover:bg-white/15"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg flex-1">ভর্তির বয়স ও জন্ম তারিখ (২০২৬ শিক্ষাবর্ষ)</h3>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'rotate-180' : ''}`} />
              </div>
              
              <div className={`grid transition-all duration-500 ease-out ${isHovered ? 'grid-rows-[1fr] mt-5 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {admissionCriteria.map((item, index) => (
                      <div key={index} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-colors">
                        <p className="text-secondary font-semibold text-sm mb-2">{item.grade}</p>
                        <p className="text-primary-foreground/80 text-xs leading-relaxed"><strong>জন্ম তারিখ:</strong> {item.birthDate}</p>
                        <p className="text-primary-foreground/80 text-xs leading-relaxed"><strong>বয়স:</strong> {item.age}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="btn-secondary text-secondary-foreground font-semibold text-base group">
                <Link to="/admission">
                  {translatedTexts[2]}
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg">
                <a href="#contact-section">{translatedTexts[3]}</a>
              </Button>
            </div>
          </div>

          {/* Contact Info Cards */}
          <div id="contact-section" className="space-y-5">
            {[
              { icon: MapPin, title: translatedTexts[4], content: "Patnahat, Balisai, Ramnagar\nPurba Medinipur, West Bengal" },
              { icon: Phone, title: translatedTexts[5], content: "phone" },
              { icon: Clock, title: translatedTexts[6], content: `${translatedTexts[7]}\n9:00 AM - 4:00 PM` }
            ].map((item, idx) => (
              <div key={idx} className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center flex-shrink-0 shadow-inner-glow group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-primary-foreground">{item.title}</h3>
                    {item.content === "phone" ? (
                      <p className="text-primary-foreground/80 leading-relaxed">
                        <a href="tel:9732743315" className="hover:text-secondary transition-colors">9732743315</a> / <a href="tel:9800640998" className="hover:text-secondary transition-colors">9800640998</a><br />
                        <a href="tel:9093775146" className="hover:text-secondary transition-colors">9093775146</a> / <a href="tel:9735225176" className="hover:text-secondary transition-colors">9735225176</a>
                      </p>
                    ) : (
                      <p className="text-primary-foreground/80 leading-relaxed whitespace-pre-line">{item.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
