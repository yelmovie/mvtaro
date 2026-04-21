import { useState, useEffect } from 'react';
import './styles/globals.css';
import { LanguageProvider } from './lib/LanguageContext';

// Components
import { HomeScreen } from './components/screens/HomeScreen';
import { CardDrawingScreen } from './components/screens/CardDrawingScreen';
import { Result } from './pages/Result';
import { GuideScreen } from './components/screens/GuideScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { HelpScreen } from './components/screens/HelpScreen';
import { PrivacyScreen } from './components/screens/PrivacyScreen';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

type Screen = 'home' | 'drawing' | 'result' | 'guide' | 'settings' | 'help' | 'privacy';
type ViewportMode = 'desktop' | 'tablet' | 'mobile';

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
  const [drawnCards, setDrawnCards] = useState<string[]>([]);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);

  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleSelectQuestion = (questionId: string, questionTitle: string, moodIcon: string, moodLabel: string) => {
    setSelectedQuestion({ id: questionId, title: questionTitle });
    setSelectedMood({ icon: moodIcon, label: moodLabel });
    setCurrentScreen('drawing');
  };

  const handleCardsDrawn = (cardIds: string[]) => {
    setDrawnCards(cardIds);
    setCurrentScreen('result');
  };

  const handleBack = () => {
    setCurrentScreen('home');
    setSelectedQuestion(null);
    setSelectedMood(null);
    setDrawnCards([]);
  };

  // Viewport dimensions
  const getViewportStyle = () => {
    switch (viewportMode) {
      case 'mobile':
        return { maxWidth: '430px', margin: '0 auto', border: '1px solid rgba(255, 255, 255, 0.1)' };
      case 'tablet':
        return { maxWidth: '820px', margin: '0 auto', border: '1px solid rgba(255, 255, 255, 0.1)' };
      case 'desktop':
      default:
        return { maxWidth: '100%' };
    }
  };

  return (
    <LanguageProvider>
      <div className="app-container">
      {/* Viewport Mode Selector */}
      <div className="glass-card" style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 100,
        display: 'flex',
        gap: '0.5rem',
        borderRadius: '12px',
        padding: '0.5rem'
      }}>
        <button
          onClick={() => setViewportMode('desktop')}
          style={{
            background: viewportMode === 'desktop' ? 'rgba(107, 70, 193, 0.5)' : 'transparent',
            border: viewportMode === 'desktop' ? '1px solid var(--primary-purple)' : '1px solid transparent',
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
            color: 'var(--text-primary)'
          }}
          title="데스크톱 뷰"
        >
          <Monitor size={18} />
          <span style={{ fontSize: '0.875rem' }}>Desktop</span>
        </button>
        
        <button
          onClick={() => setViewportMode('tablet')}
          style={{
            background: viewportMode === 'tablet' ? 'rgba(107, 70, 193, 0.5)' : 'transparent',
            border: viewportMode === 'tablet' ? '1px solid var(--primary-purple)' : '1px solid transparent',
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
            color: 'var(--text-primary)'
          }}
          title="태블릿 뷰"
        >
          <Tablet size={18} />
          <span style={{ fontSize: '0.875rem' }}>Tablet</span>
        </button>
        
        <button
          onClick={() => setViewportMode('mobile')}
          style={{
            background: viewportMode === 'mobile' ? 'rgba(107, 70, 193, 0.5)' : 'transparent',
            border: viewportMode === 'mobile' ? '1px solid var(--primary-purple)' : '1px solid transparent',
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
            color: 'var(--text-primary)'
          }}
          title="모바일 뷰"
        >
          <Smartphone size={18} />
          <span style={{ fontSize: '0.875rem' }}>Mobile</span>
        </button>
      </div>

      {/* Viewport Container */}
      <div style={getViewportStyle()}>
        {/* Screens */}
        {currentScreen === 'home' && (
          <HomeScreen 
            onSelectQuestion={handleSelectQuestion}
            onOpenGuide={() => setCurrentScreen('guide')}
            onOpenSettings={() => setCurrentScreen('settings')}
          />
        )}

        {currentScreen === 'drawing' && selectedQuestion && (
          <CardDrawingScreen
            questionTitle={selectedQuestion.title}
            onBack={handleBack}
            onCardsDrawn={handleCardsDrawn}
          />
        )}

        {currentScreen === 'result' && selectedQuestion && selectedMood && drawnCards.length > 0 && (
          <Result
            questionTitle={selectedQuestion.title}
            mood={selectedMood}
            cardIds={drawnCards}
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
