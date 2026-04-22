# 🌐 Google Services Integration

## 🔥 Firebase Stack
VoterWise utilizes a hardened Firebase architecture for secure civic data delivery.

- **Authentication**: Anonymous and OAuth-based identity management.
- **Firestore**: NoSQL real-time database with RBAC Security Rules.
- **App Check**: Protected via DeviceCheck/reCAPTCHA Enterprise to prevent unauthorized API usage.
- **Hosting**: Global CDN delivery with hardened Content Security Policies (CSP).

## 🤖 Gemini AI (Generative AI SDK)
- **Model**: Gemini-2.5-flash.
- **Context**: Grounded in official ECI documentation via the RAG (Retrieval-Augmented Generation) pipeline.
- **Sandboxing**: AI output is strictly for explanation. It is prohibited from determining eligibility or calculating election dates.

## 🗺️ Google Maps SDK
- **Usage**: Polling station visualization and constituency boundary mapping.
- **Security**: API keys are restricted via HTTP referrers and specific service enablement (Maps JavaScript API only).

## 🌍 Environment Separation
| Environment | Project ID | Usage |
| :--- | :--- | :--- |
| **Dev** | `voterwise-dev` | Local development and sandbox testing. |
| **Staging** | `voterwise-staging` | Pre-production validation and a11y auditing. |
| **Prod** | `voterwise-prod` | Nationwide civic deployment. |
