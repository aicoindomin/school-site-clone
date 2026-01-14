import { useState, useEffect, useMemo } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { useTranslatedTexts, useDynamicTranslation } from "@/components/TranslatedText";
import { useTranslation } from "@/hooks/useTranslation";

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

interface UsefulLink {
  id: string;
  title: string;
  url: string;
}

export function NoticesSection() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [usefulLinks, setUsefulLinks] = useState<UsefulLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const { language } = useTranslation();

  const textsToTranslate = useMemo(() => [
    "Latest Notices",
    "Useful Links",
    "No notices available",
    "No links available",
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
  const translatedLinks = useDynamicTranslation(usefulLinks, ["title"]);

  useEffect(() => {
    const fetchData = async () => {
      const [noticesRes, linksRes] = await Promise.all([
        supabase.from("notices").select("id, title, content, category, created_at").eq("is_active", true).order("priority", { ascending: false }).order("created_at", { ascending: false }).limit(5),
        supabase.from("useful_links").select("id, title, url").eq("is_active", true).order("order_index").limit(5),
      ]);
      if (noticesRes.data) setNotices(noticesRes.data);
      if (linksRes.data) setUsefulLinks(linksRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Get translated selected notice
  const translatedSelectedNotice = useMemo(() => {
    if (!selectedNotice) return null;
    return translatedNotices.find(n => n.id === selectedNotice.id) || selectedNotice;
  }, [selectedNotice, translatedNotices]);

  // Format date with locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy", { locale: language === "bn" ? bn : undefined });
  };

  return (
    <section className="py-12 bg-background">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-2xl font-display">{t["Latest Notices"]}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-6 bg-muted animate-pulse rounded" />)}</div>
              ) : translatedNotices.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">{t["No notices available"]}</div>
              ) : (
                <ul className="divide-y">
                  {translatedNotices.map((notice) => (
                    <li key={notice.id}>
                      <button onClick={() => setSelectedNotice(notices.find(n => n.id === notice.id) || null)} className="flex items-center gap-3 p-4 hover:bg-muted transition-colors group w-full text-left">
                        <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-foreground group-hover:text-primary transition-colors">{notice.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-2xl font-display">{t["Useful Links"]}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-6 bg-muted animate-pulse rounded" />)}</div>
              ) : translatedLinks.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">{t["No links available"]}</div>
              ) : (
                <ul className="divide-y">
                  {translatedLinks.map((link) => (
                    <li key={link.id}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 hover:bg-muted transition-colors group">
                        <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-foreground group-hover:text-primary transition-colors flex-1">{link.title}</span>
                        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <Badge className="w-fit mb-2">{translatedSelectedNotice?.category}</Badge>
            <DialogTitle className="text-xl">{translatedSelectedNotice?.title}</DialogTitle>
            {translatedSelectedNotice && <p className="text-sm text-muted-foreground">{t["Posted on"]} {formatDate(translatedSelectedNotice.created_at)}</p>}
          </DialogHeader>
          <div className="mt-4 text-foreground whitespace-pre-wrap">{translatedSelectedNotice?.content}</div>
        </DialogContent>
      </Dialog>
    </section>
  );
}