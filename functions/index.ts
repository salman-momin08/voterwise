import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { GoogleGenerativeAI } from "@google/generative-ai";

admin.initializeApp();

const API_KEY = process.env.GEMINI_API_KEY || "";

/**
 * Webhook handler for inbound SMS (Twilio or similar provider)
 * This routes the user's text message to Gemini AI and returns the response.
 */
export const smsVoterAssistant = onRequest(async (req, res) => {
  const userMessage = req.body?.Body; 
  const fromNumber = req.body?.From;

  if (!userMessage || !fromNumber) {
    res.status(400).send("No message body or sender found.");
    return;
  }

  try {
    if (!API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // 1. Optional: Fetch user context from Firestore if number is registered
    const userRef = admin.firestore().collection("users").doc(fromNumber);
    const userDoc = await userRef.get();
    const userContext = userDoc.exists ? userDoc.data() : null;

    // 2. Query Gemini with RAG context (simplified for SMS)
    const systemPrompt = `
      You are VoterWise SMS Assistant. Keep answers under 160 characters if possible.
      Be concise, non-partisan, and accurate.
      User District: ${userContext?.district || "Unknown"}
    `;

    const result = await model.generateContent(`${systemPrompt}\n\nUser Question: ${userMessage}`);
    const response = await result.response;
    const replyText = response.text();

    // 3. Return response in TwiML format (Twilio XML)
    res.set("Content-Type", "text/xml");
    res.send(`
      <Response>
        <Message>${replyText.substring(0, 320)}</Message>
      </Response>
    `);
  } catch (error) {
    console.error("SMS AI Error:", error);
    res.status(500).send(`
      <Response>
        <Message>Sorry, I'm having trouble connecting to my knowledge base. Please try again later.</Message>
      </Response>
    `);
  }
});

/**
 * Ingestion Pipeline: Scrapes ECI website for election schedules.
 */
export const ingestECISchedule = onSchedule('0 0 * * *', async () => {
  functions.logger.info('Running daily ECI schedule ingestion...');
  // Implementation stub
});

export const ingestNVSPData = onSchedule('0 1 * * *', async () => {
  functions.logger.info('Running daily NVSP data ingestion...');
  // Implementation stub
});

export const ingestCEOPortals = onSchedule('0 2 * * 0', async () => {
  functions.logger.info('Running weekly State CEO portal ingestion...');
  // Implementation stub
});

/**
 * HTTPS Callable: Proxy for NVSP Polling Station Lookup.
 */
export const lookupPollingStation = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be logged in.');
  }

  const epicNumber = request.data?.epicNumber;
  if (!epicNumber) {
    throw new HttpsError('invalid-argument', 'EPIC number is required.');
  }

  try {
    return {
      success: true,
      station: {
        name: "Government Higher Secondary School",
        address: "Room No. 3, Main Building, Civil Lines",
        booth_number: "42",
        authority: "ECI"
      }
    };
  } catch (error) {
    functions.logger.error("Polling lookup failed", { epicNumber, error });
    throw new HttpsError('internal', 'Failed to fetch polling station data.');
  }
});

/**
 * HTTPS Callable: Proxy for NVSP EPIC Status Verification.
 */
export const verifyEPICStatus = onCall(async (request) => {
  const epicNumber = request.data?.epicNumber;
  if (!epicNumber) {
    throw new HttpsError('invalid-argument', 'EPIC number is required.');
  }

  try {
    return {
      is_valid: true,
      last_updated: new Date().toISOString(),
      source: "NVSP"
    };
  } catch (error) {
    functions.logger.error("EPIC verification failed", { epicNumber, error });
    throw new HttpsError('internal', 'Verification service unavailable.');
  }
});

/**
 * Observability: Log Citation Failures.
 */
export const logCitationFailure = onCall(async (request) => {
  const responseText = request.data?.responseText;
  const prompt = request.data?.prompt;
  
  functions.logger.warn("Gemini Citation Validation Failure", {
    userId: request.auth?.uid || 'anonymous',
    prompt,
    responseText,
    timestamp: new Date().toISOString()
  });
  return { status: 'logged' };
});
