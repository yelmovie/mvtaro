import { scenarioMap, CoachingScenario } from '../data/scenarios';

export function useCardLogic() {
  const getCardResult = (problem: string, emotion: string, cardId: string): CoachingScenario => {
    // Navigate safely through the map
    const problemNode = scenarioMap[problem] || scenarioMap["conflict"];
    const emotionNode = problemNode[emotion] || problemNode["angry"] || problemNode["sad"];
    
    // Check if specific card exists, otherwise return fallback
    if (emotionNode && emotionNode[cardId]) {
      return emotionNode[cardId];
    }
    
    // Safety fallback
    if (emotionNode && emotionNode["fallback"]) {
      return emotionNode["fallback"];
    }

    return scenarioMap["conflict"]["angry"]["fallback"];
  };

  return { getCardResult };
}
