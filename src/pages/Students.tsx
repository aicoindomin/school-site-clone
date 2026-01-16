import { useState, useEffect, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import { useTranslatedTexts, useDynamicTranslation } from "@/components/TranslatedText";

interface Student {
  id: string;
  name: string;
  class: string;
  section: string | null;
  roll_number: string | null;
  image_url: string | null;
}

const classOptions = ["Prep-I", "Kg-I", "Kg-II", "Std-I", "Std-II", "Std-III", "Std-IV", "Std-V"];

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>("Prep-I");

  // Static text translations
  const textsToTranslate = useMemo(() => [
    "Our Students",
    "The pride of Balisai Public School",
    "No students available",
    "No students in this class",
    "Section"
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
  const translatedStudents = useDynamicTranslation(students, ["name"]);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("is_active", true)
        .order("class")
        .order("roll_number");

      if (!error && data) {
        setStudents(data);
      }
      setLoading(false);
    };

    fetchStudents();
  }, []);

  const getStudentsByClass = (className: string) => {
    // Filter students by class and maintain roll_number order from the database
    const classStudents: { translated: Student; original: Student }[] = [];
    students.forEach((student, index) => {
      if (student.class === className) {
        classStudents.push({
          translated: translatedStudents[index],
          original: student
        });
      }
    });
    
    // Sort by roll_number (handle null and non-numeric values)
    classStudents.sort((a, b) => {
      const rollA = parseInt(a.original.roll_number || "999", 10);
      const rollB = parseInt(b.original.roll_number || "999", 10);
      return rollA - rollB;
    });
    
    return classStudents;
  };

  const availableClasses = classOptions.filter(cls => 
    students.some(s => s.class === cls)
  );

  return (
    <MainLayout>
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t["Our Students"]}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t["The pride of Balisai Public School"]}
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
          ) : translatedStudents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {t["No students available"]}
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
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {getStudentsByClass(cls).map(({ translated, original }) => (
                      <div key={original.id} className="flex flex-col items-center p-2 rounded-2xl bg-card hover:shadow-md transition-shadow">
                        {original.image_url ? (
                          <img
                            src={original.image_url}
                            alt={translated.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-primary/20"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
                          </div>
                        )}
                        <h3 className="font-medium text-xs mt-2 text-center leading-tight">{translated.name}</h3>
                        <p className="text-primary text-[10px]">{translated.class}</p>
                        {original.section && (
                          <p className="text-muted-foreground text-[10px]">{t["Section"]}: {original.section}</p>
                        )}
                      </div>
                    ))}
                    {getStudentsByClass(cls).length === 0 && (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        {t["No students in this class"]}
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

export default Students;