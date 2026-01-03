import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";
import secretaryImg from "@/assets/leadership/secretary.png";
import headmasterImg from "@/assets/leadership/headmaster.png";

interface Functionary {
  id: string;
  name: string;
  designation: string;
  image_url: string | null;
}

// Map designations to local images
const leadershipImages: Record<string, string> = {
  "Secretary": secretaryImg,
  "Headmaster": headmasterImg,
};

export function FunctionariesSection() {
  const [functionaries, setFunctionaries] = useState<Functionary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFunctionaries() {
      const { data, error } = await supabase
        .from("key_functionaries")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true })
        .limit(4);

      if (!error && data) {
        setFunctionaries(data);
      }
      setLoading(false);
    }

    fetchFunctionaries();
  }, []);

  const getImageUrl = (functionary: Functionary) => {
    // Use local image if designation matches, otherwise use image_url from DB
    if (leadershipImages[functionary.designation]) {
      return leadershipImages[functionary.designation];
    }
    return functionary.image_url;
  };

  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Key Functionaries
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the visionary leaders guiding our institution towards excellence
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-elegant">
                <CardContent className="p-6 text-center">
                  <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </CardContent>
              </Card>
            ))
          ) : (
            functionaries.map((person, index) => {
              const imageUrl = getImageUrl(person);
              return (
                <Card 
                  key={person.id} 
                  className="border-0 shadow-elegant hover-lift group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="relative w-32 h-32 mx-auto mb-5">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={person.name}
                          className={`w-full h-full rounded-full object-cover border-4 border-primary/20 group-hover:border-secondary transition-colors ${
                            person.designation === "Secretary" ? "object-[center_15%]" : person.designation === "Headmaster" ? "object-[center_60%]" : "object-center"
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-primary flex items-center justify-center border-4 border-primary/20 group-hover:border-secondary transition-colors">
                          <User className="w-16 h-16 text-primary-foreground" />
                        </div>
                      )}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                      {person.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {person.designation}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
