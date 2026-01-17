import { Quote } from "lucide-react";
import { TranslatedText, useTranslatedTexts } from "@/components/TranslatedText";
import secretaryImg from "@/assets/leadership/secretary.png";
import headmasterImg from "@/assets/leadership/headmaster.png";

const leaders = [
  {
    title: "Secretary's Vision",
    name: "Puspendu Sekhar Dey",
    image: secretaryImg,
    quote: "Building the leaders of tomorrow starts with a strong foundation today. We are dedicated to excellence in every step of your child's growth.",
  },
  {
    title: "Headmaster's Note",
    name: "Puspendu Pradhan",
    image: headmasterImg,
    quote: "Every child is a star waiting to shine. Our job is to provide the sky. Welcome to a place where learning comes alive.",
  },
];

export function LeadershipSection() {
  const titles = useTranslatedTexts(leaders.map(l => l.title));
  const quotes = useTranslatedTexts(leaders.map(l => l.quote));

  return (
    <section id="leadership-section" className="section-padding relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-muted/30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container relative">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            <TranslatedText>Our Leadership</TranslatedText>
          </h2>
          <div className="accent-bar w-24 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {leaders.map((leader, index) => (
            <div
              key={index}
              id={index === 0 ? "secretary-message" : "headmaster-message"}
              className="group relative glass-card rounded-3xl overflow-hidden hover:shadow-3d transition-all duration-500 card-3d"
            >
              {/* Gradient border effect on hover */}
              <div 
                className="absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary) / 0.4), hsl(var(--secondary) / 0.4))',
                }}
              />

              <div className="flex flex-col lg:flex-row h-full bg-card/80 rounded-3xl overflow-hidden">
                {/* Image Section */}
                <div className="lg:w-2/5 relative overflow-hidden">
                  <div className="aspect-[4/3] lg:aspect-auto lg:h-full">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                        leader.title.includes("Secretary") ? "object-[center_15%]" : "object-[center_60%]"
                      }`}
                    />
                    {/* Enhanced gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-card/20 lg:to-card" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col justify-center relative">
                  {/* Decorative element */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
                  
                  <h3 className="font-display text-xl lg:text-2xl font-bold text-primary mb-4">
                    {titles[index]}
                  </h3>

                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-10 h-10 text-primary/15" />
                    <p className="text-foreground/80 italic text-base lg:text-lg leading-relaxed pl-8 pr-2">
                      "{quotes[index]}"
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="accent-bar w-12" />
                    <p className="font-display font-semibold text-foreground">
                      {leader.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
