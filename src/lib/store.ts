import { create } from 'zustand';
import type { IndianState, Election, RegistrationCycle, IndianStateSchema, ElectionSchema } from '../types/civic';

interface CivicStore {
  states: IndianState[];
  currentElection: Election | null;
  activeCycle: RegistrationCycle | null;
  lastUpdated: number | null;
  
  setStates: (states: IndianState[]) => void;
  setCurrentElection: (election: Election | null) => void;
  setActiveCycle: (cycle: RegistrationCycle | null) => void;
  clearCache: () => void;
}

export const useCivicStore = create<CivicStore>((set) => ({
  states: [],
  currentElection: null,
  activeCycle: null,
  lastUpdated: null,

  setStates: (states) => set({ states, lastUpdated: Date.now() }),
  setCurrentElection: (election) => set({ currentElection: election, lastUpdated: Date.now() }),
  setActiveCycle: (cycle) => set({ activeCycle: cycle, lastUpdated: Date.now() }),
  
  clearCache: () => set({ 
    states: [], 
    currentElection: null, 
    activeCycle: null, 
    lastUpdated: null 
  }),
}));
