import { useState, useEffect } from 'react';
import { translateText } from '../lib/translationStore';

export function useTranslate(text: string, targetLang: string) {
  const [translated, setTranslated] = useState(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function performTranslation() {
      if (targetLang === 'en') {
        setTranslated(text);
        return;
      }

      setLoading(true);
      const result = await translateText(text);
      
      if (isMounted) {
        setTranslated(result);
        setLoading(false);
      }
    }

    performTranslation();

    return () => {
      isMounted = false;
    };
  }, [text, targetLang]);

  return { translated, loading };
}
