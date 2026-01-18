import { useState, useEffect, useMemo } from "react";
import { ChevronRight, ExternalLink, Bell, Link2, Sparkles } from "lucide-react";
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
  title_bn?: string | null;
  content: string;
  content_bn?: string | null;
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
        supabase.from("notices").select("id, title, title_bn, content, content_bn, category, created_at").eq("is_active", true).order("priority", { ascending: false }).order("created_at", { ascending: false }).limit(5),
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
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-70" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl float-bubble" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl float-bubble-delayed" />
      
      <div className="container relative">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Notices Card */}
          <div className="premium-card p-1 hover-shadow-3d">
            <div className="bg-card rounded-xl h-full">
              {/* Header with gradient */}
              <div className="p-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">{t["Latest Notices"]}</h2>
                    <p className="text-sm text-muted-foreground">Stay updated with school announcements</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-2">
                {loading ? (
                  <div className="p-4 space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-14 bg-muted animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : translatedNotices.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                      <Bell className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">{t["No notices available"]}</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-border/50">
                    {translatedNotices.map((notice, index) => (
                      <li key={notice.id} className={`animate-fade-in-up stagger-${index + 1}`} style={{ animationFillMode: 'both' }}>
                        <button 
                          onClick={() => setSelectedNotice(notices.find(n => n.id === notice.id) || null)} 
                          className="flex items-center gap-4 p-4 hover:bg-primary/5 transition-all duration-300 group w-full text-left rounded-xl"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                            <ChevronRight className="w-5 h-5 text-primary group-hover:text-white" />
                          </div>
                          <span className="text-foreground group-hover:text-primary transition-colors font-medium line-clamp-2 flex-1">{notice.title}</span>
                          <Sparkles className="w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Useful Links Card */}
          <div className="premium-card p-1 hover-shadow-3d">
            <div className="bg-card rounded-xl h-full">
              {/* Header with gradient */}
              <div className="p-5 border-b border-border bg-gradient-to-r from-secondary/10 to-transparent rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-lg shadow-secondary/20">
                    <Link2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">{t["Useful Links"]}</h2>
                    <p className="text-sm text-muted-foreground">Quick access to important resources</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-2">
                {loading ? (
                  <div className="p-4 space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-14 bg-muted animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : translatedLinks.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                      <Link2 className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">{t["No links available"]}</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-border/50">
                    {translatedLinks.map((link, index) => (
                      <li key={link.id} className={`animate-fade-in-up stagger-${index + 1}`} style={{ animationFillMode: 'both' }}>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-4 p-4 hover:bg-secondary/5 transition-all duration-300 group rounded-xl"
                        >
                          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary group-hover:scale-110 transition-all duration-300">
                            <ChevronRight className="w-5 h-5 text-secondary group-hover:text-white" />
                          </div>
                          <span className="text-foreground group-hover:text-secondary transition-colors font-medium flex-1">{link.title}</span>
                          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Detail Modal */}
      <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col glass-strong border-0 shadow-2xl">
          <DialogHeader className="flex-shrink-0 space-y-3">
            <Badge className="w-fit bg-gradient-primary text-white border-0 px-4 py-1">{translatedSelectedNotice?.category}</Badge>
            <DialogTitle className="text-2xl font-display">{translatedSelectedNotice?.title}</DialogTitle>
            {translatedSelectedNotice && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                {t["Posted on"]} {formatDate(translatedSelectedNotice.created_at)}
              </p>
            )}
          </DialogHeader>
          <div className="mt-4 text-foreground whitespace-pre-wrap overflow-y-auto flex-1 leading-relaxed text-base">
            {translatedSelectedNotice?.content}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
