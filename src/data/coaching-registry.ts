/**
 * 코칭 규칙 엔진 레지스트리 — 20장 카드 표본 + 수트별 말투 + 2회차 카드 선택
 */

import { cardDB } from './coaching-complete-data';
import { tarotCards78Data } from './tarot-cards-78';

/** 수트별 카드 안내 말투 — 코칭 톤 */
export const COACHING_TONE_MAP = {
  cups: '공감 중심으로 마음 온도를 맞춰 보는 카드예요.',
  swords: '조심스러운 조언과 말의 균형을 살피라는 카드예요.',
  wands: '먼저 용기 내어 작게 움직이라는 카드예요.',
  pentacles: '현실적인 약속과 실행을 정리하라는 카드예요.',
  major: '큰 전환과 선택을 다시 보게 하는 카드예요.'
} as const;

/** 1차 코칭용 고정 표본 20장 — cardDB 와 단일 소스 */
export const CARD_DB_STAGE1 = cardDB.map(({ id, name, suit, tarotId }) => ({
  id,
  name,
  suit,
  tarotId
})) as ReadonlyArray<{
  id: number;
  name: string;
  suit: 'cups' | 'swords' | 'wands' | 'pentacles';
  tarotId: string;
}>;

export const FOLLOWUP_ENCOURAGEMENT_ROUND2: readonly [string, string] = [
  '지금 선택한 행동은 좋은 시작이야.',
  '조금씩 관계가 달라질 수 있어.'
];

export type CoachingActionTier = 'easy' | 'medium' | 'hard';

export function hashCoachingSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * 2회차 추천 카드 — 행동 단계 선택에 따라 수트 우선순위 적용
 * 쉬움 → 컵, 보통 → 완드, 어려움 → 검
 */
export function resolveNextRoundTarotId(opts: {
  tier: CoachingActionTier;
  excludeIds: ReadonlySet<string>;
  seed: number;
}): string {
  const { tier, excludeIds, seed } = opts;

  const preferSuits =
    tier === 'easy'
      ? (['cups'] as const)
      : tier === 'medium'
        ? (['wands'] as const)
        : (['swords'] as const);

  const all = tarotCards78Data.cards;

  for (const suit of preferSuits) {
    const pool = all.filter((c) => c.suit === suit && !excludeIds.has(c.id));
    if (pool.length > 0) return pool[seed % pool.length].id;
  }

  const fallback = all.find((c) => !excludeIds.has(c.id));
  if (fallback) return fallback.id;
  return all[0].id;
}

/** 행동 난이도 선택 후 요약 한 줄 */
export function getResultMessage(level: CoachingActionTier): string {
  if (level === 'easy') return '작은 시도를 시작했어.';
  if (level === 'medium') return '조금 더 용기를 냈어.';
  return '관계를 바꿔보려 하고 있어.';
}

/** 다음 리딩용 카드 아이디 — getNextCard 와 동일 동작 */
export function getNextCard(opts: {
  level: CoachingActionTier;
  excludeIds: ReadonlySet<string>;
  seed: number;
}): string {
  return resolveNextRoundTarotId({
    tier: opts.level,
    excludeIds: opts.excludeIds,
    seed: opts.seed
  });
}
