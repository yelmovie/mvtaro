import { GenerateInterpretationParams, TimeRole } from './types';
import { QuestionType } from '@/lib/getTarotInterpretation';

function getTimeRoleRules(timeRole: TimeRole): string {
  const baseRules = `
[공통 어휘 규칙]
❌ 금지 단어 (절대 사용 금지):
직관, 내면, 탐색, 성찰, 이해, 관계의 흐름, 에너지, 심리, 가능성 탐색, 방향성, 인식, 기대 조율, 경계설정, 메타인지, 역설, 패러다임

⭕ 사용 가능한 쉬운 표현:
- 그때 / 예전에 / 한동안 / 처음
- 요즘 / 지금 / 오늘 / 이번 주 / 최근에
- 다음에 / 앞으로 / 곧 / 만약에
- 웃었던 순간 / 서운했던 일 / 자주 했던 행동
- 어떤 말을 했는지 / 어떤 반응을 보였는지 / 어떤 표정을 지었는지
`;

  if (timeRole === 'PAST') {
    return `[시간 역할: PAST - 과거 (이미 있었던 일/처음 시작된 흐름)]

${baseRules}

✅ 사용 가능한 표현:
- "처음", "예전", "그때", "한동안", "시작했던"
- "있었던", "했던", "보였던", "느꼈던"
- "그때는", "그 시절에는" (문장 중간에만, 시작은 다양하게)

❌ 절대 금지:
- "요즘", "지금", "오늘", "이번 주", "최근에", "현재는"
- "앞으로", "다음", "곧", "미래에는"
- 문장 시작: "과거에는", "예전에는", "그때는" (다양한 시작 문구 사용)

[필드별 작성 규칙]
- perspective_shift: 두 사람이 어떻게 지내왔는지, 반복되었던 행동이나 기억, 좋았던 점 또는 어긋났던 순간 (서술문, 물음표 금지)
- observable_experiment: 그때 실제로 보였던 모습, 말투, 거리, 반응 (관찰 포인트 1개 포함)
- open_question: 그때의 경험이 지금에게 어떤 의미일지 생각해보는 질문 (1개만, 질문형)`;
  }
  
  if (timeRole === 'PRESENT') {
    return `[시간 역할: PRESENT - 현재 (요즘/지금의 장면, 오늘의 대화/거리감)]

${baseRules}

✅ 사용 가능한 표현:
- "요즘", "지금", "오늘", "이번 주", "최근에"
- "대화할 때", "만날 때", "연락할 때"
- "보인다", "느껴진다", "생긴다"

❌ 절대 금지:
- "예전", "그때", "처음", "과거에는", "한동안"
- "앞으로", "다음", "곧", "미래에는"
- 문장 시작: "현재는", "지금은", "요즘은" (다양한 시작 문구 사용)

[필드별 작성 규칙]
- perspective_shift: 지금 이 관계에서 실제로 보이는 모습에 대한 관점 (서술문, 물음표 금지)
- observable_experiment: 요즘 대화할 때, 만날 때 관찰할 수 있는 말/표정/거리/분위기 (관찰 포인트 1개 명시)
- open_question: 지금 이 순간 무엇을 확인해보고 싶은지 묻는 질문 (1개만, 질문형)`;
  }
  
  // FUTURE
  return `[시간 역할: FUTURE - 가능성 (앞으로/다음 장면, 아직 정해지지 않음)]

${baseRules}

✅ 사용 가능한 표현:
- "앞으로", "다음", "곧", "만약", "이후에"
- "할 수 있을지", "될 수 있을지", "나타날 수 있을지"
- "아직 정해지지 않은", "선택에 따라"

❌ 절대 금지:
- "예전", "그때", "처음", "과거에는", "한동안"
- "요즘", "지금", "오늘", "현재는"
- 문장 시작: "미래에는", "앞으로는", "가능성은" (다양한 시작 문구 사용)

[필드별 작성 규칙]
- perspective_shift: 이 관계가 앞으로 어떤 방향으로 갈 수 있는지 가능성 (서술문, 물음표 금지)
- observable_experiment: 다음 대화/만남에서 관찰해볼 수 있는 작은 변화 (관찰 포인트 1개 명시)
- open_question: 다음에 그 친구와 만나거나 대화할 때 어떤 새로운 이야기를 나누고 싶은지, 어떤 선택을 해보고 싶은지 (1개만, 질문형, "다음 번에 다시 뽑고 싶게 만드는" 갈래 2~3개 선택지 느낌)`;
}

function getOrientationRules(orientation: "upright" | "reversed"): string {
  if (orientation === 'reversed') {
    return `[카드 방향: REVERSED - 조심/정리 필요 상태]
- 흐름이 막히거나 어긋나 있음, 오해, 지연, 망설임, 혼란을 암시
- 조심스럽고 낮은 에너지
- 부정적으로 몰아가지 않는다
- "아직", "잠시", "정리되지 않은" 상태를 표현
- 문제를 고치라고 하지 말고, 인식하게 만든다`;
  }
  
  return `[카드 방향: UPRIGHT - 열림/연결 상태]
- 흐름이 열려 있음, 가능성과 연결을 느끼게 함
- 부드럽고 안정적인 문장
- 긍정적이되 과장하지 않는다
- "이미", "자연스럽게", "차분히 이어지고" 같은 표현
- 희망을 직접 단정하지 말고 여지를 남긴다`;
}

export function createInterpretationPrompt(
  params: GenerateInterpretationParams,
  questionType: QuestionType
): string {
  const { cardName, orientation, questionTitle, positionLabel, cardKeywords, timeRole } = params;
  
  const keywordsText = cardKeywords && cardKeywords.length > 0
    ? cardKeywords.join(', ')
    : '';
  
  const timeRoleRules = getTimeRoleRules(timeRole);
  const orientationRules = getOrientationRules(orientation);
  
  return `[명령] 이 카드의 시간 역할은 ${timeRole}입니다. 아래 규칙을 절대적으로 따르세요.

${timeRoleRules}

────────────────

${orientationRules}

────────────────

[출력 형식]
반드시 다음 JSON 형식만 출력하세요:
{
  "perspective_shift": "...",
  "observable_experiment": "...",
  "open_question": "..."
}

────────────────

[공통 작성 규칙]
- 존댓말만 사용 (반말 절대 금지)
- 한 문단은 2~3문장 이내
- 설명체, 상담체, 교훈체 금지
- 아이가 이해하기 어려운 단어 사용 금지
- 사용자에게 죄책감/불안을 키우는 표현 금지

[open_question 특별 규칙]
- 반드시 질문형 문장 (물음표 1개만)
- "다음 번에 다시 뽑고 싶게 만드는" 갈래 2~3개 선택지 느낌
- 질문을 읽고 "그럼 한 번 더 해볼까?"라는 생각이 들게
- 너무 뻔한 질문("어떤 기분인가요?") 금지, 상황을 좁혀서 묻기
- 좋은 예: "다음에 그 친구를 다시 만난다면, 어떤 말을 먼저 해보고 싶나요?"
- 나쁜 예: "어떻게 해야 할까요?", "노력해보세요."

[입력 정보]
- 고민 주제: ${questionTitle}
- 카드 이름: ${cardName}
- 카드 키워드: ${keywordsText || '(없음)'}

위 입력을 바탕으로 JSON만 출력하세요.`;
}