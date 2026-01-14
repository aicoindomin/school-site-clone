import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Pencil, FileText, Eye, EyeOff } from "lucide-react";
import { BilingualToggle } from "./BilingualToggle";

interface WebsiteContent {
  id: string;
  section_key: string;
  title: string;
  title_bn: string | null;
  content: string | null;
  content_bn: string | null;
  meta_description: string | null;
  meta_description_bn: string | null;
  is_published: boolean;
}

export function WebsiteContentManager() {
  const [contents, setContents] = useState<WebsiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<WebsiteContent | null>(null);
  const [inputLanguage, setInputLanguage] = useState<"en" | "bn">("en");
  
  // English fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  
  // Bengali fields
  const [titleBn, setTitleBn] = useState("");
  const [contentBn, setContentBn] = useState("");
  const [metaDescriptionBn, setMetaDescriptionBn] = useState("");
  
  const [isPublished, setIsPublished] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    const { data, error } = await supabase
      .from("website_content")
      .select("*")
      .order("section_key");

    if (error) {
      toast({ title: "Error fetching content", variant: "destructive" });
    } else {
      setContents(data || []);
    }
    setLoading(false);
  };

  const openEditDialog = (item: WebsiteContent) => {
    setEditingContent(item);
    setTitle(item.title);
    setTitleBn(item.title_bn || "");
    setContent(item.content || "");
    setContentBn(item.content_bn || "");
    setMetaDescription(item.meta_description || "");
    setMetaDescriptionBn(item.meta_description_bn || "");
    setIsPublished(item.is_published);
    setInputLanguage("en");
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!editingContent) return;
    
    setSaving(true);
    const { error } = await supabase
      .from("website_content")
      .update({
        title,
        title_bn: titleBn || null,
        content,
        content_bn: contentBn || null,
        meta_description: metaDescription || null,
        meta_description_bn: metaDescriptionBn || null,
        is_published: isPublished,
      })
      .eq("id", editingContent.id);

    if (error) {
      toast({ title: "Error updating content", variant: "destructive" });
    } else {
      toast({ title: "Content updated successfully" });
    }

    setSaving(false);
    setDialogOpen(false);
    fetchContents();
  };

  const togglePublished = async (item: WebsiteContent) => {
    const { error } = await supabase
      .from("website_content")
      .update({ is_published: !item.is_published })
      .eq("id", item.id);

    if (error) {
      toast({ title: "Error updating content", variant: "destructive" });
    } else {
      fetchContents();
    }
  };

  const getSectionLabel = (key: string) => {
    const labels: Record<string, string> = {
      about: "About Us",
      contact: "Contact Information",
      academics: "Academics",
      admission: "Admission",
      careers: "Careers",
    };
    return labels[key] || key;
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Edit the main content sections of your website. Changes will be reflected on the respective pages.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {contents.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {getSectionLabel(item.section_key)}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePublished(item)}
                  >
                    {item.is_published ? (
                      <Eye className="w-4 h-4 text-green-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="font-medium mb-1">{item.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.content || "No content yet..."}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit {editingContent && getSectionLabel(editingContent.section_key)}
            </DialogTitle>
          </DialogHeader>
          
          <BilingualToggle value={inputLanguage} onChange={setInputLanguage} />
          
          <div className="space-y-4">
            {inputLanguage === "en" ? (
              <>
                <div>
                  <Label>Page Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    placeholder="Write the content here..."
                  />
                </div>
                <div>
                  <Label>Meta Description (SEO)</Label>
                  <Textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={2}
                    placeholder="Brief description for search engines..."
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label>পাতার শিরোনাম (Bengali)</Label>
                  <Input value={titleBn} onChange={(e) => setTitleBn(e.target.value)} />
                </div>
                <div>
                  <Label>বিষয়বস্তু (Bengali)</Label>
                  <Textarea
                    value={contentBn}
                    onChange={(e) => setContentBn(e.target.value)}
                    rows={10}
                    placeholder="বাংলায় বিষয়বস্তু লিখুন..."
                  />
                </div>
                <div>
                  <Label>মেটা বিবরণ (Bengali)</Label>
                  <Textarea
                    value={metaDescriptionBn}
                    onChange={(e) => setMetaDescriptionBn(e.target.value)}
                    rows={2}
                    placeholder="সার্চ ইঞ্জিনের জন্য সংক্ষিপ্ত বিবরণ..."
                  />
                </div>
              </>
            )}
            
            <div className="flex items-center gap-2">
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
              <Label>Published</Label>
            </div>
            <Button onClick={handleSubmit} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Update Content"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
