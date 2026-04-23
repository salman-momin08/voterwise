import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock Google Maps globally
(global as any).google = {
  maps: {
    importLibrary: vi.fn().mockResolvedValue({
      Map: vi.fn(),
      AdvancedMarkerElement: vi.fn(),
    }),
  },
};
