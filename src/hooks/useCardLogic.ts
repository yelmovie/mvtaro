import { scenarioMap, CoachingScenario } from '../data/scenarios';
import { tarotCards78Data } from '../data/tarot-cards-78';

export function useCardLogic() {
  const getCardResult = (problem: string, emotion: string, cardId: string, position: number): CoachingScenario => {
    // 1. Check for manual overrides in scenarios.ts first (Highest Priority)
    const problemNode = scenarioMap[problem];
    if (problemNode) {
      const emotionNode = problemNode[emotion];
      if (emotionNode && emotionNode[cardId]) {
        return emotionNode[cardId];
      }
    }

    // 2. Automated Generation from tarot-cards-78Data (On-The-Fly)
    const cardData = tarotCards78Data.cards.find(c => c.id === cardId);
    
    if (cardData) {
      // Convert upright data into educational tone
      const prophecy = cardData.upright.prophecy.replace(/가능성이 큽니다|예상됩니다/g, '느낄 수 있어').replace(/당신/g, '너');
      const signs = cardData.upright.signs.map(s => s.replace(/당신/g, '너').replace(/수 있습니다/g, '수 있어'));
      const advice = cardData.upright.advice.map(s => s.replace(/당신/g, '너').replace(/보세요/g, '보자'));

      return {
        emotionText: `지금 너는 ${cardData.name} 카드의 기운을 뽑았어! ${prophecy} ${signs[0] || ''}`,
        friendText: `친구의 마음 속을 상상해볼까? ${signs[1] || ''} 아마 친구도 분명 너와 같은 고민을 하고 있을 거야. 방금 뽑은 ${cardData.name} 카드가 힌트가 될 수 있어!`,
        actions: advice.length > 0 ? advice : [
          "심호흡을 크게 세 번 하고 마음 가라앉히기",
          "친구가 왜 그랬을지 다른 이유 상상해보기",
          "솔직하게 먼저 다가가보기"
        ],
        dialogues: [
          `"안녕! 어제 일로 잠깐 이야기할 수 있을까?"`,
          `"나는 우리 관계가 예전처럼 다시 ${cardData.name} 카드처럼 밝아졌으면 좋겠어."`
        ]
      };
    }

    // 3. Ultimate Fallback (If card completely missing)
    return scenarioMap["conflict"]["angry"]["fallback"];
  };

  return { getCardResult };
}
