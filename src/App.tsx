import { useState, useEffect } from 'react';
import './styles/globals.css';
import { LanguageProvider, useLanguage } from './lib/LanguageContext';

// Components
import { HomeScreen } from './components/screens/HomeScreen';
import { CardDrawingScreen } from './components/screens/CardDrawingScreen';
import { Result } from './pages/Result';
import { GuideScreen } from './components/screens/GuideScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { HelpScreen } from './components/screens/HelpScreen';
import { PrivacyScreen } from './components/screens/PrivacyScreen';
import { DrawnCard } from './types/app-types';
import { BRAND_NAME, META_DESCRIPTION, ViewMode } from './constants/branding';

type Screen = 'home' | 'drawing' | 'result' | 'guide' | 'settings' | 'help' | 'privacy';

/** 브라우저 탭 제목만 통일합니다. OG/Twitter 제목은 index.html 정적 메타를 유지합니다. */
function DocumentHeadSync() {
  useEffect(() => {
    document.title = BRAND_NAME;
  }, []);

  return null;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedQuestion, setSelectedQuestion] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [selectedMood, setSelectedMood] = useState<{
    icon: string;
    label: string;
  } | null>(null);
  const [selectedFeelingText, setSelectedFeelingText] = useState<string | null>(null);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const savedMode = localStorage.getItem('mind-coaching-view-mode') as ViewMode | null;
    return savedMode ?? 'default';
  });
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute('content', META_DESCRIPTION);
    }

    let ogDescriptionTag = document.querySelector('meta[property="og:description"]');
    if (!ogDescriptionTag) {
      ogDescriptionTag = document.createElement('meta');
      ogDescriptionTag.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescriptionTag);
    }
    ogDescriptionTag.setAttribute('content', META_DESCRIPTION);
  }, []);

  useEffect(() => {
    localStorage.setItem('mind-coaching-view-mode', viewMode);
  }, [viewMode]);

  const handleSelectQuestion = (
    questionId: string,
    questionTitle: string,
    moodIcon: string,
    moodLabel: string,
    feelingText: string
  ) => {
    setSelectedQuestion({ id: questionId, title: questionTitle });
    setSelectedMood({ icon: moodIcon, label: moodLabel });
    setSelectedFeelingText(feelingText);
    setCurrentScreen('drawing');
  };

  const handleCardsDrawn = (cards: DrawnCard[]) => {
    setDrawnCards(cards);
    if (cards.length === 0) {
      return;
    }
    setCurrentScreen('result');
  };

  const handleBack = () => {
    setCurrentScreen('home');
    setSelectedQuestion(null);
    setSelectedMood(null);
    setSelectedFeelingText(null);
    setDrawnCards([]);
  };

  return (
    <LanguageProvider>
      <DocumentHeadSync />
      <div className="app-container" data-view-mode={viewMode}>
      <div className="app-route-layer">
        {/* Screens */}
        {currentScreen === 'home' && (
          <HomeScreen 
            onSelectQuestion={handleSelectQuestion}
            onOpenGuide={() => setCurrentScreen('guide')}
            onOpenSettings={() => setCurrentScreen('settings')}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
          />
        )}

        {currentScreen === 'drawing' && selectedQuestion && (
          <CardDrawingScreen
            problemType={selectedQuestion.id}
            emotionLabel={selectedMood?.label ?? '속상함'}
            questionTitle={selectedQuestion.title}
            onBack={handleBack}
            onCardsDrawn={handleCardsDrawn}
          />
        )}

        {currentScreen === 'result' && selectedQuestion && selectedMood && drawnCards.length > 0 && (
          <Result
            problemType={selectedQuestion.id}
            questionTitle={selectedQuestion.title}
            mood={selectedMood}
            selectedFeelingText={selectedFeelingText ?? ''}
            cards={drawnCards}
            onBack={handleBack}
          />
        )}

        {currentScreen === 'guide' && (
          <GuideScreen 
            onBack={handleBack} 
            highlightedCardId={highlightedCardId}
            onClearHighlight={() => setHighlightedCardId(null)}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen 
            onBack={handleBack} 
            onNavigateToHelp={() => setCurrentScreen('help')}
            onNavigateToPrivacy={() => setCurrentScreen('privacy')}
          />
        )}

        {currentScreen === 'help' && (
          <HelpScreen onBack={() => setCurrentScreen('settings')} />
        )}

        {currentScreen === 'privacy' && (
          <PrivacyScreen onBack={() => setCurrentScreen('settings')} />
        )}

      </div>
    </div>
    </LanguageProvider>
  );
}

export default App;
