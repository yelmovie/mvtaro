export interface TarotInterpretationResponse {
  perspective_shift: string; // 사용자의 생각을 재해석하는 관점 전환 문장 1개
  observable_experiment: string; // 관찰 가능한 실험 (착한 행동이 아닌)
  open_question: string; // 정답 없는 질문 1개
}

export type TimeRole = "PAST" | "PRESENT" | "FUTURE";

export interface GenerateInterpretationParams {
  cardId: string;
  cardName: string;
  cardNameEn: string;
  orientation: "upright" | "reversed";
  questionId: string;
  questionTitle: string;
  positionLabel: string;
  cardKeywords?: string[]; // 카드 키워드 (옵셔널)
  cardIndex: number; // 카드 배열 index (0: 과거, 1: 현재, 2: 가능성)
  timeRole: TimeRole; // 시간 역할 (PAST/PRESENT/FUTURE)
}

export interface UpstageChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface UpstageChatRequest {
  model: string;
  messages: UpstageChatMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: {
    type: "json_object";
  };
}

export interface UpstageChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}
