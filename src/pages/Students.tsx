import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";

interface Student {
  id: string;
  name: string;
  class: string;
  section: string | null;
  roll_number: string | null;
  image_url: string | null;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("is_active", true)
        .order("class")
        .order("name");

      if (!error && data) {
        setStudents(data);
      }
      setLoading(false);
    };

    fetchStudents();
  }, []);

  return (
    <MainLayout>
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Students
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The pride of Balisai Public School
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4 text-center">
                    <Skeleton className="w-20 h-20 rounded-full mx-auto mb-3" />
                    <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No students available
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {students.map((student) => (
                <Card key={student.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    {student.image_url ? (
                      <img
                        src={student.image_url}
                        alt={student.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-primary/20"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                        <User className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                    <h3 className="font-semibold text-sm">{student.name}</h3>
                    <p className="text-primary text-xs">Class {student.class}</p>
                    {student.section && (
                      <p className="text-muted-foreground text-xs">Section: {student.section}</p>
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

export default Students;
