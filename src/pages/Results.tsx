import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Award } from "lucide-react";

interface Result {
  id: string;
  student_name: string;
  exam_type: string;
  percentage: number;
  rank: number | null;
  year: number;
  class_name: string | null;
}

const classOptions = ["Prep-I", "Kg-I", "Kg-II", "Std-I", "Std-II", "Std-III", "Std-IV", "Std-V"];

const examTypes: Record<string, string> = {
  annual: "Annual Exam",
  half_yearly: "Half Yearly",
  quarterly: "Quarterly",
  unit_test: "Unit Test",
  board: "Board Exam",
};

const Results = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>("Prep-I");

  useEffect(() => {
    const fetchResults = async () => {
      const { data, error } = await supabase
        .from("results")
        .select("*")
        .order("percentage", { ascending: false });

      if (!error && data) {
        setResults(data);
      }
      setLoading(false);
    };

    fetchResults();
  }, []);

  const getResultsByClass = (className: string) => {
    return results.filter(r => r.class_name === className);
  };

  const getRankIcon = (rank: number | null) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const availableClasses = classOptions.filter(cls => 
    results.some(r => r.class_name === cls)
  );

  return (
    <MainLayout>
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Exam Results
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Celebrating academic excellence
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-20 mb-3" />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No results available
            </div>
          ) : (
            <Tabs value={selectedClass} onValueChange={setSelectedClass}>
              <TabsList className="mb-6 flex-wrap h-auto gap-2">
                {(availableClasses.length > 0 ? availableClasses : classOptions).map((cls) => (
                  <TabsTrigger key={cls} value={cls} className="px-4 py-2">
                    {cls}
                  </TabsTrigger>
                ))}
              </TabsList>

              {classOptions.map((cls) => (
                <TabsContent key={cls} value={cls}>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getResultsByClass(cls).map((result) => (
                      <Card key={result.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-3xl font-bold text-primary">{result.percentage}%</span>
                            {getRankIcon(result.rank)}
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{result.student_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {examTypes[result.exam_type] || result.exam_type} • {result.year}
                          </p>
                          {result.rank && (
                            <p className="text-sm text-primary mt-1">Rank #{result.rank}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    {getResultsByClass(cls).length === 0 && (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        No results for this class
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Results;
