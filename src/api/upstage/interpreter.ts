import { upstageChat } from './client';
import { createInterpretationPrompt } from './prompts';
import type { GenerateInterpretationParams, TarotInterpretationResponse, TimeRole } from './types';
import { QuestionType } from '@/lib/getTarotInterpretation';

const FORBIDDEN_WORDS = [
  '직관', '내면', '탐색', '성찰', '이해', '관계의 흐름', '에너지', '심리',
  '가능성 탐색', '방향성', '인식', '기대 조율', '경계설정', '메타인지', '역설', '패러다임'
];

function checkForbiddenWords(text: string, timeRole: TimeRole): { hasViolation: boolean; words: string[] } {
  const found: string[] = [];
  FORBIDDEN_WORDS.forEach(word => {
    if (text.includes(word)) {
      found.push(word);
    }
  });

  // timeRole별 금지 표현 체크
  const timeRoleForbidden: Record<TimeRole, string[]> = {
    PAST: ['요즘', '지금', '오늘', '이번 주', '최근에', '현재는', '앞으로', '다음', '곧', '미래에는'],
    PRESENT: ['예전', '그때', '처음', '과거에는', '한동안', '앞으로', '다음', '곧', '미래에는'],
    FUTURE: ['예전', '그때', '처음', '과거에는', '한동안', '요즘', '지금', '오늘', '현재는']
  };

  timeRoleForbidden[timeRole].forEach(word => {
    if (text.includes(word)) {
      found.push(`[${timeRole}금지:${word}]`);
    }
  });

  return { hasViolation: found.length > 0, words: found };
}

export async function generateTarotInterpretation(
  params: GenerateInterpretationParams,
  questionType: QuestionType
): Promise<TarotInterpretationResponse | null> {
  const { timeRole, orientation, cardName, cardIndex } = params;
  
  try {
    let prompt = createInterpretationPrompt(params, questionType);
    let retryCount = 0;
    const maxRetries = 1;
    
    while (retryCount <= maxRetries) {
      const response = await upstageChat({
        model: 'solar-1-mini-chat',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: {
          type: 'json_object',
        },
        temperature: 0.25,
      });

      const parsed = parseJsonResponse(response);
      
      if (!isValidInterpretation(parsed)) {
        console.warn('[Upstage] Invalid interpretation format', { cardIndex, timeRole });
        return null;
      }

      // 금지어 및 timeRole 위반 체크
      const allText = `${parsed.perspective_shift || ''} ${parsed.observable_experiment || ''} ${parsed.open_question || ''}`;
      const violation = checkForbiddenWords(allText, timeRole);

      // 디버깅 로그 (개발 환경에서만)
      if (import.meta.env.DEV) {
        console.debug('[Upstage] Interpretation generated', {
          cardIndex,
          timeRole,
          orientation,
          cacheHit: false,
          retryCount,
          violationCheck: {
            hasViolation: violation.hasViolation,
            words: violation.words
          }
        });
      }

      if (violation.hasViolation && retryCount < maxRetries) {
        if (import.meta.env.DEV) {
          console.debug('[Upstage] TimeRole/Forbidden word violation detected, retrying', {
            timeRole,
            violations: violation.words
          });
        }
        prompt = `${prompt}\n\n⚠️ 이전 답변이 timeRole(${timeRole}) 규칙 위반이므로 다시 작성하세요. 금지된 표현: ${violation.words.join(', ')}`;
        retryCount++;
        continue;
      }

      // 재시도 후에도 위반이 있어도 응답 사용 (조용히 처리)
      if (violation.hasViolation && import.meta.env.DEV) {
        console.debug('[Upstage] TimeRole/Forbidden word violation after retry, using response anyway', {
          timeRole,
          violations: violation.words
        });
      }

      return {
        perspective_shift: parsed.perspective_shift || '',
        observable_experiment: parsed.observable_experiment || '',
        open_question: parsed.open_question || '',
      };
    }

    return null;
  } catch (error) {
    console.warn('[Upstage] Failed to generate interpretation:', error instanceof Error ? error.message : 'Unknown error', {
      cardIndex,
      timeRole,
      orientation
    });
    return null;
  }
}

function parseJsonResponse(response: string): Partial<TarotInterpretationResponse> {
  try {
    // JSON 코드 블록 제거
    const cleaned = response.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.warn('[Upstage] Failed to parse JSON response:', error);
    return {};
  }
}

function isValidInterpretation(data: Partial<TarotInterpretationResponse>): boolean {
  return (
    typeof data.perspective_shift === 'string' &&
    data.perspective_shift.length > 0 &&
    typeof data.observable_experiment === 'string' &&
    data.observable_experiment.length > 0 &&
    typeof data.open_question === 'string' &&
    data.open_question.length > 0
  );
}

