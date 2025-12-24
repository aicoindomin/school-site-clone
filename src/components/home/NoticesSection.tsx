import { ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const notices = [
  { title: "Admission Open for Session 2025-26", link: "/admission" },
  { title: "Annual Sports Day - 15th January 2025", link: "/notices" },
  { title: "Winter Vacation: 24th Dec to 5th Jan", link: "/notices" },
  { title: "Parent-Teacher Meeting - 20th January", link: "/notices" },
  { title: "Republic Day Celebration", link: "/notices" },
];

const usefulLinks = [
  { title: "West Bengal Board of Secondary Education", url: "https://wbbse.wb.gov.in" },
  { title: "West Bengal Council of Higher Secondary Education", url: "https://wbchse.nic.in" },
  { title: "Ministry of Education, Govt. of India", url: "https://www.education.gov.in" },
  { title: "National Council of Educational Research", url: "https://ncert.nic.in" },
  { title: "Sarva Shiksha Abhiyan, West Bengal", url: "https://www.wbprd.gov.in" },
];

export function NoticesSection() {
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
              <ul className="divide-y">
                {notices.map((notice, index) => (
                  <li key={index}>
                    <Link
                      to={notice.link}
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
            </CardContent>
          </Card>

          {/* Useful Links */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-2xl font-display">Useful Links</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {usefulLinks.map((link, index) => (
                  <li key={index}>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
