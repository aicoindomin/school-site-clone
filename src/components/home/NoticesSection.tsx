import { useState, useEffect } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Notice {
  id: string;
  title: string;
  category: string;
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

  useEffect(() => {
    const fetchData = async () => {
      const [noticesRes, linksRes] = await Promise.all([
        supabase
          .from("notices")
          .select("id, title, category")
          .eq("is_active", true)
          .order("priority", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("useful_links")
          .select("id, title, url")
          .eq("is_active", true)
          .order("order_index")
          .limit(5),
      ]);

      if (noticesRes.data) setNotices(noticesRes.data);
      if (linksRes.data) setUsefulLinks(linksRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const getNoticeLink = (category: string) => {
    if (category === "admission") return "/admission";
    return "/notices";
  };

  return (
    <section className="py-12 bg-background">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Latest Notices */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-2xl font-display">Latest Notices</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-6 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : notices.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notices available
                </div>
              ) : (
                <ul className="divide-y">
                  {notices.map((notice) => (
                    <li key={notice.id}>
                      <Link
                        to={getNoticeLink(notice.category)}
                        className="flex items-center gap-3 p-4 hover:bg-muted transition-colors group"
                      >
                        <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-foreground group-hover:text-primary transition-colors">
                          {notice.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Useful Links */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-2xl font-display">Useful Links</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-6 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : usefulLinks.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No links available
                </div>
              ) : (
                <ul className="divide-y">
                  {usefulLinks.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 hover:bg-muted transition-colors group"
                      >
                        <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-foreground group-hover:text-primary transition-colors flex-1">
                          {link.title}
                        </span>
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
    </section>
  );
}
