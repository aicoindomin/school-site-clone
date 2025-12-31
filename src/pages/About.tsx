import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import chairmanImg from "@/assets/leadership/chairman.png";
import principalImg from "@/assets/leadership/principal.png";

const About = () => {
  return (
    <MainLayout>
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              About Us
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Balisai Public School - Nurturing young minds since 2009
            </p>
          </div>

          {/* Overview */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card>
              <CardContent className="p-8">
                <h2 className="font-display text-2xl font-bold mb-4">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Balisai Public School was established in 2009 with a vision to provide quality education 
                  to the children of Balisai and surrounding areas. Located in Patnahat, Ramnagar, 
                  Purba Medinipur, our school has grown from humble beginnings to become a beacon of 
                  educational excellence in the region.
                </p>
                <p className="text-muted-foreground mb-4">
                  We believe in holistic development of every child, focusing not just on academic 
                  excellence but also on moral values, physical fitness, and creative expression.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8">
                <h2 className="font-display text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-primary-foreground/80">
                  To provide quality education that empowers students with knowledge, skills, and values 
                  necessary to succeed in life. We strive to create a nurturing environment where every 
                  child can discover and develop their unique potential.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-secondary text-secondary-foreground">
              <CardContent className="p-8">
                <h2 className="font-display text-2xl font-bold mb-4">Our Vision</h2>
                <p className="text-secondary-foreground/80">
                  To be a leading educational institution that shapes future leaders and responsible 
                  citizens who contribute positively to society. We envision a school where learning 
                  is joyful, inclusive, and transformative.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Leadership Messages */}
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-muted/50 rounded-xl p-8">
              <img 
                src={chairmanImg} 
                alt="Chairman" 
                className="w-48 h-48 rounded-full object-cover border-4 border-primary"
              />
              <div>
                <h3 className="font-display text-2xl font-bold mb-2">Chairman's Message</h3>
                <p className="text-muted-foreground">
                  "At Balisai Public School, we are committed to providing an environment where every 
                  child can flourish. Education is not just about textbooks; it's about building 
                  character, instilling values, and preparing our children for the challenges of 
                  tomorrow. Together with our dedicated teachers and supportive parents, we are 
                  shaping the leaders of the future."
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-8 bg-muted/50 rounded-xl p-8">
              <img 
                src={principalImg} 
                alt="Principal" 
                className="w-48 h-48 rounded-full object-cover border-4 border-secondary"
              />
              <div>
                <h3 className="font-display text-2xl font-bold mb-2">Principal's Message</h3>
                <p className="text-muted-foreground">
                  "Welcome to Balisai Public School! Our dedicated team of educators works tirelessly 
                  to ensure that every student receives personalized attention and guidance. We believe 
                  in nurturing not just the intellect but also the creativity, curiosity, and compassion 
                  in every child. Join us in this beautiful journey of learning and growth."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
