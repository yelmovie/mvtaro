/**
 * 코칭 완성용 로컬 데이터 — 카드 20장 + 해설 + 행동 200개 (외부 없이 동작)
 * 카드는 tarotId로 78장 이미지와 연결됩니다.
 */

import type { EmotionIntensity } from './coaching-engine-v2-data';
import { SPEECH_LINES_100 } from './speech-db';
import { behaviorCoreDB } from './coaching-core-bundle';
import { expandBehavior } from './behavior-expand-engine';
import { interpretationDB } from './interpretation-db';

export { behaviorCoreDB } from './coaching-core-bundle';
export {
  expandBehavior,
  generateScripts,
  applyIntensity,
  naturalize,
  applyIntensityToActionLine,
  applyEmotionToneToAction,
  toSpeech
} from './behavior-expand-engine';
export { interpretationDB };

export type CoachCardDirection = 'upright' | 'reversed';

export interface CoachCardRow {
  id: number;
  name: string;
  suit: 'cups' | 'swords' | 'wands' | 'pentacles';
  direction: CoachCardDirection;
  meaning: string;
  tarotId: string;
}

/** 1. 카드 20장 — 수트별 5장씩 균형 */
export const cardDB: readonly CoachCardRow[] = [
  {
    id: 1,
    name: '컵의 에이스',
    suit: 'cups',
    direction: 'upright',
    meaning: '조심스럽게 손 내밀고 싶은 마음이 생기고, 관계에 새 물줄기가 트일 수 있는 상황',
    tarotId: 'ace-of-cups'
  },
  {
    id: 2,
    name: '컵의 2',
    suit: 'cups',
    direction: 'upright',
    meaning: '말을 많이 하지 않아도 서로의 마음이 닿을 수 있고, 조금씩 가까워질 수 있는 상황',
    tarotId: 'two-of-cups'
  },
  {
    id: 3,
    name: '컵의 3',
    suit: 'cups',
    direction: 'reversed',
    meaning: '함께 웃고 싶은데 자리가 어색하게 느껴질 수 있어, 편한 만남을 찾아보면 좋은 상황',
    tarotId: 'three-of-cups'
  },
  {
    id: 4,
    name: '컵의 4',
    suit: 'cups',
    direction: 'reversed',
    meaning: '관심이 줄어든 것처럼 느껴져 마음이 가라앉을 수 있어, 필요한 걸 다시 고르게 되는 상황',
    tarotId: 'four-of-cups'
  },
  {
    id: 5,
    name: '컵의 5',
    suit: 'cups',
    direction: 'upright',
    meaning: '아쉬운 일이 있어도 아직 소중한 건 남아 있을 수 있어, 앞을 보게 되는 상황',
    tarotId: 'five-of-cups'
  },
  {
    id: 6,
    name: '완드의 에이스',
    suit: 'wands',
    direction: 'upright',
    meaning: '하고 싶은 말이나 시도가 생기고, 작게라도 움직이면 분위기가 바뀔 수 있는 상황',
    tarotId: 'ace-of-wands'
  },
  {
    id: 7,
    name: '완드의 2',
    suit: 'wands',
    direction: 'reversed',
    meaning: '계획이 흔들려 답답할 수 있어, 속도나 방법을 조금 바꿔 보면 숨통이 트일 수 있는 상황',
    tarotId: 'two-of-wands'
  },
  {
    id: 8,
    name: '완드의 3',
    suit: 'wands',
    direction: 'upright',
    meaning: '같이 가고 싶은 방향이 보이고, 서로 손을 맞대면 한 걸음씩 나아갈 수 있는 상황',
    tarotId: 'three-of-wands'
  },
  {
    id: 9,
    name: '완드의 4',
    suit: 'wands',
    direction: 'upright',
    meaning: '지금까지 쌓인 편안함이 있어서, 그 위에서 다시 용기를 낼 수 있는 상황',
    tarotId: 'four-of-wands'
  },
  {
    id: 10,
    name: '완드의 5',
    suit: 'wands',
    direction: 'reversed',
    meaning: '말이 부딪히는 느낌이 들 수 있어, 잠깐 거리를 두고 숨 고르면 좋은 상황',
    tarotId: 'five-of-wands'
  },
  {
    id: 11,
    name: '검의 에이스',
    suit: 'swords',
    direction: 'upright',
    meaning: '무엇이 맞는지 분명히 짚고 싶은 마음이 생기고, 차분한 말로 정리할 수 있는 상황',
    tarotId: 'ace-of-swords'
  },
  {
    id: 12,
    name: '검의 2',
    suit: 'swords',
    direction: 'reversed',
    meaning: '선택을 미루게 되고 마음이 복잡할 수 있어, 천천히 정리해 보면 되는 상황',
    tarotId: 'two-of-swords'
  },
  {
    id: 13,
    name: '검의 3',
    suit: 'swords',
    direction: 'upright',
    meaning: '마음이 아프거나 서운함이 크게 느껴질 수 있어, 그 감정을 숨기지 않아도 되는 상황',
    tarotId: 'three-of-swords'
  },
  {
    id: 14,
    name: '검의 4',
    suit: 'swords',
    direction: 'reversed',
    meaning: '말을 줄이고 잠시 쉬면 생각이 정리될 수 있어, 회복을 택하게 되는 상황',
    tarotId: 'four-of-swords'
  },
  {
    id: 15,
    name: '검의 5',
    suit: 'swords',
    direction: 'reversed',
    meaning: '이기려 하면 더 지칠 수 있어, 굳이 맞서지 않아도 마음을 지킬 수 있는 상황',
    tarotId: 'five-of-swords'
  },
  {
    id: 16,
    name: '펜타클의 에이스',
    suit: 'pentacles',
    direction: 'upright',
    meaning: '작은 약속이나 준비 하나로 시작할 수 있고, 현실적인 발판이 보이기 시작하는 상황',
    tarotId: 'ace-of-pentacles'
  },
  {
    id: 17,
    name: '펜타클의 2',
    suit: 'pentacles',
    direction: 'reversed',
    meaning: '여러 일이 겹쳐 흔들릴 수 있어, 역할을 나누면 부담이 줄어들 수 있는 상황',
    tarotId: 'two-of-pentacles'
  },
  {
    id: 18,
    name: '펜타클의 3',
    suit: 'pentacles',
    direction: 'upright',
    meaning: '함께 손을 맞대면 할 일이 나뉘고, 서로 도와가며 만들어갈 수 있는 상황',
    tarotId: 'three-of-pentacles'
  },
  {
    id: 19,
    name: '펜타클의 4',
    suit: 'pentacles',
    direction: 'reversed',
    meaning: '너무 조이거나 지키려 하면 숨이 막힐 수 있어, 나누고 조정하면 편해지는 상황',
    tarotId: 'four-of-pentacles'
  },
  {
    id: 20,
    name: '펜타클의 5',
    suit: 'pentacles',
    direction: 'upright',
    meaning: '혼자 버티기 어렵게 느껴질 수 있어, 도움을 구해도 괜찮다고 느껴지는 상황',
    tarotId: 'five-of-pentacles'
  }
];

export type BehaviorSuitKey = 'cups' | 'swords' | 'wands' | 'pentacles';

/** 수트별 행동 문장 풀 — 핵심 40개를 규칙 확장해 각 50줄 (총 200줄 근사) */
function buildBehaviorLines(): Record<BehaviorSuitKey, string[]> {
  return {
    cups: expandBehavior(behaviorCoreDB.cups),
    swords: expandBehavior(behaviorCoreDB.swords),
    wands: expandBehavior(behaviorCoreDB.wands),
    pentacles: expandBehavior(behaviorCoreDB.pentacles)
  };
}

export const behaviorDB = buildBehaviorLines();

/** tarot 카드 아이디 → 로컬 카드 번호 */
export const tarotIdToCoachCardId: Record<string, number> = Object.fromEntries(
  cardDB.map((c) => [c.tarotId, c.id])
);

function hashStr(n: number, s: string): number {
  let h = n | 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 33 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function shuffleForSeed(lines: readonly string[], seed: number): string[] {
  const arr = [...lines];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = hashStr(seed + i, arr[i]) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** 강도에 따라 시작점만 달리고 9개 행동을 고유하게 고름 */
export function pickNineBehaviorLines(
  suit: BehaviorSuitKey,
  intensity: EmotionIntensity,
  seed: number
): { easy: string[]; medium: string[]; hard: string[] } {
  const pool = behaviorDB[suit];
  const offset =
    intensity === 'weak' ? 0 : intensity === 'strong' ? 11 : 5;
  const shuffled = shuffleForSeed(pool, seed + offset * 17);
  const pickUnique = (start: number, count: number): string[] => {
    const out: string[] = [];
    let i = start % shuffled.length;
    let guard = 0;
    while (out.length < count && guard < shuffled.length * 2) {
      const line = shuffled[i % shuffled.length];
      i += 1;
      guard += 1;
      if (!out.includes(line)) out.push(line);
    }
    return out.slice(0, count);
  };
  const easy = pickUnique(0, 3);
  const medium = pickUnique(3, 3);
  const hard = pickUnique(6, 3);
  return { easy, medium, hard };
}

/** 확장 행동 풀(200줄) 기준 — 화면용 묶음은 coaching-core-bundle + interactive-action-bundle 사용 권장 */
export function getActions(suit: BehaviorSuitKey, intensity: EmotionIntensity, seed: number) {
  return pickNineBehaviorLines(suit, intensity, seed);
}

const INTENSITY_OPEN: Record<EmotionIntensity, string> = {
  weak: '조금 속상했을 수도 있어.',
  normal: '속상했을 수 있어.',
  strong: '많이 힘들었을 수도 있어.'
};

/** 행동 한 줄에 연결할 말하기 두 문장 — 강도에 따라 풀 오프셋 조정 */
export function scriptsForActionPair(opts: {
  actionText: string;
  intensity: EmotionIntensity;
  seed: number;
}): [string, string] {
  const base = hashStr(opts.seed, opts.actionText);
  const poolOff =
    opts.intensity === 'weak' ? 0 : opts.intensity === 'strong' ? 41 : 19;
  let step = 0;
  let a = '';
  let b = '';
  while ((!a || !b || a === b) && step < 400) {
    const i = (base + poolOff + step * 11) % SPEECH_LINES_100.length;
    const j = (base + poolOff + step * 17 + 29) % SPEECH_LINES_100.length;
    step += 1;
    a = SPEECH_LINES_100[i];
    b = SPEECH_LINES_100[j];
  }
  return [a || '잠깐 얘기해도 될까?', b || '요즘 우리 분위기가 마음에 걸렸어.'];
}

/** 감정 강도별 공감 한 줄 — 말하기 앞에 붙일 때 사용 */
export function empathyLineForIntensity(intensity: EmotionIntensity): string {
  return INTENSITY_OPEN[intensity];
}

export function getInterpretation(cardId: number) {
  return interpretationDB[cardId];
}
