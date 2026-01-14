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
import { Plus, Pencil, Trash2, User, Mail, Phone } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { BilingualToggle } from "./BilingualToggle";

interface Faculty {
  id: string;
  name: string;
  name_bn: string | null;
  designation: string;
  designation_bn: string | null;
  department: string | null;
  department_bn: string | null;
  qualification: string | null;
  qualification_bn: string | null;
  image_url: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  bio_bn: string | null;
  order_index: number;
  is_active: boolean;
}

export function FacultyManager() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [inputLanguage, setInputLanguage] = useState<"en" | "bn">("en");
  
  // English fields
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [qualification, setQualification] = useState("");
  const [bio, setBio] = useState("");
  
  // Bengali fields
  const [nameBn, setNameBn] = useState("");
  const [designationBn, setDesignationBn] = useState("");
  const [departmentBn, setDepartmentBn] = useState("");
  const [qualificationBn, setQualificationBn] = useState("");
  const [bioBn, setBioBn] = useState("");
  
  // Common fields
  const [imageUrl, setImageUrl] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    const { data, error } = await supabase
      .from("faculty")
      .select("*")
      .order("order_index");

    if (error) {
      toast({ title: "Error fetching faculty", variant: "destructive" });
    } else {
      setFaculty(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setName("");
    setNameBn("");
    setDesignation("");
    setDesignationBn("");
    setDepartment("");
    setDepartmentBn("");
    setQualification("");
    setQualificationBn("");
    setImageUrl("");
    setEmail("");
    setPhone("");
    setBio("");
    setBioBn("");
    setOrderIndex(0);
    setIsActive(true);
    setEditingFaculty(null);
    setInputLanguage("en");
  };

  const openEditDialog = (member: Faculty) => {
    setEditingFaculty(member);
    setName(member.name);
    setNameBn(member.name_bn || "");
    setDesignation(member.designation);
    setDesignationBn(member.designation_bn || "");
    setDepartment(member.department || "");
    setDepartmentBn(member.department_bn || "");
    setQualification(member.qualification || "");
    setQualificationBn(member.qualification_bn || "");
    setImageUrl(member.image_url || "");
    setEmail(member.email || "");
    setPhone(member.phone || "");
    setBio(member.bio || "");
    setBioBn(member.bio_bn || "");
    setOrderIndex(member.order_index);
    setIsActive(member.is_active);
    setInputLanguage("en");
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    const facultyData = {
      name,
      name_bn: nameBn || null,
      designation,
      designation_bn: designationBn || null,
      department: department || null,
      department_bn: departmentBn || null,
      qualification: qualification || null,
      qualification_bn: qualificationBn || null,
      image_url: imageUrl || null,
      email: email || null,
      phone: phone || null,
      bio: bio || null,
      bio_bn: bioBn || null,
      order_index: orderIndex,
      is_active: isActive,
    };

    if (editingFaculty) {
      const { error } = await supabase
        .from("faculty")
        .update(facultyData)
        .eq("id", editingFaculty.id);

      if (error) {
        toast({ title: "Error updating faculty", variant: "destructive" });
      } else {
        toast({ title: "Faculty updated successfully" });
      }
    } else {
      const { error } = await supabase.from("faculty").insert([facultyData]);

      if (error) {
        toast({ title: "Error adding faculty", variant: "destructive" });
      } else {
        toast({ title: "Faculty added successfully" });
      }
    }

    setSaving(false);
    setDialogOpen(false);
    resetForm();
    fetchFaculty();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("faculty").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting faculty", variant: "destructive" });
    } else {
      toast({ title: "Faculty deleted successfully" });
      fetchFaculty();
    }
  };

  const toggleActive = async (member: Faculty) => {
    const { error } = await supabase
      .from("faculty")
      .update({ is_active: !member.is_active })
      .eq("id", member.id);

    if (error) {
      toast({ title: "Error updating faculty", variant: "destructive" });
    } else {
      fetchFaculty();
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={resetForm}>
            <Plus className="w-4 h-4 mr-2" /> Add Faculty
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingFaculty ? "Edit Faculty" : "Add Faculty Member"}</DialogTitle>
          </DialogHeader>
          
          <BilingualToggle value={inputLanguage} onChange={setInputLanguage} />
          
          <div className="space-y-4">
            <div>
              <Label>Photo</Label>
              <ImageUpload
                value={imageUrl}
                onChange={setImageUrl}
                folder="faculty"
              />
            </div>
            
            {inputLanguage === "en" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <Label>Designation</Label>
                    <Input value={designation} onChange={(e) => setDesignation(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Department</Label>
                    <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
                  </div>
                  <div>
                    <Label>Qualification</Label>
                    <Input value={qualification} onChange={(e) => setQualification(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>নাম (Bengali)</Label>
                    <Input value={nameBn} onChange={(e) => setNameBn(e.target.value)} />
                  </div>
                  <div>
                    <Label>পদবী (Bengali)</Label>
                    <Input value={designationBn} onChange={(e) => setDesignationBn(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>বিভাগ (Bengali)</Label>
                    <Input value={departmentBn} onChange={(e) => setDepartmentBn(e.target.value)} />
                  </div>
                  <div>
                    <Label>যোগ্যতা (Bengali)</Label>
                    <Input value={qualificationBn} onChange={(e) => setQualificationBn(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>পরিচিতি (Bengali)</Label>
                  <Textarea value={bioBn} onChange={(e) => setBioBn(e.target.value)} rows={3} />
                </div>
              </>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
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
              {saving ? "Saving..." : editingFaculty ? "Update" : "Add"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {faculty.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {member.image_url ? (
                  <img src={member.image_url} alt={member.name} className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-sm text-primary">{member.designation}</p>
                  {member.department && (
                    <p className="text-sm text-muted-foreground">{member.department}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    {member.email && <Mail className="w-3 h-3" />}
                    {member.phone && <Phone className="w-3 h-3" />}
                  </div>
                </div>
                <Switch checked={member.is_active} onCheckedChange={() => toggleActive(member)} />
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(member)}>
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
                      <AlertDialogTitle>Delete Faculty?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(member.id)}>Delete</AlertDialogAction>
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
