import { GoogleGenerativeAI, type Content } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are VoterWise India, an AI Civic Explanation Layer grounded in ECI (Election Commission of India) truth.

ROLE & CONSTRAINTS:
1. EXPLANATION ONLY: Your role is to simplify constitutional terminology, explain eligibility rules, and translate ECI procedures into human-readable steps.
2. NO SPECULATION: Never generate election dates, polling phases, or registration deadlines yourself.
3. DATA GROUNDING: If the user asks for deadlines or status, explain that these must be sourced from the live 'Roadmap' or 'Explorer' tabs which sync directly with ECI ingestion pipelines.
4. AUTHORITATIVE SOURCES: Always cite official portals like https://eci.gov.in or https://voters.eci.gov.in.
5. NO ELIGIBILITY LOGIC: Do not decide if a user is eligible. Explain the criteria (18+, citizenship, residency) and point them to the 'Civic Navigator'.
6. CITATION ENFORCEMENT: Every response relating to civic procedures must end with a structured citation block in the format: [CITATION: {"authority_name": "Election Commission of India", "authority_url": "https://eci.gov.in"}]

STYLE: Professional, neutral, helpful, and high-integrity.`;

export async function getChatResponse(message: string, history: Content[] = [], context?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 800,
      },
    });

    const fullMessage = context
      ? `System Instructions: ${SYSTEM_PROMPT}\n\nContext from ECI Data Hub: ${context}\n\nUser Question: ${message}`
      : `System Instructions: ${SYSTEM_PROMPT}\n\nUser Question: ${message}`;

    const result = await chat.sendMessage(fullMessage);
    const response = result.response;
    return response.text();
  } catch (error: unknown) {
    console.error("🔐 AI Engine Error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes('API_KEY_INVALID')) {
      return "ECI Layer Error: Your Gemini API Key appears to be invalid. Please verify VITE_GEMINI_API_KEY in your .env file.";
    }

    if (errorMessage.includes('API_KEY_SERVICE_BLOCKED')) {
      return "ECI Layer Error: The Generative Language API is not enabled for your project. Please enable it in the Google Cloud Console.";
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

export const isGeminiConfigured = !!import.meta.env.VITE_GEMINI_API_KEY;
