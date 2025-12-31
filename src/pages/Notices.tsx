import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Bell } from "lucide-react";

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  priority: number;
}

const Notices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .eq("is_active", true)
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false });

      if (!error && data) {
        setNotices(data);
      }
      setLoading(false);
    };

    fetchNotices();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "admission": return "bg-green-500";
      case "exam": return "bg-blue-500";
      case "holiday": return "bg-orange-500";
      case "event": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <MainLayout>
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Notices
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Latest announcements and updates from the school
            </p>
          </div>

          {loading ? (
            <div className="space-y-4 max-w-3xl mx-auto">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : notices.length === 0 ? (
            <Card className="max-w-lg mx-auto text-center">
              <CardContent className="py-12">
                <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Notices</h3>
                <p className="text-muted-foreground">
                  There are no notices at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {notices.map((notice) => (
                <Card 
                  key={notice.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedNotice(notice)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCategoryColor(notice.category)}>
                            {notice.category}
                          </Badge>
                          {notice.priority > 0 && (
                            <Badge variant="destructive">Important</Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{notice.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {notice.content}
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground flex-shrink-0">
                        {format(new Date(notice.created_at), "MMM d, yyyy")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Notice Detail Dialog */}
      <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              {selectedNotice && (
                <>
                  <Badge className={getCategoryColor(selectedNotice.category)}>
                    {selectedNotice.category}
                  </Badge>
                  {selectedNotice.priority > 0 && (
                    <Badge variant="destructive">Important</Badge>
                  )}
                </>
              )}
            </div>
            <DialogTitle className="text-xl">{selectedNotice?.title}</DialogTitle>
            {selectedNotice && (
              <p className="text-sm text-muted-foreground">
                Posted on {format(new Date(selectedNotice.created_at), "MMMM d, yyyy")}
              </p>
            )}
          </DialogHeader>
          <div className="mt-4 text-foreground whitespace-pre-wrap">
            {selectedNotice?.content}
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Notices;
