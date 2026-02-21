import { Zap, Moon, MessageCircle, HeartHandshake, User, History, BookOpen, Settings, Star } from 'lucide-react';
import { MysticBackground } from '../MysticBackground';
import { UserProfile } from '../UserProfileModal';
import crystalBallImage from 'figma:asset/30e70ba49f3c5069e376c16c52dea7bcd25db6b6.png';
import { useLanguage } from '../../lib/LanguageContext';
import { getTranslations } from '../../lib/translations';

const QUESTIONS = [
  {
    id: 'conflict',
    icon: Zap,
    title: '누군가와 갈등이 있어요',
    description: '카드가 화해의 길을 비춰줄 거예요',
    color: '#EC4899'
  },
  {
    id: 'distance',
    icon: Moon,
    title: '관계에 거리가 생긴 것 같아요',
    description: '별들이 가까워지는 방법을 속삭여줄 거예요',
    color: '#6B46C1'
  },
  {
    id: 'new-friend',
    icon: Star,
    title: '새로운 사람과 친해지고 싶어요',
    description: '우주가 새로운 인연의 신호를 보내줄 거예요',
    color: '#F59E0B'
  },
  {
    id: 'understanding',
    icon: MessageCircle,
    title: '상대의 마음을 알고 싶어요',
    description: '타로가 숨겨진 마음을 들려줄 거예요',
    color: '#8B5CF6'
  },
  {
    id: 'improve',
    icon: HeartHandshake,
    title: '우리 관계를 더 좋게 만들고 싶어요',
    description: '그 사람을 떠올리며 집중하세요, 카드가 답을 알고 있어요',
    color: '#10B981'
  }
];

interface HomeScreenProps {
  onSelectQuestion: (questionId: string, questionTitle: string) => void;
  onOpenProfile: () => void;
  onOpenAnalysis?: () => void;
  onOpenHistory?: () => void;
  onOpenGuide?: () => void;
  onOpenSettings?: () => void;
  userProfile: UserProfile | null;
  isLoggedIn?: boolean;
}

export function HomeScreen({ onSelectQuestion, onOpenProfile, onOpenAnalysis, onOpenHistory, onOpenGuide, onOpenSettings, userProfile, isLoggedIn = false }: HomeScreenProps) {
  const { language, setLanguage } = useLanguage();
  const t = getTranslations(language);
  
  return (
    <div className="min-h-screen relative">
      {/* Mystic 3D Background */}
      <MysticBackground variant="tarot-space" intensity="high" />

      {/* Content */}
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
            {/* Title Row */}
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
              }}>
                ✦
              </div>
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
                Arcana Compass
              </h1>
              <div style={{
                fontSize: '1.5rem',
                filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.6))',
                flexShrink: 0,
                opacity: 0.3
              }}>
                ✦
              </div>
            </div>

            {/* Navigation Buttons Row */}
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => {
                  // 프로필 입력 → 회원가입 통합 플로우
                  onOpenProfile();
                }}
                className="glass-card"
                style={{
                  padding: '0.625rem',
                  borderRadius: '0.75rem',
                  border: `1px solid ${userProfile ? 'var(--primary-gold)' : 'var(--primary-purple)'}`,
                  background: userProfile ? 'rgba(245, 158, 11, 0.1)' : 'rgba(107, 70, 193, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                title={isLoggedIn ? (userProfile ? '프로필 보기' : '프로필 설정') : '프로필 설정 및 회원가입'}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = userProfile ? 'rgba(245, 158, 11, 0.2)' : 'rgba(107, 70, 193, 0.4)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = userProfile ? 'rgba(245, 158, 11, 0.1)' : 'rgba(107, 70, 193, 0.2)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <User size={18} color={userProfile ? 'var(--primary-gold)' : 'var(--primary-purple)'} />
                {userProfile && (
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--primary-gold)',
                    fontWeight: 500 
                  }}>
                    {userProfile.name || '프로필'}
                  </span>
                )}
              </button>

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
                  justifyContent: 'center'
                }}
                title="타로 히스토리"
                onClick={onOpenHistory || (() => alert('타로 히스토리 기능은 곧 출시됩니다!'))}
              >
                <History size={18} color="var(--text-secondary)" />
              </button>

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
                  justifyContent: 'center'
                }}
                title="타로 가이드"
                onClick={onOpenGuide || (() => alert('타로 가이드 기능은 곧 출시됩니다!'))}
              >
                <BookOpen size={18} color="var(--text-secondary)" />
              </button>

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
                  justifyContent: 'center'
                }}
                title={t.settings}
                onClick={onOpenSettings || (() => alert(t.comingSoon))}
              >
                <Settings size={18} color="var(--text-secondary)" />
              </button>
            </div>
          </div>

          {/* Welcome Message & Analysis Button */}
          {userProfile && (
            <div>
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
                  타로가 <span style={{ color: 'var(--primary-gold)', fontWeight: 600 }}>{userProfile.name || '당신'}</span>님의 에너지를 느끼고 있어요 ✨
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  진심을 담아 카드를 선택하면, 우주가 답을 보여줄 거예요
                </p>
              </div>

              {/* My Analysis Button */}
              {userProfile.personalityAnswers && userProfile.personalityAnswers.length > 0 && onOpenAnalysis && (
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <button
                    onClick={onOpenAnalysis}
                    className="glass-card cosmic-glow"
                    style={{
                      padding: '1rem 2rem',
                      borderRadius: '9999px',
                      border: '2px solid var(--primary-gold)',
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--primary-gold)',
                      transition: 'all 0.3s ease',
                      animation: 'pulse 2s ease-in-out infinite'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(245, 158, 11, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <Star size={20} />
                    나의 사주 & 성격 분석 보기
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Question Title */}
          <h2 className="text-2xl font-semibold text-center mb-8 text-primary" style={{ marginTop: userProfile ? '0' : '2rem' }}>
            어떤 고민이 있나요?
          </h2>

          {/* Main Mystery Button */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '3rem',
            padding: '0 1rem'
          }}>
            <button
              onClick={() => onSelectQuestion('mystery', '마음속 고민')}
              className="glass-card"
              style={{
                width: '100%',
                maxWidth: '500px',
                padding: '0',
                borderRadius: '1.5rem',
                border: '2px solid rgba(139, 92, 246, 0.4)',
                position: 'relative',
                cursor: 'pointer',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflow: 'hidden',
                transition: 'all 0.4s ease',
                boxShadow: `
                  0 4px 20px rgba(139, 92, 246, 0.3),
                  0 0 40px rgba(245, 158, 11, 0.2)
                `
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
                e.currentTarget.style.boxShadow = `
                  0 8px 30px rgba(139, 92, 246, 0.4),
                  0 0 50px rgba(245, 158, 11, 0.3)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = `
                  0 4px 20px rgba(139, 92, 246, 0.3),
                  0 0 40px rgba(245, 158, 11, 0.2)
                `;
              }}
            >
              {/* Crystal Ball Background Image */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${crystalBallImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.8,
                zIndex: 0
              }} />

              {/* Subtle overlay for text readability */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'var(--blur-lock)',
                zIndex: 1
              }} />

              {/* Gentle border animation */}
              <div style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                borderRadius: '1.5rem',
                background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.3), rgba(245, 158, 11, 0.3), rgba(139, 92, 246, 0.3))',
                backgroundSize: '200% 200%',
                animation: 'subtleFlow 8s ease infinite',
                zIndex: -1,
                opacity: 0.5
              }} />

              {/* Gentle floating particles */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
                borderRadius: '1.5rem',
                zIndex: 2
              }}>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: '3px',
                      height: '3px',
                      background: i % 2 === 0 ? 'rgba(139, 92, 246, 0.5)' : 'rgba(245, 158, 11, 0.5)',
                      borderRadius: '50%',
                      boxShadow: `0 0 6px ${i % 2 === 0 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                      animation: `floatParticle${i % 4} ${6 + (i % 3)}s ease-in-out infinite`,
                      animationDelay: `${i * 0.8}s`,
                      left: `${(i * 15) % 100}%`,
                      top: `${(i * 20) % 100}%`,
                      opacity: 0.4
                    }}
                  />
                ))}
              </div>

              {/* Content container */}
              <div style={{
                padding: '2.5rem 2rem',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                position: 'relative',
                zIndex: 3
              }}>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  position: 'relative'
                }}>
                  <span style={{
                    fontSize: '1.75rem',
                    textShadow: '0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1), 0 2px 8px rgba(0, 0, 0, 0.8), 2px 0 2px rgba(0, 0, 0, 1), -2px 0 2px rgba(0, 0, 0, 1), 0 2px 2px rgba(0, 0, 0, 1), 0 -2px 2px rgba(0, 0, 0, 1)',
                    letterSpacing: '0.03em',
                    fontWeight: 700,
                    color: '#fff'
                  }}>
                    마음속 고민
                  </span>
                </div>
                
                <p style={{
                  fontSize: '1rem',
                  color: '#fff',
                  textShadow: '0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 0.8), 1px 0 1px rgba(0, 0, 0, 1), -1px 0 1px rgba(0, 0, 0, 1), 0 1px 1px rgba(0, 0, 0, 1), 0 -1px 1px rgba(0, 0, 0, 1)',
                  fontWeight: 500,
                  lineHeight: 1.7,
                  maxWidth: '400px',
                  textAlign: 'center'
                }}>
                  관계에 대한 고민을 마음속으로 떠올리고<br/>
                  카드가 당신에게 메시지를 전할 거예요
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#F59E0B',
                  fontWeight: 600,
                  textShadow: '0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 0.8), 1px 0 1px rgba(0, 0, 0, 1), -1px 0 1px rgba(0, 0, 0, 1)'
                }}>
                  <span style={{ animation: 'twinkle 1.5s ease-in-out infinite' }}>✨</span>
                  지금 카드 뽑기
                  <span style={{ animation: 'twinkle 1.5s ease-in-out infinite 0.75s' }}>✨</span>
                </div>
              </div>
            </button>
          </div>

          {/* Divider with text */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '2rem 0',
            opacity: 0.6
          }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, var(--primary-gold), transparent)' }} />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>예시 고민들</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, var(--primary-gold), transparent)' }} />
          </div>

          {/* Question Cards - As Examples */}
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
                onClick={() => onSelectQuestion(question.id, question.title)}
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
          </div>

          {/* Quick Tips Section */}
          <div style={{
            background: 'rgba(107, 70, 193, 0.1)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(107, 70, 193, 0.3)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginTop: '2rem'
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
              타로 리딩 팁
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
                <span>조용하고 편안한 환경에서 카드를 선택하세요</span>
              </li>
              <li style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'start',
                gap: '0.5rem'
              }}>
                <span style={{ color: 'var(--primary-gold)' }}>•</span>
                <span>친구에 대한 생각에 집중하며 직관적으로 선택하세요</span>
              </li>
              <li style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'start',
                gap: '0.5rem'
              }}>
                <span style={{ color: 'var(--primary-gold)' }}>•</span>
                <span>해석은 가능성의 하나이며, 최종 선택은 당신에게 있습니다</span>
              </li>
            </ul>
          </div>

          {/* Footer Message */}
          <p className="text-center text-sm text-muted italic" style={{ marginTop: '2rem' }}>
            이 해석은 가능성 중 하나이며, 선택은 당신에게 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
