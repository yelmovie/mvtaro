/**
 * 핵심 행동 → 200줄 규칙 확장(naturalize) + 감정 말투 + 강도 + 말하기(toSpeech)
 */

import type { EmotionIntensity } from './coaching-engine-v2-data';

export type IntensityLevel = 'weak' | 'normal' | 'strong';

/** 앱에서 쓰는 감정 키 (영문 유지는 타입만 — 출력 문장은 전부 한국어) */
export type CoachingEmotionToneKey = 'angry' | 'sad' | 'anxious' | 'frustrated';

const TARGET_PER_SUIT = 50;

export function normalizeLine(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function fitsLength(t: string): boolean {
  return t.length >= 10 && t.length <= 30;
}

/** 한 줄의 «시작 덩어리» (같은 시작 반복 제한용) */
function startKey(line: string): string {
  const t = normalizeLine(line);
  const parts = t.split(/\s+/);
  if (parts.length >= 2 && /^(오늘|짧게|조용히|부담|천천히|먼저|내일|함께|다시|한)$/.test(parts[0] ?? '')) {
    return `${parts[0]} ${parts[1]?.slice(0, 4) ?? ''}`;
  }
  return parts[0]?.slice(0, 6) ?? t.slice(0, 6);
}

/**
 * 자연화 변형 — 사용자 예시 + 부담 없이 + 마무리 문장
 */
export function naturalize(action: string): string[] {
  const a = normalizeLine(action);
  if (!a) return [];
  return [
    a,
    `오늘 ${a}`,
    `짧게 ${a}`,
    `조용히 ${a}`,
    `부담 없이 ${a}`,
    `${a} 정도만 해봐도 좋아`
  ];
}

/**
 * 확장 풀 생성: naturalize 합치기 + 같은 시작키 최대 3번 + 길이 필터
 */
export function expandBehavior(baseActions: readonly string[]): string[] {
  const seen = new Set<string>();
  const startCounts = new Map<string, number>();
  const out: string[] = [];

  const tryPush = (raw: string) => {
    const t = normalizeLine(raw);
    if (!fitsLength(t) || seen.has(t)) return;
    const sk = startKey(t);
    const c = startCounts.get(sk) ?? 0;
    if (c >= 3) return;
    seen.add(t);
    startCounts.set(sk, c + 1);
    out.push(t);
  };

  for (const action of baseActions) {
    for (const line of naturalize(action)) {
      tryPush(line);
      if (out.length >= TARGET_PER_SUIT) return out.slice(0, TARGET_PER_SUIT);
    }
  }

  const EXTRA = [
    (x: string) => `먼저 ${x}`,
    (x: string) => `내일 ${x}`,
    (x: string) => `함께 ${x}`,
    (x: string) => `다시 ${x}`,
    (x: string) => `천천히 ${x}`
  ];

  for (const action of baseActions) {
    for (const ex of EXTRA) {
      tryPush(ex(action));
      if (out.length >= TARGET_PER_SUIT) return out.slice(0, TARGET_PER_SUIT);
    }
  }

  for (const action of baseActions) {
    tryPush(`${action} 학교에서`);
    tryPush(`${action} 쉬는 시간에`);
    if (out.length >= TARGET_PER_SUIT) return out.slice(0, TARGET_PER_SUIT);
  }

  return out.slice(0, TARGET_PER_SUIT);
}

/** 감정별 말투 — 시드로 접두 하나 선택 (직접·따뜻·안정·정리) */
const EMOTION_OPENERS: Record<CoachingEmotionToneKey, readonly string[]> = {
  angry: ['지금은 ', '잠깐 ', '바로 반응 말고 ', ''],
  sad: ['천천히 ', '부담 없이 ', '내 마음을 ', ''],
  anxious: ['확인만 ', '짧게 ', '한 번에 하나만 ', ''],
  frustrated: ['한 줄로 ', '차근차근 ', '지금 상황을 ', '']
};

export function applyEmotionToneToAction(
  action: string,
  emotionKey: string,
  salt: number
): string {
  const k = emotionKey as CoachingEmotionToneKey;
  const pool = EMOTION_OPENERS[k] ?? EMOTION_OPENERS.sad;
  const pick = pool[salt % pool.length];
  const a = normalizeLine(action);
  if (!pick) return a;
  if (a.includes(pick.trim())) return a;
  return `${pick}${a}`;
}

/**
 * 행동 줄 강도 — weak: 조금 ~ / strong: 지금이라도 ~해 보는 게 좋아
 */
export function applyIntensityToActionLine(action: string, intensity: EmotionIntensity): string {
  const a = normalizeLine(action);
  if (!a) return a;
  if (intensity === 'normal') return a;
  if (intensity === 'weak') {
    if (/^조금\s/.test(a)) return a;
    return `조금 ${a}`;
  }
  if (intensity === 'strong') {
    if (/지금이라도/.test(a)) return a;
    if (/해보기$/.test(a)) {
      const stem = a.replace(/해보기$/, '').trim();
      return `지금이라도 ${stem}해 보는 게 좋아`;
    }
    if (/말해보기$/.test(a)) {
      const stem = a.replace(/말해보기$/, '').trim();
      return `지금이라도 ${stem}말해 보는 게 좋아`;
    }
    if (/시도해보기$/.test(a)) {
      const stem = a.replace(/시도해보기$/, '').trim();
      return `지금이라도 ${stem}시도해 보는 게 좋아`;
    }
    if (/ 말해 보기$/.test(a)) {
      const stem = a.replace(/ 말해 보기$/, '').trim();
      return `지금이라도 ${stem}말해 보는 게 좋아`;
    }
    if (/ 보기$/.test(a) && !/해보기$/.test(a) && !/말해보기$/.test(a)) {
      const stem = a.replace(/ 보기$/, '').trim();
      return `지금이라도 ${stem}해 보는 게 좋아`;
    }
    return `지금이라도 ${a} 해 보는 게 좋아`;
  }
  return a;
}

/** 말하기 두 줄에 붙는 가벼운 강도 (기존 호환) */
export function applyIntensity(text: string, level: IntensityLevel): string {
  const t = normalizeLine(text);
  if (!t) return t;
  if (level === 'normal') return t;
  if (level === 'weak') {
    if (t.startsWith('조금 ')) return t;
    return `조금 ${t}`;
  }
  if (level === 'strong') {
    if (t.startsWith('많이 ')) return t;
    return `많이 ${t}`;
  }
  return t;
}

export function applyIntensityFromEmotion(text: string, intensity: EmotionIntensity): string {
  return applyIntensity(text, intensity);
}

/**
 * 행동 → 말하기 (toSpeech) — 해보기/말해보기/보기 규칙 + 예외
 */
export function generateScripts(action: string): [string, string] {
  return toSpeech(action);
}

export function toSpeech(action: string): [string, string] {
  const a = normalizeLine(action);
  if (!a) return ['잠깐 얘기해도 될까?', '지금 이렇게 해도 될까?'];

  if (/말해보기$/.test(a)) {
    return [a.replace(/말해보기$/, '말해볼까?'), a.replace(/말해보기$/, '말해도 될까?')];
  }
  if (/시도해보기$/.test(a)) {
    return [a.replace(/시도해보기$/, '시도해볼까?'), a.replace(/시도해보기$/, '시도해도 될까?')];
  }
  if (/해보기$/.test(a)) {
    return [a.replace(/해보기$/, '해볼까?'), a.replace(/해보기$/, '해도 될까?')];
  }

  if (/남겨 보기$/.test(a)) {
    const base = a.slice(0, -'남겨 보기'.length);
    return [`${base}남겨 볼까?`, `${base}남겨도 될까?`];
  }
  if (/적어 보기$/.test(a)) {
    const base = a.slice(0, -'적어 보기'.length);
    return [`${base}적어 볼까?`, `${base}적어도 될까?`];
  }
  if (/말해 보기$/.test(a)) {
    const base = a.slice(0, -'말해 보기'.length);
    return [`${base}말해 볼까?`, `${base}말해도 될까?`];
  }
  if (/해 보기$/.test(a)) {
    const base = a.slice(0, -'해 보기'.length);
    return [`${base}해 볼까?`, `${base}해도 될까?`];
  }
  if (/나눠 보기$/.test(a)) {
    const base = a.slice(0, -'나눠 보기'.length);
    return [`${base}나눠 볼까?`, `${base}나눠도 될까?`];
  }
  if (/지켜 보기$/.test(a)) {
    const base = a.slice(0, -'지켜 보기'.length);
    return [`${base}지켜 볼까?`, `${base}지켜도 될까?`];
  }
  if (/맞춰 보기$/.test(a)) {
    const base = a.slice(0, -'맞춰 보기'.length);
    return [`${base}맞춰 볼까?`, `${base}맞춰도 될까?`];
  }
  if (/던져 보기$/.test(a)) {
    const base = a.slice(0, -'던져 보기'.length);
    return [`${base}던져 볼까?`, `${base}던져도 될까?`];
  }
  if (/부탁해 보기$/.test(a)) {
    const base = a.slice(0, -'부탁해 보기'.length);
    return [`${base}부탁해 볼까?`, `${base}부탁해도 될까?`];
  }
  if (/ 숨 고르기$/.test(a)) {
    const base = a.slice(0, -' 숨 고르기'.length);
    return [`${base} 숨 고를까?`, `${base} 숨 고르도 될까?`];
  }
  if (/고르기$/.test(a)) {
    return [a.replace(/고르기$/, '골라 볼까?'), a.replace(/고르기$/, '골라도 될까?')];
  }
  if (/ 보기$/.test(a)) {
    const base = a.slice(0, -' 보기'.length);
    return [`${base}해 볼까?`, `${base}해도 될까?`];
  }
  if (/줄이기$/.test(a)) {
    const base = a.slice(0, -'줄이기'.length);
    return [`${base}줄여 볼까?`, `${base}줄여도 될까?`];
  }
  if (/ 보여 주기$/.test(a)) {
    const base = a.slice(0, -' 보여 주기'.length);
    return [`${base} 보여 줄까?`, `${base} 보여 줘도 될까?`];
  }
  if (/주기$/.test(a)) {
    const stem = a.slice(0, -2);
    return [`${stem}줘 볼까?`, `${stem}줘도 될까?`];
  }

  const short = a.length > 14 ? `${a.slice(0, 14)}…` : a;
  return [`${short} 한번 해볼까?`, `${short} 지금 해도 될까?`];
}
