import { Quote } from "lucide-react";
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
  return (
    <section id="leadership-section" className="py-16 bg-gradient-to-b from-muted to-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Leadership
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {leaders.map((leader, index) => (
            <div
              key={index}
              id={index === 0 ? "secretary-message" : "headmaster-message"}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)) 100%)',
              }}
            >
              {/* Decorative gradient border */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary) / 0.3), hsl(var(--accent) / 0.3))',
                  transform: 'scale(1.02)',
                }}
              />

              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="lg:w-2/5 relative overflow-hidden">
                  <div className="aspect-[4/3] lg:aspect-auto lg:h-full">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                        leader.title.includes("Secretary") ? "object-[center_15%]" : "object-[center_60%]"
                      }`}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-card" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col justify-center">
                  <h3 className="font-display text-xl lg:text-2xl font-bold text-primary mb-4">
                    {leader.title}
                  </h3>

                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                    <p className="text-foreground/80 italic text-base lg:text-lg leading-relaxed pl-6">
                      "{leader.quote}"
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="w-12 h-0.5 bg-primary rounded-full" />
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
