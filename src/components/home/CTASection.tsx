import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, MapPin, Clock, BookOpen, ChevronDown } from "lucide-react";
import { useState } from "react";

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

  return (
    <section id="admissions" className="py-16 bg-gradient-hero text-primary-foreground">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Admissions Open for 2026</h2>
            <p className="text-primary-foreground/80 mb-6 text-lg">
              Give your child the gift of quality education. Join Balisai Public School and become part of our growing family of achievers.
            </p>
            
            {/* Hover Dropdown for Admission Criteria */}
            <div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="flex items-center gap-2 cursor-pointer">
                <BookOpen className="w-5 h-5 text-secondary" />
                <h3 className="font-semibold text-lg">ভর্তির বয়স ও জন্ম তারিখ (২০২৬ শিক্ষাবর্ষ)</h3>
                <ChevronDown className={`w-5 h-5 transition-transform ${isHovered ? 'rotate-180' : ''}`} />
              </div>
              
              {isHovered && (
                <div className="mt-4 space-y-2 animate-fade-in">
                  {admissionCriteria.map((item, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-3">
                      <p className="text-secondary font-medium text-sm">{item.grade}</p>
                      <p className="text-primary-foreground/80 text-xs mt-1"><strong>জন্ম তারিখ:</strong> {item.birthDate}</p>
                      <p className="text-primary-foreground/80 text-xs"><strong>বয়স:</strong> {item.age}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link to="/admission">
                  Apply for Admission
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <a href="#contact-section">Contact Us</a>
              </Button>
            </div>
          </div>

          {/* Contact Info Cards */}
          <div id="contact-section" className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Our Location</h3>
                  <p className="text-primary-foreground/80">Patnahat, Balisai, Ramnagar<br />Purba Medinipur, West Bengal</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Contact Numbers</h3>
                  <p className="text-primary-foreground/80">
                    <a href="tel:9732743315" className="hover:text-secondary transition-colors">9732743315</a> / <a href="tel:9800640998" className="hover:text-secondary transition-colors">9800640998</a><br />
                    <a href="tel:9093775146" className="hover:text-secondary transition-colors">9093775146</a> / <a href="tel:9735225176" className="hover:text-secondary transition-colors">9735225176</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">School Timing</h3>
                  <p className="text-primary-foreground/80">Monday - Saturday<br />9:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
