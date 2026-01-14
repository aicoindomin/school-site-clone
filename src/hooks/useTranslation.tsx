import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Language = "en" | "bn";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (text: string) => Promise<string>;
  translateBatch: (texts: string[]) => Promise<string[]>;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

// Cache translations to avoid repeated API calls
const translationCache: Record<string, Record<string, string>> = {
  en: {},
  bn: {},
};

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get from localStorage or default to 'en'
    const saved = localStorage.getItem("siteLanguage");
    return (saved === "bn" ? "bn" : "en") as Language;
  });
  const [isTranslating, setIsTranslating] = useState(false);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("siteLanguage", lang);
  }, []);

  const translateBatch = useCallback(async (texts: string[]): Promise<string[]> => {
    if (language === "en") {
      return texts; // No translation needed for English
    }

    // Check cache first
    const uncachedTexts: string[] = [];
    const uncachedIndices: number[] = [];
    const results: string[] = [...texts];

    texts.forEach((text, index) => {
      const cached = translationCache[language][text];
      if (cached) {
        results[index] = cached;
      } else {
        uncachedTexts.push(text);
        uncachedIndices.push(index);
      }
    });

    if (uncachedTexts.length === 0) {
      return results;
    }

    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: { texts: uncachedTexts, targetLanguage: language },
      });

      if (error) {
        console.error("Translation error:", error);
        toast({
          title: "Translation Error",
          description: "Failed to translate content. Showing original text.",
          variant: "destructive",
        });
        return texts;
      }

      if (data?.translations) {
        data.translations.forEach((translation: string, idx: number) => {
          const originalIndex = uncachedIndices[idx];
          results[originalIndex] = translation;
          // Cache the translation
          translationCache[language][uncachedTexts[idx]] = translation;
        });
      }

      return results;
    } catch (err) {
      console.error("Translation failed:", err);
      return texts;
    } finally {
      setIsTranslating(false);
    }
  }, [language]);

  const translate = useCallback(async (text: string): Promise<string> => {
    const [result] = await translateBatch([text]);
    return result;
  }, [translateBatch]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, translate, translateBatch, isTranslating }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
