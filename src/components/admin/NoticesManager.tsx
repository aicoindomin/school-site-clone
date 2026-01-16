import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { BilingualToggle } from "./BilingualToggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Notice {
  id: string;
  title: string;
  title_bn: string | null;
  content: string;
  content_bn: string | null;
  category: string;
  is_active: boolean;
  priority: number;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
}

const categories = [
  { value: "general", label: "General" },
  { value: "academic", label: "Academic" },
  { value: "exam", label: "Examination" },
  { value: "holiday", label: "Holiday" },
  { value: "event", label: "Event" },
  { value: "admission", label: "Admission" },
];

export function NoticesManager() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [editLanguage, setEditLanguage] = useState<"en" | "bn">("en");
  const { toast } = useToast();

  // Form state - English
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // Form state - Bengali
  const [titleBn, setTitleBn] = useState("");
  const [contentBn, setContentBn] = useState("");
  // Common fields
  const [category, setCategory] = useState("general");
  const [isActive, setIsActive] = useState(true);
  const [priority, setPriority] = useState(0);

  const fetchNotices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notices",
        variant: "destructive",
      });
    } else {
      setNotices(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTitleBn("");
    setContentBn("");
    setCategory("general");
    setIsActive(true);
    setPriority(0);
    setEditingNotice(null);
    setEditLanguage("en");
  };

  const openEditDialog = (notice: Notice) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setContent(notice.content);
    setTitleBn(notice.title_bn || "");
    setContentBn(notice.content_bn || "");
    setCategory(notice.category);
    setIsActive(notice.is_active);
    setPriority(notice.priority);
    setEditLanguage("en");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const noticeData = {
      title: title.trim(),
      content: content.trim(),
      title_bn: titleBn.trim() || null,
      content_bn: contentBn.trim() || null,
      category,
      is_active: isActive,
      priority,
    };

    let error;

    if (editingNotice) {
      const { error: updateError } = await supabase
        .from("notices")
        .update(noticeData)
        .eq("id", editingNotice.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("notices")
        .insert([noticeData]);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: editingNotice ? "Notice updated successfully" : "Notice created successfully",
      });
      setDialogOpen(false);
      resetForm();
      fetchNotices();
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("notices").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete notice",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Notice deleted successfully",
      });
      fetchNotices();
    }
  };

  const toggleActive = async (notice: Notice) => {
    const { error } = await supabase
      .from("notices")
      .update({ is_active: !notice.is_active })
      .eq("id", notice.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update notice",
        variant: "destructive",
      });
    } else {
      fetchNotices();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          {notices.length} notice{notices.length !== 1 ? "s" : ""} total
        </p>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingNotice ? "Edit Notice" : "Add New Notice"}</DialogTitle>
            </DialogHeader>
            
            <BilingualToggle language={editLanguage} onLanguageChange={setEditLanguage} />
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {editLanguage === "en" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title (English)</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Notice title in English"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content (English)</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Notice content in English..."
                      rows={12}
                      className="min-h-[250px] resize-y"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title_bn">Title (Bengali) - শিরোনাম</Label>
                    <Input
                      id="title_bn"
                      value={titleBn}
                      onChange={(e) => setTitleBn(e.target.value)}
                      placeholder="বাংলায় শিরোনাম লিখুন (Optional)"
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty to use auto-translation
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content_bn">Content (Bengali) - বিষয়বস্তু</Label>
                    <Textarea
                      id="content_bn"
                      value={contentBn}
                      onChange={(e) => setContentBn(e.target.value)}
                      placeholder="বাংলায় বিষয়বস্তু লিখুন (Optional)"
                      rows={12}
                      className="min-h-[250px] resize-y"
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty to use auto-translation
                    </p>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
                    min={0}
                    max={10}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingNotice ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {notices.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No notices yet. Click "Add Notice" to create one.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <Card key={notice.id} className={!notice.is_active ? "opacity-60" : ""}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{notice.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {categories.find(c => c.value === notice.category)?.label || notice.category}
                      </span>
                      {notice.title_bn && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">
                          বাংলা
                        </span>
                      )}
                      {!notice.is_active && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{notice.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Created: {new Date(notice.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={notice.is_active}
                      onCheckedChange={() => toggleActive(notice)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(notice)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Notice</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{notice.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(notice.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
