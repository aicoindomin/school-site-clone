import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Trophy, User } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

interface TopAchiever {
  id: string;
  student_name: string;
  student_name_bn: string | null;
  class_label: string;
  class_label_bn: string | null;
  position: string;
  position_bn: string | null;
  image_url: string | null;
  year: number;
  order_index: number;
  is_active: boolean;
}

export function TopAchieversManager() {
  const [achievers, setAchievers] = useState<TopAchiever[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAchiever, setEditingAchiever] = useState<TopAchiever | null>(null);
  const [editLanguage, setEditLanguage] = useState<"en" | "bn">("en");
  
  // English fields
  const [studentName, setStudentName] = useState("");
  const [classLabel, setClassLabel] = useState("");
  const [position, setPosition] = useState("1st");
  // Bengali fields
  const [studentNameBn, setStudentNameBn] = useState("");
  const [classLabelBn, setClassLabelBn] = useState("");
  const [positionBn, setPositionBn] = useState("");
  // Common fields
  const [imageUrl, setImageUrl] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [orderIndex, setOrderIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAchievers();
  }, []);

  const fetchAchievers = async () => {
    const { data, error } = await supabase
      .from("top_achievers")
      .select("*")
      .order("order_index");

    if (error) {
      toast({ title: "Error fetching achievers", variant: "destructive" });
    } else {
      setAchievers(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setStudentName("");
    setClassLabel("");
    setPosition("1st");
    setStudentNameBn("");
    setClassLabelBn("");
    setPositionBn("");
    setImageUrl("");
    setYear(new Date().getFullYear());
    setOrderIndex(0);
    setIsActive(true);
    setEditingAchiever(null);
    setEditLanguage("en");
  };

  const openEditDialog = (achiever: TopAchiever) => {
    setEditingAchiever(achiever);
    setStudentName(achiever.student_name);
    setClassLabel(achiever.class_label);
    setPosition(achiever.position);
    setStudentNameBn(achiever.student_name_bn || "");
    setClassLabelBn(achiever.class_label_bn || "");
    setPositionBn(achiever.position_bn || "");
    setImageUrl(achiever.image_url || "");
    setYear(achiever.year);
    setOrderIndex(achiever.order_index);
    setIsActive(achiever.is_active);
    setEditLanguage("en");
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    const achieverData = {
      student_name: studentName,
      student_name_bn: studentNameBn.trim() || null,
      class_label: classLabel,
      class_label_bn: classLabelBn.trim() || null,
      position,
      position_bn: positionBn.trim() || null,
      image_url: imageUrl || null,
      year,
      order_index: orderIndex,
      is_active: isActive,
    };

    if (editingAchiever) {
      const { error } = await supabase
        .from("top_achievers")
        .update(achieverData)
        .eq("id", editingAchiever.id);

      if (error) {
        toast({ title: "Error updating achiever", variant: "destructive" });
      } else {
        toast({ title: "Achiever updated successfully" });
      }
    } else {
      const { error } = await supabase.from("top_achievers").insert([achieverData]);

      if (error) {
        toast({ title: "Error adding achiever", variant: "destructive" });
      } else {
        toast({ title: "Achiever added successfully" });
      }
    }

    setSaving(false);
    setDialogOpen(false);
    resetForm();
    fetchAchievers();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("top_achievers").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting achiever", variant: "destructive" });
    } else {
      toast({ title: "Achiever deleted successfully" });
      fetchAchievers();
    }
  };

  const toggleActive = async (achiever: TopAchiever) => {
    const { error } = await supabase
      .from("top_achievers")
      .update({ is_active: !achiever.is_active })
      .eq("id", achiever.id);

    if (error) {
      toast({ title: "Error updating achiever", variant: "destructive" });
    } else {
      fetchAchievers();
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={resetForm}>
            <Plus className="w-4 h-4 mr-2" /> Add Achiever
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAchiever ? "Edit Achiever" : "Add Top Achiever"}</DialogTitle>
          </DialogHeader>
          
          <BilingualToggle language={editLanguage} onLanguageChange={setEditLanguage} />
          
          <div className="space-y-4">
            {editLanguage === "en" ? (
              <>
                <div>
                  <Label>Student Name (English)</Label>
                  <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Student name in English" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Class (English)</Label>
                    <Input value={classLabel} onChange={(e) => setClassLabel(e.target.value)} placeholder="e.g., Class 5" />
                  </div>
                  <div>
                    <Label>Position (English)</Label>
                    <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g., 1st" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label>Student Name (Bengali) - ছাত্রের নাম</Label>
                  <Input value={studentNameBn} onChange={(e) => setStudentNameBn(e.target.value)} placeholder="বাংলায় ছাত্রের নাম (Optional)" />
                  <p className="text-xs text-muted-foreground mt-1">Leave empty to use auto-translation</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Class (Bengali) - শ্রেণী</Label>
                    <Input value={classLabelBn} onChange={(e) => setClassLabelBn(e.target.value)} placeholder="e.g., পঞ্চম শ্রেণী" />
                  </div>
                  <div>
                    <Label>Position (Bengali) - স্থান</Label>
                    <Input value={positionBn} onChange={(e) => setPositionBn(e.target.value)} placeholder="e.g., প্রথম" />
                  </div>
                </div>
              </>
            )}
            
            <ImageUpload value={imageUrl} onChange={setImageUrl} folder="achievers" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Year</Label>
                <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={orderIndex} onChange={(e) => setOrderIndex(Number(e.target.value))} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <Label>Active</Label>
            </div>
            <Button onClick={handleSubmit} disabled={saving} className="w-full">
              {saving ? "Saving..." : editingAchiever ? "Update" : "Add"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievers.map((achiever) => (
          <Card key={achiever.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {achiever.image_url ? (
                    <img src={achiever.image_url} alt={achiever.student_name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{achiever.student_name}</h4>
                      {achiever.student_name_bn && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">
                          বাংলা
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{achiever.class_label}</p>
                    <div className="flex items-center gap-1 text-sm text-primary">
                      <Trophy className="w-3 h-3" />
                      {achiever.position} - {achiever.year}
                    </div>
                  </div>
                </div>
                <Switch checked={achiever.is_active} onCheckedChange={() => toggleActive(achiever)} />
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(achiever)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Achiever?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(achiever.id)}>Delete</AlertDialogAction>
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
