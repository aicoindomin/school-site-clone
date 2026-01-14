import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";
import { BilingualToggle } from "./BilingualToggle";

interface CareerOpening {
  id: string;
  title: string;
  title_bn: string | null;
  department: string;
  department_bn: string | null;
  description: string;
  description_bn: string | null;
  requirements: string | null;
  requirements_bn: string | null;
  is_active: boolean;
  created_at: string;
}

export function CareersManager() {
  const [openings, setOpenings] = useState<CareerOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOpening, setEditingOpening] = useState<CareerOpening | null>(null);
  const [inputLanguage, setInputLanguage] = useState<"en" | "bn">("en");
  
  // English fields
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  
  // Bengali fields
  const [titleBn, setTitleBn] = useState("");
  const [departmentBn, setDepartmentBn] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [requirementsBn, setRequirementsBn] = useState("");
  
  const [isActive, setIsActive] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOpenings();
  }, []);

  const fetchOpenings = async () => {
    const { data, error } = await supabase
      .from("career_openings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching career openings", variant: "destructive" });
    } else {
      setOpenings(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setTitleBn("");
    setDepartment("");
    setDepartmentBn("");
    setDescription("");
    setDescriptionBn("");
    setRequirements("");
    setRequirementsBn("");
    setIsActive(true);
    setEditingOpening(null);
    setInputLanguage("en");
  };

  const openEditDialog = (opening: CareerOpening) => {
    setEditingOpening(opening);
    setTitle(opening.title);
    setTitleBn(opening.title_bn || "");
    setDepartment(opening.department);
    setDepartmentBn(opening.department_bn || "");
    setDescription(opening.description);
    setDescriptionBn(opening.description_bn || "");
    setRequirements(opening.requirements || "");
    setRequirementsBn(opening.requirements_bn || "");
    setIsActive(opening.is_active);
    setInputLanguage("en");
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !department.trim() || !description.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setSaving(true);
    const openingData = {
      title: title.trim(),
      title_bn: titleBn.trim() || null,
      department: department.trim(),
      department_bn: departmentBn.trim() || null,
      description: description.trim(),
      description_bn: descriptionBn.trim() || null,
      requirements: requirements.trim() || null,
      requirements_bn: requirementsBn.trim() || null,
      is_active: isActive,
    };

    if (editingOpening) {
      const { error } = await supabase
        .from("career_openings")
        .update(openingData)
        .eq("id", editingOpening.id);

      if (error) {
        toast({ title: "Error updating career opening", variant: "destructive" });
      } else {
        toast({ title: "Career opening updated successfully" });
      }
    } else {
      const { error } = await supabase.from("career_openings").insert([openingData]);

      if (error) {
        toast({ title: "Error adding career opening", variant: "destructive" });
      } else {
        toast({ title: "Career opening added successfully" });
      }
    }

    setSaving(false);
    setDialogOpen(false);
    resetForm();
    fetchOpenings();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("career_openings").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting career opening", variant: "destructive" });
    } else {
      toast({ title: "Career opening deleted successfully" });
      fetchOpenings();
    }
  };

  const toggleActive = async (opening: CareerOpening) => {
    const { error } = await supabase
      .from("career_openings")
      .update({ is_active: !opening.is_active })
      .eq("id", opening.id);

    if (error) {
      toast({ title: "Error updating career opening", variant: "destructive" });
    } else {
      fetchOpenings();
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={resetForm}>
            <Plus className="w-4 h-4 mr-2" /> Add Career Opening
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingOpening ? "Edit Career Opening" : "Add Career Opening"}</DialogTitle>
          </DialogHeader>
          
          <BilingualToggle language={inputLanguage} onLanguageChange={setInputLanguage} />
          
          <div className="space-y-4">
            {inputLanguage === "en" ? (
              <>
                <div>
                  <Label>Job Title *</Label>
                  <Input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g., Primary Teacher"
                  />
                </div>
                <div>
                  <Label>Department *</Label>
                  <Input 
                    value={department} 
                    onChange={(e) => setDepartment(e.target.value)} 
                    placeholder="e.g., Teaching Staff"
                  />
                </div>
                <div>
                  <Label>Description *</Label>
                  <Textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    rows={4}
                    placeholder="Job description..."
                  />
                </div>
                <div>
                  <Label>Requirements</Label>
                  <Textarea 
                    value={requirements} 
                    onChange={(e) => setRequirements(e.target.value)} 
                    rows={3}
                    placeholder="List of requirements..."
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label>পদের নাম (Bengali)</Label>
                  <Input 
                    value={titleBn} 
                    onChange={(e) => setTitleBn(e.target.value)} 
                    placeholder="e.g., প্রাথমিক শিক্ষক"
                  />
                </div>
                <div>
                  <Label>বিভাগ (Bengali)</Label>
                  <Input 
                    value={departmentBn} 
                    onChange={(e) => setDepartmentBn(e.target.value)} 
                    placeholder="e.g., শিক্ষণ কর্মী"
                  />
                </div>
                <div>
                  <Label>বিবরণ (Bengali)</Label>
                  <Textarea 
                    value={descriptionBn} 
                    onChange={(e) => setDescriptionBn(e.target.value)} 
                    rows={4}
                    placeholder="কাজের বিবরণ..."
                  />
                </div>
                <div>
                  <Label>প্রয়োজনীয়তা (Bengali)</Label>
                  <Textarea 
                    value={requirementsBn} 
                    onChange={(e) => setRequirementsBn(e.target.value)} 
                    rows={3}
                    placeholder="প্রয়োজনীয়তার তালিকা..."
                  />
                </div>
              </>
            )}
            
            <div className="flex items-center gap-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <Label>Active (Show on website)</Label>
            </div>
            <Button onClick={handleSubmit} disabled={saving} className="w-full">
              {saving ? "Saving..." : editingOpening ? "Update" : "Add"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {openings.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No career openings yet. Click "Add Career Opening" to create one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {openings.map((opening) => (
            <Card key={opening.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{opening.title}</h4>
                      {!opening.is_active && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-primary">{opening.department}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {opening.description}
                    </p>
                  </div>
                  <Switch checked={opening.is_active} onCheckedChange={() => toggleActive(opening)} />
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(opening)}>
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
                        <AlertDialogTitle>Delete Career Opening?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(opening.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
