import { CoachingScenario } from '../data/scenarios';
import { ACTION_STEP_META } from '../components/result/result-step-types';
import {
  actionLines as actionLinePool,
  closingLines as closingLinePool,
  dialogueLines as dialogueLinePool,
  empathyLines as empathyLinePool,
  flattenEmotionLines,
  friendPerspectiveLines as friendPerspectiveLinePool
} from '../data/coaching-sentence-pools';
import { empathyLines as baseEmpathyLines } from '../data/rule-empathy-lines';
import {
  EmotionIntensity,
  INTENSITY_EXPRESSIONS,
  SAFETY_LINE
} from '../data/coaching-engine-v2-data';
import {
  actionLines as ACTION_LINES_V3,
  dialogueLines as DIALOGUE_LINES_V3,
  friendPerspectiveLines as FRIEND_PERSPECTIVE_LINES_V3,
  getToneByEmotionAndSuit
} from '../data/coaching-engine-v3-data';
import { buildInteractiveActionBundle } from '../data/interactive-action-bundle';
import { getInterpretation, tarotIdToCoachCardId } from '../data/coaching-complete-data';
import { tarotCards78Data } from '../data/tarot-cards-78';
import { DrawnCard } from '../types/app-types';

function tierHeadingLabels(): Record<'easy' | 'medium' | 'hard', string> {
  return Object.fromEntries(ACTION_STEP_META.map((m) => [m.key, m.heading])) as Record<
    'easy' | 'medium' | 'hard',
    string
  >;
}

type EmotionKey =
  | 'angry'
  | 'sad'
  | 'anxious'
  | 'frustrated'
  | 'sorry'
  | 'brave'
  | 'reconcile'
  | 'distance';

type CardCategory =
  | '속상함'
  | '화남'
  | '불안함'
  | '답답함'
  | '미안함'
  | '용기'
  | '화해'
  | '거리감'
  | '다시 시작'
  | '도움/배려';

type PatternType =
  | '공감형'
  | '오해해소형'
  | '용기내기형'
  | '거리좁히기형'
  | '사과회복형'
  | '기다림배려형'
  | '솔직표현형'
  | '마음정리형'
  | '함께행동형'
  | '다시시작형';

type PositionRole = 0 | 1 | 2;

/** 결과 1단계 — 내 마음: 오늘 실천 가능한 긍정 문장 풀 (랜덤 3문장 추가) */
const PRACTICAL_KID_LINES_SELF: string[] = [
  '오늘은 일부러 크게 말하지 않아도, 복도에서 마주치면 가볍게 인사만 해도 좋아.',
  '너무 빨리 풀리려고 하지 말고, 쉬는 시간에 물 한 모금 마시며 숨을 한 번 고르면 마음이 조금 가벼워질 수 있어.',
  '마음이 올라올 땐 바로 답하기보다 “지금은 생각 정리할게”라고 속으로 말해도 충분히 용감한 거야.',
  '작은 종이에 내 마음 한 줄만 적어 넣었다가 집에서 다시 읽어보면 생각이 정리되기도 해.',
  '친구가 말할 때는 핸드폰을 잠깐 내려놓고 눈만 맞춰 들어주면 관계가 덜 어색해질 수 있어.',
  '오늘은 ‘내가 잘못했나?’보다 ‘나는 지금 어떤 마음이야?’를 먼저 물어보는 연습을 해봐도 좋아.',
  '화가 날 땐 세 번 세고, 지나가는 말 말고 나중에 한 문장만 남겨보자고 생각해도 돼.',
  '혼자 몰래 울어도 괜찮아. 울고 나면 조금은 마음이 정리되기도 해.',
  '선생님이나 믿는 어른에게 “친구랑 좀 고민돼요”라고만 말해도 도움이 될 수 있어.',
  '점심시간에 친구 옆자리가 비면 조용히 앉아도 좋고, 인사 한마디만 건네도 오늘의 작은 시작이야.',
  '내 이야기를 전부 다 말하지 않아도, 오늘은 한 가지만 솔직하게 말해보는 연습을 해도 충분해.',
  '단톡은 보내기 전에 한 번만 다시 읽고, 화난 말은 내일로 미뤄도 괜찮아.',
  '나를 위한 칭찬 한마디(“나 오늘도 잘 버텼다”)를 속으로 해보면 마음이 조금 따뜻해질 수 있어.',
  '친구 사진이나 글을 보고 비교가 나오면 잠깐 앱을 내려놓고 창밖을 보는 것도 방법이야.',
  '너무 미안해하지 말고, 먼저 “내가 그때는 이랬어”라고 짧게 말할 기회를 한 번만 만들어봐도 좋아.'
];

/** 결과 1단계 — 친구 입장: 관계를 부드럽게 만드는 실천 문장 풀 */
const PRACTICAL_KID_LINES_FRIEND: string[] = [
  '친구도 그날은 컨디션이 안 좋았거나, 다른 걱정이 있었을 수 있어.',
  '상대가 말을 줄였다고 해서 너를 싫어한다는 뜻만은 아닐 수 있어.',
  '부담 없게 “괜찮아?” 한마디만 건네면 대화 문이 아주 조금 열릴 수 있어.',
  '친구 입장에서 생각해 보면 ‘그때는 그랬나 보다’라고 넓게 이해해 보는 연습을 해도 좋아.',
  '짧게라도 말을 건네 보면, 나중에 긴 이야기로 이어지기 쉬워질 수 있어.',
  '같이 웃을 수 있는 작은 장면(간식 나누기, 게임 한 판)을 한 번 만들어봐도 관계가 부드러워질 수 있어.',
  '상대가 바로 대답하지 않아도, 시간을 주는 것도 배려일 수 있어.',
  '오해가 있었다면 “내가 이렇게 들었어”라고 사실만 짧게 말해보는 것도 도움이 돼.',
  '친구가 미안해하기 어려워할 수도 있으니, 먼저 내 마음을 조금만 말해줘도 분위기가 달라질 수 있어.',
  '같이 걸어가며 이야기하면 마주 보기보다 편해서 말이 잘 나올 때도 있어.',
  '단톡보다는 얼굴 보고 한두 문장만 말하면 오해가 줄어드는 경우가 많아.',
  '친구가 다른 친구와 더 친해 보여도, 너와의 관계가 없어지는 건 아닐 수 있어.',
  '‘너랑 있으면 편해’처럼 좋았던 기억 한 가지를 떠올려 말해보면 거리가 가까워질 수 있어.',
  '상대가 부담스러워하지 않게 짧게 한마디만 건네고, 반응을 기다려도 좋아.',
  '싸운 뒤에는 “우리 나중에 다시 얘기하자”라고 정해두면 마음이 덜 급해질 수 있어.'
];

type ProblemKey =
  | 'friend-avoiding'
  | 'argument'
  | 'jealousy'
  | 'groupchat-leftout'
  | 'joke-misfire'
  | 'dont-want-apology'
  | 'secret-broken'
  | 'left-out-play'
  | 'feeling-ignored'
  | 'mystery';

interface PatternGuide {
  when: string;
  cardGroupHint: string;
  structure: string;
}

const PATTERN_LIBRARY: Record<PatternType, PatternGuide> = {
  공감형: {
    when: '서운함이 크고 마음이 다친 느낌일 때',
    cardGroupHint: 'cups, three-of-swords, five-of-cups',
    structure: '공감 -> 감정이해 -> 작은 회복 행동'
  },
  오해해소형: {
    when: '말이 엇갈리거나 오해가 생겼을 때',
    cardGroupHint: 'swords, justice, two-of-swords',
    structure: '사실확인 -> 친구입장 상상 -> 차분한 대화'
  },
  용기내기형: {
    when: '먼저 다가가기 망설여질 때',
    cardGroupHint: 'wands, strength, chariot',
    structure: '두려움 인정 -> 한걸음 제안 -> 짧은 시작'
  },
  거리좁히기형: {
    when: '예전보다 멀어진 느낌이 들 때',
    cardGroupHint: 'cups, six-of-cups, temperance',
    structure: '관계거리 인식 -> 공통기억 -> 다시 연결'
  },
  사과회복형: {
    when: '미안한 마음이 크고 사과가 필요할 때',
    cardGroupHint: 'judgement, pentacles, five-of-wands reversed',
    structure: '책임인정 -> 진심사과 -> 회복약속'
  },
  기다림배려형: {
    when: '상대가 바로 답하지 못할 때',
    cardGroupHint: 'hermit, pentacles, four-of-swords',
    structure: '서두르지않기 -> 배려표현 -> 기다림'
  },
  솔직표현형: {
    when: '내 마음을 숨기다 답답해질 때',
    cardGroupHint: 'wands, ace-of-swords, page cards',
    structure: '솔직한마음 -> 부드러운말 -> 확인질문'
  },
  마음정리형: {
    when: '감정이 복잡해서 정리가 필요할 때',
    cardGroupHint: 'moon, high-priestess, swords',
    structure: '감정정리 -> 생각분리 -> 행동선택'
  },
  함께행동형: {
    when: '말보다 같이 해보는 게 더 좋을 때',
    cardGroupHint: 'pentacles, three-of-pentacles, six-of-pentacles',
    structure: '작은협력 -> 같이실행 -> 신뢰회복'
  },
  다시시작형: {
    when: '한 번 틀어졌지만 다시 시작하고 싶을 때',
    cardGroupHint: 'the-fool, judgement, ace cards',
    structure: '새출발선언 -> 약속정하기 -> 응원마무리'
  }
};

const EMOTION_BY_LABEL: Record<string, EmotionKey> = {
  화남: 'angry',
  속상함: 'sad',
  불안함: 'anxious',
  답답함: 'frustrated'
};

const EMPATHY_LINES = flattenEmotionLines(empathyLinePool);
const FRIEND_VIEW_LINES = flattenEmotionLines(friendPerspectiveLinePool);
const ACTION_LINES = flattenEmotionLines(actionLinePool);
const DIALOGUE_LINES = flattenEmotionLines(dialogueLinePool);

const CHEER_LINES = [
  '작은 용기 하나가 관계를 바꿀 수 있어.',
  '천천히 해도 괜찮아. 네 마음은 충분히 소중해.',
  '오늘의 한마디가 내일의 웃음을 만들 수 있어.',
  '완벽하게 말하지 않아도 진심은 전해질 수 있어.',
  '너는 이미 관계를 회복할 힘을 가지고 있어.'
];

const CLOSING_LINES = flattenEmotionLines(closingLinePool);

const TEACHER_TIPS = [
  '학생이 감정을 단어로 말하면 내용보다 표현 시도를 먼저 칭찬해 주세요.',
  '사과 문장은 짧고 구체적으로 안내하면 부담이 줄어듭니다.',
  '갈등 상황은 누가 맞는지보다 서로의 감정 확인부터 돕는 것이 좋습니다.',
  '학생이 말문을 열면 중간 개입보다 끝까지 말하게 기다려 주세요.',
  '회복 행동은 큰 약속보다 오늘 가능한 작은 실천 1개가 효과적입니다.'
];

const CATEGORY_OVERRIDE: Record<string, CardCategory[]> = {
  'three-of-swords': ['속상함', '거리감', '다시 시작'],
  'six-of-pentacles': ['도움/배려', '화해', '다시 시작'],
  'the-star': ['다시 시작', '용기', '화해'],
  'the-moon': ['불안함', '답답함', '거리감']
};

const PROBLEM_WEIGHT_RULES: Record<string, Partial<Record<CardCategory, number>>> = {
  'friend-avoiding': { 거리감: 1.5, 속상함: 1.35, 화해: 1.2 },
  argument: { 화남: 1.45, 화해: 1.35, 용기: 1.2 },
  jealousy: { 속상함: 1.4, 불안함: 1.25, 화해: 1.15 },
  'groupchat-leftout': { 불안함: 1.45, 거리감: 1.3, 속상함: 1.2 },
  'joke-misfire': { 미안함: 1.35, 화해: 1.35, '다시 시작': 1.15 },
  'dont-want-apology': { 화남: 1.4, 미안함: 1.2, 화해: 1.25 },
  'secret-broken': { 속상함: 1.45, 화남: 1.2, 거리감: 1.2 },
  'left-out-play': { 거리감: 1.45, 속상함: 1.25, 용기: 1.15 },
  'feeling-ignored': { 화남: 1.35, 답답함: 1.3, 화해: 1.15 },
  mystery: { 답답함: 1.2, 불안함: 1.15, 용기: 1.15 }
};

const PROBLEM_ALIAS: Record<string, ProblemKey> = {
  '친구가 나를 피하는 것 같아요': 'friend-avoiding',
  '친구랑 말다툼 했어요': 'argument',
  '친구가 다른 친구랑 더 친하게 지내요': 'jealousy',
  '단톡방에서 소외된 느낌이에요': 'groupchat-leftout',
  '장난이었는데 친구가 화났어요': 'joke-misfire',
  '먼저 사과하기 싫어요': 'dont-want-apology',
  '친구가 내 비밀을 말했어요': 'secret-broken',
  '같이 놀고 싶은데 끼워주지 않아요': 'left-out-play',
  '친구가 나를 무시하는 것 같아요': 'feeling-ignored'
};

const PROBLEM_LABEL: Record<ProblemKey, string> = {
  'friend-avoiding': '친구가 나를 피하는 것 같을 때',
  argument: '친구와 말다툼을 했을 때',
  jealousy: '친구가 다른 친구와 더 친하게 지낼 때',
  'groupchat-leftout': '단톡방에서 소외된 느낌이 들 때',
  'joke-misfire': '장난이 오해가 되었을 때',
  'dont-want-apology': '먼저 사과하기 어려울 때',
  'secret-broken': '비밀이 지켜지지 않았을 때',
  'left-out-play': '놀이에 끼지 못했을 때',
  'feeling-ignored': '무시당하는 느낌이 들 때',
  mystery: '말하기 어려운 고민이 있을 때'
};

const PROBLEM_TONE: Record<ProblemKey, {
  empathyHint: string;
  friendHint: string;
  actionHint: string;
  todayActions: string[];
  oneLineSummaries: string[];
}> = {
  'friend-avoiding': {
    empathyHint: '관계가 멀어진 느낌이 들면 더 예민해질 수 있어.',
    friendHint: '상대도 어색해서 먼저 다가오지 못했을 수 있어.',
    actionHint: '짧은 인사로 거리를 줄이는 방식이 잘 맞아.',
    todayActions: ['내일 아침 먼저 안녕이라고 말해보기', '쉬는 시간에 옆에 잠깐 가보기'],
    oneLineSummaries: ['나는 멀어진 마음을 천천히 다시 이어보고 싶다', '나는 오늘 작은 인사로 다시 시작해보고 싶다']
  },
  argument: {
    empathyHint: '다툰 뒤에는 마음이 뜨거워져 말이 더 세게 느껴질 수 있어.',
    friendHint: '친구도 같은 장면을 다르게 기억하고 있을 수 있어.',
    actionHint: '사실 확인과 차분한 톤이 중요해.',
    todayActions: ['말하기 전에 숨 세 번 쉬고 한 문장만 말해보기', '내 기분을 먼저 말하고 이유는 짧게 말해보기'],
    oneLineSummaries: ['나는 다툰 마음을 차분하게 풀어보고 싶다', '나는 오늘 감정보다 대화를 먼저 선택하고 싶다']
  },
  jealousy: {
    empathyHint: '비교되는 순간에는 서운함이 더 크게 느껴질 수 있어.',
    friendHint: '친구는 네가 느낀 소외감을 눈치채지 못했을 수 있어.',
    actionHint: '비교보다 내 마음 전달이 더 도움이 돼.',
    todayActions: ['친구에게 서운했던 마음을 한 문장으로 말해보기', '둘이 잠깐 이야기할 시간을 먼저 제안해보기'],
    oneLineSummaries: ['나는 비교보다 내 마음을 솔직히 전하고 싶다', '나는 서운함을 부드럽게 말해보고 싶다']
  },
  'groupchat-leftout': {
    empathyHint: '단톡에서 소외된 느낌은 불안을 크게 만들 수 있어.',
    friendHint: '상대는 일부러가 아니라 상황을 가볍게 봤을 수 있어.',
    actionHint: '추측보다 확인 질문이 잘 맞아.',
    todayActions: ['내가 오해한 부분이 있는지 짧게 물어보기', '답을 듣고 고맙다고 한마디 말해보기'],
    oneLineSummaries: ['나는 걱정보다 확인 대화를 선택해보고 싶다', '나는 소외감보다 연결을 선택해보고 싶다']
  },
  'joke-misfire': {
    empathyHint: '장난이 어긋나면 생각보다 크게 상처가 남을 수 있어.',
    friendHint: '친구도 당황해서 바로 말하지 못했을 수 있어.',
    actionHint: '짧고 분명한 사과가 잘 맞아.',
    todayActions: ['짧게 미안하다고 먼저 말해보기', '변명 없이 내 의도를 한 문장으로 설명해보기'],
    oneLineSummaries: ['나는 장난보다 진심을 먼저 보여주고 싶다', '나는 오늘 짧은 사과부터 시작해보고 싶다']
  },
  'dont-want-apology': {
    empathyHint: '화난 상태에서 먼저 사과하려면 더 억울할 수 있어.',
    friendHint: '친구도 먼저 말하기를 망설이고 있을 수 있어.',
    actionHint: '자존심보다 관계 목표를 먼저 정하는 게 좋아.',
    todayActions: ['사과 대신 먼저 내 마음을 짧게 설명해보기', '내가 원하는 관계를 한 문장으로 말해보기'],
    oneLineSummaries: ['나는 자존심보다 관계를 먼저 생각해보고 싶다', '나는 화난 마음을 차분히 말해보고 싶다']
  },
  'secret-broken': {
    empathyHint: '비밀이 알려지면 신뢰가 크게 흔들릴 수 있어.',
    friendHint: '친구도 실수의 무게를 늦게 느꼈을 수 있어.',
    actionHint: '경계와 회복 약속을 분명히 말하는 게 중요해.',
    todayActions: ['어떤 점이 가장 속상했는지 한 문장으로 말해보기', '앞으로 지켜줬으면 하는 약속 하나 말해보기'],
    oneLineSummaries: ['나는 상처를 천천히 풀고 다시 신뢰를 만들고 싶다', '나는 내 경계를 분명히 말해보고 싶다']
  },
  'left-out-play': {
    empathyHint: '끼워주지 않는 상황은 외로움과 긴장을 함께 만들 수 있어.',
    friendHint: '친구들도 분위기에 휩쓸려 신호를 놓쳤을 수 있어.',
    actionHint: '참여 의사를 짧게 먼저 표현하는 게 좋아.',
    todayActions: ['같이 놀고 싶다고 짧게 말해보기', '옆에 가서 먼저 반응해보기'],
    oneLineSummaries: ['나는 용기 내서 같이 놀고 싶다고 말해보고 싶다', '나는 오늘 참여 의사를 분명히 전하고 싶다']
  },
  'feeling-ignored': {
    empathyHint: '무시당한 느낌은 화남과 답답함을 같이 만들 수 있어.',
    friendHint: '친구는 네 마음을 읽지 못했을 수 있어.',
    actionHint: '짧고 분명한 경계 표현이 잘 맞아.',
    todayActions: ['내 말도 듣고 싶다고 한 문장으로 전하기', '표정 대신 말로 내 기분 설명하기'],
    oneLineSummaries: ['나는 무시당한 기분을 부드럽게 전해보고 싶다', '나는 오늘 내 마음을 숨기지 않고 말해보고 싶다']
  },
  mystery: {
    empathyHint: '마음이 복잡할 때는 답을 빨리 찾기 어려울 수 있어.',
    friendHint: '상대도 같은 장면을 다르게 느꼈을 수 있어.',
    actionHint: '가장 쉬운 행동 하나를 먼저 고르는 게 좋아.',
    todayActions: ['짧은 인사 한 번 먼저 해보기', '내 마음 한 문장 메모하고 말해보기'],
    oneLineSummaries: ['나는 오늘 관계를 천천히 회복해보고 싶다', '나는 작은 행동부터 시작해보고 싶다']
  }
};

const EMOTION_WEIGHT_RULES: Record<EmotionKey, Partial<Record<CardCategory, number>>> = {
  angry: { 화남: 1.55, 용기: 1.25, 화해: 1.2, 답답함: 1.1 },
  sad: { 속상함: 1.5, 화해: 1.25, '다시 시작': 1.2, '도움/배려': 1.15 },
  anxious: { 불안함: 1.55, 답답함: 1.25, '도움/배려': 1.15, 거리감: 1.2 },
  frustrated: { 답답함: 1.55, 거리감: 1.25, 용기: 1.15, 화해: 1.1 },
  sorry: { 미안함: 1.6, 화해: 1.4, '도움/배려': 1.2 },
  brave: { 용기: 1.5, '다시 시작': 1.25, 화해: 1.15 },
  reconcile: { 화해: 1.55, '도움/배려': 1.3, '다시 시작': 1.2 },
  distance: { 거리감: 1.45, 속상함: 1.2, '다시 시작': 1.2 }
};

const RECENT_LINE_HISTORY = new Map<string, string[]>();

function normalizeEmotionKey(input: string): EmotionKey {
  return EMOTION_BY_LABEL[input] ?? (input as EmotionKey) ?? 'sad';
}

function normalizeForCoaching(text: string): string {
  return text
    .replace(/운명|예언|에너지|우주|운세/g, '마음의 흐름')
    .replace(/당신/g, '너')
    .replace(/하십시오|하세요|해보세요/g, '해보자')
    .replace(/수 있습니다/g, '수 있어')
    .replace(/가능성이 큽니다|예상됩니다/g, '그럴 수 있어');
}

function sentenceize(line: string): string {
  const trimmed = line.trim().replace(/["']/g, '');
  if (!trimmed) return '';
  if (/[.!?]$/.test(trimmed)) return trimmed;
  return `${trimmed}.`;
}

function pickBySeed<T>(arr: T[], seed: number): T {
  if (arr.length === 0) {
    throw new Error('Empty array');
  }
  return arr[Math.abs(seed) % arr.length];
}

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function normalizeProblemKey(problemType: string): ProblemKey {
  if (PROBLEM_ALIAS[problemType]) {
    return PROBLEM_ALIAS[problemType];
  }
  return (problemType as ProblemKey) in PROBLEM_TONE ? (problemType as ProblemKey) : 'mystery';
}

export function inferEmotionIntensity(
  selectedFeelingText: string,
  emotionKey: EmotionKey,
  isReversed: boolean
): EmotionIntensity {
  const strongWords = ['많이', '너무', '계속', '정말', '억울', '싫어', '무시', '소외', '비밀'];
  const weakWords = ['조금', '살짝', '약간'];
  if (isReversed || strongWords.some((word) => selectedFeelingText.includes(word))) {
    return 'strong';
  }
  if (weakWords.some((word) => selectedFeelingText.includes(word))) {
    return 'weak';
  }
  if (emotionKey === 'angry' || emotionKey === 'anxious') {
    return 'strong';
  }
  return 'normal';
}

function uniqueItems(items: string[], max: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const normalized = item.trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
    if (out.length >= max) break;
  }
  return out;
}

function pickAvoidRecent(pool: string[], seed: number, historyKey: string): string {
  const history = RECENT_LINE_HISTORY.get(historyKey) ?? [];
  const preferred = pool.filter((line) => !history.includes(line));
  const source = preferred.length > 0 ? preferred : pool;
  const picked = pickBySeed(source, seed);
  const nextHistory = [...history, picked].slice(-8);
  RECENT_LINE_HISTORY.set(historyKey, nextHistory);
  return picked;
}

function pickManyAvoidRecent(pool: string[], count: number, seed: number, historyKey: string): string[] {
  const picked: string[] = [];
  for (let i = 0; i < count; i += 1) {
    picked.push(pickAvoidRecent(pool, seed + i * 17, `${historyKey}-${i}`));
  }
  return uniqueItems(picked, count);
}

function mapCardCategories(card: (typeof tarotCards78Data.cards)[0]): CardCategory[] {
  if (CATEGORY_OVERRIDE[card.id]) {
    return CATEGORY_OVERRIDE[card.id].filter(Boolean) as CardCategory[];
  }

  const categories = new Set<CardCategory>();
  const text = `${card.upright.prophecy} ${card.reversed.prophecy} ${card.upright.signs.join(' ')}`.toLowerCase();

  if (card.suit === 'cups') {
    categories.add('속상함');
    categories.add('화해');
  }
  if (card.suit === 'swords') {
    categories.add('화남');
    categories.add('불안함');
    categories.add('답답함');
  }
  if (card.suit === 'pentacles') {
    categories.add('도움/배려');
    categories.add('다시 시작');
  }
  if (card.suit === 'wands') {
    categories.add('용기');
    categories.add('다시 시작');
  }
  if (card.suit === 'major') {
    categories.add('다시 시작');
    categories.add('화해');
  }

  if (/불안|망설|두려|걱정/.test(text)) categories.add('불안함');
  if (/화해|관대|이해|균형/.test(text)) categories.add('화해');
  if (/상처|슬픔|실망/.test(text)) categories.add('속상함');
  if (/거리|혼자|고립/.test(text)) categories.add('거리감');
  if (/배려|도움|나누/.test(text)) categories.add('도움/배려');
  if (/사과|책임|반성/.test(text)) categories.add('미안함');

  if (categories.size === 0) {
    categories.add('다시 시작');
    categories.add('화해');
  }
  return Array.from(categories);
}

function getCardCategory(card: (typeof tarotCards78Data.cards)[0]): CardCategory[] {
  return mapCardCategories(card);
}

function getToneByEmotion(emotionKey: EmotionKey): { empathyLead: string; actionLead: string } {
  const toneMap: Record<EmotionKey, { empathyLead: string; actionLead: string }> = {
    angry: { empathyLead: '마음이 뜨거워져서 말이 세게 나왔을 수도 있어.', actionLead: '먼저 진정하고 짧게 말하는 방식이 좋아.' },
    sad: { empathyLead: '서운함이 길어져서 더 외롭게 느껴졌을 수도 있어.', actionLead: '짧은 연결부터 다시 만드는 방식이 좋아.' },
    anxious: { empathyLead: '확실하지 않아서 걱정이 커졌을 수도 있어.', actionLead: '확인 질문을 부드럽게 하는 방식이 좋아.' },
    frustrated: { empathyLead: '마음은 있는데 표현이 막혀 답답했을 수도 있어.', actionLead: '한 문장 메모 후 말하기 같은 쉬운 시작이 좋아.' },
    sorry: { empathyLead: '미안한 마음이 커서 먼저 말하기 어려웠을 수도 있어.', actionLead: '짧고 분명한 사과 한마디가 좋아.' },
    brave: { empathyLead: '용기를 내고 싶은데 실패가 걱정됐을 수도 있어.', actionLead: '작은 행동부터 하나씩 시도하는 방식이 좋아.' },
    reconcile: { empathyLead: '다시 잘 지내고 싶은 마음이 분명했을 수도 있어.', actionLead: '관계를 잇는 짧은 표현부터 해보는 게 좋아.' },
    distance: { empathyLead: '멀어진 느낌 때문에 더 조심스러웠을 수도 있어.', actionLead: '거리감을 줄이는 작은 인사부터 시작해보자.' }
  };
  return toneMap[emotionKey];
}

function getProblemTone(problemType: string) {
  return PROBLEM_TONE[normalizeProblemKey(problemType)];
}

function getEmotionOpening(emotionKey: EmotionKey, selectedFeelingText: string): string {
  const openings: Record<EmotionKey, string> = {
    angry: `${selectedFeelingText}라서 화가 크게 올라왔을 수 있어.`,
    sad: `${selectedFeelingText}처럼 느껴져서 많이 속상했겠다.`,
    anxious: `${selectedFeelingText}라는 생각이 들어서 걱정이 커졌을 수 있어.`,
    frustrated: `${selectedFeelingText}라서 마음이 더 답답했을 수 있어.`,
    sorry: `${selectedFeelingText}라는 마음이 들어서 먼저 말하기 어려웠을 수 있어.`,
    brave: `${selectedFeelingText}라는 마음으로 용기를 내보려 했을 수 있어.`,
    reconcile: `${selectedFeelingText}처럼 느껴져서 관계를 다시 잇고 싶었을 수 있어.`,
    distance: `${selectedFeelingText}처럼 느껴져서 더 조심스러웠을 수 있어.`
  };
  return sentenceize(openings[emotionKey] ?? openings.sad);
}

function weightedPick(
  candidates: (typeof tarotCards78Data.cards),
  weights: Map<string, number>
): (typeof tarotCards78Data.cards)[0] {
  const total = candidates.reduce((sum, c) => sum + (weights.get(c.id) ?? 1), 0);
  let roll = Math.random() * total;
  for (const card of candidates) {
    roll -= weights.get(card.id) ?? 1;
    if (roll <= 0) {
      return card;
    }
  }
  return candidates[candidates.length - 1];
}

export function drawRecommendedCards(problemType: string, emotion: string): DrawnCard[] {
  const emotionKey = normalizeEmotionKey(emotion);
  const normalizedProblem = normalizeProblemKey(problemType);
  const cards = [...tarotCards78Data.cards];
  const picked: DrawnCard[] = [];
  const selectedSuits = new Set<string>();

  while (picked.length < 3 && cards.length > 0) {
    const weights = new Map<string, number>();
    const problemRule = PROBLEM_WEIGHT_RULES[normalizedProblem] ?? {};
    const emotionRule = EMOTION_WEIGHT_RULES[emotionKey] ?? {};

    for (const card of cards) {
      let weight = 1;
      const categories = mapCardCategories(card);
      for (const cat of categories) {
        weight *= problemRule[cat] ?? 1;
        weight *= emotionRule[cat] ?? 1;
      }
      if (selectedSuits.has(card.suit)) {
        weight *= 0.72;
      }
      weights.set(card.id, weight);
    }

    const chosen = weightedPick(cards, weights);
    selectedSuits.add(chosen.suit);
    picked.push({
      id: chosen.id,
      isReversed: Math.random() < 0.5,
      toneSeed: Math.floor(Math.random() * 10000)
    });
    const idx = cards.findIndex((c) => c.id === chosen.id);
    cards.splice(idx, 1);
  }
  return picked;
}

function patternByContext(position: number, categories: CardCategory[]): PatternType {
  if (position === 2) {
    if (categories.includes('미안함')) return '사과회복형';
    if (categories.includes('도움/배려')) return '함께행동형';
    if (categories.includes('용기')) return '용기내기형';
    return '다시시작형';
  }
  if (position === 1) {
    if (categories.includes('거리감')) return '거리좁히기형';
    if (categories.includes('불안함')) return '오해해소형';
    return '기다림배려형';
  }
  if (categories.includes('답답함')) return '마음정리형';
  if (categories.includes('화남')) return '솔직표현형';
  return '공감형';
}

export function getCardCategoryMap(): Record<string, CardCategory[]> {
  const map: Record<string, CardCategory[]> = {};
  for (const card of tarotCards78Data.cards) {
    map[card.id] = mapCardCategories(card);
  }
  return map;
}

export function useCardLogic() {
  // 교육 목적 흐름: 감정 인식 -> 표현(한 줄 마음) -> 실행(작은 행동)으로 연결
  const getTodayAction = (
    problemType: string,
    emotionKey: string,
    selectedFeelingText: string,
    actions: string[],
    variantRound: number = 0
  ): string => {
    const problemTone = getProblemTone(problemType);
    const feelingSeed = hashSeed(`${emotionKey}-${selectedFeelingText}-${variantRound}`);
    const easyActions = [
      '쉬는 시간에 먼저 인사해보기',
      '짧게라도 "어제는 미안해"라고 말해보기',
      '친구 말 먼저 끝까지 들어보기',
      '눈 마주치고 웃어주기',
      '카톡 대신 직접 한마디 해보기'
    ];
    const contextBoost: Record<string, string> = {
      화남: '말이 세게 나오기 전에 숨을 세 번 쉬고 한마디부터 해보기',
      속상함: '쉬는 시간에 조용히 다가가 "괜찮아?"라고 먼저 물어보기',
      불안함: '확인하고 싶은 걸 한 문장으로 짧게 물어보기',
      답답함: '메모로 한 문장 적고 그대로 읽어 말해보기'
    };

    const mixedPool = [...problemTone.todayActions, ...easyActions, ...actions];
    const pickedFromActions = actions.find((act) => act.length <= 26) ?? actions[0];
    const basePick = pickedFromActions || pickBySeed(mixedPool, feelingSeed);
    const boost = contextBoost[emotionKey];
    if (boost && feelingSeed % 2 === 0) {
      return boost;
    }
    return basePick;
  };

  const buildTodayAction = getTodayAction;
  const getDailyAction = (
    emotionKey: string,
    selectedFeelingText: string,
    actions: string[],
    variantRound: number = 0
  ) => getTodayAction('mystery', emotionKey, selectedFeelingText, actions, variantRound);

  const getOneLineSummary = (
    problemType: string,
    emotionLabel: string,
    selectedFeelingText: string
  ): string => {
    const emotionSummaryMap: Record<string, string[]> = {
      화남: [
        '나는 오해를 풀고 다시 편해지고 싶다',
        '나는 화난 마음을 차분하게 말해보고 싶다'
      ],
      속상함: [
        '나는 아직 친구랑 잘 지내고 싶다',
        '나는 혼자가 아니라는 걸 믿어보고 싶다'
      ],
      불안함: [
        '나는 내 마음을 솔직하게 물어보고 싶다',
        '나는 걱정보다 대화를 먼저 해보고 싶다'
      ],
      답답함: [
        '나는 작은 한마디부터 시작해보고 싶다',
        '나는 참고만 하지 않고 천천히 말해보고 싶다'
      ]
    };

    const problemSummaryMap: Record<string, string> = {
      'friend-avoiding': '나는 멀어진 마음을 조금씩 다시 이어보고 싶다',
      argument: '나는 다툰 마음을 풀고 다시 웃고 싶다',
      jealousy: '나는 비교보다 내 마음을 솔직히 전하고 싶다',
      'groupchat-leftout': '나는 소외감보다 연결을 선택해보고 싶다',
      'joke-misfire': '나는 장난보다 진심을 먼저 보여주고 싶다',
      'dont-want-apology': '나는 자존심보다 관계를 먼저 생각해보고 싶다',
      'secret-broken': '나는 상처를 천천히 풀고 다시 신뢰를 만들고 싶다',
      'left-out-play': '나는 용기 내서 같이 놀고 싶다고 말해보고 싶다',
      'feeling-ignored': '나는 무시당한 기분을 부드럽게 전해보고 싶다'
    };

    const normalizedProblem = normalizeProblemKey(problemType);
    const problemTone = getProblemTone(normalizedProblem);
    const seed = hashSeed(`${normalizedProblem}-${emotionLabel}-${selectedFeelingText}`);
    const emotionLine = pickBySeed(emotionSummaryMap[emotionLabel] ?? ['나는 천천히 관계를 회복하고 싶다'], seed);
    const problemLine = problemSummaryMap[normalizedProblem] ?? pickBySeed(problemTone.oneLineSummaries, seed + 5);
    if (problemLine && seed % 2 === 0) {
      return problemLine;
    }
    return emotionLine;
  };

  const buildOneLineSummary = getOneLineSummary;
  const getMindSummary = getOneLineSummary;

  const buildActionSet = (
    cardMeaning: (typeof tarotCards78Data.cards)[0]['upright'],
    emotionKey: EmotionKey,
    problemType: string,
    seed: number
  ): string[] => {
    const tone = getToneByEmotion(emotionKey);
    const problemTone = getProblemTone(problemType);
    const emotionActionPool = actionLinePool[emotionKey === 'distance' ? 'reconcile' : emotionKey] ?? ACTION_LINES;
    const advicePool = [
      ...cardMeaning.advice.map(normalizeForCoaching),
      ...emotionActionPool,
      tone.actionLead,
      problemTone.actionHint
    ];
    const picked = [0, 1, 2, 3].map((idx) =>
      pickAvoidRecent(advicePool, seed + idx * 11, `action-${problemType}-${emotionKey}`)
    );
    return uniqueItems(picked, 3);
  };

  const getActionBundle = buildActionSet;

  const buildDialogueSet = (
    emotionKey: EmotionKey,
    problemType: string,
    seed: number
  ): string[] => {
    const tone = getToneByEmotion(emotionKey);
    const problemTone = getProblemTone(problemType);
    const emotionDialoguePool = dialogueLinePool[emotionKey === 'distance' ? 'reconcile' : emotionKey] ?? DIALOGUE_LINES;
    const dialoguePool = [
      ...emotionDialoguePool,
      tone.empathyLead.replace(/있어\.$/, '있어.'),
      sentenceize(problemTone.actionHint)
    ];
    const picked = [0, 1, 2, 3].map((idx) =>
      pickAvoidRecent(dialoguePool, seed + idx * 19, `dialogue-${problemType}-${emotionKey}`)
    );
    return uniqueItems(picked, 3);
  };

  const getDialogueBundle = buildDialogueSet;

  const getEmpathyLine = (
    emotionKey: EmotionKey,
    selectedFeelingText: string,
    problemType: string,
    seed: number,
    intensity: EmotionIntensity
  ): string[] => {
    const emotionPool = empathyLinePool[emotionKey === 'distance' ? 'reconcile' : emotionKey] ?? EMPATHY_LINES;
    const intensityLine = pickBySeed(INTENSITY_EXPRESSIONS[intensity], seed + 3);
    const mixedPool = [
      ...baseEmpathyLines,
      ...emotionPool,
      intensityLine,
      sentenceize(`${selectedFeelingText}처럼 느껴져서 많이 힘들었을 수 있어`)
    ];
    return pickManyAvoidRecent(mixedPool, 2, seed, `empathy-mix-${problemType}-${emotionKey}`);
  };

  const getSituationAnalysis = (
    problemType: string,
    card: (typeof tarotCards78Data.cards)[0],
    isReversed: boolean,
    seed: number,
    emotionKey: EmotionKey,
    intensity: EmotionIntensity
  ): string[] => {
    const tone = getProblemTone(problemType);
    const toneLine = getToneByEmotionAndSuit(emotionKey, card.suit, intensity);
    const orientation = isReversed
      ? '지금은 감정이 꼬여서 오해가 커지기 쉬운 흐름일 수 있어.'
      : '지금은 차분히 풀어가면 회복할 수 있는 흐름일 수 있어.';
    const suitHint: Record<string, string> = {
      cups: '감정이 예민해져서 작은 반응도 크게 받아들였을 수 있어.',
      swords: '말의 오해나 긴장이 쌓여 관계가 더 날카롭게 느껴졌을 수 있어.',
      wands: '먼저 다가갈 용기가 필요한 시점일 수 있어.',
      pentacles: '작고 현실적인 행동이 관계를 안정시키는 데 도움이 될 수 있어.',
      major: '지금은 관계에서 중요한 감정을 다시 보는 시기일 수 있어.'
    };
    return uniqueItems(
      [
        tone.empathyHint,
        toneLine,
        orientation,
        suitHint[card.suit] ?? suitHint.major,
        sentenceize(`${PROBLEM_LABEL[normalizeProblemKey(problemType)]}에는 작은 대화가 큰 변화를 만들 수 있어`)
      ],
      2 + (seed % 2)
    );
  };

  const getActionSuggestions = getActionBundle;
  const getDialogueExamples = getDialogueBundle;

  const getFriendPerspective = (
    problemType: string,
    card: (typeof tarotCards78Data.cards)[0],
    emotionKey: EmotionKey,
    intensity: EmotionIntensity
  ): string => {
    const tone = getProblemTone(problemType);
    const toneLine = getToneByEmotionAndSuit(emotionKey, card.suit, intensity);
    const suitHint: Record<string, string> = {
      cups: '친구도 감정이 먼저 올라와 말이 줄었을 수 있어.',
      swords: '친구도 말이 상처가 될까 조심했을 수 있어.',
      wands: '친구도 먼저 다가가고 싶었지만 망설였을 수 있어.',
      pentacles: '친구는 현실적인 해결 방법을 찾고 있었을 수 있어.',
      major: '친구도 이 관계를 중요하게 느끼고 있을 수 있어.'
    };
    return `${tone.friendHint} ${toneLine} ${suitHint[card.suit] ?? suitHint.major}`;
  };

  const getInsightByPosition = (
    card: (typeof tarotCards78Data.cards)[0],
    isReversed: boolean,
    position: PositionRole,
    emotionKey: EmotionKey,
    problemType: string,
    selectedFeelingText: string,
    seed: number
  ): string => {
    const tone = getToneByEmotion(emotionKey);
    const problemTone = getProblemTone(problemType);
    const opening = getEmotionOpening(emotionKey, selectedFeelingText);
    const orientLead = isReversed
      ? '지금은 오해가 커지거나 마음이 꼬였을 수도 있어.'
      : '지금은 마음을 차분히 풀어볼 기회가 열려 있을 수 있어.';
    const suitLeadMap: Record<string, string> = {
      cups: '감정이 예민해진 순간이라 작은 반응도 크게 느껴졌을 수 있어.',
      swords: '생각이 많아지면서 말의 상처나 긴장이 커졌을 수 있어.',
      wands: '먼저 다가갈 용기가 필요한 시점일 수 있어.',
      pentacles: '작고 현실적인 행동이 더 효과적인 상황일 수 있어.',
      major: '관계에서 중요한 마음을 다시 살펴볼 때일 수 있어.'
    };
    const roleMap: Record<PositionRole, string> = {
      0: '내 마음을 먼저 이해하면 다음 행동이 쉬워질 수 있어.',
      1: '친구 입장을 상상하면 오해를 줄이는 데 도움이 될 수 있어.',
      2: '지금은 짧은 행동 하나를 선택해 실천하는 게 좋아.'
    };
    const problemHint = sentenceize(`${PROBLEM_LABEL[normalizeProblemKey(problemType)]}에는 작은 말 한마디가 분위기를 바꿀 수 있어`);
    const lines = [
      opening,
      tone.empathyLead,
      problemTone.empathyHint,
      orientLead,
      suitLeadMap[card.suit] ?? suitLeadMap.major,
      problemHint,
      roleMap[position]
    ];
    return lines.join(' ');
  };

  const buildStructuredNarrative = (
    position: number,
    selectedFeelingText: string,
    meaning: (typeof tarotCards78Data.cards)[0]['upright'],
    emotion: string,
    cardName: string,
    seed: number
  ) => {
    const closingEmotionKey = (emotion as EmotionKey) === 'distance' ? 'reconcile' : (emotion as EmotionKey);
    const openingEmotionKey = (emotion as EmotionKey) === 'distance' ? 'reconcile' : (emotion as EmotionKey);
    const closingPool = closingLinePool[closingEmotionKey] ?? CLOSING_LINES;
    const empathyPool = empathyLinePool[openingEmotionKey] ?? EMPATHY_LINES;
    const empathyA = getEmotionOpening(openingEmotionKey, selectedFeelingText);
    const empathyB = sentenceize(pickBySeed(empathyPool, seed));

    const explanation = [
      sentenceize(`지금 마음은 ${sentenceize(normalizeForCoaching(meaning.prophecy)).replace(/\.$/, '')}처럼 보일 수 있어`),
      sentenceize(`특히 ${normalizeForCoaching(meaning.signs[0] ?? '마음이 복잡해진 순간')}이 있었을 수 있어`),
      sentenceize(`이럴 때는 감정이 먼저 올라와서 말이 꼬이거나 오해가 커질 수 있어`)
    ];

    const meaningLinesByPosition: Record<number, string[]> = {
      0: [
        sentenceize(`${cardName} 카드는 네 마음을 무시하지 말고 천천히 살펴보라고 알려줘`),
        sentenceize(`이 감정은 관계를 소중히 여기기 때문에 생긴 자연스러운 신호일 수 있어`)
      ],
      1: [
        sentenceize(`친구도 일부러 그러기보다 다른 걱정 때문에 표현이 서툴렀을 수도 있어`),
        sentenceize(`지금은 누가 맞는지보다 서로의 마음을 확인하는 게 더 도움이 될 수 있어`)
      ],
      2: [
        sentenceize(`행동은 크게 한 번에 하기보다 작은 시도를 여러 번 하는 쪽이 더 좋아`),
        sentenceize(`네가 먼저 부드럽게 시작하면 관계의 분위기가 바뀔 수 있어`)
      ]
    };

    const closing = sentenceize(pickBySeed(closingPool, seed + 31));
    const emotionInsight = [...[empathyA, empathyB], ...explanation, ...meaningLinesByPosition[0], [closing][0]].join(' ');
    const friendPerspective = [...[empathyA, empathyB], ...explanation, ...meaningLinesByPosition[1], [closing][0]].join(' ');
    const actionGuide = [...[empathyA, empathyB], ...explanation, ...meaningLinesByPosition[2], [closing][0]].join(' ');
    return {
      empathy: [empathyA, empathyB],
      explanation,
      meaning: meaningLinesByPosition[position] ?? meaningLinesByPosition[0],
      closing,
      emotionInsight,
      friendPerspective,
      actionGuide
    };
  };

  const getCardResult = (
    problemType: string,
    emotion: string,
    selectedFeelingText: string,
    card: DrawnCard,
    position: number,
    variantRound: number = 0
  ): CoachingScenario => {
    const normalizedProblem = normalizeProblemKey(problemType);
    const cardData = tarotCards78Data.cards.find((c) => c.id === card.id);
    if (!cardData) {
      const fb = buildInteractiveActionBundle({
        suit: 'major',
        emotionKey: 'sad',
        intensity: 'normal',
        seed: 42,
        tierLabels: tierHeadingLabels()
      });
      return {
        emotionInsight:
          '지금 마음이 복잡해도 괜찮아. 친구 관계에서 마음이 흔들릴 수 있어. 관계 고민은 하루에 다 풀리지 않을 수 있어. 오해는 대화를 통해 천천히 줄일 수 있어. 네 마음을 알아차린 것 자체가 좋은 시작이야. 작은 행동 하나가 관계 변화를 만들 수 있어. 오늘은 한 문장만 말해보는 작은 시도부터 시작해도 좋아. 오늘은 복도에서 마주치면 가볍게 인사만 해도 좋아. 마음이 올라올 땐 바로 답하기보다 숨을 한 번 고르면 생각이 정리되기도 해. 작은 종이에 내 마음 한 줄만 적었다가 집에서 다시 읽어보면 도움이 될 수 있어.',
        friendPerspective:
          '친구도 네 마음을 다 알지 못했을 수 있어. 겉으로 괜찮아 보여도 속으로는 고민했을 수도 있어. 서로 표현이 서툴러서 오해가 생겼을 수 있어. 지금은 누가 맞는지보다 마음을 확인하는 게 먼저야. 짧고 부드러운 대화가 관계를 다시 이어줄 수 있어. 오늘은 천천히 말문을 열어보자. 부담 없게 “괜찮아?” 한마디만 건네면 대화 문이 조금 열릴 수 있어. 같이 웃을 수 있는 작은 장면을 한 번 만들어봐도 관계가 부드러워질 수 있어. 상대가 바로 대답하지 않아도 시간을 주는 것도 배려일 수 있어.',
        actionGuide:
          '바로 문제를 다 해결하려고 하면 부담이 커질 수 있어. 그래서 오늘은 작고 쉬운 행동부터 시작하는 게 좋아. 먼저 인사하기, 짧게 마음 말하기, 친구 말 끝까지 듣기처럼 할 수 있는 것부터 골라보자. 행동은 정답이 아니라 선택지야. 네가 편한 방법부터 해도 충분히 의미 있어. 작은 시도를 반복하면 관계가 달라질 수 있어.',
        title: position === 0 ? '나의 속마음' : position === 1 ? '친구의 입장 상상' : '추천하는 행동',
        summary: '잠시 숨을 고르고 오늘의 마음을 천천히 정리해보자.',
        empathy: [
          '지금 마음이 복잡해도 괜찮아.',
          '정답을 바로 찾지 못해도 충분히 잘하고 있어.'
        ],
        explanation: [
          '관계 고민은 하루에 다 풀리지 않을 수 있어.',
          '오해는 대화를 통해 천천히 줄일 수 있어.',
          '지금은 마음을 먼저 정리하는 단계야.'
        ],
        meaning: [
          '네 마음을 알아차린 것 자체가 좋은 시작이야.',
          '작은 행동 하나가 관계 변화를 만들 수 있어.'
        ],
        closing: '오늘은 한 문장만 말해보는 작은 시도부터 시작해도 좋아.',
        emotionText: '지금은 마음을 잠깐 쉬게 하면서 천천히 생각해보자.',
        friendText: '친구도 네 마음을 바로 알기 어려웠을 수 있어.',
        actions: [...fb.actionSteps.easy, ...fb.actionSteps.medium, ...fb.actionSteps.hard],
        actionSteps: fb.actionSteps,
        interactiveActionSet: fb.interactive,
        emotionIntensity: 'normal',
        dialogues: ['우리 잠깐 이야기해볼래?', '나는 우리 사이를 다시 편하게 하고 싶어.'],
        cheer: '작은 시작이 큰 변화를 만들 수 있어.',
        smallAction: '오늘 친구에게 먼저 눈 맞추고 인사하기',
        todayAction: '오늘 친구에게 먼저 눈 맞추고 인사하기',
        safetyLine: SAFETY_LINE,
        teacherTip: '학생이 먼저 말하려는 시도를 즉시 긍정 강화해 주세요.',
        patternName: '공감형',
        mindSummary: '나는 오늘 내 마음을 차분하게 표현해보고 싶다'
      };
    }

    const emotionKey = normalizeEmotionKey(emotion);
    const intensity = inferEmotionIntensity(selectedFeelingText, emotionKey, card.isReversed);
    const meaning = card.isReversed ? cardData.reversed : cardData.upright;
    const categories = getCardCategory(cardData);
    const pattern = patternByContext(position, categories);
    const seed = hashSeed(`${card.id}-${position}-${emotionKey}-${normalizedProblem}-${card.toneSeed}-${variantRound}`);
    const sentenceEmotionKey = emotionKey === 'distance' ? 'reconcile' : emotionKey;
    const empathyPool = empathyLinePool[sentenceEmotionKey] ?? EMPATHY_LINES;
    const friendPool = friendPerspectiveLinePool[sentenceEmotionKey] ?? FRIEND_VIEW_LINES;

    const empathy = pickAvoidRecent(empathyPool, seed, `empathy-${normalizedProblem}-${emotionKey}`);
    const friendLine = pickAvoidRecent(friendPool, seed + 7, `friend-${normalizedProblem}-${emotionKey}`);
    const cheer = pickBySeed(CHEER_LINES, seed + 13);
    const teacherTip = pickBySeed(TEACHER_TIPS, seed + 23);

    const baseProphecy = normalizeForCoaching(meaning.prophecy);
    const signA = normalizeForCoaching(meaning.signs[0] ?? '');
    const signB = normalizeForCoaching(meaning.signs[1] ?? signA);
    const actions = getActionSuggestions(meaning, emotionKey, normalizedProblem, seed);
    const dialogues = uniqueItems(
      [
        ...getDialogueExamples(emotionKey, normalizedProblem, seed),
        ...pickManyAvoidRecent(DIALOGUE_LINES_V3, 2, seed + 77, `dialogue-v3-${normalizedProblem}-${emotionKey}`)
      ],
      3
    );

    const patternGuide = PATTERN_LIBRARY[pattern];
    const orientationLabel = card.isReversed ? '뒤집힌 카드' : '정방향 카드';
    const narrative = buildStructuredNarrative(position, selectedFeelingText, meaning, emotion, cardData.name, seed);

    const coachCardId = tarotIdToCoachCardId[card.id];
    const coachInterp = coachCardId !== undefined ? getInterpretation(coachCardId) : undefined;
    const mergeCoachBlock = (base: string, slot: 0 | 1 | 2): string => {
      if (!coachInterp || position !== slot) return base;
      const extra = slot === 0 ? coachInterp.self : slot === 1 ? coachInterp.friend : coachInterp.action;
      if (!extra.trim()) return base;
      return `${extra.trim()}\n\n${base}`.trim();
    };

    const emotionText =
      position === 0
        ? `${selectedFeelingText}라는 마음이 들어서 힘들었을 수 있어. ${empathy} 지금 너의 마음은 ${baseProphecy} ${signA}`.trim()
        : `지금 너는 관계를 소중히 여기고 있어. ${baseProphecy}`.trim();

    const friendText =
      position === 1
        ? `${friendLine} ${getFriendPerspective(normalizedProblem, cardData, emotionKey, intensity)} ${signB} 그래서 먼저 차분하게 물어보는 게 좋아.`
        : `친구도 사실은 이런 마음일 수 있어. ${signA}`;

    const smallAction = buildTodayAction(normalizedProblem, emotion, selectedFeelingText, actions, variantRound);
    const mindSummary = buildOneLineSummary(normalizedProblem, emotion, selectedFeelingText);
    const positionInsight = getInsightByPosition(
      cardData,
      card.isReversed,
      position as PositionRole,
      emotionKey,
      normalizedProblem,
      selectedFeelingText,
      seed
    );
    const empathyBundle = getEmpathyLine(emotionKey, selectedFeelingText, normalizedProblem, seed, intensity);
    const situationBundle = getSituationAnalysis(normalizedProblem, cardData, card.isReversed, seed, emotionKey, intensity);
    const opening = sentenceize(
      `${selectedFeelingText}라고 느껴져서 ${pickBySeed(INTENSITY_EXPRESSIONS[intensity], seed + 9).replace(/\.$/, '')}`
    );
    const practicalSelfExtras = pickManyAvoidRecent(
      PRACTICAL_KID_LINES_SELF,
      3,
      seed + 801,
      `kid-self-${normalizedProblem}-${emotionKey}-${variantRound}`
    ).map((line) => sentenceize(line));

    const emotionInsight = [opening, ...empathyBundle, ...situationBundle, ...practicalSelfExtras].join(' ');

    const practicalFriendExtras = pickManyAvoidRecent(
      PRACTICAL_KID_LINES_FRIEND,
      3,
      seed + 902,
      `kid-friend-${normalizedProblem}-${emotionKey}-${variantRound}`
    ).map((line) => sentenceize(line));

    const friendPerspective = [
      getFriendPerspective(normalizedProblem, cardData, emotionKey, intensity),
      ...pickManyAvoidRecent(friendPool, 1, seed + 9, `friend-bundle-${normalizedProblem}-${emotionKey}`),
      ...pickManyAvoidRecent(FRIEND_PERSPECTIVE_LINES_V3, 2, seed + 15, `friend-v2-${normalizedProblem}-${emotionKey}`),
      sentenceize('그래서 먼저 차분하게 확인하는 대화가 도움이 될 수 있어'),
      ...practicalFriendExtras
    ].join(' ');
    const { interactive: interactiveActionSet, actionSteps } = buildInteractiveActionBundle({
      suit: cardData.suit,
      emotionKey,
      intensity,
      seed,
      tierLabels: tierHeadingLabels()
    });
    const actionGuide = [
      sentenceize(getProblemTone(normalizedProblem).actionHint),
      sentenceize(getToneByEmotionAndSuit(emotionKey, cardData.suit, intensity)),
      sentenceize('지금은 바로 결론 내리기보다 작은 시도를 먼저 해보는 게 좋아'),
      sentenceize('처음에는 가장 쉬운 행동으로 시작해보고, 익숙해지면 조금 용기가 필요한 행동으로 넘어가도 좋아'),
      sentenceize('천천히 해도 괜찮고, 오늘 한 번 시도한 것만으로도 충분히 의미 있어')
    ].join(' ');

    const emotionInsightOut = mergeCoachBlock(
      position === 0 ? emotionInsight : narrative.emotionInsight,
      0
    );
    const friendPerspectiveOut = mergeCoachBlock(
      position === 1 ? friendPerspective : narrative.friendPerspective,
      1
    );
    const actionGuideOut = mergeCoachBlock(
      position === 2 ? `${positionInsight} ${actionGuide}` : narrative.actionGuide,
      2
    );

    return {
      emotionInsight: emotionInsightOut,
      friendPerspective: friendPerspectiveOut,
      actionGuide: actionGuideOut,
      title: position === 0 ? '나의 속마음' : position === 1 ? '친구의 입장 상상' : '추천하는 행동',
      summary: position === 0
        ? `${cardData.name} (${orientationLabel}) - 내 마음 신호를 읽는 카드`
        : position === 1
          ? `${cardData.name} (${orientationLabel}) - 친구 마음을 상상해보는 카드`
          : `${cardData.name} (${orientationLabel}) - 오늘 실천을 고르는 카드`,
      empathy: narrative.empathy,
      explanation: narrative.explanation,
      meaning: narrative.meaning,
      closing: narrative.closing,
      emotionText: `${emotionText} (${orientationLabel}, ${patternGuide.structure})`,
      friendText,
      actions: [...actionSteps.easy, ...actionSteps.medium, ...actionSteps.hard],
      actionSteps,
      dialogues,
      cheer,
      todayAction: smallAction,
      safetyLine: SAFETY_LINE,
      oneLineSummary: mindSummary,
      smallAction,
      mindSummary,
      teacherTip,
      patternName: `${pattern} · ${patternGuide.when}`,
      interactiveActionSet,
      emotionIntensity: intensity
    };
  };

  return {
    getProblemTone,
    getEmotionOpening,
    getCardCategory,
    getToneByEmotion,
    getFriendPerspective,
    getEmpathyLine,
    getSituationAnalysis,
    getInsightByPosition,
    getActionBundle,
    getActionSuggestions,
    buildActionSet,
    getDialogueBundle,
    getDialogueExamples,
    buildDialogueSet,
    getTodayAction,
    buildTodayAction,
    getOneLineSummary,
    buildOneLineSummary,
    getCardResult,
    inferEmotionIntensity,
    getDailyAction,
    drawRecommendedCards,
    getCardCategoryMap,
    patternLibrary: PATTERN_LIBRARY
  };
}
