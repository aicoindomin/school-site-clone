import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface Holiday {
  id: string;
  title: string;
  holiday_date: string;
  description: string | null;
  holiday_type: string | null;
}

const Holidays = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolidays = async () => {
      const { data, error } = await supabase
        .from("holidays")
        .select("*")
        .eq("is_active", true)
        .order("holiday_date");

      if (!error && data) {
        setHolidays(data);
      }
      setLoading(false);
    };

    fetchHolidays();
  }, []);

  const getTypeColor = (type: string | null) => {
    switch (type) {
      case "national": return "bg-orange-500";
      case "religious": return "bg-purple-500";
      case "school": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <MainLayout>
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Holiday Calendar
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              List of holidays and important dates
            </p>
          </div>

          {loading ? (
            <div className="space-y-4 max-w-3xl mx-auto">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : holidays.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No holidays available
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {holidays.map((holiday) => (
                <Card key={holiday.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-primary mb-1" />
                        <span className="text-xs font-medium text-primary">
                          {format(new Date(holiday.holiday_date), "MMM")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{holiday.title}</h3>
                          {holiday.holiday_type && (
                            <Badge className={getTypeColor(holiday.holiday_type)}>
                              {holiday.holiday_type}
                            </Badge>
                          )}
                        </div>
                        <p className="text-primary text-sm font-medium">
                          {format(new Date(holiday.holiday_date), "EEEE, MMMM d, yyyy")}
                        </p>
                        {holiday.description && (
                          <p className="text-muted-foreground text-sm mt-2">
                            {holiday.description}
                          </p>
                        )}
                      </div>
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

export default Holidays;
