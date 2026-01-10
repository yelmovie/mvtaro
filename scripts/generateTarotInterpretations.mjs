import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// Read cards data
const cardsData = JSON.parse(
  readFileSync(resolve(rootDir, 'src/data/cards.json'), 'utf-8')
);

const orientations = ['upright', 'reversed'];
const questionTypes = ['conflict', 'distance', 'new_friend', 'mind', 'improve'];

// Template-based generation
const templates = {
  conflict: {
    upright: {
      core_message: '이 카드는 갈등을 해결하는 방법을 알려줘요.',
      prediction: '대화와 이해를 통해 관계가 더 좋아질 수 있어요.',
      signs: [
        '서로의 마음을 이해하려는 노력이 보여요',
        '대화할 기회가 생길 수 있어요',
        '해결의 실마리가 보이기 시작해요'
      ],
      positive_actions: [
        '먼저 사과하는 마음 표현하기',
        '상대의 입장 들어보기',
        '함께 해결책 찾기'
      ]
    },
    reversed: {
      core_message: '이 카드는 갈등을 천천히 풀어가라는 뜻이에요.',
      prediction: '시간을 두고 차분하게 대화하면 해결될 수 있어요.',
      signs: [
        '서로 차분해지는 시간이 필요해요',
        '무리하게 해결하려 하지 않아요',
        '천천히 접근하는 게 좋아요'
      ],
      positive_actions: [
        '조금 기다려보기',
        '차분한 마음으로 대화하기',
        '서로의 공간 존중하기'
      ]
    }
  },
  distance: {
    upright: {
      core_message: '이 카드는 거리감이 자연스럽다는 뜻이에요.',
      prediction: '시간이 지나면 다시 가까워질 수 있어요.',
      signs: [
        '서로 다른 길을 가고 있어요',
        '자연스러운 거리감이 생겨요',
        '무리하게 가까워지려 하지 않아요'
      ],
      positive_actions: [
        '거리를 두는 것도 괜찮다고 생각하기',
        '자연스러운 만남 기다리기',
        '서로의 공간 존중하기'
      ]
    },
    reversed: {
      core_message: '이 카드는 거리감을 줄일 수 있다는 뜻이에요.',
      prediction: '작은 노력으로 관계를 다시 가깝게 만들 수 있어요.',
      signs: [
        '다시 만날 기회가 생겨요',
        '관계를 회복하고 싶어요',
        '연락할 수 있는 방법이 있어요'
      ],
      positive_actions: [
        '먼저 연락하기',
        '함께 할 수 있는 일 찾기',
        '작은 관심 표현하기'
      ]
    }
  },
  new_friend: {
    upright: {
      core_message: '이 카드는 새로운 만남의 가능성을 보여줘요.',
      prediction: '새로운 친구를 만날 좋은 시기가 올 거예요.',
      signs: [
        '새로운 사람들을 만날 기회가 생겨요',
        '자신감 있게 다가갈 수 있어요',
        '순수한 마음으로 관계를 시작할 수 있어요'
      ],
      positive_actions: [
        '용기 내어 먼저 인사하기',
        '공통 관심사로 대화 시작하기',
        '자연스럽게 친해지기'
      ]
    },
    reversed: {
      core_message: '이 카드는 새로운 만남을 조심스럽게 접근하라는 뜻이에요.',
      prediction: '천천히 신중하게 관계를 시작하면 좋아요.',
      signs: [
        '새로운 만남에 조심스러워요',
        '천천히 알아가고 싶어요',
        '서두르지 않고 관계를 만들어가요'
      ],
      positive_actions: [
        '천천히 신뢰 쌓기',
        '서로를 알아가는 시간 갖기',
        '무리하게 친해지려 하지 않기'
      ]
    }
  },
  mind: {
    upright: {
      core_message: '이 카드는 친구의 마음을 이해할 수 있다는 뜻이에요.',
      prediction: '대화와 관찰을 통해 친구의 마음을 알 수 있어요.',
      signs: [
        '친구가 말하고 싶어 해요',
        '소통할 기회가 생겨요',
        '서로의 마음을 나눌 수 있어요'
      ],
      positive_actions: [
        '친구에게 물어보기',
        '대화를 잘 들어주기',
        '함께 시간 보내며 이해하기'
      ]
    },
    reversed: {
      core_message: '이 카드는 친구의 마음을 이해하는 데 시간이 필요하다는 뜻이에요.',
      prediction: '천천히 관찰하고 기다리면 마음을 알 수 있어요.',
      signs: [
        '친구가 말하기 어려워할 수 있어요',
        '시간을 두고 지켜봐야 해요',
        '서두르지 않고 기다려야 해요'
      ],
      positive_actions: [
        '친구에게 부드럽게 다가가기',
        '시간을 두고 지켜보기',
        '편안한 분위기 만들기'
      ]
    }
  },
  improve: {
    upright: {
      core_message: '이 카드는 관계를 개선할 수 있다는 뜻이에요.',
      prediction: '작은 노력으로 관계가 더 좋아질 수 있어요.',
      signs: [
        '관계를 개선할 에너지가 있어요',
        '새로운 방법을 시도하고 싶어요',
        '좋은 변화를 만들 수 있어요'
      ],
      positive_actions: [
        '작은 배려부터 시작하기',
        '새로운 활동 함께하기',
        '긍정적인 변화 만들기'
      ]
    },
    reversed: {
      core_message: '이 카드는 관계 개선을 위해 천천히 접근하라는 뜻이에요.',
      prediction: '서두르지 않고 차근차근 노력하면 좋아질 거예요.',
      signs: [
        '변화를 위한 시간이 필요해요',
        '천천히 접근해야 해요',
        '무리하게 바꾸려 하지 않아요'
      ],
      positive_actions: [
        '작은 것부터 천천히 바꾸기',
        '서로의 페이스 존중하기',
        '인내심을 가지고 노력하기'
      ]
    }
  }
};

// Generate interpretations
const interpretations = [];

for (const card of cardsData.cards) {
  for (const orientation of orientations) {
    for (const questionType of questionTypes) {
      const template = templates[questionType][orientation];
      interpretations.push({
        cardId: card.id,
        orientation: orientation,
        question_type: questionType,
        core_message: template.core_message,
        prediction: template.prediction,
        signs: [...template.signs],
        positive_actions: [...template.positive_actions]
      });
    }
  }
}

// Write to file
const outputPath = resolve(rootDir, 'src/data/tarotInterpretations_v1.json');
writeFileSync(outputPath, JSON.stringify(interpretations, null, 2), 'utf-8');

console.log(`Generated ${interpretations.length} entries to ${outputPath}`);
