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
              타로 가이드
            </h1>
            <p className="text-sm text-secondary">
              타로 카드의 의미와 해석 방법을 배워보세요
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
                    타로란 무엇인가요?
                  </h2>
                </div>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  color: 'var(--text-secondary)',
                  marginBottom: '1rem'
                }}>
                  타로는 78장의 카드를 사용하여 과거, 현재, 미래에 대한 통찰을 얻는 점술 도구입니다. 
                  각 카드는 고유한 상징과 의미를 가지고 있으며, 카드의 조합과 위치에 따라 다양한 해석이 가능합니다.
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
                    💡 관계 타로의 특징
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)'
                  }}>
                    우리 앱은 완전한 78장 타로 덱을 사용하여 대인관계에 특화된 해석을 제공합니다. 
                    메이저 아르카나 22장과 마이너 아르카나 56장(완드, 컵, 검, 펜타클)이 모두 포함되어 있습니다.
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
                    타로 리딩 방법
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    {
                      step: 1,
                      title: '질문 선택',
                      desc: '현재 고민하고 있는 관계에 대한 질문을 선택하세요',
                      icon: '1️⃣'
                    },
                    {
                      step: 2,
                      title: '카드 선택',
                      desc: '직관을 따라 3장의 카드를 선택하세요. 첫 느낌이 중요합니다',
                      icon: '2️⃣'
                    },
                    {
                      step: 3,
                      title: '해석 확인',
                      desc: '과거-현재-미래의 흐름을 통해 관계의 방향성을 이해하세요',
                      icon: '3️⃣'
                    },
                    {
                      step: 4,
                      title: '행동하기',
                      desc: '타로의 조언을 참고하여 관계 개선을 위한 실천을 해보세요',
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
                    3장 리딩의 의미
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
                      과거
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)'
                    }}>
                      관계가 어떻게 시작됐는지, 과거의 영향은 무엇인지 살펴봅니다
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
                      현재
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)'
                    }}>
                      지금 이 순간의 관계 상태와 현재 직면한 상황을 이해합니다
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
                      가능성
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)'
                    }}>
                      미래에 나아갈 수 있는 방향과 발전 가능성을 탐색합니다
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
                  타로를 대하는 마음가짐
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
                    '타로는 절대적인 미래가 아닌 가능성을 보여줍니다',
                    '열린 마음으로 받아들이되, 맹신하지 마세요',
                    '타로의 조언을 참고하되, 최종 선택은 자신이 합니다',
                    '부정적인 카드도 성장의 기회로 받아들이세요'
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
