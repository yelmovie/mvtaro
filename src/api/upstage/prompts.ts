import { GenerateInterpretationParams } from './types';
import { QuestionType } from '@/lib/getTarotInterpretation';

export function createInterpretationPrompt(
  params: GenerateInterpretationParams,
  questionType: QuestionType
): string {
  const { cardName, cardNameEn, orientation, questionTitle, positionLabel } = params;
  
  const orientationText = orientation === 'reversed' 
    ? '역방향(reversed)' 
    : '정방향(upright)';
  
  // 질문 유형별 특별 지침
  const questionGuidance = getQuestionTypeGuidance(questionType);
  
  return `당신은 초등학생을 위한 친절한 타로 카드 해석 상담사입니다. 다음 조건을 정확히 따라주세요:

**중요 규칙:**
1. 절대로 "운명", "예언", "확정", "반드시", "100%", "결정적" 같은 단어를 사용하지 마세요.
2. 두려움을 주는 표현을 사용하지 마세요.
3. 카드 이름을 명시적으로 언급하지 마세요 (암묵적으로만 사용).
4. 모든 메시지는 따뜻하고 긍정적으로, 선택 가능함을 강조하세요.
5. 출력은 반드시 유효한 JSON 형식만 반환하세요 (추가 설명 없이).

**카드 정보:**
- 카드: ${cardName} (${cardNameEn})
- 방향: ${orientationText}
- 질문: ${questionTitle}
- 위치: ${positionLabel}

${orientation === 'reversed' 
  ? '**역방향 특별 지침:** 회복, 되돌리기, 정리의 느낌으로 부드럽게 작성하세요.'
  : ''}

**질문 유형 특별 지침:**
${questionGuidance}

**출력 형식 (JSON만 반환):**
{
  "core_message": "핵심 메시지 (2~3문장, 친절하고 안전한 톤)",
  "helpful_hint": "지금 도움이 되는 힌트 (2~3문장, 실용적이고 따뜻한 조언)",
  "positive_actions": [
    "첫 번째 작은 행동 (1문장, 안전하고 작은 행동)",
    "두 번째 작은 행동 (1문장, 안전하고 작은 행동)",
    "세 번째 작은 행동 (1문장, 안전하고 작은 행동)"
  ]
}

**확인사항:**
- positive_actions는 반드시 정확히 3개여야 합니다.
- 모든 텍스트는 초등학생이 이해할 수 있는 쉬운 언어로 작성하세요.
- JSON만 반환하고 다른 설명은 포함하지 마세요.`;
}

function getQuestionTypeGuidance(questionType: QuestionType): string {
  switch (questionType) {
    case 'conflict':
      return `- 타인을 비난하거나 잘못을 지적하는 표현 금지
- "나" 메시지 중심으로 작성 (예: "내 마음을 말해볼 수 있어요")
- 화해보다는 이해와 소통 강조`;
    
    case 'distance':
      return `- 기다림, 공간, 관찰, 천천히 접근하는 것을 강조
- 서두르지 않아도 된다는 메시지
- 자연스러운 흐름을 존중`;
    
    case 'new_friend':
      return `- 작은 인사, 공통점 찾기, 용기 부여
- 부담스럽지 않은 작은 시작
- 자신감과 관심 표현`;
    
    case 'mind':
      return `- 추측이나 가정 금지
- 질문하기, 경청하기 강조
- 이해하려는 노력`;
    
    case 'improve':
      return `- 한 가지 행동 선택, 지속, 작게 실천
- 작은 변화부터 시작
- 꾸준함의 중요성`;
    
    default:
      return `- 긍정적이고 안전한 조언
- 작은 행동부터 시작`;
  }
}
