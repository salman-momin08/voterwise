import { get, set, createStore } from 'idb-keyval';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Create a dedicated store for translations
const translationStore = createStore('voterwise-translations', 'translations');

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (targetLang === 'en') return text;

  const cacheKey = `${targetLang}:${text}`;
  
  try {
    // 1. Check IndexedDB Cache
    const cached = await get(cacheKey, translationStore);
    if (cached) {
      console.log(`[Cache Hit] ${targetLang}: ${text.substring(0, 20)}...`);
      return cached;
    }

    // 2. Fetch from Gemini if not in cache
    console.log(`[API Call] Translating to ${targetLang}...`);
    const prompt = `Translate the following civic/election related text from English to ${targetLang}. 
    Provide only the translated text without any explanations.
    Text: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translated = response.text().trim().replace(/^"|"$/g, '');

    // 3. Store in IndexedDB
    await set(cacheKey, translated, translationStore);
    
    return translated;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback to original text
  }
}

export async function warmUpCache(strings: string[], targetLang: string) {
  if (targetLang === 'en') return;
  console.log(`[WarmUp] Pre-fetching ${strings.length} critical strings...`);
  await Promise.all(strings.map(s => translateText(s, targetLang)));
}

export async function clearTranslationCache() {
  const { clear } = await import('idb-keyval');
  await clear(translationStore);
}
