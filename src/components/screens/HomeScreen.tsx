import { Zap, Moon, Sun, MessageCircle, HeartHandshake, BookOpen, Star, AlertCircle } from 'lucide-react';
import { MysticBackground } from '../MysticBackground';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../lib/LanguageContext';
import { getTranslations } from '../../lib/translations';
// @ts-ignore
import angerIcon from '../../assets/anger.png';
// @ts-ignore
import sadIcon from '../../assets/sad.png';
// @ts-ignore
import nervousIcon from '../../assets/nervous.png';
// @ts-ignore
import clockIcon from '../../assets/clock.png';
import {
  HOME_DESCRIPTION,
  HOME_QUESTION,
  HOME_STEP_LABEL,
  VIEW_MODE_OPTIONS,
  ViewMode
} from '../../constants/branding';

const QUESTIONS = [
  {
    id: 'friend-avoiding',
    icon: Zap,
    title: '친구가 나를 피하는 것 같아요',
    description: '예전처럼 눈도 잘 안 마주치고 말도 줄었어요',
    color: '#EC4899'
  },
  {
    id: 'argument',
    icon: Moon,
    title: '친구랑 말다툼 했어요',
    description: '말이 세게 나와서 서로 기분이 상했어요',
    color: '#6B46C1'
  },
  {
    id: 'jealousy',
    icon: Star,
    title: '친구가 다른 친구랑 더 친하게 지내요',
    description: '내가 밀려난 느낌이 들어서 속상해요',
    color: '#F59E0B'
  },
  {
    id: 'groupchat-leftout',
    icon: MessageCircle,
    title: '단톡방에서 나만 소외된 느낌이에요',
    description: '답장이 늦거나 나만 빼고 이야기하는 것 같아요',
    color: '#8B5CF6'
  },
  {
    id: 'joke-misfire',
    icon: HeartHandshake,
    title: '장난이었는데 친구가 화났어요',
    description: '웃기려고 한 말인데 상처가 된 것 같아요',
    color: '#10B981'
  },
  {
    id: 'dont-want-apology',
    icon: HeartHandshake,
    title: '먼저 사과하기 싫어요',
    description: '내 잘못 같지도 않아서 더 화가 나요',
    color: '#22c55e'
  },
  {
    id: 'secret-broken',
    icon: AlertCircle,
    title: '친구가 내 비밀을 말했어요',
    description: '믿었는데 배신당한 느낌이라 속상해요',
    color: '#f43f5e'
  },
  {
    id: 'left-out-play',
    icon: Star,
    title: '같이 놀고 싶은데 끼워주지 않아요',
    description: '어디에 끼어야 할지 몰라서 위축돼요',
    color: '#f59e0b'
  },
  {
    id: 'feeling-ignored',
    icon: MessageCircle,
    title: '친구가 나를 무시하는 것 같아요',
    description: '내 말은 잘 안 듣고 딴청 피우는 것 같아요',
    color: '#10B981'
  }
];

interface MoodOption {
  icon: string;
  label: string;
  emoji: string;
  accent: string;
  glow: string;
  tint: string;
  shadow: string;
}

const MOODS = [
  {
    icon: angerIcon,
    label: '화남',
    emoji: '😡',
    accent: '#D27A86',
    glow: 'rgba(210, 122, 134, 0.42)',
    tint: 'rgba(210, 122, 134, 0.16)',
    shadow: 'rgba(113, 34, 45, 0.34)'
  },
  {
    icon: sadIcon,
    label: '속상함',
    emoji: '😥',
    accent: '#8FA9E8',
    glow: 'rgba(143, 169, 232, 0.4)',
    tint: 'rgba(143, 169, 232, 0.14)',
    shadow: 'rgba(62, 82, 145, 0.3)'
  },
  {
    icon: nervousIcon,
    label: '불안함',
    emoji: '😟',
    accent: '#9A98D9',
    glow: 'rgba(154, 152, 217, 0.38)',
    tint: 'rgba(154, 152, 217, 0.13)',
    shadow: 'rgba(72, 68, 135, 0.3)'
  },
  {
    icon: clockIcon,
    label: '답답함',
    emoji: '😶',
    accent: '#D8C68B',
    glow: 'rgba(216, 198, 139, 0.34)',
    tint: 'rgba(216, 198, 139, 0.14)',
    shadow: 'rgba(120, 104, 57, 0.28)'
  }
] satisfies MoodOption[];

interface HomeScreenProps {
  onSelectQuestion: (
    questionId: string,
    questionTitle: string,
    moodIcon: string,
    moodLabel: string,
    selectedFeelingText: string
  ) => void;
  onOpenGuide?: () => void;
  onOpenSettings?: () => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
}

const FEELING_PROMPTS: Record<string, string[]> = {
  화남: [
    '나만 바보 된 느낌이야',
    '왜 나한테만 그러는지 모르겠어',
    '친구가 일부러 그런 것 같아'
  ],
  속상함: [
    '친구가 나를 피하는 것 같아',
    '예전처럼 안 친한 느낌이야',
    '혼자 있는 기분이 들어'
  ],
  불안함: [
    '친구가 나를 싫어하는 건 아닐까?',
    '내가 잘못한 걸까 계속 생각나',
    '다른 애들이 나 빼고 친한 것 같아'
  ],
  답답함: [
    '말하고 싶은데 어떻게 말해야 할지 모르겠어',
    '계속 생각나서 더 답답해',
    '그냥 참고 있는데 힘들어'
  ]
};

export function HomeScreen({ onSelectQuestion, onOpenGuide, viewMode, onChangeViewMode }: HomeScreenProps) {
  const { language } = useLanguage();
  const t = getTranslations(language);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'light' ? 'light' : 'dark';
  });
  const [selectedTopic, setSelectedTopic] = useState<{ id: string, title: string } | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [selectedFeelingText, setSelectedFeelingText] = useState<string | null>(null);
  const [isProceeding, setIsProceeding] = useState(false);
  const [selectingMoodLabel, setSelectingMoodLabel] = useState<string | null>(null);

  const handleSelectMood = (mood: MoodOption) => {
    setSelectingMoodLabel(mood.label);
    setSelectedMood(mood);
    setSelectedFeelingText(null);
    setIsProceeding(false);
    window.setTimeout(() => {
      setSelectingMoodLabel((prev) => (prev === mood.label ? null : prev));
    }, 420);
  };

  const handleProceedToDrawing = () => {
    if (!selectedTopic || !selectedMood || !selectedFeelingText || isProceeding) return;
    setIsProceeding(true);
    window.setTimeout(() => {
      onSelectQuestion(
        selectedTopic.id,
        selectedTopic.title,
        selectedMood.icon,
        selectedMood.label,
        selectedFeelingText
      );
    }, 180);
  };

  const toggleTheme = () => {
    setThemeMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      return next;
    });
  };

  useEffect(() => {
    const syncFromStorage = () => {
      const saved = localStorage.getItem('theme');
      setThemeMode(saved === 'light' ? 'light' : 'dark');
    };
    window.addEventListener('focus', syncFromStorage);
    return () => window.removeEventListener('focus', syncFromStorage);
  }, []);
  
  return (
    <div className="min-h-screen relative home-screen-shell">
      <MysticBackground variant="tarot-space" intensity="high" />

      <div className="relative z-10">
        <div className="home-top-bar">
          <button
            type="button"
            className="home-theme-toggle"
            onClick={toggleTheme}
            aria-label={themeMode === 'dark' ? '라이트 모드로 바꾸기' : '다크 모드로 바꾸기'}
            title={themeMode === 'dark' ? '라이트 모드' : '다크 모드'}
          >
            {themeMode === 'dark' ? <Sun size={22} strokeWidth={2} /> : <Moon size={22} strokeWidth={2} />}
          </button>
        </div>

        <div className="home-screen-inner py-12 px-4">
        <div className="home-screen-content">
          <header className="home-header glass-card">
            <div className="home-brand-block">
              <span className="home-brand-kicker">친구관계 마음 정리 앱</span>
              <h1 className="home-brand-title">{t.appTitle}</h1>
              <p className="home-brand-tagline">{t.appSubtitle}</p>
            </div>

            <div className="home-header-actions">
              <div className="home-view-control-label">보기 설정</div>
              <div className="view-mode-toggle" role="group" aria-label="보기 설정">
                {VIEW_MODE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`view-mode-btn ${viewMode === option.value ? 'is-active' : ''}`}
                    aria-pressed={viewMode === option.value}
                    title={option.description}
                    onClick={() => onChangeViewMode(option.value)}
                  >
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </header>

          <section className="home-hero glass-card animate-fade-in">
            <span className="home-step-label">{HOME_STEP_LABEL}</span>
            <h2 className="home-main-question">{HOME_QUESTION}</h2>
            <p className="home-main-description">{HOME_DESCRIPTION}</p>
          </section>

          {/* Step 1: Select Topic */}
          {!selectedTopic && (
            <section className="animate-fade-in home-selection-section">
              <div className="home-section-intro">
                <p className="home-section-eyebrow">지금 가장 가까운 고민을 골라보세요</p>
                <p className="home-section-helper">
                  가장 먼저 눌러볼 고민을 하나 고르면 다음 단계로 자연스럽게 이어져요.
                </p>
              </div>

              <div className="home-question-grid">
                {QUESTIONS.map((question, index) => (
                  <div
                    key={question.id}
                    className="question-card animate-fade-in home-question-card"
                    onClick={() => setSelectedTopic({ id: question.id, title: question.title })}
                    style={{
                      animationDelay: `${index * 0.06}s`
                    }}
                  >
                    <div className="home-question-card__inner">
                      <div className="home-question-card__icon">
                        <question.icon size={24} color={question.color} />
                      </div>
                      <div className="home-question-card__content">
                        <h3 className="home-question-card__title">{question.title}</h3>
                        <p className="home-question-card__description">{question.description}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setSelectedTopic({ id: 'mystery', title: '말하기 힘든 다른 고민' })}
                  className="home-question-card home-question-card--ghost"
                >
                  <AlertCircle size={18} />
                  내가 직접 생각할게요
                </button>
              </div>
            </section>
          )}

          {/* Step 2: Select Mood */}
          {selectedTopic && (
            <section className="animate-fade-in home-detail-flow">
              <div className="home-selected-topic glass-card">
                <span className="home-selected-topic__label">선택한 고민</span>
                <strong className="home-selected-topic__title">{selectedTopic.title}</strong>
              </div>

              <button 
                onClick={() => {
                  setSelectedTopic(null);
                  setSelectedMood(null);
                  setSelectedFeelingText(null);
                  setIsProceeding(false);
                }}
                className="home-back-link"
              >
                ← 다른 고민 고르기
              </button>

              <div className="home-detail-intro">
                <h2 className="home-detail-title">지금 기분이 어떤가요?</h2>
                <p className="home-detail-subtitle">솔직한 내 감정을 하나 고른 뒤, 내 마음 한 줄까지 이어서 선택해보세요.</p>
              </div>

              <div className="emotion-mood-grid">
                {MOODS.map((mood) => (
                  <button
                    key={mood.label}
                    type="button"
                    onClick={() => handleSelectMood(mood)}
                    disabled={isProceeding}
                    aria-pressed={selectedMood?.label === mood.label}
                    className={`emotion-mood-card ${selectedMood?.label === mood.label ? 'is-selected' : ''} ${selectingMoodLabel === mood.label ? 'is-selecting' : ''} ${selectedMood && selectedMood.label !== mood.label ? 'is-muted' : ''}`}
                    style={{
                      ['--mood-accent' as string]: mood.accent,
                      ['--mood-glow' as string]: mood.glow,
                      ['--mood-tint' as string]: mood.tint,
                      ['--mood-shadow' as string]: mood.shadow
                    }}
                  >
                    <span className="emotion-mood-card__sheen" aria-hidden="true" />
                    <span className="emotion-mood-card__icon-area">
                      <span className="emotion-mood-card__icon-wrap">
                        <span className="emotion-mood-card__icon-glow" aria-hidden="true" />
                        <img
                          src={mood.icon}
                          alt={mood.label}
                          className="emotion-mood-card__icon"
                        />
                      </span>
                    </span>
                    <span className="emotion-mood-card__label-area">
                      <span className="emotion-mood-card__label">
                        {mood.label} {mood.emoji}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              {selectedMood && (
                <p className="emotion-selection-guidance">
                  좋아, 이 마음으로 카드 이야기를 들어보자.
                </p>
              )}

              {selectedMood && (
                <div className="emotion-feeling-panel">
                  <h3 className="emotion-feeling-title">내 마음 한 줄을 골라봐요</h3>
                  <p className="emotion-feeling-subtitle">내 이야기랑 가장 가까운 문장을 하나 선택해보세요.</p>
                  <div className="emotion-feeling-grid">
                    {(FEELING_PROMPTS[selectedMood.label] ?? []).map((feeling) => (
                      <button
                        key={feeling}
                        type="button"
                        className={`emotion-feeling-card ${selectedFeelingText === feeling ? 'is-selected' : ''}`}
                        onClick={() => setSelectedFeelingText(feeling)}
                      >
                        {feeling}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="emotion-feeling-confirm"
                    disabled={!selectedFeelingText || isProceeding}
                    onClick={handleProceedToDrawing}
                  >
                    이 마음으로 카드 뽑기
                  </button>
                </div>
              )}
            </section>
          )}

          <footer className="home-footer-tools">
            <button
              className="home-guide-button glass-card"
              onClick={onOpenGuide}
            >
              <BookOpen size={18} color="var(--text-secondary)" />
              <span>카드 설명서 보기</span>
            </button>

            <div className="home-tip-card">
              <h3 className="home-tip-title">시작 전에 이렇게 해보세요</h3>
              <ul className="home-tip-list">
                <li>혼자 조용한 곳에서 내 솔직한 생각에 집중해보세요.</li>
                <li>친구의 얼굴을 떠올리며 지금 가장 가까운 고민부터 골라보세요.</li>
              </ul>
            </div>
          </footer>
        </div>
        </div>
      </div>
    </div>
  );
}
