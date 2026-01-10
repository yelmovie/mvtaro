/**
 * 타로 카드 데이터 및 타입 정의
 * 
 * 이 파일은 tarotCards.json을 기반으로 생성됩니다.
 * Single Source of Truth: tarotCards.json
 */

import tarotCardsData from "./tarotCards.json";

// Types
export type TarotArcanaType = "major" | "minor";

export type TarotSuit = "wands" | "cups" | "swords" | "pentacles";

export type TarotRank =
  | "ace"
  | "two"
  | "three"
  | "four"
  | "five"
  | "six"
  | "seven"
  | "eight"
  | "nine"
  | "ten"
  | "page"
  | "knight"
  | "queen"
  | "king";

export interface TarotCard {
  id: number;
  key: string;
  filename: string;
  imagePath: string;
  arcanaType: TarotArcanaType;
  suit: TarotSuit | null;
  rank: TarotRank | null;
}

// Runtime validation
function validateTarotCards(cards: TarotCard[]): void {
  // Check count
  if (cards.length !== 78) {
    throw new Error(
      `Expected exactly 78 cards, found ${cards.length}`
    );
  }

  // Check IDs are 0-77 unique and sorted
  const ids = cards.map((c) => c.id);
  const expectedIds = Array.from({ length: 78 }, (_, i) => i);
  const missingIds = expectedIds.filter((id) => !ids.includes(id));
  const duplicateIds = ids.filter(
    (id, index) => ids.indexOf(id) !== index
  );

  if (missingIds.length > 0) {
    throw new Error(
      `Missing card IDs: ${missingIds.join(", ")}`
    );
  }

  if (duplicateIds.length > 0) {
    throw new Error(
      `Duplicate card IDs: ${[...new Set(duplicateIds)].join(", ")}`
    );
  }

  // Check sorted
  for (let i = 0; i < cards.length - 1; i++) {
    if (cards[i].id > cards[i + 1].id) {
      throw new Error(
        `Cards are not sorted. Found ID ${cards[i].id} before ${cards[i + 1].id}`
      );
    }
  }
}

// Validate on import
validateTarotCards(tarotCardsData as TarotCard[]);

// Export cards array
export const tarotCards: TarotCard[] = tarotCardsData as TarotCard[];

// Helper functions
export function getCardById(id: number): TarotCard | undefined {
  return tarotCards.find((card) => card.id === id);
}

export function getCardsBySuit(suit: TarotSuit): TarotCard[] {
  return tarotCards.filter((card) => card.suit === suit);
}

export function isMajor(card: TarotCard): boolean {
  return card.arcanaType === "major";
}

export function isMinor(card: TarotCard): boolean {
  return card.arcanaType === "minor";
}
