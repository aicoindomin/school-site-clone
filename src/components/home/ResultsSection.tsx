import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Award } from "lucide-react";

interface Result {
  id: string;
  student_name: string;
  exam_type: string;
  year: number;
  percentage: number;
  rank: number | null;
  image_url: string | null;
}

export function ResultsSection() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      const { data, error } = await supabase
        .from("results")
        .select("*")
        .eq("is_featured", true)
        .order("percentage", { ascending: false })
        .limit(4);

      if (!error && data) {
        setResults(data);
      }
      setLoading(false);
    }

    fetchResults();
  }, []);

  const getRankIcon = (rank: number | null) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return null;
  };

  return (
    <section id="results" className="py-20 bg-gradient-primary text-primary-foreground">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Our Top Achievers
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Celebrating the outstanding academic achievements of our students
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="bg-primary-foreground/10 border-0 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4 bg-primary-foreground/20" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2 bg-primary-foreground/20" />
                  <Skeleton className="h-4 w-1/2 mx-auto bg-primary-foreground/20" />
                </CardContent>
              </Card>
            ))
          ) : (
            results.map((result, index) => (
              <Card 
                key={result.id} 
                className="bg-primary-foreground/10 border-0 backdrop-blur-sm hover:bg-primary-foreground/20 transition-colors group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-display text-2xl font-bold">
                      {result.percentage}%
                    </div>
                    {result.rank && (
                      <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary-foreground flex items-center justify-center">
                        {getRankIcon(result.rank)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-1">
                    {result.student_name}
                  </h3>
                  <p className="text-primary-foreground/70 text-sm">
                    {result.exam_type} {result.year}
                  </p>
                  {result.rank && (
                    <p className="text-secondary text-sm font-medium mt-2">
                      Rank #{result.rank}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
