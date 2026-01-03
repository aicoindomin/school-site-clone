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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, Pencil, Trash2, User } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

interface Student {
  id: string;
  name: string;
  class: string;
  section: string | null;
  roll_number: string | null;
  image_url: string | null;
  parent_name: string | null;
  parent_contact: string | null;
  admission_year: number | null;
  is_active: boolean;
}

export function StudentsManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [section, setSection] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [admissionYear, setAdmissionYear] = useState(new Date().getFullYear());
  const [isActive, setIsActive] = useState(true);
  const [filterClass, setFilterClass] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("class")
      .order("name");

    if (error) {
      toast({ title: "Error fetching students", variant: "destructive" });
    } else {
      setStudents(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setName("");
    setStudentClass("");
    setSection("");
    setRollNumber("");
    setImageUrl("");
    setParentName("");
    setParentContact("");
    setAdmissionYear(new Date().getFullYear());
    setIsActive(true);
    setEditingStudent(null);
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setStudentClass(student.class);
    setSection(student.section || "");
    setRollNumber(student.roll_number || "");
    setImageUrl(student.image_url || "");
    setParentName(student.parent_name || "");
    setParentContact(student.parent_contact || "");
    setAdmissionYear(student.admission_year || new Date().getFullYear());
    setIsActive(student.is_active);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    const studentData = {
      name,
      class: studentClass,
      section: section || null,
      roll_number: rollNumber || null,
      image_url: imageUrl || null,
      parent_name: parentName || null,
      parent_contact: parentContact || null,
      admission_year: admissionYear,
      is_active: isActive,
    };

    if (editingStudent) {
      const { error } = await supabase
        .from("students")
        .update(studentData)
        .eq("id", editingStudent.id);

      if (error) {
        toast({ title: "Error updating student", variant: "destructive" });
      } else {
        toast({ title: "Student updated successfully" });
      }
    } else {
      const { error } = await supabase.from("students").insert([studentData]);

      if (error) {
        toast({ title: "Error adding student", variant: "destructive" });
      } else {
        toast({ title: "Student added successfully" });
      }
    }

    setSaving(false);
    setDialogOpen(false);
    resetForm();
    fetchStudents();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("students").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting student", variant: "destructive" });
    } else {
      toast({ title: "Student deleted successfully" });
      fetchStudents();
    }
  };

  const toggleActive = async (student: Student) => {
    const { error } = await supabase
      .from("students")
      .update({ is_active: !student.is_active })
      .eq("id", student.id);

    if (error) {
      toast({ title: "Error updating student", variant: "destructive" });
    } else {
      fetchStudents();
    }
  };

  const uniqueClasses = [...new Set(students.map((s) => s.class))];
  const filteredStudents = filterClass
    ? students.filter((s) => s.class === filterClass)
    : students;

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingStudent ? "Edit Student" : "Add Student"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Photo</Label>
                <ImageUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  folder="students"
                />
              </div>
              <div>
                <Label>Student Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Class</Label>
                  <Select value={studentClass} onValueChange={setStudentClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prep-1">Prep-1</SelectItem>
                      <SelectItem value="Kg-1">Kg-1</SelectItem>
                      <SelectItem value="Std-1">Std-1</SelectItem>
                      <SelectItem value="Std-2">Std-2</SelectItem>
                      <SelectItem value="Std-3">Std-3</SelectItem>
                      <SelectItem value="Std-4">Std-4</SelectItem>
                      <SelectItem value="Std-5">Std-5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Section</Label>
                  <Input value={section} onChange={(e) => setSection(e.target.value)} placeholder="e.g., A" />
                </div>
                <div>
                  <Label>Roll No.</Label>
                  <Input value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Parent Name</Label>
                  <Input value={parentName} onChange={(e) => setParentName(e.target.value)} />
                </div>
                <div>
                  <Label>Academic Year</Label>
                  <Input type="number" value={admissionYear} onChange={(e) => setAdmissionYear(Number(e.target.value))} />
                </div>
              </div>
              <div>
                <Label>Parent's Contact Number</Label>
                <Input value={parentContact} onChange={(e) => setParentContact(e.target.value)} placeholder="e.g., +91 9876543210" />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <Label>Active</Label>
              </div>
              <Button onClick={handleSubmit} disabled={saving} className="w-full">
                {saving ? "Saving..." : editingStudent ? "Update" : "Add"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Select value={filterClass || "all"} onValueChange={(val) => setFilterClass(val === "all" ? "" : val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {uniqueClasses.map((cls) => (
              <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground">
          Total: {filteredStudents.length} students
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {student.image_url ? (
                  <img src={student.image_url} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-medium">{student.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Class {student.class}{student.section && ` - ${student.section}`}
                    {student.roll_number && ` | Roll: ${student.roll_number}`}
                  </p>
                  {student.parent_name && (
                    <p className="text-xs text-muted-foreground">Parent: {student.parent_name}</p>
                  )}
                </div>
                <Switch checked={student.is_active} onCheckedChange={() => toggleActive(student)} />
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(student)}>
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
                      <AlertDialogTitle>Delete Student?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(student.id)}>Delete</AlertDialogAction>
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
