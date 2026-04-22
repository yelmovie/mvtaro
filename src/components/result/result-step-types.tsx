import type { CoachingInteractiveActionSetResolved } from '../../data/interactive-action-bundle';
import { FALLBACK_ACTION_LINE } from '../../data/action-step-matrix';
import { getResultMessage } from '../../data/coaching-registry';

export type ResultStep = 1 | 2 | 3;

export type { CoachingInteractiveActionSetResolved };

export type ActionStepKey = 'easy' | 'medium' | 'hard';

export const ACTION_STEP_META: Array<{
  key: ActionStepKey;
  heading: string;
  emoji: string;
}> = [
  { key: 'easy', heading: '먼저 이렇게 해볼 수 있어요', emoji: '😊' },
  { key: 'medium', heading: '조금 더 용기를 내보면', emoji: '💬' },
  { key: 'hard', heading: '준비가 되면 이렇게도 해볼 수 있어요', emoji: '✨' }
];

export const SECTION_EMOJI = {
  selfFeeling: '💛',
  friendFeeling: '🩵',
  goodAction: '💭',
  dialogue: '🗣️',
  todayAction: '🌱',
  mindSummary: '✏️',
  choice: '✨',
  teacher: '🍀'
} as const;

export interface ResultStepBaseProps {
  onPrev: () => void;
  onNext?: () => void;
}

export interface ResultStepEmotionProps extends ResultStepBaseProps {
  emotionInsight: string;
  friendPerspective: string;
}

export interface ResultStepActionProps extends ResultStepBaseProps {
  actionGuide: string;
  actionSteps: {
    easy: string[];
    medium: string[];
    hard: string[];
  };
  interactiveActionSet?: CoachingInteractiveActionSetResolved | null;
  selectedAction?: { tier: ActionStepKey; index: number } | null;
  onSelectAction?: (tier: ActionStepKey, index: number) => void;
}

const DEFAULT_TIER_LINES: Record<ActionStepKey, string[]> = {
  easy: ['오늘은 친구를 한 번 바라보기', '짧게라도 먼저 인사해보기', '숨 세 번 세고 한 마디만 생각하기'],
  medium: ['간단한 말을 먼저 건네보기', '상대 말을 끝까지 들어보기', '작은 질문으로 대화 시작하기'],
  hard: [
    '"나 사실 조금 속상했어"라고 솔직하게 말해보기',
    '"우리 다시 편하게 이야기해볼래?"라고 말해보기',
    '"내 마음을 좀 말해도 될까?"라고 물어보기'
  ]
};

/** 구버전(문자열)·빈 값 호환 — 티어당 항상 3줄 */
export function normalizeActionSteps(
  raw: Partial<Record<ActionStepKey, string | string[]>> | undefined
): Record<ActionStepKey, string[]> {
  const fb = FALLBACK_ACTION_LINE;

  function tier(key: ActionStepKey): string[] {
    const v = raw?.[key];
    let lines: string[] = [];
    if (Array.isArray(v)) {
      lines = v.map((s) => String(s).trim()).filter(Boolean);
    } else if (typeof v === 'string' && v.trim()) {
      lines = [v.trim()];
    }
    const base = DEFAULT_TIER_LINES[key];
    return [0, 1, 2].map((i) => lines[i] ?? base[i] ?? fb);
  }

  return {
    easy: tier('easy'),
    medium: tier('medium'),
    hard: tier('hard')
  };
}

export interface ResultStepSummaryProps extends ResultStepBaseProps {
  dialogues: string[];
  todaySmallAction: string;
  todayMindSummary: string;
  teacherTip?: string;
  followupGuideText: string;
  /** 행동 단계에서 고른 단계 기반 피드백 */
  behaviorFeedback?: string;
  onTryDifferentMethod: () => void;
  onTryTomorrow: () => void;
}

/** 선택한 행동 단계 → 후속 결과 문구 */
export const FEEDBACK_BY_ACTION_TIER: Record<ActionStepKey, string> = {
  easy: getResultMessage('easy'),
  medium: getResultMessage('medium'),
  hard: getResultMessage('hard')
};

export function softenAction(text: string): string {
  if (!text) return '';

  let t = text.trim().replace(/["“”]/g, '');
  t = t.replace(/하기$/, '해보는 것도 좋아요')
    .replace(/보기$/, '보는 것도 좋아요')
    .replace(/않기$/, '않는 것도 좋아요');

  if (/[.!?…]$/.test(t)) return t;
  if (/(좋아요|괜찮아요|돼요|있어요|방법이에요|어때요)$/.test(t)) return `${t}.`;
  return `${t}는 것도 좋아요.`;
}

function splitIntoSentences(normalized: string): string[] {
  const byPunct = normalized.split(/(?<=[.!?…。])\s+/).filter(Boolean);
  if (byPunct.length > 0) {
    return byPunct;
  }
  const byYo = normalized.split(/(?<=요)\s+/).filter(Boolean);
  if (byYo.length > 1) {
    return byYo;
  }
  return [normalized];
}

export function SoftParagraph({
  text,
  layout = 'paired'
}: {
  text: string;
  /** paired: 문장 2개씩 묶음 | sentence: 문장마다 한 줄(박스 높이·리듬 안정) */
  layout?: 'paired' | 'sentence';
}) {
  if (!text) return null;

  const normalized = text.replace(/\s+/g, ' ').trim();
  const sentences = splitIntoSentences(normalized);

  if (layout === 'sentence') {
    return (
      <>
        {sentences.map((sentence, idx) => (
          <p key={idx}>{sentence}</p>
        ))}
      </>
    );
  }

  const chunks: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    chunks.push(sentences.slice(i, i + 2).join(' '));
  }

  return (
    <>
      {chunks.map((chunk, idx) => (
        <p key={idx}>{chunk}</p>
      ))}
    </>
  );
}
