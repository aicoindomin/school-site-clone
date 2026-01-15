import { useState, useEffect, memo } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface TranslatedTextProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  [key: string]: any;
}

// Component that automatically translates its text content
export const TranslatedText = memo(function TranslatedText({ 
  children, 
  as: Component = "span", 
  className,
  ...props 
}: TranslatedTextProps) {
  const { language, translate } = useTranslation();
  const [translatedText, setTranslatedText] = useState(children);

  useEffect(() => {
    if (language === "en") {
      setTranslatedText(children);
      return;
    }

    let isMounted = true;
    translate(children).then((result) => {
      if (isMounted) {
        setTranslatedText(result);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [children, language, translate]);

  return (
    <Component className={className} {...props}>
      {translatedText}
    </Component>
  );
});

// Hook for translating text in components
export function useTranslatedText(text: string): string {
  const { language, translate } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    if (language === "en") {
      setTranslatedText(text);
      return;
    }

    let isMounted = true;
    translate(text).then((result) => {
      if (isMounted) {
        setTranslatedText(result);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [text, language, translate]);

  return translatedText;
}

// Hook for translating multiple texts at once (more efficient)
export function useTranslatedTexts(texts: string[]): string[] {
  const { language, translateBatch } = useTranslation();
  const [translatedTexts, setTranslatedTexts] = useState(texts);

  useEffect(() => {
    if (language === "en") {
      setTranslatedTexts(texts);
      return;
    }

    let isMounted = true;
    translateBatch(texts).then((results) => {
      if (isMounted) {
        setTranslatedTexts(results);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [texts.join("|"), language, translateBatch]);

  return translatedTexts;
}

// Hook for translating dynamic database content
// Prefers manually written content in the target language, falls back to auto-translation
// Handles both: Bengali display (use _bn fields) and English display (translate from _bn if English is empty)
export function useDynamicTranslation<T extends Record<string, any>>(
  items: T[],
  fieldsToTranslate: (keyof T)[]
): T[] {
  const { language, translateBatch } = useTranslation();
  const [translatedItems, setTranslatedItems] = useState<T[]>(items);

  useEffect(() => {
    if (items.length === 0) {
      setTranslatedItems(items);
      return;
    }

    // Collect texts that need translation
    const textsToTranslate: string[] = [];
    const translationMap: { itemIndex: number; field: keyof T; sourceLang: "en" | "bn" }[] = [];
    
    // First pass: determine what content to show and what needs translation
    const partiallyTranslatedItems = items.map((item, itemIndex) => {
      const newItem = { ...item };
      fieldsToTranslate.forEach((field) => {
        const bnField = `${String(field)}_bn` as keyof T;
        const bnValue = item[bnField];
        const enValue = item[field];
        
        const hasBengali = typeof bnValue === "string" && bnValue.trim();
        const hasEnglish = typeof enValue === "string" && enValue.trim();
        
        if (language === "bn") {
          // Bengali mode: prefer _bn content, fallback to translating English
          if (hasBengali) {
            (newItem as any)[field] = bnValue;
          } else if (hasEnglish) {
            // Queue English text for translation to Bengali
            textsToTranslate.push(enValue);
            translationMap.push({ itemIndex, field, sourceLang: "en" });
          }
        } else {
          // English mode: prefer English content, fallback to translating Bengali
          if (hasEnglish) {
            (newItem as any)[field] = enValue;
          } else if (hasBengali) {
            // Queue Bengali text for translation to English
            textsToTranslate.push(bnValue as string);
            translationMap.push({ itemIndex, field, sourceLang: "bn" });
          }
        }
      });
      return newItem;
    });

    // If no texts need translation, we're done
    if (textsToTranslate.length === 0) {
      setTranslatedItems(partiallyTranslatedItems);
      return;
    }

    let isMounted = true;
    
    // Separate texts by target language for proper translation
    const bnToEn = translationMap.filter(m => m.sourceLang === "bn");
    const enToBn = translationMap.filter(m => m.sourceLang === "en");
    
    const translateAndApply = async () => {
      const finalItems = [...partiallyTranslatedItems];
      
      // Translate Bengali to English
      if (bnToEn.length > 0) {
        const bnTexts = bnToEn.map((_, i) => textsToTranslate[translationMap.findIndex(m => m === bnToEn[i])]);
        const translations = await translateBatch(bnTexts, "en");
        bnToEn.forEach((mapping, idx) => {
          if (isMounted) {
            (finalItems[mapping.itemIndex] as any)[mapping.field] = translations[idx];
          }
        });
      }
      
      // Translate English to Bengali
      if (enToBn.length > 0) {
        const enTexts = enToBn.map((_, i) => textsToTranslate[translationMap.findIndex(m => m === enToBn[i])]);
        const translations = await translateBatch(enTexts, "bn");
        enToBn.forEach((mapping, idx) => {
          if (isMounted) {
            (finalItems[mapping.itemIndex] as any)[mapping.field] = translations[idx];
          }
        });
      }
      
      if (isMounted) {
        setTranslatedItems(finalItems);
      }
    };

    translateAndApply();

    return () => {
      isMounted = false;
    };
  }, [items, language, translateBatch, fieldsToTranslate.join(",")]);

  return translatedItems;
}
