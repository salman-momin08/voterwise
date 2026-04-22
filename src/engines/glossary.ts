/**
 * Civic-Safe Translation & Glossary Engine
 * 
 * Protects critical constitutional and electoral terminology 
 * from machine-translation errors. 
 */

export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'bn' | 'mr';

interface GlossaryEntry {
  term: string;
  definition: string;
  translations: Record<SupportedLanguage, string>;
}

export const CIVIC_GLOSSARY: Record<string, GlossaryEntry> = {
  ELECTORAL_ROLL_REVISION: {
    term: 'Electoral Roll Revision',
    definition: 'The process of updating the voter list.',
    translations: {
      en: 'Electoral Roll Revision',
      hi: 'निर्वाचक नामावली पुनरीक्षण',
      ta: 'வாக்காளர் பட்டியல் திருத்தம்',
      te: 'ఓటర్ల జాబితా సవరణ',
      kn: 'ಮತದಾರರ ಪಟ್ಟಿಯ ಪರಿಷ್ಕರಣೆ',
      bn: 'ভোটার তালিকা সংশোধন',
      mr: 'मतदार यादी पुनरीक्षण'
    }
  },
  ASSEMBLY_CONSTITUENCY: {
    term: 'Assembly Constituency',
    definition: 'A geographical area represented by an MLA.',
    translations: {
      en: 'Assembly Constituency',
      hi: 'विधानसभा निर्वाचन क्षेत्र',
      ta: 'சட்டமன்றத் தொகுதி',
      te: 'అసెంబ్లీ నియోజకవర్గం',
      kn: 'ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ',
      bn: 'বিধানসভা কেন্দ্র',
      mr: 'विधानसभा मतदारसंघ'
    }
  },
  PARLIAMENTARY_CONSTITUENCY: {
    term: 'Parliamentary Constituency',
    definition: 'A geographical area represented by an MP.',
    translations: {
      en: 'Parliamentary Constituency',
      hi: 'संसदीय निर्वाचन क्षेत्र',
      ta: 'நாடாளுமன்றத் தொகுதி',
      te: 'పార్లమెంటరీ నియోజకవర్గం',
      kn: 'ಲೋಕಸಭಾ ಕ್ಷೇತ್ರ',
      bn: 'সংসদীয় কেন্দ্র',
      mr: 'संसदीय मतदारसंघ'
    }
  },
  EPIC_NUMBER: {
    term: 'EPIC Number',
    definition: 'Electoral Photo Identity Card number.',
    translations: {
      en: 'EPIC Number',
      hi: 'एपिक संख्या (मतदाता पहचान पत्र संख्या)',
      ta: 'வாக்காளர் அடையாள அட்டை எண்',
      te: 'ఓటరు గుర్తింపు కార్డు సంఖ్య',
      kn: 'ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ ಸಂಖ್ಯೆ',
      bn: 'এপিক নম্বর',
      mr: 'ए EPIC क्रमांक'
    }
  }
};

/**
 * Translates a civic term using the protected glossary
 */
export const translateCivicTerm = (key: keyof typeof CIVIC_GLOSSARY, lang: SupportedLanguage): string => {
  return CIVIC_GLOSSARY[key]?.translations[lang] || CIVIC_GLOSSARY[key]?.term;
};
