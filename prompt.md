# VoterWise Build Prompts

This document tracks the strategic prompts used to architect, design, and harden the VoterWise platform.

## Phase 1: Foundational Architecture & Design
- **Original Vision**: "Architect and develop 'VoterWise,' a high-performance, premium AI-powered election education platform. Achieve 100% in code quality, security, efficiency, accessibility, and Google Service integration. Build a modular architecture with React, TypeScript, and Firebase; implement a RAG-ready Gemini AI chat assistant; create a hyper-localized election timeline; and add a gamified quiz module."
- **Production Refactoring**: "Transform VoterWise into a production-grade, India-specific civic election assistant. Implement a dynamic civic data infrastructure sourcing exclusively from authoritative ECI and NVSP portals. Replace static datasets with runtime-evaluated eligibility, lifecycle, and deadline engines. Enforce strict Gemini response constraints via citation-validation middleware to deliver authenticated, jurisdiction-aware voter assistance."

## Phase 2: Maintenance & Hardening (Refinement)
- **Google Maps API Migration**: "Fix Google Maps JavaScript API errors causing InvalidKeyMapError. Migrate legacy google.maps.Marker to AdvancedMarkerElement to comply with deprecation requirements. Resolve styling conflicts caused by mapId usage."
- **Accessibility Hardening**: "Resolve axe-core accessibility issues. Fix elements failing minimum color contrast ratio thresholds. Ensure every page contains exactly one level-one (H1) heading."
- **Build & Type Safety**: "Fix TypeScript build errors including missing types (SourceAttribution) and type mismatches in test files. Enforce strict linting compliance."

## Phase 3: Translation & Cost Optimization
- **Translation Engine Pivot**: "Don't use Gemini to translate the page. Switch to the Google Translate API for better cost efficiency and reliability."
- **Zero-Cost Translation Implementation**: "Since the Cloud Translation API returns 403 Forbidden without manual project enablement, proceed with implementing the free Google Translate Web Element approach. Use the 'googtrans' cookie method for programmatic control from our custom Navbar selector."

## Phase 4: Production Readiness Audit & Hardening
- **Comprehensive Audit**: "Perform a senior software repository audit across Code Quality, Security, Efficiency, Testing, Accessibility, and Google Services Implementation. Generate evidence-based scores and a maturity classification."
- **Global Stability**: "Implement a global Error Boundary strategy to gracefully handle runtime failures in async components."
- **Advanced A11y**: "Implement focus management for the Chat Assistant using focus-trap-react to ensure WCAG 2.1.2 compliance."
- **Data Integrity (Gemini RAG)**: "Harden the Gemini RAG middleware by enforcing structured JSON citations in the system prompt and parsing them in the UI for ground-truth verification."
- **Security Hardening**: "Enable Firebase App Check with ReCAPTCHA Enterprise for production environment security."

---
