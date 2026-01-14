import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Save, Loader2, Info } from "lucide-react";

interface WhatsAppSettings {
  id: string;
  whatsapp_number: string;
  api_key: string | null;
  is_active: boolean;
}

export function WhatsAppSettingsManager() {
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isActive, setIsActive] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("whatsapp_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      setSettings(data);
      setWhatsappNumber(data.whatsapp_number);
      setApiKey(data.api_key || "");
      setIsActive(data.is_active);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!whatsappNumber) {
      toast({ title: "WhatsApp number is required", variant: "destructive" });
      return;
    }

    setSaving(true);

    if (settings) {
      // Update existing
      const { error } = await supabase
        .from("whatsapp_settings")
        .update({
          whatsapp_number: whatsappNumber,
          api_key: apiKey || null,
          is_active: isActive,
        })
        .eq("id", settings.id);

      if (error) {
        toast({ title: "Failed to update settings", variant: "destructive" });
      } else {
        toast({ title: "WhatsApp settings updated successfully" });
      }
    } else {
      // Create new
      const { error } = await supabase
        .from("whatsapp_settings")
        .insert({
          whatsapp_number: whatsappNumber,
          api_key: apiKey || null,
          is_active: isActive,
        });

      if (error) {
        toast({ title: "Failed to create settings", variant: "destructive" });
      } else {
        toast({ title: "WhatsApp settings created successfully" });
        fetchSettings();
      }
    }

    setSaving(false);
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
            <MessageCircle className="w-5 h-5 text-green-500" />
            WhatsApp Integration Settings
          </CardTitle>
          <CardDescription>
            Configure WhatsApp integration to receive admission inquiries instantly on your phone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">How it works:</p>
              <p>When a parent submits an admission inquiry, they will be redirected to WhatsApp with a pre-filled message containing all the form details. This uses the free WhatsApp Web API (wa.me link) - no paid API required!</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">WhatsApp Number (with country code)</Label>
              <Input
                id="whatsapp_number"
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="919732743315 (India: 91 + number)"
              />
              <p className="text-xs text-muted-foreground">
                Enter the number with country code but without + sign. For India: 91XXXXXXXXXX
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api_key">WhatsApp Business API Key (Optional - for future use)</Label>
              <Input
                id="api_key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Optional - for advanced features"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use free WhatsApp Web redirect. Only needed if you have WhatsApp Business API.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <Label>Enable WhatsApp Notifications</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  When enabled, form submissions will redirect to WhatsApp
                </p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
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
        </CardContent>
      </Card>
    </div>
  );
}
