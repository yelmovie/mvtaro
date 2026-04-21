export interface CoachingScenario {
  emotionText: string;
  friendText: string;
  actions: string[];
  dialogues: string[];
}

export type ScenarioMap = {
  [problemId: string]: {
    [emotionId: string]: {
      [cardId: string]: CoachingScenario;
      fallback: CoachingScenario;
    };
  };
};

export const scenarioMap: ScenarioMap = {
  "conflict": {
    "angry": {
      "the-fool": {
        emotionText: "친구와 멀어져서 많이 화가 났지만, 사실 오해나 다툼 따윈 금방 잊고 예전처럼 편하게 지내고 싶지?",
        friendText: "친구도 네가 화난 걸 보고 무척 당황했을 거야. 먼저 다가가고 싶지만 무서워서 피하고 있을지도 몰라.",
        actions: [
          "심각한 얘기보다 먼저 가볍게 인사해보기",
          "서로 감정이 가라앉은 후 타이밍 잡기",
          "비난 대신 '나는 ~해서 속상했어' 라고 말하기"
        ],
        dialogues: [
          "아까는 내가 너무 화를 내서 미안해.",
          "우리 지금은 조금 진정하고 내일 다시 얘기할래?"
        ]
      },
      "fallback": {
        emotionText: "화가 나는 건 당연한 감정이야. 하지만 그 안에는 친구와 다시 잘 지내고 싶은 마음이 숨어있을 거야.",
        friendText: "친구도 어색해서 말을 못 걸고 있을 거야. 누군가 먼저 손 내밀기를 바라고 있을지 몰라.",
        actions: [
          "심호흡을 크게 세 번 하고 마음 가라앉히기",
          "친구가 왜 그랬을지 다른 이유 상상해보기",
          "작은 편지나 쪽지에 내 마음 솔직하게 적기"
        ],
        dialogues: [
          "내가 화났던 건 네가 싫어서가 아니야.",
          "우리 내일은 웃으면서 다시 볼 수 있으면 좋겠다."
        ]
      }
    },
    "sad": {
      "fallback": {
        emotionText: "이유도 모른 채 서운한 일이 생겨 많이 슬펐구나. 그 마음 충분히 이해해.",
        friendText: "친구는 네가 그렇게 크게 상처받았는지 아직 모를 수도 있어.",
        actions: [
          "가만히 기다리기만 하지 말고 눈빛 보내기",
          "네 마음을 나 전달법으로 부드럽게 표현하기",
          "같이 밥 먹으면서 자연스럽게 대화 시도하기"
        ],
        dialogues: [
          "어제 네가 그렇게 말해서 나는 조금 속상했어.",
          "나랑 같이 점심 먹으면서 오해 풀래?"
        ]
      }
    }
  }
};
