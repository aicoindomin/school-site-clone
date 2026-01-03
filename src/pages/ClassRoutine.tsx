import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

interface RoutineEntry {
  id: string;
  class_name: string;
  day_of_week: string;
  period_number: number;
  subject: string;
  teacher_name: string | null;
  start_time: string;
  end_time: string;
}

const classOptions = ["Prep-I", "Kg-I", "Kg-II", "Std-I", "Std-II", "Std-III", "Std-IV", "Std-V"];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ClassRoutine = () => {
  const [routine, setRoutine] = useState<RoutineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>("Prep-I");

  useEffect(() => {
    const fetchRoutine = async () => {
      const { data, error } = await supabase
        .from("class_routine")
        .select("*")
        .eq("is_active", true)
        .order("period_number");

      if (!error && data) {
        setRoutine(data);
      }
      setLoading(false);
    };

    fetchRoutine();
  }, []);

  const getRoutineForClassAndDay = (className: string, day: string) => {
    return routine
      .filter(r => r.class_name === className && r.day_of_week === day)
      .sort((a, b) => a.period_number - b.period_number);
  };

  const getRoutineByClass = (className: string) => {
    return routine.filter(r => r.class_name === className);
  };

  const availableClasses = classOptions.filter(cls => 
    routine.some(r => r.class_name === cls)
  );

  return (
    <MainLayout>
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Class Routine
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Weekly schedule for all classes
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : routine.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No class routine available
            </div>
          ) : (
            <div>
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
                    <div className="grid gap-4">
                      {getRoutineByClass(cls).length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No routine for this class
                        </div>
                      ) : (
                        daysOfWeek.map((day) => {
                          const dayRoutine = getRoutineForClassAndDay(cls, day);
                          if (dayRoutine.length === 0) return null;
                          
                          return (
                            <Card key={day}>
                              <CardHeader className="py-3 bg-primary text-primary-foreground">
                                <CardTitle className="text-lg">{day}</CardTitle>
                              </CardHeader>
                              <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="bg-muted">
                                        <th className="px-4 py-2 text-left text-sm font-medium">Period</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium">Time</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium">Subject</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium">Teacher</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {dayRoutine.map((entry) => (
                                        <tr key={entry.id} className="border-b last:border-0">
                                          <td className="px-4 py-3 text-sm">{entry.period_number}</td>
                                          <td className="px-4 py-3 text-sm">
                                            {entry.start_time} - {entry.end_time}
                                          </td>
                                          <td className="px-4 py-3 text-sm font-medium">{entry.subject}</td>
                                          <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {entry.teacher_name || "-"}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default ClassRoutine;
