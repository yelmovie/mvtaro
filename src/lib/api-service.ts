import { UserProfile, PersonalityAnalysis, CompatibilityData } from '../types/app-types';

// Mock API functions - to be replaced with real API calls later

export async function generateAIReading(cardIds: string[], question: string, userProfile?: UserProfile) {
  // Mock Upstage API integration
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    interpretation: "AI가 생성한 심화 해석...",
    personalizedInsights: userProfile ? [
      `${userProfile.zodiacSign || '당신의'} 별자리 에너지가 이 카드와 조화를 이룹니다.`,
      "당신의 생년월일 기운이 긍정적인 변화를 예고합니다."
    ] : []
  };
}

export async function sendResultEmail(email: string, results: any) {
  // Mock email sending
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('Sending email to:', email, results);
  return { success: true, message: '이메일이 전송되었습니다.' };
}

export async function analyzePersonality(answers: Record<string, string>): Promise<PersonalityAnalysis> {
  // Mock MBTI-based analysis (hidden from user)
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    traits: ['창의적', '직관적', '공감 능력이 뛰어남'],
    strengths: ['깊은 통찰력', '예술적 감각', '타인에 대한 이해'],
    challenges: ['지나친 감정 몰입', '현실적 판단력 필요'],
    mbtiType: 'INFP' // Hidden from user
  };
}

export async function calculateCompatibility(user1: UserProfile, user2: UserProfile): Promise<CompatibilityData> {
  // Mock compatibility calculation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    user1,
    user2,
    score: 85,
    insights: [
      '두 사람의 에너지가 조화롭게 어우러집니다.',
      '서로의 장점을 잘 보완해줄 수 있는 관계입니다.',
      '소통을 통해 더욱 깊은 유대감을 형성할 수 있습니다.'
    ]
  };
}

export async function getZodiacAnalysis(birthDate: string) {
  // Mock zodiac analysis
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    sign: '물고기자리',
    element: '물',
    traits: ['감성적', '예술적', '직관적'],
    luckyDay: '금요일',
    luckyColor: '보라색'
  };
}

export async function getChineseZodiacAnalysis(birthYear: number) {
  // Mock Chinese zodiac analysis
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const zodiacAnimals = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
  const index = (birthYear - 4) % 12;
  
  return {
    animal: zodiacAnimals[index],
    traits: ['성실함', '인내심', '책임감'],
    luckyNumbers: [2, 7, 9],
    element: '흙'
  };
}

export async function getDailyFortune(birthDate: string, date: string) {
  // Mock daily fortune based on birth date
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    overall: '오늘은 새로운 기회가 찾아올 수 있는 날입니다.',
    love: '소중한 사람과의 관계가 더욱 깊어질 수 있습니다.',
    career: '창의적인 아이디어가 좋은 결과로 이어질 것입니다.',
    health: '충분한 휴식을 취하는 것이 중요합니다.',
    luckyItem: '보라색 소품',
    luckyTime: '오후 3시'
  };
}
