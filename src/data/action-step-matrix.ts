/**
 * 결과 2단계 실천 행동 — 감정·수트별 풀 (각 티어당 3문장 무작위 추출용)
 * 문장: 초등 고학년 톤, 행동 중심, 15~25자 내외 권장
 */

export type EmotionKeyForAction = 'angry' | 'sad' | 'anxious' | 'frustrated';

export type SuitKey = 'cups' | 'swords' | 'wands' | 'pentacles' | 'major';

export const FALLBACK_ACTION_LINE = '지금은 천천히 생각해보기';

/** pad 시 티어 간 중복 회피용 순환 문장 */
export const ACTION_FALLBACK_ROTATION = [
  FALLBACK_ACTION_LINE,
  '지금은 한 줄만 종이에 적어보기',
  '내일 다시 차분히 말해보기'
];

/** 쉬운 행동 — 화남 */
const EASY_ANGRY: string[] = [
  '바로 반응하기 전에 두 발자국 물러서 숨 세 번 세기',
  '카톡 보내기 전 화면 껐다가 한 줄만 다시 적어보기',
  '손주먹 풀고 물 한 모금 마시기',
  '말하고 싶은 건 메모로만 적어두기',
  '그날은 통화 대신 글로만 남겨보기',
  '친구 얼굴 보기 전까지 단톡 답장 미루기'
];

/** 쉬운 행동 — 속상함 */
const EASY_SAD: string[] = [
  '오늘은 친구 사진만 보지 않기로 하기',
  '복도에서 마주치면 고개만 가볍게 숙이기',
  '좋아하는 음악 한 곡 듣고 교실 들어가기',
  '내 마음 한 단어를 연습장 모서리에 적기',
  '울고 싶으면 화장실에서 잠깐 울고 오기',
  '선생님께 쉬는 시간에 말 걸 기회만 만들어두기'
];

/** 쉬운 행동 — 불안함 */
const EASY_ANXIOUS: string[] = [
  '확인하고 싶은 걸 한 문장으로 종이에 적기',
  '친구 시선만 보지 말고 발바닥 느낌에 집중하기',
  '단톡 알림을 잠깐 끄고 숨 고르기',
  '지금 걱정을 별 세 개 점수로 매겨보기',
  '오늘은 질문 한 번만 하고 나머지는 내일로 미루기',
  '믿는 친구 한 명에게 짧게 물어보기만 하기'
];

/** 쉬운 행동 — 답답함 */
const EASY_FRUSTRATED: string[] = [
  '해야 할 일 한 가지만 종이에 적어보기',
  '말할 순서를 머릿속으로 세 번만 말해보기',
  '창문 열고 바깥 공기 한 번 들이마시기',
  '친구에게 바로 말하지 않고 오늘만 참아보기',
  '내 말을 녹음으로만 남겨보고 지우기',
  '자리만 바꿔 앉아보고 기분 차이 적어보기'
];

/** 수트별 쉬운 행동 오버레이 */
const EASY_SUIT: Record<SuitKey, string[]> = {
  swords: [
    '말로 승부 내지 않고 시간을 하루만 미루기',
    '날카로운 말 대신 사실만 한 줄 적기',
    '대화 전에 주장 한 개만 정해두기',
    '문자는 짧게 두 문장 안으로 줄이기',
    '서로 소리치지 않기로 속으로만 약속하기'
  ],
  cups: [
    '내 기분을 색 한 가지로만 말해보기',
    '친구 말 끝날 때까지 끼어들지 않기',
    '위로 한마디만 연습해서 적어두기',
    '눈물 날 땐 잠깐 자리 비우기',
    '오늘 고마웠던 점 한 가지만 떠올리기'
  ],
  wands: [
    '먼저 손 들고 발언 순서 지키기',
    '제안 한 가지만 메모해 들고 가기',
    '작게라도 먼저 손 흔들어보기',
    '운동장 한 바퀴만 걸으며 마음 가라앉히기',
    '하고 싶은 말을 동그라미 친 한 줄만 남기기'
  ],
  pentacles: [
    '약속 시간을 한 가지만 정리해서 적기',
    '함께할 수 있는 현실적인 일 한 가지 고르기',
    '숙제·준비물부터 맞춰보기',
    '학교 규칙 안에서 할 수 있는 행동만 고르기',
    '오늘 손에 잡히는 준비물 하나만 챙기기'
  ],
  major: [
    '오늘은 한 가지 마음만 붙잡고 나머지는 내려놓기',
    '큰 결심은 내일로 미루고 오늘은 숨만 고르기',
    '지금 할 수 있는 최소 행동 하나만 고르기',
    '친구와 나의 거리를 숫자로 매겨보기',
    '오늘의 목표를 한 단어로 적어두기'
  ]
};

const MEDIUM_ANGRY: string[] = [
  '화난 이유를 나·상대·상황으로 나눠 적어보기',
  '선생님께 상황만 짧게 알리고 조언 듣기',
  '친구에게 나중에 말하겠다고 시간만 정해두기',
  '내가 원하는 결과를 한 문장으로 적기',
  '사과가 아니라 내 감정만 먼저 전하기 연습하기'
];

const MEDIUM_SAD: string[] = [
  '쉬는 시간에 조용히 다가가 인사만 건네보기',
  '"요즘 좀 힘들었어"라고 한 줄만 말해보기',
  '친구의 하루를 질문 한 개로만 물어보기',
  '단톡에서 오해 난 부분만 사실으로 짚어보기',
  '함께 걸으며 짧게 대화 신청해보기'
];

const MEDIUM_ANXIOUS: string[] = [
  '"지금 이렇게 느껴"라고 감정만 말해보기',
  '확인하고 싶은 걸 네 아니오로만 물어보기',
  '내가 필요한 것을 한 가지만 부탁해보기',
  '상대 반응을 기다리며 바로 채팅 추가하지 않기',
  '친구 표정만 보고 결론 내리지 않기로 하기'
];

const MEDIUM_FRUSTRATED: string[] = [
  '지금 상황을 종이에 시간 순서로 적어보기',
  '친구에게 내가 원하는 걸 한 가지만 말하기',
  '목소리 크기를 일부러 한 단계만 낮추기',
  '"나는 이렇게 들었어"라고 사실만 전하기',
  '해결보다 오늘은 서로 할 말만 적어보기'
];

const MEDIUM_SUIT: Record<SuitKey, string[]> = {
  swords: [
    '말을 바꿔 한 번 더 말해보기 연습하기',
    '진실만 짧게 적어 보여주기',
    '말싸움이 길어지면 잠깐 자리 비우기',
    '문자는 짧게 두 문장 안으로 줄이기',
    '날카로운 말 대신 사실만 한 줄 적기'
  ],
  cups: [
    '내 마음 그림 그려서 보여주기',
    '"속상했어" 한마디만 전하기',
    '친구 이야기 요약해서 내가 이해한 것 말하기',
    '울컥하면 물 마시고 한 문장만 말하기',
    '친구 말에 공감 한마디만 덧붙이기'
  ],
  wands: [
    '같이 할 작은 활동 하나 제안하기',
    '먼저 연락할 시간만 정해두기',
    '밝은 인사 한마디로 분위기 바꿔보기',
    '게임이나 공부 같이 한 판만 하자고 말하기',
    '주도하지 말고 번갈아 말하기로 정하기'
  ],
  pentacles: [
    '함께 할 숙제·역할 하나 나누기',
    '현실적으로 가능한 약속만 잡기',
    '작은 도움 요청 한 가지 해보기',
    '시간·장소를 구체적으로만 정하기',
    '각자 준비할 것 한 가지씩 적기'
  ],
  major: [
    '지금 선택지를 두 개만 적고 하나 고르기',
    '어른에게 조언 한마디만 구하기',
    '오늘과 내일 할 일을 나눠 적기',
    '중요한 기준 한 가지만 상대와 맞추기',
    '지금 마음을 숫자 점수로만 바꿔 말하기'
  ]
};

const HARD_ANGRY: string[] = [
  '"그때 나는 이렇게 느꼈어"라고 바로 말하기',
  '내 잘못 부분과 서운한 부분을 나눠 말하기',
  '사과가 필요하면 짧게 먼저 사과하기',
  '다시 싸우지 않기 위한 규칙 한 가지 정하기'
];

const HARD_SAD: string[] = [
  '"너랑 다시 편하고 싶어"라고 말해보기',
  '내가 바라는 관계를 한 문장으로 말하기',
  '미안한 점과 바라는 점을 나눠 말하기',
  '같이 산책하며 천천히 이야기해보기'
];

const HARD_ANXIOUS: string[] = [
  '"내가 불안했던 건 이거야"라고 구체적으로 말하기',
  '확인받고 싶은 질문을 세 개만 적어 물어보기',
  '오해였다면 바로 고쳐달라고 부탁하기',
  '서로 필요한 말을 번갈아 한 마디씩 하기'
];

const HARD_FRUSTRATED: string[] = [
  '지금 문제를 함께 해결할 방법 하나 정하기',
  '각자 할 일을 나눠 적고 다시 만나기로 하기',
  '큰 싸움 전에 멈추는 암호 한 가지 정하기',
  '같이 선생님께 말해도 된다고 제안하기'
];

const HARD_SUIT: Record<SuitKey, string[]> = {
  swords: [
    '말이 아니라 글로만 정리해서 전달하기',
    '세 번 생각한 말만 입 밖으로 내기',
    '서로 말 끊지 않기 약속하고 대화하기',
    '큰 목소리 나오면 즉시 멈추고 물 마시기',
    '팩트만 적은 쪽지를 나눠 보여주기'
  ],
  cups: [
    '울어도 괜찮다고 말하고 마음 털어놓기',
    '상대 마음을 한 문장으로 되받아 말해보기',
    '앞으로 연락 방식을 같이 정하기',
    '미안함과 바람을 한 매듭씩 나눠 말하기',
    '오늘 대화 후 마음 한 줄 서로 적어 바꿔 보기'
  ],
  wands: [
    '처음 인사하는 것처럼 다시 시작해보자고 말하기',
    '작은 성공 경험 하나 같이 만들기',
    '용기 내어 악수나 하이파이브로 화해 신호 보내기',
    '함께 목표 하나만 정하고 다음 주까지 지키기',
    '역할 나눠 다음 만남까지 할 일 적기'
  ],
  pentacles: [
    '같이 시간표 맞춰보고 다음 약속 잡기',
    '현실적으로 지킬 수 있는 약속 한 가지 하기',
    '서로 필요한 도움을 한 가지씩 말하기',
    '문제 해결 순서를 번호로 적어 합의하기',
    '각자 할 일 완료 시기를 적어 교환하기'
  ],
  major: [
    '관계에서 지키고 싶은 약속 한 가지 정하기',
    '서로 바라는 미래를 한 줄로 바꿔 말하기',
    '오늘 대화 내용을 메모로 남기고 서명하기',
    '앞으로 싸우면 멈추는 신호 한 가지 정하기',
    '한 달 뒤 다시 물어볼 질문 하나만 적어두기'
  ]
};

const EMOTION_DEFAULT: Record<string, EmotionKeyForAction> = {
  angry: 'angry',
  sad: 'sad',
  anxious: 'anxious',
  frustrated: 'frustrated',
  sorry: 'sad',
  brave: 'frustrated',
  reconcile: 'sad',
  distance: 'anxious'
};

export function normalizeEmotionForActions(ek: string): EmotionKeyForAction {
  const k = ek as EmotionKeyForAction;
  if (['angry', 'sad', 'anxious', 'frustrated'].includes(ek)) return k;
  return (EMOTION_DEFAULT[ek] ?? 'sad') as EmotionKeyForAction;
}

export function normalizeSuitForActions(suit: string): SuitKey {
  if (suit === 'cups' || suit === 'swords' || suit === 'wands' || suit === 'pentacles') return suit;
  return 'major';
}

function tierByEmotion(
  ek: EmotionKeyForAction,
  tier: 'easy' | 'medium' | 'hard'
): string[] {
  const map: Record<EmotionKeyForAction, { easy: string[]; medium: string[]; hard: string[] }> = {
    angry: { easy: EASY_ANGRY, medium: MEDIUM_ANGRY, hard: HARD_ANGRY },
    sad: { easy: EASY_SAD, medium: MEDIUM_SAD, hard: HARD_SAD },
    anxious: { easy: EASY_ANXIOUS, medium: MEDIUM_ANXIOUS, hard: HARD_ANXIOUS },
    frustrated: { easy: EASY_FRUSTRATED, medium: MEDIUM_FRUSTRATED, hard: HARD_FRUSTRATED }
  };
  return map[ek][tier];
}

export function buildTierPool(
  tier: 'easy' | 'medium' | 'hard',
  emotionKey: string,
  suit: string,
  problemActions: string[],
  meaningExtras: string[]
): string[] {
  const ek = normalizeEmotionForActions(emotionKey);
  const sk = normalizeSuitForActions(suit);
  const emotionLines = tierByEmotion(ek, tier);
  const suitLines = tier === 'easy' ? EASY_SUIT[sk] : tier === 'medium' ? MEDIUM_SUIT[sk] : HARD_SUIT[sk];

  const cleanedExtras = [...meaningExtras, ...problemActions]
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => s.length >= 6 && s.length <= 40);

  const merged = [...emotionLines, ...suitLines, ...cleanedExtras];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of merged) {
    if (seen.has(line)) continue;
    seen.add(line);
    out.push(line);
  }
  return out;
}

/** 수트별 행동 DB 행 — 총 50개(동일 텍스트는 한 번만) */
export interface BehaviorDbRow {
  tier: 'easy' | 'medium' | 'hard';
  text: string;
  /** 가벼움(1)~직설(3), 강도 선택 가중치용 */
  directness: 1 | 2 | 3;
}

/** 카드 군(cups/swords/wands/pentacles/major)별 50개 행동 레코드 */
export function getBehaviorRowsForSuit(suit: SuitKey): BehaviorDbRow[] {
  const rows: BehaviorDbRow[] = [];

  const pushAll = (
    tier: BehaviorDbRow['tier'],
    texts: string[],
    dirBase: 1 | 2 | 3
  ) => {
    texts.forEach((text, i) => {
      rows.push({
        tier,
        text,
        directness: (((dirBase + i - 1) % 3) + 1) as 1 | 2 | 3
      });
    });
  };

  pushAll('easy', EASY_SUIT[suit], 1);
  pushAll('medium', MEDIUM_SUIT[suit], 2);
  pushAll('hard', HARD_SUIT[suit], 3);

  pushAll(
    'easy',
    [...EASY_ANGRY, ...EASY_SAD, ...EASY_ANXIOUS, ...EASY_FRUSTRATED],
    1
  );
  pushAll(
    'medium',
    [...MEDIUM_ANGRY, ...MEDIUM_SAD, ...MEDIUM_ANXIOUS, ...MEDIUM_FRUSTRATED],
    2
  );
  pushAll(
    'hard',
    [...HARD_ANGRY, ...HARD_SAD, ...HARD_ANXIOUS, ...HARD_FRUSTRATED],
    3
  );

  const seen = new Set<string>();
  const uniq: BehaviorDbRow[] = [];
  for (const row of rows) {
    const k = row.text.trim();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    uniq.push(row);
    if (uniq.length >= 50) break;
  }

  let pad = 0;
  while (uniq.length < 50) {
    uniq.push({
      tier: pad % 3 === 0 ? 'easy' : pad % 3 === 1 ? 'medium' : 'hard',
      text: ACTION_FALLBACK_ROTATION[pad % ACTION_FALLBACK_ROTATION.length],
      directness: ((pad % 3) + 1) as 1 | 2 | 3
    });
    pad += 1;
  }

  return uniq.slice(0, 50);
}
