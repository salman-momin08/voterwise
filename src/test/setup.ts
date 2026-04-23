import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Speech API since it's not in JSDOM
window.SpeechRecognition = vi.fn();
window.webkitSpeechRecognition = vi.fn();

// Use Object.defineProperty for non-writable properties if needed, but here simple assignment might work if types are right
(window as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = vi.fn();

Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn().mockReturnValue([]),
  },
  writable: true
});

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn((cb: (user: null) => void) => {
      cb(null);
      return () => { /* cleanup */ };
    }),
  },
  db: {},
}));
