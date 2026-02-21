import { useState, useEffect } from 'react';
import './styles/globals.css';
import { supabase } from './utils/supabase/client';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { LanguageProvider } from './lib/LanguageContext';

// Components
import { HomeScreen } from './components/screens/HomeScreen';
import { CardDrawingScreen } from './components/screens/CardDrawingScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { FeaturesScreen } from './components/screens/FeaturesScreen';
import { ProfileViewScreen } from './components/screens/ProfileViewScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { GuideScreen } from './components/screens/GuideScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { HelpScreen } from './components/screens/HelpScreen';
import { PrivacyScreen } from './components/screens/PrivacyScreen';
import { IntegratedProfileAuthModal, UserProfile } from './components/IntegratedProfileAuthModal';
import { PayPalPremiumModal } from './components/PayPalPremiumModal';
import { initializeAdSense } from './components/GoogleAdSense';
import { Monitor, Tablet, Smartphone, Settings2 } from 'lucide-react';
import { EnvSetupModal } from './components/EnvSetupModal';
import { warnMissingEnv } from './lib/config/env';

type Screen = 'home' | 'drawing' | 'result' | 'features' | 'profile' | 'history' | 'guide' | 'settings' | 'help' | 'privacy';
type ViewportMode = 'desktop' | 'tablet' | 'mobile';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedQuestion, setSelectedQuestion] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [drawnCards, setDrawnCards] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);
  const [authSession, setAuthSession] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);

  // Load user profile from localStorage and check auth session
  useEffect(() => {
    let mounted = true;
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const initAuth = async () => {
      // Load from localStorage first
      const savedProfile = localStorage.getItem('friendship-tarot-profile');
      if (savedProfile && mounted) {
        try {
          setUserProfile(JSON.parse(savedProfile));
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }

      // Check for existing auth session or OAuth callback
      try {
        // First, try to get session from URL (OAuth callback)
        const { data: { session: urlSession }, error: urlError } = await supabase.auth.getSession();
        
        if (urlError) {
          console.error('Error getting session from URL:', urlError);
        }
        
        if (!mounted) return;
        
        if (urlSession) {
          setAuthSession(urlSession);
          console.log('Session found (possibly from OAuth):', urlSession);
          
          // Load profile from session metadata if available
          if (urlSession.user?.user_metadata) {
            const metadata = urlSession.user.user_metadata;
            const profile: UserProfile = {
              name: metadata.name || urlSession.user.email?.split('@')[0] || '',
              birthDate: metadata.birthDate || '',
              birthTime: metadata.birthTime || '',
              mbti: metadata.mbti || ''
            };
            setUserProfile(profile);
            localStorage.setItem('friendship-tarot-profile', JSON.stringify(profile));
          } else if (urlSession.user?.email) {
            // For Google OAuth, create a basic profile
            const profile: UserProfile = {
              name: urlSession.user.email.split('@')[0],
              birthDate: '',
              birthTime: '',
              mbti: ''
            };
            setUserProfile(profile);
            localStorage.setItem('friendship-tarot-profile', JSON.stringify(profile));
          }
          
          // Clean up URL hash after processing OAuth callback
          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname);
          }
          
          // Check premium status
          if (urlSession.user?.email) {
            checkPremiumStatus(urlSession.user.email);
          }
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      }
    };

    initAuth();
    
    // 개발 환경에서 미설정 env 경고를 1회만 표시
    warnMissingEnv();

    // Initialize Google AdSense
    initializeAdSense();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, session);
      
      setAuthSession(session);
      
      // Update profile from session metadata
      if (session?.user) {
        const metadata = session.user.user_metadata;
        const profile: UserProfile = {
          name: metadata?.name || session.user.email?.split('@')[0] || '',
          birthDate: metadata?.birthDate || '',
          birthTime: metadata?.birthTime || '',
          mbti: metadata?.mbti || ''
        };
        setUserProfile(profile);
        localStorage.setItem('friendship-tarot-profile', JSON.stringify(profile));
        
        // Clean up URL after OAuth redirect
        if (event === 'SIGNED_IN' && window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSelectQuestion = (questionId: string, questionTitle: string) => {
    setSelectedQuestion({ id: questionId, title: questionTitle });
    setCurrentScreen('drawing');
  };

  const handleCardsDrawn = (cardIds: string[]) => {
    setDrawnCards(cardIds);
    setCurrentScreen('result');
  };

  const handleBack = () => {
    setCurrentScreen('home');
    setSelectedQuestion(null);
    setDrawnCards([]);
  };

  const handleSaveProfile = (profile: UserProfile, session?: any) => {
    setUserProfile(profile);
    localStorage.setItem('friendship-tarot-profile', JSON.stringify(profile));
    
    if (session) {
      setAuthSession(session);
      
      // Check premium status when user logs in
      if (session.user?.email) {
        checkPremiumStatus(session.user.email);
      }
    }
  };
  
  const checkPremiumStatus = async (email: string) => {
    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-adbcd17e/premium/check/${encodeURIComponent(email)}`;
      console.log('Checking premium status:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (!response.ok) {
        console.error('Premium check failed:', response.status, response.statusText);
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setIsPremium(data.isPremium);
        console.log('Premium status:', data.isPremium);
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };
  
  const handlePurchaseSuccess = () => {
    setIsPremium(true);
    alert('🎉 프리미엄 기능이 활성화되었습니다!');
  };

  const handleOpenFeatures = () => {
    if (!userProfile) {
      setIsProfileModalOpen(true);
    } else {
      setCurrentScreen('features');
    }
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

        {/* 개발 환경 설정 버튼 — 개발 빌드에서만 표시 */}
        {import.meta.env.DEV && (
          <button
            onClick={() => setIsEnvModalOpen(true)}
            style={{
              background: 'rgba(251, 191, 36, 0.15)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              borderRadius: '8px',
              padding: '0.5rem 0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              color: '#fbbf24',
              marginLeft: '0.25rem',
            }}
            title="환경 변수 설정 (개발용)"
          >
            <Settings2 size={18} />
            <span style={{ fontSize: '0.875rem' }}>ENV</span>
          </button>
        )}
      </div>

      {/* Viewport Container */}
      <div style={getViewportStyle()}>
        {/* Screens */}
        {currentScreen === 'home' && (
          <HomeScreen 
            onSelectQuestion={handleSelectQuestion}
            onOpenProfile={() => {
              // 프로필 아이콘 클릭 시 통합 모달 열기
              setIsProfileModalOpen(true);
            }}
            onOpenAnalysis={handleOpenFeatures}
            onOpenHistory={() => setCurrentScreen('history')}
            onOpenGuide={() => setCurrentScreen('guide')}
            onOpenSettings={() => setCurrentScreen('settings')}
            userProfile={userProfile}
            isLoggedIn={!!authSession}
          />
        )}

        {currentScreen === 'drawing' && selectedQuestion && (
          <CardDrawingScreen
            questionTitle={selectedQuestion.title}
            onBack={handleBack}
            onCardsDrawn={handleCardsDrawn}
          />
        )}

        {currentScreen === 'result' && selectedQuestion && drawnCards.length > 0 && (
          <ResultScreen
            questionTitle={selectedQuestion.title}
            cardIds={drawnCards}
            onBack={handleBack}
            onNavigateToGuide={(cardId) => {
              setHighlightedCardId(cardId);
              setCurrentScreen('guide');
            }}
            onOpenAuth={() => setIsProfileModalOpen(true)}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
            userProfile={userProfile}
            isLoggedIn={!!authSession}
            isPremium={isPremium}
          />
        )}

        {currentScreen === 'features' && userProfile && (
          <FeaturesScreen
            userProfile={userProfile}
            onBack={handleBack}
          />
        )}

        {currentScreen === 'profile' && userProfile && (
          <ProfileViewScreen
            userProfile={userProfile}
            onBack={handleBack}
            onEditProfile={() => setIsProfileModalOpen(true)}
          />
        )}

        {currentScreen === 'history' && (
          <HistoryScreen
            onBack={handleBack}
            userProfile={userProfile}
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

        {/* Integrated Profile & Auth Modal */}
        <IntegratedProfileAuthModal
          isOpen={isProfileModalOpen}
          onClose={() => {
            setIsProfileModalOpen(false);
          }}
          onSuccess={(profile, session) => {
            handleSaveProfile(profile, session);
            setIsProfileModalOpen(false);
            
            // 프로필 저장 후 사주 분석 화면으로 이동
            if (profile.personalityAnswers && profile.personalityAnswers.length > 0) {
              setCurrentScreen('features');
            }
          }}
          existingProfile={userProfile}
          isLoggedIn={!!authSession}
        />
        
        {/* PayPal Premium Modal */}
        <PayPalPremiumModal
          isOpen={isPremiumModalOpen}
          onClose={() => setIsPremiumModalOpen(false)}
          onPurchaseSuccess={handlePurchaseSuccess}
          userEmail={authSession?.user?.email}
        />

        {/* 개발 환경 변수 설정 모달 */}
        <EnvSetupModal
          isOpen={isEnvModalOpen}
          onClose={() => setIsEnvModalOpen(false)}
        />
      </div>
    </div>
    </LanguageProvider>
  );
}

export default App;
