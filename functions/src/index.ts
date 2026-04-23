import { onCall, HttpsError } from "firebase-functions/v2/https";
import { GoogleGenerativeAI, type Content } from "@google/generative-ai";
import { defineSecret } from "firebase-functions/params";

// Define the secret for the Gemini API Key
const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

const SYSTEM_PROMPT = `You are VoterWise India, an AI Civic Explanation Layer grounded in ECI (Election Commission of India) truth.

ROLE & CONSTRAINTS:
1. EXPLANATION ONLY: Your role is to simplify constitutional terminology, explain eligibility rules, and translate ECI procedures into human-readable steps.
2. NO SPECULATION: Never generate election dates, polling phases, or registration deadlines yourself.
3. DATA GROUNDING: If the user asks for deadlines or status, explain that these must be sourced from the live 'Roadmap' or 'Explorer' tabs which sync directly with ECI ingestion pipelines.
4. AUTHORITATIVE SOURCES: Always cite official portals like https://eci.gov.in or https://voters.eci.gov.in.
5. NO ELIGIBILITY LOGIC: Do not decide if a user is eligible. Explain the criteria (18+, citizenship, residency) and point them to the 'Civic Navigator'.
6. CITATION ENFORCEMENT: Every response relating to civic procedures must end with a structured citation block in the format: [CITATION: {"authority_name": "Election Commission of India", "authority_url": "https://eci.gov.in"}]

STYLE: Professional, neutral, helpful, and high-integrity.`;

export const chatWithAi = onCall({ secrets: [GEMINI_API_KEY] }, async (request) => {
  const { message, history, context } = request.data as {
    message: string;
    history: Content[];
    context?: string;
  };

  if (!message) {
    throw new HttpsError("invalid-argument", "The function must be called with a message.");
  }

  try {
    const apiKey = GEMINI_API_KEY.value();
    const genAI = new GoogleGenerativeAI(apiKey);
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
    return { text: result.response.text() };
  } catch (error: any) {
    console.error("🔐 AI Backend Error:", error);
    throw new HttpsError("internal", "Failed to get AI response from the backend.");
  }
});
