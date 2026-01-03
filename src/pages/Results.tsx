import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Award } from "lucide-react";

interface Result {
  id: string;
  student_name: string;
  exam_type: string;
  year: number;
  percentage: number;
  rank: number | null;
  image_url: string | null;
  class_name: string | null;
}

const examTypeLabels: Record<string, string> = {
  annual: "Annual Exam",
  half_yearly: "Half Yearly",
  quarterly: "Quarterly",
  unit_test: "Unit Test",
  board: "Board Exam",
};

const Results = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterClass, setFilterClass] = useState<string>("");

  useEffect(() => {
    const fetchResults = async () => {
      const { data, error } = await supabase
        .from("results")
        .select("*")
        .order("year", { ascending: false })
        .order("percentage", { ascending: false });

      if (!error && data) {
        setResults(data);
      }
      setLoading(false);
    };

    fetchResults();
  }, []);

  const getRankIcon = (rank: number | null) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const uniqueClasses = [...new Set(results.map((r) => r.class_name).filter(Boolean))];
  const filteredResults = filterClass
    ? results.filter((r) => r.class_name === filterClass)
    : results;

  return (
    <MainLayout>
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Exam Results
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Academic achievements of our students
            </p>
          </div>

          {/* Filter */}
          <div className="flex justify-center mb-8">
            <Select value={filterClass || "all"} onValueChange={(val) => setFilterClass(val === "all" ? "" : val)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {uniqueClasses.map((cls) => (
                  <SelectItem key={cls} value={cls!}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-8 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No results available
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((result) => (
                <Card key={result.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{result.student_name}</h3>
                        <p className="text-muted-foreground text-sm">
                          {result.class_name && `${result.class_name} • `}
                          {examTypeLabels[result.exam_type] || result.exam_type} - {result.year}
                        </p>
                      </div>
                      {getRankIcon(result.rank)}
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-primary">{result.percentage}%</span>
                      {result.rank && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          Rank: {result.rank}
                        </span>
                      )}
                    </div>
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

export default Results;
