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
