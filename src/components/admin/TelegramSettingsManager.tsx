import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send, Save, Loader2, Info } from "lucide-react";

interface TelegramSettings {
  id: string;
  bot_token: string;
  chat_id: string;
  is_active: boolean;
}

export function TelegramSettingsManager() {
  const [settings, setSettings] = useState<TelegramSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("telegram_settings" as any)
      .select("*")
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      const typedData = data as unknown as TelegramSettings;
      setSettings(typedData);
      setBotToken(typedData.bot_token);
      setChatId(typedData.chat_id);
      setIsActive(typedData.is_active);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!botToken || !chatId) {
      toast({ title: "Bot Token and Chat ID are required", variant: "destructive" });
      return;
    }

    setSaving(true);

    if (settings) {
      const { error } = await supabase
        .from("telegram_settings" as any)
        .update({
          bot_token: botToken,
          chat_id: chatId,
          is_active: isActive,
        })
        .eq("id", settings.id);

      if (error) {
        toast({ title: "Failed to update settings", variant: "destructive" });
      } else {
        toast({ title: "Telegram settings updated successfully" });
      }
    } else {
      const { error } = await supabase
        .from("telegram_settings" as any)
        .insert({
          bot_token: botToken,
          chat_id: chatId,
          is_active: isActive,
        });

      if (error) {
        toast({ title: "Failed to create settings", variant: "destructive" });
      } else {
        toast({ title: "Telegram settings created successfully" });
        fetchSettings();
      }
    }

    setSaving(false);
  };

  const handleTestMessage = async () => {
    if (!botToken || !chatId) {
      toast({ title: "Please save Bot Token and Chat ID first", variant: "destructive" });
      return;
    }

    setTesting(true);

    try {
      const testMessage = "🔔 Test notification from Balisai Public School website!";
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(testMessage)}`;
      
      const response = await fetch(telegramUrl);
      const result = await response.json();

      if (result.ok) {
        toast({ title: "Test message sent successfully! Check your Telegram." });
      } else {
        toast({ title: `Failed: ${result.description}`, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Failed to send test message", variant: "destructive" });
    }

    setTesting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-500" />
            Telegram Notification Settings
          </CardTitle>
          <CardDescription>
            Configure Telegram integration to receive admission inquiries instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">How it works:</p>
              <p>When a parent submits an admission inquiry, you'll receive an instant notification on Telegram with all the form details.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bot_token">Bot Token</Label>
              <Input
                id="bot_token"
                type="password"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="e.g., 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
              />
              <p className="text-xs text-muted-foreground">
                Get this from @BotFather on Telegram
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chat_id">Chat ID</Label>
              <Input
                id="chat_id"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="e.g., 5588394964"
              />
              <p className="text-xs text-muted-foreground">
                Your Telegram user ID or group chat ID
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <Label>Enable Telegram Notifications</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  When enabled, form submissions will send notifications
                </p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
            <Button onClick={handleTestMessage} disabled={testing} variant="outline">
              {testing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Send Test"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
