import { useState, useEffect, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import { useTranslatedTexts, useDynamicTranslation } from "@/components/TranslatedText";

interface Faculty {
  id: string;
  name: string;
  designation: string;
  department: string | null;
  qualification: string | null;
  image_url: string | null;
}

const Faculty = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  // Static text translations
  const textsToTranslate = useMemo(() => [
    "Our Faculty",
    "Meet our dedicated team of educators",
    "No faculty members available"
  ], []);

  const translatedTexts = useTranslatedTexts(textsToTranslate);
  
  const t = useMemo(() => {
    const map: Record<string, string> = {};
    textsToTranslate.forEach((text, index) => {
      map[text] = translatedTexts[index] || text;
    });
    return map;
  }, [textsToTranslate, translatedTexts]);

  // Translate dynamic content
  const translatedFaculty = useDynamicTranslation(faculty, ["name", "designation", "department", "qualification"]);

  useEffect(() => {
    const fetchFaculty = async () => {
      const { data, error } = await supabase
        .from("faculty")
        .select("*")
        .eq("is_active", true)
        .order("order_index");

      if (!error && data) {
        setFaculty(data);
      }
      setLoading(false);
    };

    fetchFaculty();
  }, []);

  return (
    <MainLayout>
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t["Our Faculty"]}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t["Meet our dedicated team of educators"]}
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6 text-center">
                    <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : translatedFaculty.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {t["No faculty members available"]}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {translatedFaculty.map((member, index) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    {faculty[index]?.image_url ? (
                      <img
                        src={faculty[index].image_url!}
                        alt={member.name}
                        className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-primary/20"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <User className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-primary text-sm">{member.designation}</p>
                    {member.department && (
                      <p className="text-muted-foreground text-sm">{member.department}</p>
                    )}
                    {member.qualification && (
                      <p className="text-muted-foreground text-xs mt-1">{member.qualification}</p>
                    )}
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

export default Faculty;