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
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Video } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
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

interface GalleryItem {
  id: string;
  title: string;
  title_bn: string | null;
  description: string | null;
  description_bn: string | null;
  image_url: string;
  category: string;
  category_bn: string | null;
  event_date: string | null;
  is_featured: boolean | null;
  media_type: string | null;
  created_at: string;
}

const categories = [
  { value: "events", label: "Events" },
  { value: "sports", label: "Sports" },
  { value: "cultural", label: "Cultural" },
  { value: "academic", label: "Academic" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "celebrations", label: "Celebrations" },
];

export function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editLanguage, setEditLanguage] = useState<"en" | "bn">("en");
  const { toast } = useToast();

  // English form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Bengali form state
  const [titleBn, setTitleBn] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  // Common fields
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("events");
  const [eventDate, setEventDate] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch gallery items",
        variant: "destructive",
      });
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTitleBn("");
    setDescriptionBn("");
    setImageUrl("");
    setCategory("events");
    setEventDate("");
    setIsFeatured(false);
    setMediaType("image");
    setEditingItem(null);
    setEditLanguage("en");
  };

  const openEditDialog = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description || "");
    setTitleBn(item.title_bn || "");
    setDescriptionBn(item.description_bn || "");
    setImageUrl(item.image_url);
    setCategory(item.category);
    setEventDate(item.event_date || "");
    setIsFeatured(item.is_featured || false);
    setMediaType((item.media_type as "image" | "video") || "image");
    setEditLanguage("en");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const itemData = {
      title: title.trim(),
      title_bn: titleBn.trim() || null,
      description: description.trim() || null,
      description_bn: descriptionBn.trim() || null,
      image_url: imageUrl.trim(),
      category,
      event_date: eventDate || null,
      is_featured: isFeatured,
      media_type: mediaType,
    };

    let error;

    if (editingItem) {
      const { error: updateError } = await supabase
        .from("gallery")
        .update(itemData)
        .eq("id", editingItem.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("gallery")
        .insert([itemData]);
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
        description: editingItem ? "Image updated successfully" : "Image added successfully",
      });
      setDialogOpen(false);
      resetForm();
      fetchItems();
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("gallery").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
      fetchItems();
    }
  };

  const toggleFeatured = async (item: GalleryItem) => {
    const { error } = await supabase
      .from("gallery")
      .update({ is_featured: !item.is_featured })
      .eq("id", item.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update image",
        variant: "destructive",
      });
    } else {
      fetchItems();
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
          {items.length} image{items.length !== 1 ? "s" : ""} total
        </p>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Image" : "Add New Image"}</DialogTitle>
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
                      placeholder="Image title in English"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (English - Optional)</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Image description in English..."
                      rows={3}
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
                    <p className="text-xs text-muted-foreground">Leave empty to use auto-translation</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description_bn">Description (Bengali) - বিবরণ</Label>
                    <Textarea
                      id="description_bn"
                      value={descriptionBn}
                      onChange={(e) => setDescriptionBn(e.target.value)}
                      placeholder="বাংলায় বিবরণ লিখুন (Optional)"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">Leave empty to use auto-translation</p>
                  </div>
                </>
              )}

              <ImageUpload value={imageUrl} onChange={setImageUrl} folder="gallery" />

              {/* Media Type Selector */}
              <div className="space-y-2">
                <Label>Media Type</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      value="image"
                      checked={mediaType === "image"}
                      onChange={() => setMediaType("image")}
                      className="w-4 h-4 text-primary"
                    />
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-sm">Image</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      value="video"
                      checked={mediaType === "video"}
                      onChange={() => setMediaType("video")}
                      className="w-4 h-4 text-primary"
                    />
                    <Video className="w-4 h-4" />
                    <span className="text-sm">Video</span>
                  </label>
                </div>
                {mediaType === "video" && (
                  <p className="text-xs text-muted-foreground">
                    Paste a video URL (MP4 recommended). Videos will autoplay muted with volume control.
                  </p>
                )}
              </div>

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
                  <Label htmlFor="event_date">Event Date</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingItem ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No gallery images yet. Click "Add Image" to upload one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video relative bg-muted">
                {item.image_url ? (
                  item.media_type === "video" ? (
                    <video
                      src={item.image_url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                {item.is_featured && (
                  <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded bg-primary text-primary-foreground">
                    Featured
                  </span>
                )}
                {item.media_type === "video" && (
                  <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-red-500 text-white flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    Video
                  </span>
                )}
              </div>
              <CardContent className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{item.title}</h3>
                      {item.title_bn && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">
                          বাংলা
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {categories.find(c => c.value === item.category)?.label || item.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Switch
                      checked={item.is_featured || false}
                      onCheckedChange={() => toggleFeatured(item)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
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
                          <AlertDialogTitle>Delete Image</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{item.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)}>
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
