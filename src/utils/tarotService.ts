import { TarotData, TarotCard, Question, SpreadType, Reading } from '../types/tarot';
import tarotDataJson from '../data/cards.json';

const tarotData = tarotDataJson as TarotData;

// 카드 데이터 로딩
export const getTarotData = (): TarotData => {
  return tarotData;
};

export const getCardById = (cardId: string): TarotCard | undefined => {
  const data = getTarotData();
  return data.cards.find(card => card.id === cardId);
};

export const getQuestionById = (questionId: string): Question | undefined => {
  const data = getTarotData();
  return data.questions.find(q => q.id === questionId);
};

export const getSpreadTypeById = (spreadId: string): SpreadType | undefined => {
  const data = getTarotData();
  return data.spreadTypes.find(s => s.id === spreadId);
};

// 카드 섞기 및 뽑기
export const shuffleAndDraw = (count: number): string[] => {
  const data = getTarotData();
  const shuffled = [...data.cards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(card => card.id);
};

// 정/역방향 랜덤 결정
export const getRandomOrientation = (): 'upright' | 'reversed' => {
  return Math.random() > 0.5 ? 'upright' : 'reversed';
};

// 로컬스토리지 관련
const STORAGE_KEY = 'tarot-readings';

export const saveReading = (reading: Reading): void => {
  try {
    const readings = getReadings();
    readings.push(reading);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
  } catch (error) {
    console.error('Failed to save reading:', error);
  }
};

export const getReadings = (): Reading[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load readings:', error);
    return [];
  }
};

export const getReadingById = (id: string): Reading | undefined => {
  const readings = getReadings();
  return readings.find(r => r.id === id);
};

export const deleteReading = (id: string): void => {
  try {
    const readings = getReadings();
    const filtered = readings.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete reading:', error);
  }
};

// 오늘의 리딩 체크
export const getTodayReading = (): Reading | undefined => {
  const readings = getReadings();
  const today = new Date().toISOString().split('T')[0];
  return readings.find(r => r.date.startsWith(today));
};

// 고유 ID 생성
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 카드 이미지 파일 경로 매핑 (Vite glob import 사용)
const cardImages = import.meta.glob<{ default: string }>('/src/assets/tarot/cards/*.png', { eager: true });

// 카드 id를 이미지 파일명으로 변환하여 이미지 경로 반환
export const getCardImagePath = (cardId: string, cardNumber: number): string => {
  // 카드 배열에서의 인덱스를 찾아서 사용 (이미지 파일명의 번호는 전체 덱 순서)
  const data = getTarotData();
  const cardIndex = data.cards.findIndex(card => card.id === cardId);
  
  if (cardIndex === -1) {
    return '';
  }
  
  // 카드 id를 kebab-case에서 snake_case로 변환
  const idSnakeCase = cardId.replace(/-/g, '_');
  // 카드 배열 인덱스를 두 자리 숫자로 포맷팅 (00, 01, 02...)
  const numberStr = cardIndex.toString().padStart(2, '0');
  const imageKey = `/src/assets/tarot/cards/${numberStr}_${idSnakeCase}.png`;
  
  const imageModule = cardImages[imageKey];
  return imageModule?.default || '';
};