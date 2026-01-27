import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Language = "en" | "bn";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (text: string, targetLang?: Language) => Promise<string>;
  translateBatch: (texts: string[], targetLang?: Language) => Promise<string[]>;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

// Persistent cache using localStorage with in-memory fallback
const CACHE_KEY = "translation_cache_v2";
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  value: string;
  timestamp: number;
}

interface TranslationCacheData {
  en: Record<string, CacheEntry>;
  bn: Record<string, CacheEntry>;
}

// Load cache from localStorage
function loadCache(): TranslationCacheData {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as TranslationCacheData;
      // Clean expired entries
      const now = Date.now();
      Object.keys(parsed.en).forEach(key => {
        if (now - parsed.en[key].timestamp > CACHE_EXPIRY_MS) {
          delete parsed.en[key];
        }
      });
      Object.keys(parsed.bn).forEach(key => {
        if (now - parsed.bn[key].timestamp > CACHE_EXPIRY_MS) {
          delete parsed.bn[key];
        }
      });
      return parsed;
    }
  } catch (e) {
    console.warn("Failed to load translation cache:", e);
  }
  return { en: {}, bn: {} };
}

// Save cache to localStorage
function saveCache(cache: TranslationCacheData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn("Failed to save translation cache:", e);
  }
}

// In-memory cache initialized from localStorage
let translationCache: TranslationCacheData = loadCache();

// Rate limit tracking
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL_MS = 1000; // Minimum 1 second between requests
let pendingRequests: Map<string, Promise<string[]>> = new Map();

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("siteLanguage");
    return (saved === "bn" ? "bn" : "en") as Language;
  });
  const [isTranslating, setIsTranslating] = useState(false);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("siteLanguage", lang);
  }, []);

  const translateBatch = useCallback(async (texts: string[], targetLang?: Language): Promise<string[]> => {
    const effectiveTargetLang = targetLang || language;
    
    // If language is English and no explicit target, return as-is
    if (effectiveTargetLang === "en" && !targetLang) {
      return texts;
    }
    
    // Check cache first
    const uncachedTexts: string[] = [];
    const uncachedIndices: number[] = [];
    const results: string[] = [...texts];

    texts.forEach((text, index) => {
      if (!text || !text.trim()) {
        results[index] = text;
        return;
      }
      
      const cached = translationCache[effectiveTargetLang][text];
      if (cached && (Date.now() - cached.timestamp) < CACHE_EXPIRY_MS) {
        results[index] = cached.value;
      } else {
        uncachedTexts.push(text);
        uncachedIndices.push(index);
      }
    });

    if (uncachedTexts.length === 0) {
      return results;
    }

    // Create a unique key for this batch request
    const batchKey = `${effectiveTargetLang}:${uncachedTexts.join("|||")}`;
    
    // Check if there's already a pending request for the same texts
    const existingRequest = pendingRequests.get(batchKey);
    if (existingRequest) {
      const translations = await existingRequest;
      translations.forEach((translation, idx) => {
        const originalIndex = uncachedIndices[idx];
        if (originalIndex !== undefined) {
          results[originalIndex] = translation;
        }
      });
      return results;
    }

    // Rate limiting - wait if needed
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL_MS) {
      await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL_MS - timeSinceLastRequest));
    }
    lastRequestTime = Date.now();

    setIsTranslating(true);
    
    // Create the request promise
    const requestPromise = (async (): Promise<string[]> => {
      try {
        const { data, error } = await supabase.functions.invoke("translate", {
          body: { texts: uncachedTexts, targetLanguage: effectiveTargetLang },
        });

        if (error) {
          console.error("Translation error:", error);
          // Don't show toast for rate limits - just return original text quietly
          if (!error.message?.includes("429")) {
            toast({
              title: "Translation Error",
              description: "Showing original text.",
              variant: "destructive",
            });
          }
          return uncachedTexts;
        }

        if (data?.translations) {
          // Cache the translations
          const timestamp = Date.now();
          data.translations.forEach((translation: string, idx: number) => {
            translationCache[effectiveTargetLang][uncachedTexts[idx]] = {
              value: translation,
              timestamp,
            };
          });
          // Persist to localStorage
          saveCache(translationCache);
          return data.translations;
        }

        return uncachedTexts;
      } catch (err) {
        console.error("Translation failed:", err);
        return uncachedTexts;
      }
    })();

    // Store the pending request
    pendingRequests.set(batchKey, requestPromise);
    
    try {
      const translations = await requestPromise;
      translations.forEach((translation, idx) => {
        const originalIndex = uncachedIndices[idx];
        results[originalIndex] = translation;
      });
      return results;
    } finally {
      pendingRequests.delete(batchKey);
      setIsTranslating(false);
    }
  }, [language]);

  const translate = useCallback(async (text: string, targetLang?: Language): Promise<string> => {
    const [result] = await translateBatch([text], targetLang);
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
