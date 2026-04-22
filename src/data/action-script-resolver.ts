/**
 * 행동 문장 → 말하기 예시 2~3개 연결 (감정·강도·티어 반영)
 */

import type { EmotionIntensity } from './coaching-engine-v2-data';
import type { SuitKey } from './action-step-matrix';
import { normalizeEmotionForActions } from './action-step-matrix';
import { SPEECH_LINES_100 } from './speech-db';

export type BehaviorTierUi = 'easy' | 'medium' | 'hard';

function seedPick<T>(items: T[], seed: number): T {
  if (items.length === 0) return items[0];
  const idx = Math.abs(seed) % items.length;
  return items[idx];
}

/** 강도별 공감 오프닝 한 줄 — 사용자 요청 문구 패밀리 */
function empathyOpener(emotionNorm: string, intensity: EmotionIntensity, seed: number): string {
  type Buck = Record<'angry' | 'sad' | 'anxious' | 'frustrated', string[]>;
  const weak: Buck = {
    angry: ['그때는 마음이 조금 거칠었을 수도 있어.', '속에 말을 붙들고 있었을 수도 있어.'],
    sad: ['마음이 조금 어색하게 남았을 수도 있어.', '표현이 서툴렀을 수도 있어.'],
    anxious: ['예민하게 느껴졌을 수도 있어.', '마음이 자꾸 돌았을 수도 있어.'],
    frustrated: ['머릿속이 조금 복잡했을 수도 있어.', '숨이 막히게 느껴졌을 수도 있어.']
  };
  const normal: Buck = {
    angry: ['그때는 속이 많이 따가웠을 수 있어.', '화난 게 남았을 수 있어.'],
    sad: ['속상했을 수 있어.', '마음에 구멍 난 것 같았을 수 있어.'],
    anxious: ['불안하게 느껴졌을 수 있어.', '확인하고 싶었을 수 있어.'],
    frustrated: ['막막했을 수 있어.', '순서가 안 잡혔을 수 있어.']
  };
  const strong: Buck = {
    angry: ['화가 많이 치밀었을 수 있어.', '그날은 참기가 정말 힘들었을 수 있어.'],
    sad: ['많이 속상했을 수 있어.', '마음이 많이 무거웠을 수 있어.'],
    anxious: ['많이 불안했을 수 있어.', '숨까지 얕아졌을 수 있어.'],
    frustrated: ['많이 답답했을 수 있어.', '해결이 안 보였을 수 있어.']
  };

  const bucket: Buck =
    intensity === 'weak' ? weak : intensity === 'strong' ? strong : normal;
  const ek = normalizeEmotionForActions(emotionNorm);
  const lines = bucket[ek] ?? bucket.sad;
  return seedPick(lines, seed + 31);
}

const SUIT_BRIDGE: Record<SuitKey, string[]> = {
  swords: ['말은 짧게, 속도는 천천히 가져가 보자.', '내용보다 분위기부터 고르게 해도 좋아.'],
  cups: ['감정 한 가지만 나눠도 의미 있어.', '내 마음 표현 하나만 붙여도 좋아.'],
  wands: ['먼저 작게 시작해도 괜찮아.', '용기 내는 순서부터 맞춰 보자.'],
  pentacles: ['할 수 있는 만큼만 현실적으로 말해도 좋아.', '약속 하나만 맞춰도 진전이야.'],
  major: ['오늘은 목표 하나만 적어두면 돼.', '큰 말 없이 진심 한 줄이면 충분해.']
};

const EASY_CLOSE: Record<BehaviorTierUi, string[]> = {
  easy: ['잠깐 얘기해도 될까?', '요즘 우리 분위기가 좀 신경 쓰였어.', '내가 먼저 인사부터 해볼게.'],
  medium: ['조금 속상했던 게 있었어.', '네 말이 계속 마음에 남았어.', '우리 시간 맞춰보자.'],
  hard: ['그때 내 마음은 이랬어.', '오해였을 수도 있는데 확인하고 싶어.', '우리 천천히 다시 얘기할래?']
};

/** 행동 한 줄과 연결된 말하기 2~3개 생성 */
export function resolveScriptsForBehavior(opts: {
  emotionKey: string;
  tier: BehaviorTierUi;
  intensity: EmotionIntensity;
  suit: SuitKey;
  actionText: string;
  seed: number;
}): string[] {
  const { emotionKey, tier, intensity, suit, seed } = opts;

  const open = empathyOpener(emotionKey, intensity, seed);
  const bridge = seedPick(SUIT_BRIDGE[suit], seed + 101);
  const closes = EASY_CLOSE[tier];

  const c1 = seedPick(closes, seed + 201);
  let c2 = seedPick(closes, seed + 307);
  if (c2 === c1 && closes.length > 1) {
    c2 = closes[(closes.indexOf(c1) + 1) % closes.length];
  }

  const scripts = tier === 'easy'
    ? [open, bridge, c1]
    : tier === 'medium'
      ? [open, c1, c2]
      : [open, c1, seedPick(['너 생각하면 마음이 조금 무거워.', '함께 방법 하나만 정해보자.', '내가 바라는 건 이거야.'], seed + 409)];

  const merged = uniqueShort(scripts);
  const pool = padWithSpeechPool(merged, seed, 3);
  return pool;
}

function padWithSpeechPool(base: string[], seed: number, target: number): string[] {
  const out = [...base];
  const seen = new Set(base);
  let step = 0;
  while (out.length < target && step < SPEECH_LINES_100.length * 3) {
    const line = SPEECH_LINES_100[(seed + step * 19) % SPEECH_LINES_100.length];
    step += 1;
    if (seen.has(line)) continue;
    seen.add(line);
    out.push(line);
  }
  return uniqueShort(out).slice(0, target);
}

function uniqueShort(lines: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}
