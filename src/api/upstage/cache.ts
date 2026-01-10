import type { TarotInterpretationResponse } from './types';

const CACHE_PREFIX = 'upstage_interpretation_';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry {
  value: TarotInterpretationResponse;
  expiry: number;
}

export function getCachedInterpretation(
  cacheKey: string
): TarotInterpretationResponse | null {
  try {
    const key = `${CACHE_PREFIX}${cacheKey}`;
    const cached = localStorage.getItem(key);
    
    if (!cached) {
      return null;
    }

    const entry: CacheEntry = JSON.parse(cached);
    
    if (Date.now() > entry.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.value;
  } catch (error) {
    console.warn('[Upstage Cache] Failed to read cache:', error);
    return null;
  }
}

export function setCachedInterpretation(
  cacheKey: string,
  value: TarotInterpretationResponse
): void {
  try {
    const key = `${CACHE_PREFIX}${cacheKey}`;
    const entry: CacheEntry = {
      value,
      expiry: Date.now() + CACHE_TTL_MS,
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.warn('[Upstage Cache] Failed to write cache:', error);
  }
}

export function createCacheKey(
  questionId: string,
  cardId: string,
  orientation: string,
  positionIndex: number
): string {
  return `${questionId}_${cardId}_${orientation}_${positionIndex}`;
}
