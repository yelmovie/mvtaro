import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Book, Search, Star, Moon, Sun, Heart } from 'lucide-react';
import { MysticBackground } from '../MysticBackground';
import { motion } from 'motion/react';
import { tarotCardsData } from '../../data/tarot-cards';
import { getCardImage } from '../../data/tarot-card-images';

interface GuideScreenProps {
  onBack: () => void;
  highlightedCardId?: string | null;
  onClearHighlight?: () => void;
}

export function GuideScreen({ onBack, highlightedCardId, onClearHighlight }: GuideScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'major' | 'minor' | 'guide'>('all');
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const filteredCards = tarotCardsData.cards.filter((card: any) => {
    // Filter by search query
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'major') return matchesSearch && card.suit === 'major';
    if (activeTab === 'minor') return matchesSearch && card.suit !== 'major';
    return matchesSearch;
  });

  // Scroll to highlighted card when component mounts or when highlightedCardId changes
  useEffect(() => {
    if (highlightedCardId) {
      // Switch to appropriate tab
      const card = tarotCardsData.cards.find((c: any) => c.id === highlightedCardId);
      if (card) {
        if (card.suit === 'major') {
          setActiveTab('major');
        } else {
          setActiveTab('minor');
        }
      }
      
      // Wait for render then scroll
      setTimeout(() => {
        const cardElement = cardRefs.current[highlightedCardId];
        if (cardElement) {
          cardElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
          // Clear highlight after 3 seconds
          setTimeout(() => {
            if (onClearHighlight) {
              onClearHighlight();
            }
          }, 3000);
        }
      }, 100);
    }
  }, [highlightedCardId, onClearHighlight]);

  return (
    <div className="min-h-screen relative">
      <MysticBackground variant="tarot-space" intensity="medium" />

      <div className="relative z-10 py-8 px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button className="back-button mb-6" onClick={onBack}>
            <ArrowLeft size={20} />
            돌아가기
          </button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div style={{
              fontSize: '2rem',
              marginBottom: '1rem',
              filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.5))'
            }}>
              📖
            </div>
            <h1 className="text-2xl font-semibold mb-2 text-primary">
              마음코칭 카드 가이드
            </h1>
            <p className="text-sm text-secondary">
              카드로 마음을 정리하는 방법과 카드 도감을 살펴보세요
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: 'flex',
              gap: '0.75rem',
              marginBottom: '2rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <button
              onClick={() => setActiveTab('guide')}
              className="glass-card transition-all"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: `2px solid ${activeTab === 'guide' ? 'var(--primary-purple)' : 'var(--surface-border)'}`,
                background: activeTab === 'guide' ? 'rgba(107, 70, 193, 0.3)' : 'var(--surface-glass)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Book size={18} />
              사용 가이드
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className="glass-card transition-all"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: `2px solid ${activeTab === 'all' ? 'var(--primary-purple)' : 'var(--surface-border)'}`,
                background: activeTab === 'all' ? 'rgba(107, 70, 193, 0.3)' : 'var(--surface-glass)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Star size={18} />
              전체 카드
            </button>
            <button
              onClick={() => setActiveTab('major')}
              className="glass-card transition-all"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: `2px solid ${activeTab === 'major' ? 'var(--primary-purple)' : 'var(--surface-border)'}`,
                background: activeTab === 'major' ? 'rgba(107, 70, 193, 0.3)' : 'var(--surface-glass)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              메이저 아르카나
            </button>
            <button
              onClick={() => setActiveTab('minor')}
              className="glass-card transition-all"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: `2px solid ${activeTab === 'minor' ? 'var(--primary-purple)' : 'var(--surface-border)'}`,
                background: activeTab === 'minor' ? 'rgba(107, 70, 193, 0.3)' : 'var(--surface-glass)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Heart size={18} />
              마이너 아르카나
            </button>
          </motion.div>

          {activeTab === 'guide' ? (
            /* Guide Content */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              {/* Tarot Basics */}
              <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.5rem'
                }}>
                  <Book size={28} color="var(--primary-gold)" />
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)'
                  }}>
                    마음코칭 카드는 무엇인가요?
                  </h2>
                </div>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  color: 'var(--text-secondary)',
                  marginBottom: '1rem'
                }}>
                  이 앱에서는 78장의 카드를 그림과 상징으로 활용해, 친구 관계에서의 내 마음과 생각할 거리를 차분히
                  정리하는 데 도움을 줍니다. 운세나 미래를 단정하지 않으며, 스스로 선택하고 실천할 수 있는 작은 힌트를
                  모아 보여 줍니다.
                </p>
                <div style={{
                  padding: '1.25rem',
                  background: 'rgba(107, 70, 193, 0.1)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(107, 70, 193, 0.2)'
                }}>
                  <p style={{
                    fontSize: '0.9375rem',
                    color: 'var(--primary-purple)',
                    fontWeight: 500,
                    marginBottom: '0.5rem'
                  }}>
                    💡 이 앱에서 카드가 하는 일
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)'
                  }}>
                    같은 고민이라도 카드 조합에 따라 다른 관점을 떠올리게 할 수 있어요.
                    메이저·마이너 카드가 모두 포함된 78장을 사용하며, 친구 관계 이야기에 맞춘 코칭 문장과 연결됩니다.
                  </p>
                </div>
              </div>

              {/* How to Use */}
              <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.5rem'
                }}>
                  🔮
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)'
                  }}>
                    마음코칭 카드 사용 순서
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    {
                      step: 1,
                      title: '고민 선택',
                      desc: '지금 마음이 가장 가까운 친구 관계 고민 하나를 고릅니다',
                      icon: '1️⃣'
                    },
                    {
                      step: 2,
                      title: '감정 · 마음 한 줄',
                      desc: '내 감정과 오늘 마음 한 줄을 고르면 카드 뽑기 화면으로 이어져요',
                      icon: '2️⃣'
                    },
                    {
                      step: 3,
                      title: '카드 뽑기',
                      desc: '준비가 되면 카드를 뽑아 나·친구·행동 순서로 살펴봅니다',
                      icon: '3️⃣'
                    },
                    {
                      step: 4,
                      title: '작은 행동 정하기',
                      desc: '코칭 문장과 오늘 해볼 한 걸음을 골라 실천해 보면 됩니다',
                      icon: '4️⃣'
                    }
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        padding: '1.25rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '0.75rem'
                      }}
                    >
                      <div style={{
                        fontSize: '2rem',
                        flexShrink: 0
                      }}>
                        {item.icon}
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          marginBottom: '0.5rem'
                        }}>
                          {item.title}
                        </h3>
                        <p style={{
                          fontSize: '0.9375rem',
                          lineHeight: 1.6,
                          color: 'var(--text-secondary)'
                        }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Positions */}
              <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.5rem'
                }}>
                  <Moon size={28} color="var(--primary-purple)" />
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)'
                  }}>
                    카드 세 장이 말하는 순서
                  </h2>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⏪</div>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--primary-gold)',
                      marginBottom: '0.5rem'
                    }}>
                      나의 속마음
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)'
                    }}>
                      내가 지금 어떤 감정인지, 마음속에서 일어나는 생각을 돌아봅니다
                    </p>
                  </div>

                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(107, 70, 193, 0.1)',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--primary-purple)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⏺️</div>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--primary-purple)',
                      marginBottom: '0.5rem'
                    }}>
                      친구의 입장 상상
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)'
                    }}>
                      상대 입장에서 한 번 생각해 보면 어떨지, 부드럽게 상상해 봅니다
                    </p>
                  </div>

                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(236, 72, 153, 0.1)',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--primary-pink)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⏩</div>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--primary-pink)',
                      marginBottom: '0.5rem'
                    }}>
                      해볼 수 있는 행동
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)'
                    }}>
                      오늘 당장 시도할 수 있는 작은 말과 행동을 고릅니다
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="glass-card" style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10B981'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#10B981',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Heart size={20} />
                  카드를 대하는 마음가짐
                </h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  {[
                    '카드는 정해진 미래가 아니라, 생각해 볼 관점을 던져 줍니다',
                    '마음에 와 닿는 말만 골라 적용해도 괜찮아요',
                    '최종 선택과 행동은 항상 내가 합니다',
                    '어렵게 느껴지는 카드도 새로운 시도를 떠올리게 하는 신호일 수 있어요'
                  ].map((tip, index) => (
                    <li
                      key={index}
                      style={{
                        fontSize: '0.9375rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'start',
                        gap: '0.5rem',
                        lineHeight: 1.6
                      }}
                    >
                      <span style={{ color: '#10B981', flexShrink: 0 }}>✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            /* Card List */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Search Bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <Search
                    size={20}
                    color="var(--text-muted)"
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="카드 이름으로 검색..."
                    className="glass-card"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem 0.875rem 3rem',
                      fontSize: '1rem',
                      borderRadius: '9999px',
                      border: '1px solid var(--surface-border)',
                      background: 'var(--surface-glass)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {filteredCards.map((card: any, index: number) => (
                  <motion.div
                    key={card.id}
                    ref={(el) => { cardRefs.current[card.id] = el; }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      boxShadow: highlightedCardId === card.id 
                        ? '0 0 30px rgba(245, 158, 11, 0.6)' 
                        : '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                    transition={{ 
                      delay: index * 0.05,
                      boxShadow: { duration: 0.3 }
                    }}
                    className="glass-card cursor-pointer"
                    style={{
                      padding: '1.5rem',
                      borderRadius: '1rem',
                      transition: 'all 0.3s ease',
                      border: highlightedCardId === card.id 
                        ? '2px solid rgba(245, 158, 11, 0.8)' 
                        : '1px solid var(--surface-border)'
                    }}
                    onClick={() => setSelectedCard(card)}
                    onMouseEnter={(e) => {
                      if (highlightedCardId !== card.id) {
                        e.currentTarget.style.borderColor = 'var(--primary-purple)';
                      }
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      if (highlightedCardId !== card.id) {
                        e.currentTarget.style.borderColor = 'var(--surface-border)';
                      }
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      {(() => {
                        const cardImageSrc = getCardImage(card.id);
                        
                        if (cardImageSrc) {
                          // Display actual card image
                          return (
                            <div style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              border: '2px solid rgba(245, 158, 11, 0.5)',
                              flexShrink: 0,
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                            }}>
                              <img 
                                src={cardImageSrc}
                                alt={card.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </div>
                          );
                        }
                        
                        // Fallback: Display diamond icon
                        return (
                          <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(107, 70, 193, 0.3) 0%, rgba(245, 158, 11, 0.3) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            flexShrink: 0
                          }}>
                            ✦
                          </div>
                        );
                      })()}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          marginBottom: '0.25rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {card.name}
                        </h3>
                        <p style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          No. {card.number}
                        </p>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        padding: '0.75rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          marginBottom: '0.375rem'
                        }}>
                          <Sun size={14} color="#10B981" />
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#10B981',
                            fontWeight: 500
                          }}>
                            정방향
                          </p>
                        </div>
                        <p style={{
                          fontSize: '0.8125rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {typeof card.upright === 'object' ? card.upright.prophecy : card.upright}
                        </p>
                      </div>

                      <div style={{
                        padding: '0.75rem',
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(139, 92, 246, 0.2)'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          marginBottom: '0.375rem'
                        }}>
                          <Moon size={14} color="#8B5CF6" />
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#8B5CF6',
                            fontWeight: 500
                          }}>
                            역방향
                          </p>
                        </div>
                        <p style={{
                          fontSize: '0.8125rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {typeof card.reversed === 'object' ? card.reversed.prophecy : card.reversed}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedCard(null)}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '500px' }}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedCard(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem' }}
            >
              ×
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              {(() => {
                const cardImageSrc = getCardImage(selectedCard.id);
                
                if (cardImageSrc) {
                  // Display actual card image
                  return (
                    <div style={{
                      width: '200px',
                      margin: '0 auto 1.5rem',
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      border: '3px solid rgba(245, 158, 11, 0.5)',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
                    }}>
                      <img 
                        src={cardImageSrc}
                        alt={selectedCard.name}
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block'
                        }}
                      />
                    </div>
                  );
                }
                
                // Fallback: Display diamond icon
                return (
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem'
                  }}>
                    ✦
                  </div>
                );
              })()}
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                marginBottom: '0.5rem'
              }}>
                {selectedCard.name}
              </h2>
              <p style={{
                fontSize: '1rem',
                color: 'var(--text-secondary)'
              }}>
                카드 번호: {selectedCard.number}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                padding: '1.5rem',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '1rem',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#10B981',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Sun size={20} />
                  정방향
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)'
                }}>
                  {typeof selectedCard.upright === 'object' 
                    ? (
                      <>
                        <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                          {selectedCard.upright.prophecy}
                        </strong>
                        {selectedCard.upright.signs && selectedCard.upright.signs.map((sign: string, i: number) => (
                          <div key={i} style={{ marginBottom: '0.5rem' }}>• {sign}</div>
                        ))}
                      </>
                    )
                    : selectedCard.upright
                  }
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '1rem',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#8B5CF6',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Moon size={20} />
                  역방향
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)'
                }}>
                  {typeof selectedCard.reversed === 'object'
                    ? (
                      <>
                        <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                          {selectedCard.reversed.prophecy}
                        </strong>
                        {selectedCard.reversed.signs && selectedCard.reversed.signs.map((sign: string, i: number) => (
                          <div key={i} style={{ marginBottom: '0.5rem' }}>• {sign}</div>
                        ))}
                      </>
                    )
                    : selectedCard.reversed
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
