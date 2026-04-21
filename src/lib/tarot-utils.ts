import tarotData from '../data/tarot-cards.json';

export interface TarotCard {
  id: string;
  name: string;
  number: number;
  symbol: string;
  upright: {
    prophecy: string;
    signs: string[];
    advice: string[];
  };
  reversed: {
    prophecy: string;
    signs: string[];
    advice: string[];
  };
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position: number;
}

export interface ReadingPositions {
  0: string;
  1: string;
  2: string;
}

export const READING_POSITIONS: ReadingPositions = {
  0: '과거 / 원인',
  1: '현재 / 상황',
  2: '미래 / 가능성',
};

/**
 * Get all tarot cards
 */
export function getAllCards(): TarotCard[] {
  return tarotData.cards as TarotCard[];
}

/**
 * Get a random card orientation (upright or reversed)
 */
export function getRandomOrientation(): boolean {
  return Math.random() < 0.5;
}

/**
 * Shuffle an array (Fisher-Yates algorithm)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Draw N cards from the deck
 */
export function drawCards(count: number = 3): DrawnCard[] {
  const allCards = getAllCards();
  const shuffled = shuffleArray(allCards);
  const selected = shuffled.slice(0, count);
  
  return selected.map((card, index) => ({
    card,
    isReversed: getRandomOrientation(),
    position: index,
  }));
}

/**
 * Get the disclaimer text
 */
export function getDisclaimer(): string {
  return tarotData.disclaimer;
}

/**
 * Format date for reading history
 */
export function formatReadingDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
