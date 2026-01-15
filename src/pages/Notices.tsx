import { useState, useEffect, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { Bell } from "lucide-react";
import { useTranslatedTexts, useDynamicTranslation } from "@/components/TranslatedText";
import { useTranslation } from "@/hooks/useTranslation";

interface Notice {
  id: string;
  title: string;
  title_bn?: string | null;
  content: string;
  content_bn?: string | null;
  category: string;
  created_at: string;
  priority: number;
}

const Notices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const { language } = useTranslation();

  // Static text translations
  const textsToTranslate = useMemo(() => [
    "Notices",
    "Latest announcements and updates from the school",
    "No Notices",
    "There are no notices at the moment.",
    "Important",
    "Posted on"
  ], []);

  const translatedTexts = useTranslatedTexts(textsToTranslate);
  
  const t = useMemo(() => {
    const map: Record<string, string> = {};
    textsToTranslate.forEach((text, index) => {
      map[text] = translatedTexts[index] || text;
    });
    return map;
  }, [textsToTranslate, translatedTexts]);

  // Translate dynamic database content
  const translatedNotices = useDynamicTranslation(notices, ["title", "content", "category"]);

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
    switch (category.toLowerCase()) {
      case "admission": return "bg-green-500";
      case "exam": return "bg-blue-500";
      case "holiday": return "bg-orange-500";
      case "event": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  // Get translated selected notice
  const translatedSelectedNotice = useMemo(() => {
    if (!selectedNotice) return null;
    return translatedNotices.find(n => n.id === selectedNotice.id) || selectedNotice;
  }, [selectedNotice, translatedNotices]);

  // Format date with locale
  const formatDate = (dateString: string, formatStr: string = "MMM d, yyyy") => {
    const date = new Date(dateString);
    return format(date, formatStr, { locale: language === "bn" ? bn : undefined });
  };

  return (
    <MainLayout>
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t["Notices"]}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t["Latest announcements and updates from the school"]}
            </p>
          </div>

          {loading ? (
            <div className="space-y-4 max-w-3xl mx-auto">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : translatedNotices.length === 0 ? (
            <Card className="max-w-lg mx-auto text-center">
              <CardContent className="py-12">
                <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{t["No Notices"]}</h3>
                <p className="text-muted-foreground">
                  {t["There are no notices at the moment."]}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {translatedNotices.map((notice, index) => (
                <Card 
                  key={notice.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedNotice(notices[index])}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCategoryColor(notices[index].category)}>
                            {notice.category}
                          </Badge>
                          {notices[index].priority > 0 && (
                            <Badge variant="destructive">{t["Important"]}</Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{notice.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {notice.content}
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground flex-shrink-0">
                        {formatDate(notice.created_at)}
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
              {translatedSelectedNotice && (
                <>
                  <Badge className={getCategoryColor(selectedNotice?.category || "")}>
                    {translatedSelectedNotice.category}
                  </Badge>
                  {selectedNotice && selectedNotice.priority > 0 && (
                    <Badge variant="destructive">{t["Important"]}</Badge>
                  )}
                </>
              )}
            </div>
            <DialogTitle className="text-xl">{translatedSelectedNotice?.title}</DialogTitle>
            {translatedSelectedNotice && (
              <p className="text-sm text-muted-foreground">
                {t["Posted on"]} {formatDate(translatedSelectedNotice.created_at, "MMMM d, yyyy")}
              </p>
            )}
          </DialogHeader>
          <div className="mt-4 text-foreground whitespace-pre-wrap">
            {translatedSelectedNotice?.content}
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Notices;