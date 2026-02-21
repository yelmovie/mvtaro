export type ViewMode = 'desktop' | 'tablet' | 'mobile';

export interface UserProfile {
  birthDate?: string;
  birthTime?: string;
  gender?: 'male' | 'female' | 'other';
  zodiacSign?: string;
  chineseZodiac?: string;
}

export interface ReadingHistory {
  id: string;
  date: string;
  questionTitle: string;
  cardIds: string[];
  results: any;
}

export interface CompatibilityData {
  user1: UserProfile;
  user2: UserProfile;
  score: number;
  insights: string[];
}

export interface PersonalityAnalysis {
  traits: string[];
  strengths: string[];
  challenges: string[];
  mbtiType?: string;
}
