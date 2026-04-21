import { type DrawnCard } from './tarot-utils';

export interface ReadingHistory {
  id: string;
  date: string;
  questionId: string;
  cards: {
    cardId: string;
    isReversed: boolean;
    position: number;
  }[];
}

const STORAGE_KEY = 'tarot-reading-history';

/**
 * Save a reading to history
 */
export function saveReading(questionId: string, cards: DrawnCard[]): void {
  const history = getHistory();
  
  const reading: ReadingHistory = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    questionId,
    cards: cards.map(({ card, isReversed, position }) => ({
      cardId: card.id,
      isReversed,
      position,
    })),
  };
  
  history.unshift(reading);
  
  // Keep only last 50 readings
  const trimmed = history.slice(0, 50);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

/**
 * Get all reading history
 */
export function getHistory(): ReadingHistory[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Delete a reading from history
 */
export function deleteReading(id: string): void {
  const history = getHistory();
  const filtered = history.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Clear all history
 */
export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Settings
 */
const SETTINGS_KEY = 'tarot-settings';

export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  animationIntensity: 'low' | 'normal' | 'high';
  colorPalette: 'mystic' | 'forest' | 'ocean' | 'sunset';
  pushNotifications: boolean;
  soundEffects: boolean;
  backgroundMusic: boolean;
  language: 'ko' | 'en';
}

const defaultSettings: Settings = {
  theme: 'auto',
  animationIntensity: 'normal',
  colorPalette: 'mystic',
  pushNotifications: true,
  soundEffects: true,
  backgroundMusic: false,
  language: 'ko',
};

export function getSettings(): Settings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: Partial<Settings>): void {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
}
