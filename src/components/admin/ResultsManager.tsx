import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Trophy } from "lucide-react";
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

interface Result {
  id: string;
  student_name: string;
  exam_type: string;
  percentage: number;
  rank: number | null;
  year: number;
  image_url: string | null;
  is_featured: boolean | null;
  class_name: string | null;
  created_at: string;
}

const examTypes = [
  { value: "annual", label: "Annual Exam" },
  { value: "half_yearly", label: "Half Yearly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "unit_test", label: "Unit Test" },
  { value: "board", label: "Board Exam" },
];

const classOptions = [
  "Prep-1", "Kg-1", "Std-1", "Std-2", "Std-3", "Std-4", "Std-5"
];

export function ResultsManager() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [filterClass, setFilterClass] = useState<string>("");
  const { toast } = useToast();

  // Form state
  const [studentName, setStudentName] = useState("");
  const [examType, setExamType] = useState("annual");
  const [percentage, setPercentage] = useState("");
  const [rank, setRank] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [className, setClassName] = useState("");

  const fetchResults = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("results")
      .select("*")
      .order("year", { ascending: false })
      .order("percentage", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch results",
        variant: "destructive",
      });
    } else {
      setResults(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const resetForm = () => {
    setStudentName("");
    setExamType("annual");
    setPercentage("");
    setRank("");
    setYear(new Date().getFullYear().toString());
    setImageUrl("");
    setIsFeatured(false);
    setClassName("");
    setEditingResult(null);
  };

  const openEditDialog = (result: Result) => {
    setEditingResult(result);
    setStudentName(result.student_name);
    setExamType(result.exam_type);
    setPercentage(result.percentage.toString());
    setRank(result.rank?.toString() || "");
    setYear(result.year.toString());
    setImageUrl(result.image_url || "");
    setIsFeatured(result.is_featured || false);
    setClassName(result.class_name || "");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const resultData = {
      student_name: studentName.trim(),
      exam_type: examType,
      percentage: parseFloat(percentage),
      rank: rank ? parseInt(rank) : null,
      year: parseInt(year),
      image_url: imageUrl.trim() || null,
      is_featured: isFeatured,
      class_name: className || null,
    };

    let error;

    if (editingResult) {
      const { error: updateError } = await supabase
        .from("results")
        .update(resultData)
        .eq("id", editingResult.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("results")
        .insert([resultData]);
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
        description: editingResult ? "Result updated successfully" : "Result added successfully",
      });
      setDialogOpen(false);
      resetForm();
      fetchResults();
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("results").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete result",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Result deleted successfully",
      });
      fetchResults();
    }
  };

  const toggleFeatured = async (result: Result) => {
    const { error } = await supabase
      .from("results")
      .update({ is_featured: !result.is_featured })
      .eq("id", result.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update result",
        variant: "destructive",
      });
    } else {
      fetchResults();
    }
  };

  const uniqueClasses = [...new Set(results.map((r) => r.class_name).filter(Boolean))];
  const filteredResults = filterClass
    ? results.filter((r) => r.class_name === filterClass)
    : results;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Select value={filterClass || "all"} onValueChange={(val) => setFilterClass(val === "all" ? "" : val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {uniqueClasses.map((cls) => (
                <SelectItem key={cls} value={cls!}>{cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-muted-foreground">
            {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Result
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingResult ? "Edit Result" : "Add New Result"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student_name">Student Name</Label>
                <Input
                  id="student_name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Student name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class_name">Class</Label>
                  <Select value={className} onValueChange={setClassName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classOptions.map((cls) => (
                        <SelectItem key={cls} value={cls}>
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exam_type">Exam Type</Label>
                  <Select value={examType} onValueChange={setExamType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    min={2000}
                    max={2100}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="percentage">Percentage</Label>
                  <Input
                    id="percentage"
                    type="number"
                    step="0.01"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    min={0}
                    max={100}
                    placeholder="95.50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rank">Rank</Label>
                  <Input
                    id="rank"
                    type="number"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    min={1}
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Photo URL (Optional)</Label>
                <Input
                  id="image_url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
                <Label htmlFor="is_featured">Featured (Show on homepage)</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingResult ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {filteredResults.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No results yet. Click "Add Result" to add one.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredResults.map((result) => (
            <Card key={result.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {result.image_url ? (
                      <img
                        src={result.image_url}
                        alt={result.student_name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{result.student_name}</h3>
                        {result.is_featured && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {result.class_name && `${result.class_name} • `}
                        {examTypes.find(t => t.value === result.exam_type)?.label || result.exam_type} • {result.year}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{result.percentage}%</p>
                      {result.rank && (
                        <p className="text-xs text-muted-foreground">Rank #{result.rank}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Switch
                        checked={result.is_featured || false}
                        onCheckedChange={() => toggleFeatured(result)}
                      />
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(result)}>
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
                            <AlertDialogTitle>Delete Result</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {result.student_name}'s result? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(result.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
