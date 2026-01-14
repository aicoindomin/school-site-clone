import { useState, useEffect, useMemo } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useTranslatedTexts } from "@/components/TranslatedText";

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
              ) : notices.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">{t["No notices available"]}</div>
              ) : (
                <ul className="divide-y">
                  {notices.map((notice) => (
                    <li key={notice.id}>
                      <button onClick={() => setSelectedNotice(notice)} className="flex items-center gap-3 p-4 hover:bg-muted transition-colors group w-full text-left">
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
              ) : usefulLinks.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">{t["No links available"]}</div>
              ) : (
                <ul className="divide-y">
                  {usefulLinks.map((link) => (
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
            <Badge className="w-fit mb-2">{selectedNotice?.category}</Badge>
            <DialogTitle className="text-xl">{selectedNotice?.title}</DialogTitle>
            {selectedNotice && <p className="text-sm text-muted-foreground">{t["Posted on"]} {format(new Date(selectedNotice.created_at), "MMMM d, yyyy")}</p>}
          </DialogHeader>
          <div className="mt-4 text-foreground whitespace-pre-wrap">{selectedNotice?.content}</div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
