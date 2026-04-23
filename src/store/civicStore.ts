import { create } from 'zustand';
import { getFirebaseDb } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { ConstituencyMember, Election } from '../types/civic';

interface CivicState {
  candidates: ConstituencyMember[];
  elections: Election[];
  isCandidatesLoaded: boolean;
  isElectionsLoaded: boolean;
  subscribeToCandidates: () => () => void;
  subscribeToElections: () => () => void;
}

let candidatesUnsubscribe: (() => void) | null = null;
let electionsUnsubscribe: (() => void) | null = null;
let candidatesSubscribers = 0;
let electionsSubscribers = 0;

export const useCivicStore = create<CivicState>((set) => ({
  candidates: [],
  elections: [],
  isCandidatesLoaded: false,
  isElectionsLoaded: false,

  subscribeToCandidates: () => {
    candidatesSubscribers++;
    if (!candidatesUnsubscribe) {
      const db = getFirebaseDb();
      const q = collection(db, 'members');
      candidatesUnsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => {
          const rawData = doc.data();
          return {
            id: doc.id,
            name: String(rawData.name ?? ''),
            party: String(rawData.party ?? ''),
            role: (rawData.role === 'MP' ? 'MP' : 'MLA'),
            constituency_id: String(rawData.constituency_id ?? ''),
            state_code: String(rawData.state_code ?? ''),
            official_profile_url: String(rawData.official_profile_url ?? ''),
            education: String(rawData.education ?? ''),
            criminal_cases: Number(rawData.criminal_cases ?? 0),
            assets: String(rawData.assets ?? ''),
            affidavit_url: String(rawData.affidavit_url ?? ''),
            source: rawData.source
          } as ConstituencyMember;
        });
        set({ candidates: data, isCandidatesLoaded: true });
      });
    }

    return () => {
      candidatesSubscribers--;
      if (candidatesSubscribers === 0 && candidatesUnsubscribe) {
        candidatesUnsubscribe();
        candidatesUnsubscribe = null;
      }
    };
  },

  subscribeToElections: () => {
    electionsSubscribers++;
    if (!electionsUnsubscribe) {
      const db = getFirebaseDb();
      const q = query(collection(db, 'schedule'), orderBy('date', 'asc'));
      electionsUnsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => {
          const data = doc.data();
          const rawPhases = (data.phases as Array<Record<string, unknown>>) ?? [];
          
          return {
            id: doc.id,
            title: String(data.title ?? ''),
            type: (data.type ?? 'general') as 'general' | 'assembly' | 'bye-election',
            year: Number(data.year ?? 0),
            results_declared: Boolean(data.results_declared ?? false),
            source: data.source,
            phases: rawPhases.map(p => ({
              id: String(p.id ?? ''),
              phase_number: Number(p.phase_number ?? 0),
              states: (p.states as string[] ?? []),
              constituencies: (p.constituencies as string[] ?? []),
              nomination_start: String(p.nomination_start ?? ''),
              nomination_end: String(p.nomination_end ?? ''),
              scrutiny_date: String(p.scrutiny_date ?? ''),
              withdrawal_date: String(p.withdrawal_date ?? ''),
              polling_date: String(p.polling_date ?? ''),
              counting_date: String(p.counting_date ?? ''),
              source: p.source
            }))
          } as Election;
        });
        set({ elections: list, isElectionsLoaded: true });
      });
    }

    return () => {
      electionsSubscribers--;
      if (electionsSubscribers === 0 && electionsUnsubscribe) {
        electionsUnsubscribe();
        electionsUnsubscribe = null;
      }
    };
  }
}));
