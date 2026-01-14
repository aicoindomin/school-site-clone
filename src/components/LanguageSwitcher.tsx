import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Globe, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { language, setLanguage, isTranslating } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 gap-2 rounded-none px-3"
        >
          {isTranslating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {language === "en" ? "English" : "বাংলা"}
          </span>
          <span className="sm:hidden">
            {language === "en" ? "EN" : "বা"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={language === "en" ? "bg-muted" : ""}
        >
          <span className="mr-2">🇬🇧</span>
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("bn")}
          className={language === "bn" ? "bg-muted" : ""}
        >
          <span className="mr-2">🇮🇳</span>
          বাংলা (Bengali)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
