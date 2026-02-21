// 사주 계산 및 성격 분석 유틸리티

// 천간 (Heavenly Stems)
const HEAVENLY_STEMS = ['갑(甲)', '을(乙)', '병(丙)', '정(丁)', '무(戊)', '기(己)', '경(庚)', '신(辛)', '임(壬)', '계(癸)'];

// 지지 (Earthly Branches)
const EARTHLY_BRANCHES = ['자(子)', '축(丑)', '인(寅)', '묘(卯)', '진(辰)', '사(巳)', '오(午)', '미(未)', '신(申)', '유(酉)', '술(戌)', '해(亥)'];

// 오행 (Five Elements)
const FIVE_ELEMENTS = {
  '갑(甲)': '목', '을(乙)': '목',
  '병(丙)': '화', '정(丁)': '화',
  '무(戊)': '토', '기(己)': '토',
  '경(庚)': '금', '신(辛)': '금',
  '임(壬)': '수', '계(癸)': '수'
};

// 띠 (Zodiac Animals)
const ZODIAC_ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

export interface SajuInfo {
  year: string;
  yearAnimal: string;
  yearElement: string;
  month: string;
  day: string;
  dominantElement: string;
  personality: string;
  friendshipTrait: string;
}

export function calculateSaju(birthDate: string): SajuInfo {
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 년주 계산 (기준년 1924년 = 갑자년)
  const yearIndex = (year - 1924) % 60;
  const yearStemIndex = yearIndex % 10;
  const yearBranchIndex = yearIndex % 12;
  
  const yearPillar = HEAVENLY_STEMS[yearStemIndex] + EARTHLY_BRANCHES[yearBranchIndex];
  const yearAnimal = ZODIAC_ANIMALS[yearBranchIndex];
  const yearElement = FIVE_ELEMENTS[HEAVENLY_STEMS[yearStemIndex]];

  // 월주 계산 (간단한 계산법)
  const monthStemIndex = (yearStemIndex * 2 + month) % 10;
  const monthBranchIndex = (month + 1) % 12;
  const monthPillar = HEAVENLY_STEMS[monthStemIndex] + EARTHLY_BRANCHES[monthBranchIndex];

  // 일주 계산 (간단한 계산법)
  const daysSince1900 = Math.floor((date.getTime() - new Date(1900, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  const dayStemIndex = (daysSince1900 + 9) % 10;
  const dayBranchIndex = (daysSince1900 + 11) % 12;
  const dayPillar = HEAVENLY_STEMS[dayStemIndex] + EARTHLY_BRANCHES[dayBranchIndex];

  // 주 오행 결정
  const elementCounts: { [key: string]: number } = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  [HEAVENLY_STEMS[yearStemIndex], HEAVENLY_STEMS[monthStemIndex], HEAVENLY_STEMS[dayStemIndex]].forEach(stem => {
    const element = FIVE_ELEMENTS[stem];
    elementCounts[element]++;
  });

  const dominantElement = Object.entries(elementCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];

  // 성격 및 우정 특성
  const elementTraits: { [key: string]: { personality: string; friendship: string } } = {
    목: {
      personality: '성장과 발전을 추구하는 창의적인 성격',
      friendship: '친구들의 성장을 도우며 새로운 가능성을 열어주는 관계'
    },
    화: {
      personality: '열정적이고 활발한 에너지를 가진 성격',
      friendship: '따뜻하고 활기찬 분위기를 만드는 관계'
    },
    토: {
      personality: '안정적이고 신뢰할 수 있는 중심적인 성격',
      friendship: '든든한 지지자가 되어주는 깊은 관계'
    },
    금: {
      personality: '명확하고 결단력 있는 정의로운 성격',
      friendship: '솔직하고 진실된 조언을 나누는 관계'
    },
    수: {
      personality: '지혜롭고 유연한 적응력을 가진 성격',
      friendship: '서로의 감정을 이해하는 공감적인 관계'
    }
  };

  return {
    year: yearPillar,
    yearAnimal,
    yearElement,
    month: monthPillar,
    day: dayPillar,
    dominantElement,
    personality: elementTraits[dominantElement].personality,
    friendshipTrait: elementTraits[dominantElement].friendship
  };
}

export interface PersonalityType {
  type: string;
  code: string;
  description: string;
  strengths: string[];
  friendshipStyle: string;
  compatibleTypes: string[];
}

export function analyzePersonality(answers: number[]): PersonalityType {
  if (answers.length !== 10) {
    return {
      type: '분석 중',
      code: '????',
      description: '모든 질문에 답해주세요',
      strengths: [],
      friendshipStyle: '',
      compatibleTypes: []
    };
  }

  // 점수 계산
  const score = answers.reduce((sum, val) => sum + val, 0);

  // 4가지 차원 분석
  const extrovert = answers[0] + answers[3] + answers[5] >= 2; // E vs I
  const judging = answers[1] + answers[6] + answers[8] >= 2; // J vs P
  const thinking = answers[2] + answers[4] + answers[7] >= 2; // T vs F
  const active = answers[9] === 1; // 추가 특성

  const personalityTypes: { [key: string]: PersonalityType } = {
    'EJTF': {
      type: '리더형 친구',
      code: 'ENTJ',
      description: '목표 지향적이고 계획적인 우정을 만들어가는 리더십 있는 친구',
      strengths: ['계획성', '리더십', '문제해결력', '결단력'],
      friendshipStyle: '친구들을 이끌고 함께 성장하는 것을 즐기며, 명확한 의사소통을 중요시합니다',
      compatibleTypes: ['조력자형', '분석가형', '모험가형']
    },
    'EJTD': {
      type: '조력자형 친구',
      code: 'ESFJ',
      description: '따뜻하고 배려심 깊은 관계를 중요시하는 사교적인 친구',
      strengths: ['공감능력', '배려심', '조화추구', '책임감'],
      friendshipStyle: '친구들의 감정을 잘 이해하고 필요한 도움을 적극적으로 제공합니다',
      compatibleTypes: ['리더형', '중재자형', '예술가형']
    },
    'EPTF': {
      type: '모험가형 친구',
      code: 'ENTP',
      description: '새로운 경험과 아이디어를 즐기는 창의적인 친구',
      strengths: ['창의성', '유연성', '호기심', '적응력'],
      friendshipStyle: '다양한 활동과 깊은 대화를 통해 함께 성장하는 것을 좋아합니다',
      compatibleTypes: ['리더형', '분석가형', '예술가형']
    },
    'EPTD': {
      type: '중재자형 친구',
      code: 'ENFP',
      description: '열정적이고 긍정적인 에너지로 주변을 밝히는 친구',
      strengths: ['긍정성', '열정', '공감능력', '창의성'],
      friendshipStyle: '진심 어린 관심과 격려로 친구들에게 영감을 주는 관계를 만듭니다',
      compatibleTypes: ['조력자형', '분석가형', '예술가형']
    },
    'IJTF': {
      type: '분석가형 친구',
      code: 'INTJ',
      description: '깊이 있는 대화와 지적 교류를 즐기는 신중한 친구',
      strengths: ['분석력', '독립성', '전략적사고', '통찰력'],
      friendshipStyle: '소수의 친구와 깊고 의미 있는 관계를 선호합니다',
      compatibleTypes: ['리더형', '모험가형', '관찰자형']
    },
    'IJTD': {
      type: '수호자형 친구',
      code: 'ISFJ',
      description: '헌신적이고 신뢰할 수 있는 든든한 친구',
      strengths: ['충성심', '세심함', '인내심', '신뢰성'],
      friendshipStyle: '오랜 시간 동안 변함없이 친구 곁을 지키는 안정적인 관계를 만듭니다',
      compatibleTypes: ['조력자형', '관찰자형', '예술가형']
    },
    'IPTF': {
      type: '관찰자형 친구',
      code: 'INTP',
      description: '논리적이고 탐구적인 자세로 관계를 바라보는 친구',
      strengths: ['논리성', '객관성', '지적호기심', '독창성'],
      friendshipStyle: '지적 자극을 주고받으며 서로의 생각을 존중하는 관계를 추구합니다',
      compatibleTypes: ['분석가형', '모험가형', '예술가형']
    },
    'IPTD': {
      type: '예술가형 친구',
      code: 'INFP',
      description: '감성적이고 이상적인 가치를 중요시하는 섬세한 친구',
      strengths: ['감수성', '창의성', '진정성', '이해심'],
      friendshipStyle: '깊은 감정적 연결과 진실된 이해를 바탕으로 한 관계를 소중히 합니다',
      compatibleTypes: ['중재자형', '조력자형', '수호자형']
    }
  };

  const key = `${extrovert ? 'E' : 'I'}${judging ? 'J' : 'P'}${thinking ? 'T' : 'D'}${active ? 'F' : 'D'}`;
  return personalityTypes[key] || personalityTypes['EPTD'];
}

export function getCompatibilityInsight(userType: string, friendName?: string): string {
  if (!friendName) {
    return '프로필을 완성하고 친구 이름을 입력하면 더 자세한 궁합 해석을 받을 수 있습니다.';
  }

  const insights = [
    `${friendName}님과의 관계는 서로의 장점을 발견하고 성장할 수 있는 기회가 될 것입니다.`,
    `${friendName}님과 함께할 때 당신의 ${userType} 성향이 긍정적으로 발휘될 수 있습니다.`,
    `${friendName}님과의 우정은 서로를 이해하고 지지하는 든든한 관계로 발전할 가능성이 높습니다.`,
    `${friendName}님과의 대화를 통해 새로운 관점을 발견하고 시야를 넓힐 수 있을 것입니다.`,
    `${friendName}님과 함께하는 시간이 당신에게 긍정적인 에너지와 영감을 줄 것입니다.`
  ];

  return insights[Math.floor(Math.random() * insights.length)];
}
