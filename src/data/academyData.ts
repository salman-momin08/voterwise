import { Landmark, Smartphone, Gavel } from 'lucide-react';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: any;
  content: {
    section: string;
    text: string;
  }[];
  quiz: Question[];
  resources?: {
    label: string;
    url: string;
  }[];
}

export const ACADEMY_DATA: LearningModule[] = [
  {
    id: 'm1',
    title: 'Constitutional Foundations',
    description: 'Understand the democratic framework of the Republic of India.',
    icon: Landmark,
    content: [
      {
        section: 'Article 324',
        text: 'The Constitution of India, under Article 324, provides for an independent Election Commission of India (ECI). It vests the superintendence, direction, and control of the entire process for conducting elections in this body.'
      },
      {
        section: 'Universal Adult Franchise',
        text: 'Every citizen who is not less than 18 years of age and not otherwise disqualified has the right to be registered as a voter. This is a constitutional right granted under Article 326.'
      },
      {
        section: 'The Three-Tier Structure',
        text: 'India follows a federal structure with elections for the Parliament (Lok Sabha/Rajya Sabha), State Legislative Assemblies (Vidhan Sabha), and Local Bodies (Panchayats/Municipalities).'
      }
    ],
    quiz: [
      {
        id: 'q1-1',
        text: 'Which article of the Indian Constitution mandates the establishment of the Election Commission?',
        options: ['Article 370', 'Article 324', 'Article 21', 'Article 44'],
        correctAnswer: 1,
        explanation: 'Article 324 vests the superintendence, direction, and control of elections in the Election Commission.'
      },
      {
        id: 'q1-2',
        text: 'What is the minimum age for a citizen to vote in India?',
        options: ['21 Years', '25 Years', '18 Years', '16 Years'],
        correctAnswer: 2,
        explanation: 'The 61st Amendment Act of 1988 reduced the voting age from 21 to 18 years.'
      }
    ],
    resources: [
      { label: 'Read Article 324', url: 'https://legislative.gov.in/sites/default/files/COI_statutory_24.pdf' }
    ]
  },
  {
    id: 'm2',
    title: 'Model Code of Conduct (MCC)',
    description: 'Guidelines for political parties and candidates during election periods.',
    icon: Gavel,
    content: [
      {
        section: 'What is MCC?',
        text: 'The MCC is a set of guidelines issued by the ECI for the conduct of political parties and candidates. It comes into force immediately upon the announcement of the election schedule.'
      },
      {
        section: 'Restrictions on Ministers',
        text: 'Ministers shall not combine their official visit with electioneering work and shall not make use of official machinery or personnel for electioneering.'
      },
      {
        section: 'Prevention of Corrupt Practices',
        text: 'Activities like bribing, intimidating voters, or appealing to caste/communal feelings for securing votes are strictly prohibited and punishable.'
      }
    ],
    quiz: [
      {
        id: 'q2-1',
        text: 'When does the Model Code of Conduct come into effect?',
        options: [
          'On the day of polling',
          'Immediately upon the announcement of election dates by ECI',
          'One month before the election',
          'When candidates file their nominations'
        ],
        correctAnswer: 1,
        explanation: 'MCC comes into force from the moment the ECI announces the election schedule.'
      },
      {
        id: 'q2-2',
        text: 'Can a Minister combine an official visit with election campaigning under MCC?',
        options: ['Yes, if they use their own car', 'No, it is strictly prohibited', 'Yes, only on weekends', 'Yes, with Governor permission'],
        correctAnswer: 1,
        explanation: 'Ministers are prohibited from combining official visits with electioneering work.'
      }
    ]
  },
  {
    id: 'm3',
    title: 'Digital Tools: cVIGIL & KYC',
    description: 'Empowering citizens via ECI’s official mobile applications.',
    icon: Smartphone,
    content: [
      {
        section: 'cVIGIL App',
        text: 'An innovative mobile application for citizens to report Model Code of Conduct and Expenditure violations. The ECI guarantees a 100-minute turnaround time for reported issues.'
      },
      {
        section: 'Know Your Candidate (KYC)',
        text: 'Citizens can use the KYC app to view the criminal antecedents (if any) of candidates contesting elections, ensuring informed voting.'
      },
      {
        section: 'Voter Helpline App',
        text: 'A one-stop shop for voter registration, downloading e-EPIC, and checking your name in the electoral roll.'
      }
    ],
    quiz: [
      {
        id: 'q3-1',
        text: 'What is the primary purpose of the cVIGIL app?',
        options: [
          'To download Voter ID',
          'To report MCC violations in real-time',
          'To chat with the Election Commissioner',
          'To book a slot for voting'
        ],
        correctAnswer: 1,
        explanation: 'cVIGIL allows citizens to report violations with evidence (photo/video) directly to the ECI.'
      },
      {
        id: 'q3-2',
        text: 'What information does the KYC app provide about candidates?',
        options: ['Home address only', 'Criminal antecedents and assets', 'Previous school records', 'Social media followers'],
        correctAnswer: 1,
        explanation: 'Know Your Candidate (KYC) empowers voters to see candidate affidavits, including criminal records and assets.'
      }
    ]
  }
];
