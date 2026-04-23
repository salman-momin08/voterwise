import { type Content } from "@google/generative-ai";
import { getFirebaseFunctions } from "./firebase";
import { httpsCallable } from "firebase/functions";

export async function getChatResponse(message: string, history: Content[] = [], context?: string) {
  try {
    const functions = getFirebaseFunctions();
    const chatWithAi = httpsCallable(functions, 'chatWithAi');
    
    const result = await chatWithAi({
      message,
      history,
      context
    });

    const data = result.data as { text: string };
    return data.text;
  } catch (error: any) {
    console.error("🔐 AI Engine Proxy Error:", error);

    const errorMessage = error?.message || String(error);

    if (errorMessage.includes('NOT_FOUND')) {
      return "ECI Layer Error: The AI Backend service is currently being updated. Please try again in a few minutes.";
    }

    return "I'm currently unable to access the ECI Explanation Layer due to a technical synchronization issue. Please refer directly to eci.gov.in for authoritative information.";
  }
}

// React Hook for RAG context
import { useState, useCallback } from 'react';

export const useRagContext = () => {
  const [context, setContext] = useState<string | null>(null);

  const updateContext = useCallback((newContext: string) => {
    setContext(newContext);
  }, []);

  return { context, updateContext };
};

export const isGeminiConfigured = true; // Always true now as it depends on the backend proxy
