export interface TarotInterpretationResponse {
  core_message: string;
  helpful_hint: string;
  positive_actions: [string, string, string];
}

export interface GenerateInterpretationParams {
  cardId: string;
  cardName: string;
  cardNameEn: string;
  orientation: "upright" | "reversed";
  questionId: string;
  questionTitle: string;
  positionLabel: string;
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
