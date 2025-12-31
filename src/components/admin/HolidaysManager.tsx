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
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Holiday {
  id: string;
  title: string;
  holiday_date: string;
  description: string | null;
  holiday_type: string;
  is_active: boolean;
}

const holidayTypes = ["general", "national", "religious", "school", "exam"];

export function HolidaysManager() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [title, setTitle] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [description, setDescription] = useState("");
  const [holidayType, setHolidayType] = useState("general");
  const [isActive, setIsActive] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    const { data, error } = await supabase
      .from("holidays")
      .select("*")
      .order("holiday_date", { ascending: true });

    if (error) {
      toast({ title: "Error fetching holidays", variant: "destructive" });
    } else {
      setHolidays(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setHolidayDate("");
    setDescription("");
    setHolidayType("general");
    setIsActive(true);
    setEditingHoliday(null);
  };

  const openEditDialog = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setTitle(holiday.title);
    setHolidayDate(holiday.holiday_date);
    setDescription(holiday.description || "");
    setHolidayType(holiday.holiday_type);
    setIsActive(holiday.is_active);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    const holidayData = {
      title,
      holiday_date: holidayDate,
      description: description || null,
      holiday_type: holidayType,
      is_active: isActive,
    };

    if (editingHoliday) {
      const { error } = await supabase
        .from("holidays")
        .update(holidayData)
        .eq("id", editingHoliday.id);

      if (error) {
        toast({ title: "Error updating holiday", variant: "destructive" });
      } else {
        toast({ title: "Holiday updated successfully" });
      }
    } else {
      const { error } = await supabase.from("holidays").insert([holidayData]);

      if (error) {
        toast({ title: "Error adding holiday", variant: "destructive" });
      } else {
        toast({ title: "Holiday added successfully" });
      }
    }

    setSaving(false);
    setDialogOpen(false);
    resetForm();
    fetchHolidays();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("holidays").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting holiday", variant: "destructive" });
    } else {
      toast({ title: "Holiday deleted successfully" });
      fetchHolidays();
    }
  };

  const toggleActive = async (holiday: Holiday) => {
    const { error } = await supabase
      .from("holidays")
      .update({ is_active: !holiday.is_active })
      .eq("id", holiday.id);

    if (error) {
      toast({ title: "Error updating holiday", variant: "destructive" });
    } else {
      fetchHolidays();
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={resetForm}>
            <Plus className="w-4 h-4 mr-2" /> Add Holiday
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingHoliday ? "Edit Holiday" : "Add Holiday"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input type="date" value={holidayDate} onChange={(e) => setHolidayDate(e.target.value)} />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={holidayType} onValueChange={setHolidayType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {holidayTypes.map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description (Optional)</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <Label>Active</Label>
            </div>
            <Button onClick={handleSubmit} disabled={saving} className="w-full">
              {saving ? "Saving..." : editingHoliday ? "Update" : "Add"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {holidays.map((holiday) => (
          <Card key={holiday.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{holiday.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(holiday.holiday_date), "dd MMM yyyy")} • 
                    <span className="capitalize ml-1">{holiday.holiday_type}</span>
                  </p>
                  {holiday.description && (
                    <p className="text-sm text-muted-foreground mt-1">{holiday.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={holiday.is_active} onCheckedChange={() => toggleActive(holiday)} />
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(holiday)}>
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
                      <AlertDialogTitle>Delete Holiday?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(holiday.id)}>Delete</AlertDialogAction>
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
