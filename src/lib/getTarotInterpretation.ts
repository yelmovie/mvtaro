import interpretationsData from '@/data/tarotInterpretations_v1.json';
import overridesData from '@/data/tarotInterpretations_overrides_major_v1.json';
import improveOverridesData from '@/data/tarotInterpretations_overrides_major_improve_v1.json';

export type QuestionType = "conflict" | "distance" | "new_friend" | "mind" | "improve";

interface TarotInterpretation {
  cardId: string;
  orientation: "upright" | "reversed";
  question_type: QuestionType;
  core_message: string;
  prediction: string;
  signs: [string, string, string];
  positive_actions: [string, string, string];
}

// Safe fallback interpretation (always available)
const safeFallbackInterpretation: TarotInterpretation = {
  cardId: "fallback",
  orientation: "upright",
  question_type: "improve",
  core_message: "지금은 결과를 정리하는 중이에요.",
  prediction: "잠깐 숨을 고르고, 안전한 선택을 해보면 좋아요.",
  signs: [
    "서두르지 않아도 돼요",
    "마음이 정리되면 더 잘 보여요",
    "도움을 받아도 괜찮아요"
  ],
  positive_actions: [
    "30초 쉬기",
    "내 마음 한 문장 적기",
    "필요하면 어른에게 말하기"
  ]
};

// Build index map for fast lookup (templates)
const interpretationMap = new Map<string, TarotInterpretation>();

try {
  if (Array.isArray(interpretationsData)) {
    interpretationsData.forEach((item: TarotInterpretation) => {
      if (item && item.cardId && item.orientation && item.question_type) {
        const key = `${item.cardId}|${item.orientation}|${item.question_type}`;
        interpretationMap.set(key, item);
      }
    });
  }
} catch (error) {
  console.warn("[Non-blocking] Failed to build interpretation map, using fallback", { error });
}

// Build overrides map (Major Arcana special texts)
const overridesMap = new Map<string, TarotInterpretation>();

try {
  if (Array.isArray(overridesData)) {
    overridesData.forEach((item: TarotInterpretation) => {
      if (item && item.cardId && item.orientation && item.question_type) {
        const key = `${item.cardId}|${item.orientation}|${item.question_type}`;
        overridesMap.set(key, item);
      }
    });
  }
} catch (error) {
  console.warn("[Non-blocking] Failed to build overrides map, using fallback", { error });
}

// Build improve overrides map (Major Arcana improve question type)
const improveOverridesMap = new Map<string, TarotInterpretation>();

try {
  if (Array.isArray(improveOverridesData)) {
    improveOverridesData.forEach((item: TarotInterpretation) => {
      if (item && item.cardId && item.orientation && item.question_type) {
        const key = `${item.cardId}|${item.orientation}|${item.question_type}`;
        improveOverridesMap.set(key, item);
      }
    });
  }
} catch (error) {
  console.warn("[Non-blocking] Failed to build improve overrides map, using fallback", { error });
}

export function mapQuestionIdToType(questionId: string): QuestionType {
  switch (questionId) {
    case "friendship-conflict":
      return "conflict";
    case "friendship-distance":
      return "distance";
    case "new-friendship":
      return "new_friend";
    case "friendship-understanding":
      return "mind";
    case "friendship-improve":
      return "improve";
    default:
      return "improve";
  }
}

export function getTarotInterpretation(
  cardId: string,
  orientation: "upright" | "reversed",
  questionType: QuestionType
): TarotInterpretation {
  try {
    const key = `${cardId}|${orientation}|${questionType}`;
    // Check improve overrides first (for major arcana + improve question type)
    if (questionType === "improve") {
      const improveOverride = improveOverridesMap.get(key);
      if (improveOverride) {
        return improveOverride;
      }
    }
    // Check general overrides, then fall back to templates
    const result = overridesMap.get(key) || interpretationMap.get(key);
    if (result) {
      return result;
    }
  } catch (error) {
    console.warn("[Non-blocking] Error in getTarotInterpretation, using fallback", { error, cardId, orientation, questionType });
  }
  // Always return fallback if nothing found or error occurred
  return safeFallbackInterpretation;
}
