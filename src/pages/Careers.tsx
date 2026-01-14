import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase } from "lucide-react";
import { TranslatedText, useDynamicTranslation } from "@/components/TranslatedText";

interface CareerOpening {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string | null;
}

const Careers = () => {
  const [openings, setOpenings] = useState<CareerOpening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpenings = async () => {
      const { data, error } = await supabase
        .from("career_openings")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOpenings(data);
      }
      setLoading(false);
    };

    fetchOpenings();
  }, []);

  // Translate dynamic content
  const translatedOpenings = useDynamicTranslation(openings, ["title", "department", "description", "requirements"]);

  return (
    <MainLayout>
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              <TranslatedText>Career Opportunities</TranslatedText>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              <TranslatedText>Join our team and make a difference in education</TranslatedText>
            </p>
          </div>

          {loading ? (
            <div className="space-y-6 max-w-3xl mx-auto">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : translatedOpenings.length === 0 ? (
            <Card className="max-w-lg mx-auto text-center">
              <CardContent className="py-12">
                <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">
                  <TranslatedText>No Current Openings</TranslatedText>
                </h3>
                <p className="text-muted-foreground">
                  <TranslatedText>There are no job openings at the moment. Please check back later or send your resume to info@balisaipublicschool.in</TranslatedText>
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {translatedOpenings.map((opening) => (
                <Card key={opening.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{opening.title}</CardTitle>
                        <Badge className="mt-2">{opening.department}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{opening.description}</p>
                    {opening.requirements && (
                      <div>
                        <h4 className="font-semibold mb-2">
                          <TranslatedText>Requirements:</TranslatedText>
                        </h4>
                        <p className="text-muted-foreground text-sm">{opening.requirements}</p>
                      </div>
                    )}
                    <Button className="mt-4" asChild>
                      <a href={`mailto:info@balisaipublicschool.in?subject=Application for ${opening.title}`}>
                        <TranslatedText>Apply Now</TranslatedText>
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Careers;
