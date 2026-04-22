import type { EmotionIntensity } from './coaching-engine-v2-data';
import type { CoachingInteractiveActionSetResolved } from './interactive-action-bundle';

export interface CoachingScenario {
  emotionInsight?: string;
  friendPerspective?: string;
  actionGuide?: string;
  summary?: string;
  safetyLine?: string;
  actionSteps?: {
    easy: string | string[];
    medium: string | string[];
    hard: string | string[];
  };
  todayAction?: string;
  oneLineSummary?: string;
  title?: string;
  empathy?: string[];
  explanation?: string[];
  meaning?: string[];
  closing?: string;
  emotionText: string;
  friendText: string;
  actions: string[];
  dialogues: string[];
  cheer?: string;
  smallAction?: string;
  mindSummary?: string;
  teacherTip?: string;
  patternName?: string;
  /** 행동 단계 인터랙티브 세트 + 말하기 연결 */
  interactiveActionSet?: CoachingInteractiveActionSetResolved;
  emotionIntensity?: EmotionIntensity;
}

export type ScenarioMap = {
  [problemId: string]: {
    [emotionId: string]: {
      [cardId: string]: CoachingScenario;
    };
  };
};

export const scenarioMap: ScenarioMap = {
  "conflict": {
    "angry": {
      "the-devil": {
        emotionText: "너도 모르게 자꾸 친구의 행동에 집착하거나 질투하는 마음이 생겨서 힘들었지? 무언가에 얽매인 기분이 화를 더 크게 만들고 있어.",
        friendText: "친구도 네가 자꾸 캐묻거나 불안해하는 모습에 숨이 막힐지도 몰라. 속마음을 털어놓지 못해서 둘 다 힘든 상황이야.",
        actions: [
          "잠시 친구에게서 관심을 끄고 내가 좋아하는 일 하기",
          "질투나 집착이 드는 나의 진짜 원인 써보기",
          "친구를 통제하려는 마음 내려놓기"
        ],
        dialogues: [
          "내가 요즘 너한테 너무 많이 물어봐서 답답했지?",
          "사실 내가 조금 불안해서 그랬어. 우리 조금만 편하게 지내자."
        ]
      },
      "death": {
        emotionText: "정말 절망적이고 이 관계가 끝난 것 같아 슬프지? 하지만 무언가가 끝난다는 건, 상처를 털어내고 아예 새롭게 시작할 기회이기도 해.",
        friendText: "친구 역시 지금의 방식으로는 더 이상 우리가 지낼 수 없다고 느꼈을 거야. 변화가 꼭 필요한 타이밍을 서로 마주한 거지.",
        actions: [
          "과거에 서운했던 마음 완전히 털어버리기",
          "예전과 똑같이 대하지 말고 새로운 방식으로 접근하기",
          "필요하다면 서로 잠시 떨어져서 시간 갖기"
        ],
        dialogues: [
          "우리 예전에 안 좋았던 일들은 훌훌 털고 새롭게 지내보자.",
          "나도 앞으로는 다르게 행동해 볼게."
        ]
      },
      "the-tower": {
        emotionText: "갑작스러운 다툼이나 충격적인 말 때문에 마음이 와르르 무너져 내린 기분이지? 정말 놀랐겠지만, 오히려 곪았던 문제가 이제야 터진 걸 수 있어.",
        friendText: "친구도 예상치 못한 말실수나 다툼에 스스로도 무척 당황하고 후회하고 있을 가능성이 높아.",
        actions: [
          "지금 당장 성급하게 따지지 말고 멈추기",
          "무너진 신뢰를 천천히 재건할 현실적인 방법 찾기",
          "억눌렀던 진짜 감정을 솔직하게 한 번 쏟아내기"
        ],
        dialogues: [
          "아까 네 말 듣고 너무 놀라고 상처받았어.",
          "서로 오해가 쌓였던 것 같은데 솔직하게 다 풀자."
        ]
      }
    },
    "sad": {}
  }
};
