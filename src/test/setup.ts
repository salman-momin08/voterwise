import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Speech API since it's not in JSDOM
(window as any).SpeechRecognition = vi.fn();
(window as any).webkitSpeechRecognition = vi.fn();
(window as any).SpeechSynthesisUtterance = vi.fn();
(window as any).speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn().mockReturnValue([]),
};

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn((cb) => {
      cb(null);
      return () => {};
    }),
  },
  db: {},
}));
