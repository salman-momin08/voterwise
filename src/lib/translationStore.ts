import { createStore, clear } from 'idb-keyval';

const translationStore = createStore('voterwise-translations', 'translations');
export function translateText(text: string): Promise<string> {
  // Free Google Translate Web Element translates the entire DOM automatically.
  // We return the original text here and let the browser-level widget handle the visual translation.
  return Promise.resolve(text);
}



export async function clearTranslationCache() {
  await clear(translationStore);
}
