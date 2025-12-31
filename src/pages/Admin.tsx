import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, 
  Bell, 
  Trophy, 
  Image, 
  Users, 
  FileText,
  Home
} from "lucide-react";
import { User, Session } from "@supabase/supabase-js";
import { NoticesManager, GalleryManager, ResultsManager, StaffManager } from "@/components/admin";

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "You have been signed out successfully.",
    });
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
            <span className="text-sm text-muted-foreground hidden sm:block">
              Balisai Public School
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                View Site
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome, Admin!</h2>
          <p className="text-muted-foreground">
            Manage your school website content from this dashboard.
          </p>
        </div>

        <Tabs defaultValue="notices" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto p-2">
            <TabsTrigger value="notices" className="flex items-center gap-2 py-3">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notices</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2 py-3">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Results</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2 py-3">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2 py-3">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Staff</span>
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2 py-3">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Pages</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notices">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notices & Announcements
                </CardTitle>
                <CardDescription>
                  Manage school notices, announcements, and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NoticesManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Student Results
                </CardTitle>
                <CardDescription>
                  Manage exam results and top achievers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResultsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Photo Gallery
                </CardTitle>
                <CardDescription>
                  Manage school event photos and gallery images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GalleryManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Staff Management
                </CardTitle>
                <CardDescription>
                  Manage key functionaries and staff members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StaffManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Page Content
                </CardTitle>
                <CardDescription>
                  Edit website pages and content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Page editing coming soon. You'll be able to update website content here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
