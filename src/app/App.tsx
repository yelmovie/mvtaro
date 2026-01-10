import React, { useState } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { CardDrawingScreen } from './screens/CardDrawingScreen';
import { ResultScreen } from './screens/ResultScreen';
import { DrawnCard } from '../types/tarot';

type Screen = 'home' | 'drawing' | 'result';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setCurrentScreen('drawing');
  };

  const handleDrawingComplete = (cards: DrawnCard[]) => {
    setDrawnCards(cards);
    setCurrentScreen('result');
  };

  const handleGoHome = () => {
    setCurrentScreen('home');
    setSelectedQuestionId('');
    setDrawnCards([]);
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {currentScreen === 'home' && (
        <HomeScreen
          onSelectQuestion={handleSelectQuestion}
          onViewHistory={() => {}}
          onToggleTheme={handleToggleTheme}
          isDarkMode={isDarkMode}
        />
      )}

      {currentScreen === 'drawing' && (
        <CardDrawingScreen
          questionId={selectedQuestionId}
          onComplete={handleDrawingComplete}
          onBack={handleGoHome}
        />
      )}

      {currentScreen === 'result' && (
        <ResultScreen
          questionId={selectedQuestionId}
          drawnCards={drawnCards}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  );
}
