import { z } from 'zod';

// Base Civic Component Validations
export const sourceAttributionSchema = z.object({
  authority_name: z.string(),
  authority_url: z.string().url(),
  last_verified_timestamp: z.string() // ISO date
});

// User Inputs
export const searchInputSchema = z.string().min(2).max(100).trim().transform(val => val.toLowerCase());
export const epicNumberSchema = z.string().regex(/^[A-Z]{3}[0-9]{7}$/, 'Invalid EPIC number format');

// Maps Inputs
export const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180)
});

// Gemini Responses (Checking the structured citation logic)
export const geminiCitationSchema = z.object({
  authority_name: z.string(),
  authority_url: z.string().url()
});

export const validateGeminiResponse = (text: string) => {
  // Extracts JSON from [CITATION: {...}]
  const citationMatch = /\[CITATION:\s*({.*?})\]/.exec(text);
  if (citationMatch && citationMatch[1]) {
    try {
      const parsed = JSON.parse(citationMatch[1]);
      geminiCitationSchema.parse(parsed);
      return true;
    } catch (e) {
      console.warn('Gemini response citation validation failed', e);
      return false;
    }
  }
  return false;
};
