/**
 * 핵심 행동 40개 — [구체 행동] + [부드러운 마무리], 어미 다양화(해보기·말해보기·시도해보기·거 보기 등)
 */

import { generateScripts } from './behavior-expand-engine';

export type CoreSuitKey = 'cups' | 'swords' | 'wands' | 'pentacles';

export interface CoreActionRow {
  suit: CoreSuitKey;
  action: string;
}

/** 40행 — 수트별 10개 */
export const coachingCoreActions: readonly CoreActionRow[] = [
  // cups
  { suit: 'cups', action: '쉬는 시간에 복도에서 눈 맞추고 인사 말해보기' },
  { suit: 'cups', action: '단톡에 안부 한 줄만 남겨 보기' },
  { suit: 'cups', action: '물 마시고 내 기분 한 문장 말해보기' },
  { suit: 'cups', action: '고마웠던 일 한 가지 적어 보기' },
  { suit: 'cups', action: '친구 옆에 잠깐 서 있는 거 시도해보기' },
  { suit: 'cups', action: '내 기분을 색깔로 말해 보기' },
  { suit: 'cups', action: '장난 대신 진짜 인사 한 번 해 보기' },
  { suit: 'cups', action: '친구 말 끝날 때까지 기다려 보기' },
  { suit: 'cups', action: '부담 없는 질문 하나 적어 보기' },
  { suit: 'cups', action: '내일 인사할 시간만 머릿속에 정해 보기' },
  // swords
  { suit: 'swords', action: '화 날 때 물 한 모금 마시고 말 줄이기' },
  { suit: 'swords', action: '문자는 두 문장 안으로 줄여 보내 보기' },
  { suit: 'swords', action: '세 번 생각한 말만 꺼내 보기' },
  { suit: 'swords', action: '말 끊지 않기로 속으로 약속해 보기' },
  { suit: 'swords', action: '팩트만 적은 쪽지 나눠 보여 주기' },
  { suit: 'swords', action: '그날은 통화 대신 글로만 남겨 보기' },
  { suit: 'swords', action: '확인 질문 하나만 던져 보기' },
  { suit: 'swords', action: '울면 말 멈추고 물만 건네 보기' },
  { suit: 'swords', action: '삼 초 세고 다시 말해 보기' },
  { suit: 'swords', action: '그날은 농담 대신 진지하게 말해 보기' },
  // wands
  { suit: 'wands', action: '앞에서 손 들고 차례 지켜 보기' },
  { suit: 'wands', action: '먼저 손 흔들어 인사해 보기' },
  { suit: 'wands', action: '같이 할 작은 일 하나 제안해 보기' },
  { suit: 'wands', action: '밝은 인사 한마디로 분위기 바꿔 보기' },
  { suit: 'wands', action: '운동장 한 바퀴 걸으며 숨 고르기' },
  { suit: 'wands', action: '내일 말 걸 시간만 약속해 보기' },
  { suit: 'wands', action: '작은 성공에 하이파이브 해 보기' },
  { suit: 'wands', action: '긴장될 때 손뼉 치고 시작해 보기' },
  { suit: 'wands', action: '친구 칭찬 한마디 건네 보기' },
  { suit: 'wands', action: '게임이나 공부 한 판 같이 하자 말해 보기' },
  // pentacles
  { suit: 'pentacles', action: '할 일 한 가지만 종이에 적어 보기' },
  { suit: 'pentacles', action: '약속 시간 한 가지만 정리해 보기' },
  { suit: 'pentacles', action: '역할 나눈 걸 한 줄씩 적어 보기' },
  { suit: 'pentacles', action: '지킬 수 있는 약속 하나 잡아 보기' },
  { suit: 'pentacles', action: '준비물 하나만 같이 맞춰 보기' },
  { suit: 'pentacles', action: '오늘 할 일과 내일 할 일 나눠 보기' },
  { suit: 'pentacles', action: '작은 도움 하나 부탁해 보기' },
  { suit: 'pentacles', action: '집에서 할 일 한 줄 공유해 보기' },
  { suit: 'pentacles', action: '함께 체크할 표 하나 만들어 보기' },
  { suit: 'pentacles', action: '현실적으로 가능한 약속만 잡아 보기' }
];

function groupBySuit(): Record<CoreSuitKey, string[]> {
  const out: Record<CoreSuitKey, string[]> = {
    cups: [],
    swords: [],
    wands: [],
    pentacles: []
  };
  for (const row of coachingCoreActions) {
    out[row.suit].push(row.action);
  }
  return out;
}

/** 수트별 행동 10개 */
export const behaviorCoreDB: Record<CoreSuitKey, readonly string[]> = groupBySuit();

/** 평탄 배열 (내보내기·디버그용) */
export const coreActionMap = coachingCoreActions.map(({ action }) => ({
  action,
  scripts: [...generateScripts(action)] as [string, string]
}));

export function getScriptsForCoreAction(actionText: string): [string, string] {
  return generateScripts(actionText);
}

function hashStr(n: number, s: string): number {
  let h = n | 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 33 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function shuffleCore(lines: readonly string[], seed: number): string[] {
  const arr = [...lines];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = hashStr(seed + i, arr[i]) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** 티어별 행동 3개씩 — 로컬 테스트·보조용 */
export function pickNineCoreBehaviors(suit: CoreSuitKey, seed: number): {
  easy: string[];
  medium: string[];
  hard: string[];
} {
  const pool = shuffleCore(behaviorCoreDB[suit], seed);
  return {
    easy: pool.slice(0, 3),
    medium: pool.slice(3, 6),
    hard: pool.slice(6, 9)
  };
}
