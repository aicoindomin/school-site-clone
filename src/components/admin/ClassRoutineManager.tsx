import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Pencil, Trash2, Clock } from "lucide-react";

interface ClassRoutine {
  id: string;
  class_name: string;
  day_of_week: string;
  period_number: number;
  subject: string;
  start_time: string;
  end_time: string;
  teacher_name: string | null;
  is_active: boolean;
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function ClassRoutineManager() {
  const [routines, setRoutines] = useState<ClassRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<ClassRoutine | null>(null);
  const [className, setClassName] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [periodNumber, setPeriodNumber] = useState(1);
  const [subject, setSubject] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:45");
  const [teacherName, setTeacherName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [filterClass, setFilterClass] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    const { data, error } = await supabase
      .from("class_routine")
      .select("*")
      .order("class_name")
      .order("day_of_week")
      .order("period_number");

    if (error) {
      toast({ title: "Error fetching routines", variant: "destructive" });
    } else {
      setRoutines(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setClassName("");
    setDayOfWeek("Monday");
    setPeriodNumber(1);
    setSubject("");
    setStartTime("09:00");
    setEndTime("09:45");
    setTeacherName("");
    setIsActive(true);
    setEditingRoutine(null);
  };

  const openEditDialog = (routine: ClassRoutine) => {
    setEditingRoutine(routine);
    setClassName(routine.class_name);
    setDayOfWeek(routine.day_of_week);
    setPeriodNumber(routine.period_number);
    setSubject(routine.subject);
    setStartTime(routine.start_time);
    setEndTime(routine.end_time);
    setTeacherName(routine.teacher_name || "");
    setIsActive(routine.is_active);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    const routineData = {
      class_name: className,
      day_of_week: dayOfWeek,
      period_number: periodNumber,
      subject,
      start_time: startTime,
      end_time: endTime,
      teacher_name: teacherName || null,
      is_active: isActive,
    };

    if (editingRoutine) {
      const { error } = await supabase
        .from("class_routine")
        .update(routineData)
        .eq("id", editingRoutine.id);

      if (error) {
        toast({ title: "Error updating routine", variant: "destructive" });
      } else {
        toast({ title: "Routine updated successfully" });
      }
    } else {
      const { error } = await supabase.from("class_routine").insert([routineData]);

      if (error) {
        toast({ title: "Error adding routine", variant: "destructive" });
      } else {
        toast({ title: "Routine added successfully" });
      }
    }

    setSaving(false);
    setDialogOpen(false);
    resetForm();
    fetchRoutines();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("class_routine").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting routine", variant: "destructive" });
    } else {
      toast({ title: "Routine deleted successfully" });
      fetchRoutines();
    }
  };

  const uniqueClasses = [...new Set(routines.map((r) => r.class_name))];
  const filteredRoutines = filterClass
    ? routines.filter((r) => r.class_name === filterClass)
    : routines;

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" /> Add Period
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingRoutine ? "Edit Period" : "Add Period"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Class Name</Label>
                  <Select value={className} onValueChange={setClassName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prep-I">Prep-I</SelectItem>
                      <SelectItem value="Kg-I">Kg-I</SelectItem>
                      <SelectItem value="Kg-II">Kg-II</SelectItem>
                      <SelectItem value="Std-I">Std-I</SelectItem>
                      <SelectItem value="Std-II">Std-II</SelectItem>
                      <SelectItem value="Std-III">Std-III</SelectItem>
                      <SelectItem value="Std-IV">Std-IV</SelectItem>
                      <SelectItem value="Std-V">Std-V</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Day</Label>
                  <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Period Number</Label>
                  <Input type="number" value={periodNumber} onChange={(e) => setPeriodNumber(Number(e.target.value))} min={1} max={10} />
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Teacher Name (Optional)</Label>
                <Input value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <Label>Active</Label>
              </div>
              <Button onClick={handleSubmit} disabled={saving} className="w-full">
                {saving ? "Saving..." : editingRoutine ? "Update" : "Add"}
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
              <SelectItem key={cls} value={cls}>{cls}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {uniqueClasses
          .filter((cls) => !filterClass || cls === filterClass)
          .map((cls) => (
            <Card key={cls}>
              <CardHeader>
                <CardTitle className="text-lg">{cls}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Day</th>
                        <th className="text-left p-2">Period</th>
                        <th className="text-left p-2">Subject</th>
                        <th className="text-left p-2">Time</th>
                        <th className="text-left p-2">Teacher</th>
                        <th className="text-right p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRoutines
                        .filter((r) => r.class_name === cls)
                        .map((routine) => (
                          <tr key={routine.id} className="border-b">
                            <td className="p-2">{routine.day_of_week}</td>
                            <td className="p-2">{routine.period_number}</td>
                            <td className="p-2">{routine.subject}</td>
                            <td className="p-2">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {routine.start_time} - {routine.end_time}
                              </div>
                            </td>
                            <td className="p-2">{routine.teacher_name || "-"}</td>
                            <td className="p-2 text-right">
                              <Button variant="ghost" size="sm" onClick={() => openEditDialog(routine)}>
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
                                    <AlertDialogTitle>Delete Period?</AlertDialogTitle>
                                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(routine.id)}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
