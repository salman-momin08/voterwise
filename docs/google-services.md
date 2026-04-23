# VoterWise Google Services Integration

## Firebase Structure
- **Firestore**: Database. Rules enforce "Public Read, Private Write".
- **Authentication**: Email/Password and Google OAuth.
- **Hosting**: Fast, global CDN for the static assets.
- **Functions**: Node.js backend acting as a proxy for the Gemini API.
- **App Check**: Enforces that requests originate only from our allowed domains using ReCaptcha v3.

## Gemini Pipeline
The Gemini integration uses a RAG (Retrieval-Augmented Generation) approach.
1. The user asks a question.
2. The current context from Firestore (e.g., candidate details) is appended to the prompt.
3. The prompt is sent to a **Firebase Function** (to keep the API key hidden).
4. The backend communicates with `gemini-2.5-flash`.
5. Responses MUST include a structured JSON citation linking back to ECI or NVSP.

## Maps Integration Flow
- Uses `AdvancedMarkerElement`.
- The API key is embedded in `index.html` via the Vite build process.
- Secured via **Domain Restrictions** in the Google Cloud Console.

## Authentication Lifecycle
- Checked on app initialization in `App.tsx`.
- Real-time listener (`onAuthStateChanged`) updates the global state.
