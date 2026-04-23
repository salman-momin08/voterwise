# VoterWise Architecture

## Component Hierarchy
The VoterWise platform follows a modular, lazy-loaded architecture to optimize initial bundle size and Time To Interactive (TTI).

- **App.tsx**: The root application shell. Handles routing, authentication state, and global error boundaries.
  - **AppLayout**: (Extracted from App.tsx) The global layout wrapper containing the Navigation and Footer.
  - **ViewRouter**: (Extracted from App.tsx) Handles the lazy loading of feature views (`Suspense` boundaries).
    - `CivicNavigator.tsx`: Multi-step eligibility calculator.
    - `LiveElectionTicker.tsx`: Static hero content.
    - `SampleBallot.tsx`: Interactive candidate grid.
    - `WaitTimeMap.tsx`: Geospatial wait time visualizer.
  - **ChatAssistant.tsx**: Floating AI assistant. Focus-trapped for accessibility.

## State Ownership Boundaries
- **Global Auth State**: Managed at the `App.tsx` level and passed down via props/context.
- **Civic Data (Cache)**: Managed by `civicStore.ts` (Zustand) to prevent redundant Firestore reads.
- **RAG Context**: Managed by `useRagContext` to pass localized election data to the Gemini prompt.

## Data Flow Lifecycle
1. User requests a view.
2. If data is required, `civicStore` checks the local cache.
3. If cache miss, a Firestore query is executed.
4. Updates are streamed via `onSnapshot` for real-time features (like Wait Times), or fetched once for static data (like Candidates).
5. If the user interacts with the AI Assistant, the context (current view/data) is injected into the prompt.

## Service Initialization Order
1. **Vite Boot**: `main.tsx` mounts the React root.
2. **Firebase Init**: `firebase.ts` runs synchronously to initialize App, Auth, Firestore, and App Check (if in production).
3. **App Check**: Verifies the environment (ReCaptcha v3).
4. **App Mount**: `App.tsx` mounts, checking session state and lazy loading the default route.
1