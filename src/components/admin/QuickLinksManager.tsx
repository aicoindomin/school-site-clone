import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Link } from "lucide-react";

interface QuickLink {
  id: string;
  title: string;
  url: string;
  order_index: number;
  is_active: boolean;
}

export function QuickLinksManager() {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    const { data, error } = await supabase
      .from("quick_links")
      .select("*")
      .order("order_index");

    if (error) {
      toast({ title: "Error fetching links", variant: "destructive" });
    } else {
      setLinks(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setOrderIndex(0);
    setIsActive(true);
    setEditingLink(null);
  };

  const openEditDialog = (link: QuickLink) => {
    setEditingLink(link);
    setTitle(link.title);
    setUrl(link.url);
    setOrderIndex(link.order_index);
    setIsActive(link.is_active);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    const linkData = { title, url, order_index: orderIndex, is_active: isActive };

    if (editingLink) {
      const { error } = await supabase
        .from("quick_links")
        .update(linkData)
        .eq("id", editingLink.id);

      if (error) {
        toast({ title: "Error updating link", variant: "destructive" });
      } else {
        toast({ title: "Link updated successfully" });
      }
    } else {
      const { error } = await supabase.from("quick_links").insert([linkData]);

      if (error) {
        toast({ title: "Error adding link", variant: "destructive" });
      } else {
        toast({ title: "Link added successfully" });
      }
    }

    setSaving(false);
    setDialogOpen(false);
    resetForm();
    fetchLinks();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("quick_links").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting link", variant: "destructive" });
    } else {
      toast({ title: "Link deleted successfully" });
      fetchLinks();
    }
  };

  const toggleActive = async (link: QuickLink) => {
    const { error } = await supabase
      .from("quick_links")
      .update({ is_active: !link.is_active })
      .eq("id", link.id);

    if (error) {
      toast({ title: "Error updating link", variant: "destructive" });
    } else {
      fetchLinks();
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={resetForm}>
            <Plus className="w-4 h-4 mr-2" /> Add Quick Link
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLink ? "Edit Quick Link" : "Add Quick Link"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label>URL</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/about or https://" />
            </div>
            <div>
              <Label>Order</Label>
              <Input type="number" value={orderIndex} onChange={(e) => setOrderIndex(Number(e.target.value))} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <Label>Active</Label>
            </div>
            <Button onClick={handleSubmit} disabled={saving} className="w-full">
              {saving ? "Saving..." : editingLink ? "Update" : "Add"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {links.map((link) => (
          <Card key={link.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link className="w-4 h-4 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">{link.title}</h4>
                  <p className="text-sm text-muted-foreground">{link.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={link.is_active} onCheckedChange={() => toggleActive(link)} />
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(link)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Link?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(link.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
