import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Run cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock Firebase as it shouldn't be called during unit tests
vi.mock('../lib/firebase', () => ({
  getFirebaseAuth: vi.fn(),
  getFirebaseDb: vi.fn(),
  isFirebaseConfigured: true,
}));

// Mock Google Generative AI
vi.mock('../lib/gemini', () => ({
  isGeminiConfigured: true,
  useRagContext: vi.fn(() => ({ context: null })),
  getGeminiModel: vi.fn(),
}));
