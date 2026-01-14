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
// Prefers manually written Bengali content (_bn columns), falls back to auto-translation
export function useDynamicTranslation<T extends Record<string, any>>(
  items: T[],
  fieldsToTranslate: (keyof T)[]
): T[] {
  const { language, translateBatch } = useTranslation();
  const [translatedItems, setTranslatedItems] = useState<T[]>(items);

  useEffect(() => {
    if (language === "en" || items.length === 0) {
      setTranslatedItems(items);
      return;
    }

    // Collect texts that need translation (no _bn content available)
    const textsToTranslate: string[] = [];
    const translationMap: { itemIndex: number; field: keyof T }[] = [];
    
    // First pass: use _bn content where available, collect remaining for translation
    const partiallyTranslatedItems = items.map((item, itemIndex) => {
      const newItem = { ...item };
      fieldsToTranslate.forEach((field) => {
        const bnField = `${String(field)}_bn` as keyof T;
        const bnValue = item[bnField];
        const enValue = item[field];
        
        // If Bengali content exists, use it
        if (typeof bnValue === "string" && bnValue.trim()) {
          (newItem as any)[field] = bnValue;
        } 
        // Otherwise, queue for auto-translation
        else if (typeof enValue === "string" && enValue.trim()) {
          textsToTranslate.push(enValue);
          translationMap.push({ itemIndex, field });
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
    translateBatch(textsToTranslate).then((translations) => {
      if (!isMounted) return;

      const finalItems = [...partiallyTranslatedItems];
      translations.forEach((translation, idx) => {
        const { itemIndex, field } = translationMap[idx];
        (finalItems[itemIndex] as any)[field] = translation;
      });
      setTranslatedItems(finalItems);
    });

    return () => {
      isMounted = false;
    };
  }, [items, language, translateBatch, fieldsToTranslate.join(",")]);

  return translatedItems;
}
