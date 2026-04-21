import { Zap, Moon, MessageCircle, HeartHandshake, BookOpen, Settings, Star, AlertCircle } from 'lucide-react';
import { MysticBackground } from '../MysticBackground';
import crystalBallImage from 'figma:asset/30e70ba49f3c5069e376c16c52dea7bcd25db6b6.png';
import { useState } from 'react';

const QUESTIONS = [
  {
    id: 'conflict',
    icon: Zap,
    title: '친구와 다퉜어요',
    description: '서로 오해가 쌓여서 어색해졌어요',
    color: '#EC4899'
  },
  {
    id: 'distance',
    icon: Moon,
    title: '조금 멀어진 것 같아요',
    description: '예전처럼 편하게 다가가기가 어려워요',
    color: '#6B46C1'
  },
  {
    id: 'new-friend',
    icon: Star,
    title: '새로운 친구와 친해지고 싶어요',
    description: '어떻게 말을 걸면 좋을지 힌트가 필요해요',
    color: '#F59E0B'
  },
  {
    id: 'understanding',
    icon: MessageCircle,
    title: '그 친구의 속마음이 궁금해요',
    description: '왜 그런 행동을 했는지 이해하고 싶어요',
    color: '#8B5CF6'
  },
  {
    id: 'apology',
    icon: HeartHandshake,
    title: '화해하고 싶지만 용기가 안 나요',
    description: '어떻게 사과해야 할지 방법을 찾고 싶어요',
    color: '#10B981'
  }
];

const MOODS = [
  { icon: '😡', label: '화남' },
  { icon: '😥', label: '속상함' },
  { icon: '😟', label: '불안함' },
  { icon: '😶', label: '답답함' }
];

interface HomeScreenProps {
  onSelectQuestion: (questionId: string, questionTitle: string, moodIcon: string, moodLabel: string) => void;
  onOpenGuide?: () => void;
  onOpenSettings?: () => void;
}

export function HomeScreen({ onSelectQuestion, onOpenGuide, onOpenSettings }: HomeScreenProps) {
  const [selectedTopic, setSelectedTopic] = useState<{ id: string, title: string } | null>(null);

  const handleSelectMood = (moodIcon: string, moodLabel: string) => {
    if (selectedTopic) {
      onSelectQuestion(selectedTopic.id, selectedTopic.title, moodIcon, moodLabel);
    }
  };
  
  return (
    <div className="min-h-screen relative">
      <MysticBackground variant="tarot-space" intensity="high" />

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Top Navigation Bar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '3rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            alignItems: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              justifyContent: 'center'
            }}>
              <div style={{
                fontSize: '1.5rem',
                filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.6))',
                flexShrink: 0,
                opacity: 0.3
              }}>✦</div>
              <h1 style={{
                fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #F59E0B, #FCD34D, #F59E0B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
                lineHeight: 1.3,
                textAlign: 'center',
                letterSpacing: '0.05em'
              }}>
                마음 토닥 스캐너
              </h1>
              <div style={{
                fontSize: '1.5rem',
                filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.6))',
                flexShrink: 0,
                opacity: 0.3
              }}>✦</div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <button
                className="glass-card"
                style={{
                  padding: '0.625rem',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--surface-border)',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onClick={onOpenGuide}
              >
                <BookOpen size={18} color="var(--text-secondary)" />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>카드 설명서</span>
              </button>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            marginBottom: '1.5rem',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}>
              내 마음속 진짜 이야기를 들려줄래? ✨
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              친구 고민을 고르고 카드를 섞으면, 마음 코칭 가이드가 나타날 거야!
            </p>
          </div>

          {/* Step 1: Select Topic */}
          {!selectedTopic && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold text-center mb-8 text-primary" style={{ marginTop: '2rem' }}>
                어떤 친구 문제로 고민인가요?
              </h2>

              <div style={{
                display: 'grid',
                gap: '0.75rem',
                gridTemplateColumns: '1fr',
                marginBottom: '2rem',
                opacity: 0.8
              }}>
                {QUESTIONS.map((question, index) => (
                  <div
                    key={question.id}
                    className="question-card animate-fade-in"
                    onClick={() => setSelectedTopic({ id: question.id, title: question.title })}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      transform: 'scale(0.95)',
                      padding: '1rem 1.5rem'
                    }}
                  >
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ flexShrink: 0 }}>
                        <question.icon size={24} color={question.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          fontSize: '1rem',
                          fontWeight: 600,
                          marginBottom: '0.25rem',
                          color: 'var(--text-primary)',
                          whiteSpace: 'pre-line',
                          lineHeight: 1.5
                        }}>
                          {question.title}
                        </h3>
                        <p style={{ 
                          fontSize: '0.8125rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.5,
                          margin: 0
                        }}>
                          {question.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setSelectedTopic({ id: 'mystery', title: '말하기 힘든 다른 고민' })}
                  style={{
                    padding: '1rem 1.5rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px dashed rgba(255,255,255,0.3)',
                    borderRadius: '1rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9375rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transform: 'scale(0.95)'
                  }}
                >
                  <AlertCircle size={18} />
                  내가 직접 생각할게요
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Mood */}
          {selectedTopic && (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <button 
                onClick={() => setSelectedTopic(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  textDecoration: 'underline',
                  marginBottom: '2rem',
                  cursor: 'pointer'
                }}
              >
                ← 다른 고민 고르기
              </button>

              <h2 className="text-2xl font-semibold text-center mb-4 text-primary">
                지금 내 기분은 어떤가요?
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                솔직한 내 감정을 하나 골라보세요.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                {MOODS.map((mood) => (
                  <button
                    key={mood.label}
                    onClick={() => handleSelectMood(mood.icon, mood.label)}
                    className="glass-card"
                    style={{
                      padding: '2rem 1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1rem',
                      borderRadius: '1.5rem',
                      border: '2px solid rgba(245, 158, 11, 0.2)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                      e.currentTarget.style.background = 'rgba(245, 158, 11, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.background = '';
                    }}
                  >
                    <span style={{ fontSize: '3rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>{mood.icon}</span>
                    <span style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{
            background: 'rgba(107, 70, 193, 0.1)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(107, 70, 193, 0.3)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginTop: '4rem'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--primary-purple)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              마음 코칭 이용 팁
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <li style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'start',
                gap: '0.5rem'
              }}>
                <span style={{ color: 'var(--primary-gold)' }}>•</span>
                <span>혼자 조용한 곳에서 내 솔직한 생각에 집중해보세요</span>
              </li>
              <li style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'start',
                gap: '0.5rem'
              }}>
                <span style={{ color: 'var(--primary-gold)' }}>•</span>
                <span>친구의 얼굴을 떠올리며 마음에 드는 카드를 골라보세요</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
