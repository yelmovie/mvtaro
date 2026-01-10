import { upstageChat } from './client';
import { createInterpretationPrompt } from './prompts';
import type { GenerateInterpretationParams, TarotInterpretationResponse } from './types';
import { QuestionType } from '@/lib/getTarotInterpretation';

export async function generateTarotInterpretation(
  params: GenerateInterpretationParams,
  questionType: QuestionType
): Promise<TarotInterpretationResponse | null> {
  try {
    const prompt = createInterpretationPrompt(params, questionType);
    
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
    });

    const parsed = parseJsonResponse(response);
    
    if (!isValidInterpretation(parsed)) {
      return null;
    }

    return {
      core_message: parsed.core_message,
      helpful_hint: parsed.helpful_hint,
      positive_actions: ensureThreeActions(parsed.positive_actions),
    };
  } catch (error) {
    console.warn('[Upstage] Failed to generate interpretation:', error instanceof Error ? error.message : 'Unknown error');
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
    typeof data.core_message === 'string' &&
    data.core_message.length > 0 &&
    typeof data.helpful_hint === 'string' &&
    data.helpful_hint.length > 0 &&
    Array.isArray(data.positive_actions) &&
    data.positive_actions.length >= 1
  );
}

function ensureThreeActions(actions: unknown): [string, string, string] {
  if (!Array.isArray(actions)) {
    return [
      '한 번 더 생각해보기',
      '친구에게 부드럽게 말하기',
      '어른에게 상담하기',
    ];
  }

  const validActions = actions
    .filter((action): action is string => typeof action === 'string' && action.length > 0)
    .slice(0, 3);

  // 부족하면 기본값으로 채움
  while (validActions.length < 3) {
    const defaults = [
      '한 번 더 생각해보기',
      '친구에게 부드럽게 말하기',
      '어른에게 상담하기',
    ];
    validActions.push(defaults[validActions.length]);
  }

  return validActions.slice(0, 3) as [string, string, string];
}
