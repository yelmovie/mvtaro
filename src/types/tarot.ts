export interface TarotCard {
  id: string;
  name: string;
  nameEn: string;
  number: number;
  symbol: string;
  category: 'major' | 'minor';
  keywords: string[];
  upright: CardInterpretation;
  reversed: CardInterpretation;
}

export interface CardInterpretation {
  prediction: string;
  signs: string[];
  positiveActions: string[];
}

export interface Question {
  id: string;
  title: string;
  description: string;
}

export interface SpreadType {
  id: string;
  name: string;
  description: string;
  positions: SpreadPosition[];
}

export interface SpreadPosition {
  position: number;
  label: string;
  description: string;
}

export interface DrawnCard {
  cardId: string;
  orientation: 'upright' | 'reversed';
  position: number;
}

export interface Reading {
  id: string;
  date: string;
  questionId: string;
  spreadType: string;
  cards: DrawnCard[];
  chosenAdviceId?: string;
  memo?: string;
}

export interface TarotData {
  cards: TarotCard[];
  questions: Question[];
  spreadTypes: SpreadType[];
}
