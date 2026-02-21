import { tarotCardsData } from '../../data/tarot-cards';
import { motion } from 'motion/react';
import resultBgImg from 'figma:asset/51d359264ccba0aca3f242b625c3fe3c3a660837.png';
import { getCardImage } from '../../data/tarot-card-images';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { ExternalLink, Lock, MessageCircle, Star } from 'lucide-react';
import { MembershipModal } from '../MembershipModal';
import { GoogleAdSense, MysticAdWrapper } from '../GoogleAdSense';
import { ApiKeyManager } from '../ApiKeyManager';
import { getEnv } from '@/lib/config/env';

interface ResultScreenProps {
  questionTitle: string;
  cardIds: string[];
  onBack: () => void;
  onNavigateToGuide?: (cardId: string) => void;
  onOpenAuth?: () => void;
  onOpenPremium?: () => void;
  isLoggedIn?: boolean;
  isPremium?: boolean;
  userProfile?: {
    name?: string;
    friendName?: string;
    birthDate?: string;
    birthTime?: string;
    mbti?: string;
  } | null;
}

interface CardInterpretation {
  basic: string;
  detailed: string;
  advice: string[];
}

interface CardData {
  id: string;
  name: string;
  symbol?: string;
  isReversed: boolean;
  interpretation?: CardInterpretation;
  loading?: boolean;
  error?: boolean;
}

const CARD_POSITIONS = [
  { label: '과거', subtitle: '관계가 어떻게 시작됐나요?' },
  { label: '현재', subtitle: '지금 이 순간의 관계 상태' },
  { label: '가능성', subtitle: '미래에 나아갈 수 있는 방향' }
];

/**
 * GPT-4o-mini 직접 호출 (개발 전용 fallback).
 * ENV 창에서 VITE_OPENAI_API_KEY를 설정해야 동작합니다.
 * 프로덕션에서는 Supabase Edge Function을 통해 서버 측에서 호출됩니다.
 */
async function fetchGptInterpretationDirect(params: {
  cardName: string;
  position: string;
  question: string;
  isReversed: boolean;
  userProfile?: any;
}): Promise<CardInterpretation> {
  const { openaiApiKey } = getEnv();
  if (!openaiApiKey) throw new Error('VITE_OPENAI_API_KEY 미설정');

  const profileCtx = params.userProfile?.name
    ? `사용자 이름: ${params.userProfile.name}${params.userProfile.mbti ? ', MBTI: ' + params.userProfile.mbti : ''}`
    : '';

  const prompt = `당신은 우정 타로 전문 해석가입니다. 다음 타로 카드를 한국어로 해석해주세요.

카드: ${params.cardName}${params.isReversed ? ' (역방향)' : ' (정방향)'}
위치: ${params.position}
질문: ${params.question}
${profileCtx}

다음 JSON 형식으로만 응답하세요 (설명 없이 JSON만):
{
  "basic": "기본 해석 (2-3문장, 따뜻하고 희망적인 톤)",
  "detailed": "심화 해석 (3-4문장, 구체적인 상황 분석)",
  "advice": ["조언 1", "조언 2", "조언 3"]
}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 600,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `OpenAI ${res.status}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? '';

  // JSON 파싱
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('GPT 응답 파싱 실패');
  return JSON.parse(jsonMatch[0]) as CardInterpretation;
}

export function ResultScreen({ questionTitle, cardIds, onBack, onNavigateToGuide, onOpenAuth, onOpenPremium, isLoggedIn = false, isPremium = false, userProfile }: ResultScreenProps) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);

  // Initialize cards and fetch AI interpretations
  useEffect(() => {
    const initializeCards = async () => {
      // First, create card data with loading state
      const initialCards = cardIds.map((id: string) => {
        const card = tarotCardsData.cards.find((c: any) => c.id === id);
        const isReversed = Math.random() > 0.5;
        
        if (card) {
          return {
            id: card.id,
            name: card.name,
            symbol: card.symbol,
            isReversed,
            loading: true,
            error: false
          };
        }
        return null;
      }).filter(Boolean) as CardData[];

      setCards(initialCards);

      // Then fetch AI interpretations for each card
      for (let i = 0; i < initialCards.length; i++) {
        const card = initialCards[i];
        const position = CARD_POSITIONS[i];
        
        try {
          let interpretation: CardInterpretation | null = null;

          // 1순위: Supabase Edge Function
          try {
            const response = await fetch(
              `https://${projectId}.supabase.co/functions/v1/make-server-adbcd17e/tarot/interpret`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${publicAnonKey}`
                },
                body: JSON.stringify({
                  cardName: card.name,
                  cardNumber: parseInt(card.id),
                  position: position.label,
                  question: questionTitle,
                  isReversed: card.isReversed,
                  userProfile: userProfile ? {
                    name: userProfile.name,
                    friendName: userProfile.friendName,
                    birthDate: userProfile.birthDate,
                    birthTime: userProfile.birthTime,
                    mbti: userProfile.mbti,
                    personalityAnswers: (userProfile as any).personalityAnswers
                  } : undefined
                })
              }
            );

            if (response.ok) {
              const data = await response.json();
              interpretation = data.interpretation ?? null;
            } else {
              const errorText = await response.text();
              console.warn(`[Tarot] Edge Function ${response.status}:`, errorText);
              if (errorText.includes('invalid_api_key') || errorText.includes('Incorrect API key')) {
                setShowApiKeyManager(true);
              }
            }
          } catch (edgeErr) {
            console.warn('[Tarot] Edge Function 호출 실패, GPT 직접 호출로 전환:', edgeErr);
          }

          // 2순위: VITE_OPENAI_API_KEY로 GPT-4o-mini 직접 호출 (개발 fallback)
          if (!interpretation) {
            const { openaiApiKey } = getEnv();
            if (openaiApiKey) {
              console.info('[Tarot] GPT-4o-mini 직접 호출 중...');
              interpretation = await fetchGptInterpretationDirect({
                cardName: card.name,
                position: position.label,
                question: questionTitle,
                isReversed: card.isReversed,
                userProfile,
              });
            }
          }

          if (interpretation) {
            setCards(prevCards =>
              prevCards.map((c, idx) =>
                idx === i ? { ...c, interpretation, loading: false, error: false } : c
              )
            );
          } else {
            throw new Error('해석 데이터를 가져오지 못했습니다');
          }

        } catch (error) {
          console.error(`Error fetching interpretation for card ${i}:`, error);
          
          // Set error state for this card with fallback interpretation
          setCards(prevCards => 
            prevCards.map((c, idx) => 
              idx === i ? {
                ...c,
                interpretation: {
                  basic: "긍정적인 변화가 찾아올 수 있어요",
                  detailed: "이 카드는 새로운 가능성을 보여줍니다. 친구와의 관계에서 좋은 기회가 생길 수 있으니, 마음을 열고 소통하는 것이 중요해요.",
                  advice: [
                    "친구에게 먼저 다가가 대화를 시작해보세요",
                    "서로의 관심사를 공유하며 공감대를 형성해보세요",
                    "작은 배려와 관심으로 우정을 더욱 깊게 만들어보세요"
                  ]
                },
                loading: false,
                error: true
              } : c
            )
          );
        }
      }
    };

    initializeCards();
  }, [cardIds, questionTitle, userProfile]);

  const disclaimer = tarotCardsData.disclaimer;

  // Personalized message
  const getPersonalizedMessage = () => {
    const userName = userProfile?.name;
    const friendName = userProfile?.friendName;

    if (userName && friendName) {
      return `별들이 ${userName}님과 ${friendName}님의 인연을 읽었어요 ✨`;
    } else if (userName) {
      return `${userName}님의 에너지가 카드에 담겼어요 ✨`;
    } else if (friendName) {
      return `${friendName}님과의 인연에 대한 우주의 메시지예요 ✨`;
    }
    return '카드가 당신에게 전하는 특별한 메시지예요 ✨';
  };

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Image */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0
      }}>
        <img 
          src={resultBgImg} 
          alt="background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        padding: '3rem 1.5rem',
        paddingBottom: '6rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center',
              marginBottom: '4rem'
            }}
          >
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '1.5rem',
              filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.6))',
              color: '#fff'
            }}>
              ✦ 타로 해석 ✦
            </div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#fff',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              whiteSpace: 'pre-line',
              lineHeight: 1.5
            }}>
              {questionTitle}
            </h1>
            {getPersonalizedMessage() && (
              <p style={{
                fontSize: '1.125rem',
                color: 'var(--primary-gold)',
                marginTop: '1rem',
                fontWeight: 500,
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
              }}>
                {getPersonalizedMessage()}
              </p>
            )}
          </motion.div>

          {/* Results - Card Layout */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '3rem' 
          }}>
            {cards.map((card: CardData, index: number) => {
              if (!card) return null;
              
              const position = CARD_POSITIONS[index];

              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '2.5rem',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {/* Position Label */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '2rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid rgba(245, 158, 11, 0.3)'
                  }}>
                    <span style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: 'var(--primary-gold)',
                      textShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
                    }}>
                      {position.label}
                    </span>
                    <span style={{ 
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '1.25rem'
                    }}>
                      ·
                    </span>
                    <span style={{ 
                      fontSize: '1rem', 
                      color: 'rgba(255, 255, 255, 0.8)'
                    }}>
                      {position.subtitle}
                    </span>
                  </div>

                  {/* Card & Interpretation - Responsive Layout */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    alignItems: 'center'
                  }}
                  className="result-card-layout"
                  >
                    {/* Card Image - Top on Mobile, Left on Desktop */}
                    <div style={{
                      flexShrink: 0,
                      width: '100%',
                      maxWidth: '220px',
                      margin: '0 auto'
                    }}>
                      {/* Card Name and Orientation */}
                      <div style={{
                        marginBottom: '1rem',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem'
                        }}>
                          <div style={{
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: '#fff',
                            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
                          }}>
                            {card.name}
                          </div>
                          {onNavigateToGuide && (
                            <button
                              onClick={() => onNavigateToGuide(card.id)}
                              style={{
                                background: 'rgba(245, 158, 11, 0.2)',
                                border: '1px solid rgba(245, 158, 11, 0.4)',
                                borderRadius: '0.5rem',
                                padding: '0.375rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                color: 'var(--primary-gold)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.35)';
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                              title="타로 가이드에서 자세히 보기"
                            >
                              <ExternalLink size={16} />
                            </button>
                          )}
                        </div>
                        <div style={{
                          display: 'inline-block',
                          padding: '0.375rem 0.875rem',
                          background: card.isReversed 
                            ? 'rgba(139, 92, 246, 0.25)' 
                            : 'rgba(245, 158, 11, 0.25)',
                          border: `1px solid ${card.isReversed 
                            ? 'rgba(139, 92, 246, 0.4)' 
                            : 'rgba(245, 158, 11, 0.4)'}`,
                          borderRadius: '1rem',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: card.isReversed 
                            ? 'rgba(196, 181, 253, 1)' 
                            : 'var(--primary-gold)',
                          textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
                        }}>
                          {card.isReversed ? '역방향 ↓' : '정방향 ↑'}
                        </div>
                      </div>

                      {(() => {
                        const cardImageSrc = getCardImage(card.id);
                        
                        if (cardImageSrc) {
                          // Display actual tarot card image
                          return (
                            <div style={{
                              borderRadius: '1rem',
                              overflow: 'hidden',
                              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                              transform: card.isReversed ? 'rotate(180deg)' : 'none',
                              border: '3px solid rgba(245, 158, 11, 0.5)'
                            }}>
                              <img 
                                src={cardImageSrc}
                                alt={card.name}
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  display: 'block'
                                }}
                              />
                            </div>
                          );
                        }
                        
                        // Fallback: Display symbol-based card
                        return (
                          <div style={{
                            background: 'linear-gradient(135deg, rgba(107, 70, 193, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                            padding: '1.5rem',
                            borderRadius: '1rem',
                            border: '2px solid rgba(245, 158, 11, 0.3)',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                            transform: card.isReversed ? 'rotate(180deg)' : 'none'
                          }}>
                            <div style={{
                              textAlign: 'center',
                              color: '#fff'
                            }}>
                              <div style={{ 
                                fontSize: '5rem', 
                                marginBottom: '1rem',
                                filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.5))'
                              }}>
                                {card.symbol || '✦'}
                              </div>
                              <div style={{ 
                                fontSize: '1.125rem', 
                                fontWeight: 700,
                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
                              }}>
                                {card.name}
                              </div>
                              {card.isReversed && (
                                <div style={{ 
                                  fontSize: '0.875rem', 
                                  opacity: 0.8,
                                  marginTop: '0.5rem',
                                  color: 'var(--primary-gold)'
                                }}>
                                  역방향
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Text Content - Bottom on Mobile, Right on Desktop */}
                    <div style={{ flex: 1, width: '100%' }}>
                      {/* Loading State */}
                      {card.loading && (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '3rem',
                          gap: '1rem'
                        }}>
                          <div style={{
                            fontSize: '3rem',
                            animation: 'pulse 1.5s ease-in-out infinite',
                            opacity: 0.3
                          }}>
                            ✨
                          </div>
                          <p style={{
                            color: 'var(--primary-gold)',
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            textAlign: 'center'
                          }}>
                            타로의 신비로운 해석을 불러오는 중...
                          </p>
                        </div>
                      )}

                      {/* Interpretation Content */}
                      {!card.loading && card.interpretation && (
                        <>
                          {/* Basic Interpretation */}
                          <p style={{
                            fontSize: '1.375rem',
                            fontWeight: 700,
                            marginBottom: '1.5rem',
                            color: '#fff',
                            lineHeight: 1.7,
                            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                            wordBreak: 'keep-all',
                            overflowWrap: 'break-word',
                            textAlign: 'center'
                          }}
                          className="basic-interpretation-text"
                          >
                            {card.interpretation.basic}
                          </p>
                          
                          {/* Detailed Interpretation */}
                          <div style={{
                            fontSize: '1.0625rem',
                            color: 'rgba(255, 255, 255, 0.9)',
                            lineHeight: 1.8,
                            marginBottom: '2rem',
                            textShadow: '0 1px 5px rgba(0, 0, 0, 0.5)',
                            padding: '1.5rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '0.75rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            {card.interpretation.detailed}
                          </div>

                          {/* Advice Section - Premium Only */}
                          {isPremium ? (
                            <div style={{
                              padding: '1.75rem',
                              background: 'rgba(245, 158, 11, 0.15)',
                              border: '1px solid rgba(245, 158, 11, 0.4)',
                              borderRadius: '1rem',
                              backdropFilter: 'blur(10px)'
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginBottom: '1.25rem'
                              }}>
                                <div style={{ fontSize: '1.5rem' }}>✨</div>
                                <h4 style={{
                                  fontSize: '1.125rem',
                                  fontWeight: 700,
                                  color: 'var(--primary-gold)',
                                  textShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
                                }}>
                                  구체적 행동 가이드
                                </h4>
                              </div>
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                              }}>
                                {card.interpretation.advice.map((advice: string, i: number) => (
                                  <div key={i} style={{
                                    display: 'flex',
                                    gap: '0.75rem',
                                    fontSize: '1rem',
                                    color: '#fff',
                                    lineHeight: 1.8,
                                    textShadow: '0 1px 5px rgba(0, 0, 0, 0.5)'
                                  }}>
                                    <span style={{ 
                                      color: 'var(--primary-gold)', 
                                      flexShrink: 0,
                                      fontWeight: 700,
                                      fontSize: '1.0625rem'
                                    }}>
                                      {i + 1}.
                                    </span>
                                    <span>{advice}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : isLoggedIn ? (
                            /* 로그인은 했지만 프리미엄 미구독 → 업그레이드 유도 */
                            <div
                              onClick={() => onOpenPremium?.()}
                              className="glass-card"
                              style={{
                                padding: '2rem',
                                border: '2px dashed rgba(245, 158, 11, 0.5)',
                                borderRadius: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.8)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '';
                                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)';
                              }}
                            >
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem',
                                textAlign: 'center'
                              }}>
                                <Lock size={48} style={{ color: 'var(--primary-gold)', opacity: 0.8 }} />
                                <div>
                                  <h4 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    color: 'var(--primary-gold)',
                                    marginBottom: '0.5rem'
                                  }}>
                                    구체적 행동 가이드
                                  </h4>
                                  <p style={{
                                    fontSize: '0.9375rem',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    lineHeight: 1.6
                                  }}>
                                    프리미엄 멤버십으로 업그레이드하면<br />실천 가능한 맞춤형 조언을 바로 확인할 수 있어요
                                  </p>
                                </div>
                                <div style={{
                                  marginTop: '0.5rem',
                                  padding: '0.75rem 1.5rem',
                                  background: 'var(--primary-gold)',
                                  color: '#1E1B4B',
                                  borderRadius: '0.75rem',
                                  fontWeight: 700,
                                  fontSize: '1rem'
                                }}>
                                  ✦ 프리미엄으로 업그레이드
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* 비로그인 → 회원가입 유도 */
                            <div
                              onClick={() => setShowMembershipModal(true)}
                              className="glass-card"
                              style={{
                                padding: '2rem',
                                border: '2px dashed rgba(245, 158, 11, 0.5)',
                                borderRadius: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.8)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '';
                                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)';
                              }}
                            >
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem',
                                textAlign: 'center'
                              }}>
                                <Lock size={48} style={{ color: 'var(--primary-gold)', opacity: 0.8 }} />
                                <div>
                                  <h4 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    color: 'var(--primary-gold)',
                                    marginBottom: '0.5rem'
                                  }}>
                                    구체적 행동 가이드
                                  </h4>
                                  <p style={{
                                    fontSize: '0.9375rem',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    lineHeight: 1.6
                                  }}>
                                    회원가입 후 프리미엄으로 업그레이드하면<br />실천 가능한 맞춤형 조언을 받아볼 수 있어요
                                  </p>
                                </div>
                                <div style={{
                                  marginTop: '0.5rem',
                                  padding: '0.75rem 1.5rem',
                                  background: 'var(--primary-gold)',
                                  color: '#1E1B4B',
                                  borderRadius: '0.75rem',
                                  fontWeight: 700,
                                  fontSize: '1rem'
                                }}>
                                  ✦ 무료로 가입하기
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              marginTop: '4rem',
              flexWrap: 'wrap'
            }}
          >
            <button 
              className="btn-ghost" 
              onClick={onBack}
              style={{
                fontSize: '1.125rem',
                padding: '1rem 2.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                fontWeight: 600
              }}
            >
              처음으로
            </button>
            <button 
              className="btn-secondary" 
              onClick={onBack}
              style={{
                fontSize: '1.125rem',
                padding: '1rem 2.5rem',
                fontWeight: 600
              }}
            >
              다른 질문하기
            </button>
          </motion.div>

          {/* Sign Up Call-to-Action for Non-Members */}
          {!isLoggedIn && onOpenAuth && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="modal-content"
              style={{
                marginTop: '3rem',
                padding: '2.5rem',
                borderRadius: '1.5rem',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--primary-gold)',
                marginBottom: '1rem',
                textShadow: '0 0 15px rgba(245, 158, 11, 0.5)'
              }}>
                더 자세한 해석과 구체적인 조언을 받아보세요!
              </h3>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '1.5rem',
                lineHeight: 1.6
              }}>
                회원가입 후 더 깊이 있는 타로 해석과<br />
                구체적인 행동 가이드를 받아보실 수 있습니다
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                padding: '1.25rem',
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.9375rem',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  <span style={{ color: 'var(--primary-gold)', fontSize: '1.25rem' }}>✓</span>
                  <span>더 깊이 있는 맞춤 해석</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.9375rem',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  <span style={{ color: 'var(--primary-gold)', fontSize: '1.25rem' }}>✓</span>
                  <span>구체적인 행동 가이드 제공</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.9375rem',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  <span style={{ color: 'var(--primary-gold)', fontSize: '1.25rem' }}>✓</span>
                  <span>타로 리딩 히스토리 저장</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <button
                  onClick={onOpenAuth}
                  className="glass-card"
                  style={{
                    padding: '1rem 2.5rem',
                    borderRadius: '1rem',
                    border: '2px solid var(--primary-purple)',
                    background: 'rgba(107, 70, 193, 0.5)',
                    color: '#fff',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 24px rgba(107, 70, 193, 0.4)',
                    width: '100%',
                    maxWidth: '400px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(107, 70, 193, 0.7)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(107, 70, 193, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(107, 70, 193, 0.5)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(107, 70, 193, 0.4)';
                  }}
                >
                  회원가입 / 로그인하기
                </button>
              </div>
            </motion.div>
          )}

          {/* Premium CTA for non-premium users */}
          {!isPremium && isLoggedIn && onOpenPremium && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              style={{
                marginTop: '3rem',
                padding: '2.5rem',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.2))',
                backdropFilter: 'blur(20px)',
                borderRadius: '1.5rem',
                border: '2px solid var(--primary-gold)',
                boxShadow: '0 20px 60px rgba(245, 158, 11, 0.3)',
                textAlign: 'center'
              }}
            >
              <div style={{ 
                fontSize: '3.5rem', 
                marginBottom: '1rem',
                filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.8))',
                opacity: 0.3
              }}>
                ✨
              </div>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                background: 'linear-gradient(90deg, #F59E0B, #FCD34D, #F59E0B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
              }}>
                프리미엄으로 우주의 완전한 비밀 언락
              </h3>
              <p style={{
                fontSize: '1.0625rem',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '2rem',
                lineHeight: 1.7
              }}>
                단 한 번의 결제로 평생 모든 해석을 완전히 공개하고,<br />
                광고 없이 깨끗한 타로 경험을 누리세요
              </p>
              <button
                onClick={onOpenPremium}
                style={{
                  padding: '1.25rem 3rem',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
                  border: 'none',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(245, 158, 11, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.4)';
                }}
              >
                <Star size={20} />
                프리미엄 언락하기 - $4.99
              </button>
            </motion.div>
          )}

          {/* Google AdSense for non-premium users */}
          {!isPremium && (
            <MysticAdWrapper isPremium={isPremium}>
              <GoogleAdSense 
                adSlot="1234567890" 
                adFormat="auto"
                isPremium={isPremium}
              />
            </MysticAdWrapper>
          )}

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{
              textAlign: 'center',
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.7)',
              fontStyle: 'italic',
              marginTop: '3rem',
              textShadow: '0 1px 5px rgba(0, 0, 0, 0.5)'
            }}
          >
            {disclaimer}
          </motion.p>
        </div>
      </div>

      {/* Membership Modal */}
      <MembershipModal 
        isOpen={showMembershipModal}
        onClose={() => setShowMembershipModal(false)}
        onSignup={() => {
          setShowMembershipModal(false);
          if (onOpenAuth) onOpenAuth();
        }}
      />

      {/* API Key Manager Modal */}
      {showApiKeyManager && (
        <ApiKeyManager onClose={() => setShowApiKeyManager(false)} />
      )}
    </div>
  );
}
