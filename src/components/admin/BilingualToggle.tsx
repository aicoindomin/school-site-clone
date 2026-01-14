import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Languages } from "lucide-react";

type Language = "en" | "bn";

interface BilingualToggleProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function BilingualToggle({ language, onLanguageChange }: BilingualToggleProps) {
  return (
    <div className="flex items-center gap-2 mb-4 p-2 bg-muted/50 rounded-lg">
      <Languages className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Edit in:</span>
      <Tabs value={language} onValueChange={(val) => onLanguageChange(val as Language)}>
        <TabsList className="h-8">
          <TabsTrigger value="en" className="text-xs px-3 py-1">
            English
          </TabsTrigger>
          <TabsTrigger value="bn" className="text-xs px-3 py-1">
            বাংলা (Bengali)
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
