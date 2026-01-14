import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, Bell, Trophy, Image, Users, FileText, Home, Link as LinkIcon, 
  Calendar, GraduationCap, BookOpen, Star, Settings, Send
} from "lucide-react";
import { User, Session } from "@supabase/supabase-js";
import { 
  NoticesManager, GalleryManager, ResultsManager, StaffManager,
  UsefulLinksManager, QuickLinksManager, TopAchieversManager,
  ClassRoutineManager, HolidaysManager, WebsiteContentManager,
  FacultyManager, StudentsManager, AccountSettings, TelegramSettingsManager
} from "@/components/admin";

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        if (!session) navigate("/auth");
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged Out", description: "You have been signed out successfully." });
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
            <span className="text-sm text-muted-foreground hidden sm:block">Balisai Public School</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">{user?.email}</span>
            <Button variant="outline" size="sm" asChild>
              <Link to="/"><Home className="w-4 h-4 mr-2" />View Site</Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome, Admin!</h2>
          <p className="text-muted-foreground">Manage your school website content from this dashboard.</p>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="flex flex-wrap gap-2 h-auto p-2">
            <TabsTrigger value="content" className="flex items-center gap-2 py-2 px-3">
              <FileText className="w-4 h-4" /><span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="notices" className="flex items-center gap-2 py-2 px-3">
              <Bell className="w-4 h-4" /><span className="hidden sm:inline">Notices</span>
            </TabsTrigger>
            <TabsTrigger value="faculty" className="flex items-center gap-2 py-2 px-3">
              <Users className="w-4 h-4" /><span className="hidden sm:inline">Faculty</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2 py-2 px-3">
              <GraduationCap className="w-4 h-4" /><span className="hidden sm:inline">Students</span>
            </TabsTrigger>
            <TabsTrigger value="achievers" className="flex items-center gap-2 py-2 px-3">
              <Star className="w-4 h-4" /><span className="hidden sm:inline">Achievers</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2 py-2 px-3">
              <Trophy className="w-4 h-4" /><span className="hidden sm:inline">Results</span>
            </TabsTrigger>
            <TabsTrigger value="routine" className="flex items-center gap-2 py-2 px-3">
              <BookOpen className="w-4 h-4" /><span className="hidden sm:inline">Routine</span>
            </TabsTrigger>
            <TabsTrigger value="holidays" className="flex items-center gap-2 py-2 px-3">
              <Calendar className="w-4 h-4" /><span className="hidden sm:inline">Holidays</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2 py-2 px-3">
              <Image className="w-4 h-4" /><span className="hidden sm:inline">Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center gap-2 py-2 px-3">
              <LinkIcon className="w-4 h-4" /><span className="hidden sm:inline">Links</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 py-2 px-3">
              <Settings className="w-4 h-4" /><span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />Website Content</CardTitle>
                <CardDescription>Edit About, Contact, Academics, Admission, and Careers pages</CardDescription>
              </CardHeader>
              <CardContent><WebsiteContentManager /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notices">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" />Notices & Announcements</CardTitle>
                <CardDescription>Manage school notices and updates</CardDescription>
              </CardHeader>
              <CardContent><NoticesManager /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faculty">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Faculty Management</CardTitle>
                <CardDescription>Manage teachers and staff members</CardDescription>
              </CardHeader>
              <CardContent><FacultyManager /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5" />Students</CardTitle>
                <CardDescription>Manage student records</CardDescription>
              </CardHeader>
              <CardContent><StudentsManager /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Star className="w-5 h-5" />Top Achievers</CardTitle>
                <CardDescription>Manage top performing students showcase</CardDescription>
              </CardHeader>
              <CardContent><TopAchieversManager /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5" />Exam Results</CardTitle>
                <CardDescription>Manage exam results</CardDescription>
              </CardHeader>
              <CardContent><ResultsManager /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routine">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" />Class Routine</CardTitle>
                <CardDescription>Manage class timetables and schedules</CardDescription>
              </CardHeader>
              <CardContent><ClassRoutineManager /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="holidays">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" />Holidays</CardTitle>
                <CardDescription>Manage school holidays and events calendar</CardDescription>
              </CardHeader>
              <CardContent><HolidaysManager /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Image className="w-5 h-5" />Photo Gallery</CardTitle>
                <CardDescription>Manage school event photos</CardDescription>
              </CardHeader>
              <CardContent><GalleryManager /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><LinkIcon className="w-5 h-5" />Links Management</CardTitle>
                <CardDescription>Manage useful links and quick links</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="font-semibold mb-4">Useful Links</h3>
                    <UsefulLinksManager />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Quick Links</h3>
                    <QuickLinksManager />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Send className="w-5 h-5 text-blue-500" />Telegram Settings</CardTitle>
                  <CardDescription>Configure Telegram integration for admission inquiries</CardDescription>
                </CardHeader>
                <CardContent><TelegramSettingsManager /></CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" />Account Settings</CardTitle>
                  <CardDescription>Manage your account and invite other administrators</CardDescription>
                </CardHeader>
                <CardContent><AccountSettings /></CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
