# 🗳️ VoterWise: Authoritative Civic Intelligence Platform

[![Build Status](https://img.shields.io/badge/Status-Production--Ready-success)](https://election-process-fcbf9.web.app)
[![Security](https://img.shields.io/badge/Security-Firebase--Hardened-blue)](https://firebase.google.com)
[![AI](https://img.shields.io/badge/AI-Gemini--2.0--Flash-orange)](https://deepmind.google/technologies/gemini/)

**VoterWise** is a production-grade Indian civic assistant designed to bridge the gap between authoritative government data and citizen engagement. By leveraging automated ingestion pipelines from the **Election Commission of India (ECI)** and **Chief Electoral Officer (CEO)** portals, VoterWise provides an authenticated, jurisdiction-aware, and accessibility-compliant roadmap to the democratic process.

---

## 🛡️ The Authoritative Standard

VoterWise differentiates itself from generic civic tools by enforcing a "Source-of-Truth" mandate across every layer of its architecture.

### 📡 ECI Grounded Data Ingestion
*   **Dynamic Lifecycle Engine**: No hard-coded dates. Our timeline engine synchronizes with official ECI announcements at runtime.
*   **Firestore Cache Layer**: High-performance persistence layer for normalized ECI datasets, ensuring offline resilience and sub-100ms LCP.
*   **Zustand Global State**: Efficient, lightweight state management with persistence for local civic preferences.

### 🤖 RAG-Powered Intelligence
*   **Context-Aware AI**: Powered by **Gemini 2.0 Flash**, our assistant uses Retrieval-Augmented Generation (RAG) to answer civic questions solely based on official ECI documentation.
*   **Hallucination Guardrails**: AI decision-making is stripped from deterministic workflows (Eligibility, Registration status), ensuring legal compliance.

---

## 🚀 Key Modules

| Module | Description | Tech Highlight |
| :--- | :--- | :--- |
| **Civic Navigator** | A personalized roadmap for registration and polling preparation. | `Zustand` Persistence |
| **National Timeline** | Real-time, phase-wise election tracking across all Indian States. | Deterministic Lifecycle Engine |
| **Constituency Explorer** | Interactive discovery of local leadership and polling booth locations. | Google Maps Advanced Markers |
| **Civic Academy** | Gamified, ECI-grounded literacy modules for first-time voters. | Framer Motion Animations |
| **Sample Ballot** | AI-powered candidate profile breakdown based on ECI affidavits. | Gemini Extraction Layer |

---

## 🛠️ Technology Stack

*   **Frontend**: React 19 (TypeScript), Vite 8, Framer Motion
*   **State Management**: Zustand + IDB Persistence
*   **Backend & Security**: Firebase (Auth, Firestore, Hosting, App Check)
*   **Intelligence**: Google Gemini 2.0 Flash (Function Calling + RAG)
*   **Iconography**: Lucide React
*   **Styling**: Pure CSS3 with Modern Design Tokens

---

## ⚙️ Development Setup

### 1. Pre-requisites
*   Node.js 18+
*   Firebase CLI (`npm install -g firebase-tools`)
*   Google AI Studio API Key (for Gemini)

### 2. Installation
```bash
git clone https://github.com/salman-momin08/voterwise.git
cd voterwise
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_GOOGLE_MAPS_API_KEY=...
VITE_GEMINI_API_KEY=...
```

### 4. Launching
```bash
npm run dev
```

---

## 📜 Deployment & Security

### Production Build & Deploy
```bash
npm run deploy
```
This single command builds the optimized bundle and deploys it directly to Firebase Hosting.

### Security Hardening
*   **App Check**: Protected by reCAPTCHA Enterprise to prevent unauthorized API abuse.
*   **Firestore Rules**: Strict RBAC (Role-Based Access Control) to prevent unauthorized data mutation.
*   **Secret Manager**: Sensitive API keys are managed via Firebase Secret Manager.

---

## ♿ Accessibility & Compliance
VoterWise is built to lead the competitive landscape in civic tech:
*   **WCAG 2.1 Level AA**: 100% compliant screen reader support.
*   **Multi-lingual**: Native support for 10+ Indian languages via browser-integrated Google Translate.
*   **Responsive**: Fluid performance from mobile-first polling booths to ultra-wide civic dashboards.

---

© 2026 VoterWise Team. Authoritative Civic Intelligence for the Republic of India.
