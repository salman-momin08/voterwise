# 🏗️ VoterWise Architecture

## 📡 Data Flow Model
VoterWise follows a **Deterministic Ground-Truth** model. Data flows from authoritative ECI/CEO portals into our ingestion pipelines, is normalized in Firestore, and served to the client via a centralized state management layer.

### Ingestion Pipeline
1. **Collector**: Cloud Functions fetch data from ECI Newsroom/Gazettes.
2. **Validator**: Zod schemas verify data integrity before persistence.
3. **Store**: Firestore serves as a high-performance cache.

## 🧠 State Ownership Boundaries
- **Server State**: Managed via Firestore listeners, synchronized with a global **Zustand** store for cross-component consistency.
- **Navigation State**: Managed via `sessionStorage` to ensure context persistence during hard refreshes.
- **Workflow State**: Encapsulated within `CivicNavigator`, tracking progress through the voter journey.

## 🧱 Component Hierarchy Logic
- **Views**: Top-level features (Navigator, Timeline, Academy).
- **Modules**: Self-contained civic logic (EligibilityChecker, ConstituencyExplorer).
- **Core UI**: Highly reusable, token-based design components.

## 🛡️ Deterministic Logic
All legal and lifecycle decisions are stripped from AI (Gemini) and handled by the deterministic engines in `src/engines/`. Gemini serves exclusively as a natural language explanation layer.
