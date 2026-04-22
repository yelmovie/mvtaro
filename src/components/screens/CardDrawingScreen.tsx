import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { drawRecommendedCards } from '../../hooks/useCardLogic';
import { DrawnCard } from '../../types/app-types';
import cardBackImg from 'figma:asset/ebbb072acc67baec62346e995df8d7e6c58b0f3a.png';
import beginButtonImg from 'figma:asset/88750f26f150628ebb5988a25a59a53e93957ab3.png';
import backgroundImg from 'figma:asset/88caa78ab1187604e765043cdea4cdaa77aaba83.png';

interface CardDrawingScreenProps {
  problemType: string;
  emotionLabel: string;
  questionTitle: string;
  onBack: () => void;
  onCardsDrawn: (cards: DrawnCard[]) => void;
}

type AnimationPhase = 'preparation' | 'breathing' | 'ready' | 'spinning' | 'spreading' | 'flipping';

export function CardDrawingScreen({ problemType, emotionLabel, questionTitle, onBack, onCardsDrawn }: CardDrawingScreenProps) {
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('preparation');
  const [focusProgress, setFocusProgress] = useState(0);

  // Breathing animation
  useEffect(() => {
    if (animationPhase === 'breathing') {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 1;
        setFocusProgress(Math.min(progress, 100));
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setAnimationPhase('ready');
          }, 500);
        }
      }, 80); // 8 seconds total

      return () => clearInterval(interval);
    }
  }, [animationPhase]);

  const handleStartPreparation = () => {
    setAnimationPhase('breathing');
  };

  const handleBegin = () => {
    // Phase 1: Spinning (1.5s)
    setAnimationPhase('spinning');
    
    setTimeout(() => {
      // Phase 2: Spreading (1s)
      setAnimationPhase('spreading');
      
      setTimeout(() => {
        // Phase 3: Flipping (1s)
        setAnimationPhase('flipping');
        
        setTimeout(() => {
          // Phase 4: Navigate to result
          const selectedCards = drawRecommendedCards(problemType, emotionLabel);
          onCardsDrawn(selectedCards);
        }, 1200);
      }, 1000);
    }, 1500);
  };

  const isAnimating = ['spinning', 'spreading', 'flipping'].includes(animationPhase);
  const showCards = ['ready', 'spinning', 'spreading', 'flipping'].includes(animationPhase);

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      backgroundImage: `url(${backgroundImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {/* Header */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          돌아가기
        </button>
        
        <h2 style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: 'var(--primary-gold)',
          textAlign: 'center',
          flex: 1,
          marginRight: '100px'
        }}>
          {questionTitle}
        </h2>
      </div>

      {/* Preparation Phase */}
      <AnimatePresence>
        {animationPhase === 'preparation' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              zIndex: 5
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="modal-content"
              style={{
                textAlign: 'center',
                maxWidth: '600px',
                borderRadius: '1.5rem',
                padding: '3rem 2rem'
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
              </motion.div>

              <h2 style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--primary-gold)',
                marginBottom: '1.5rem',
                background: 'linear-gradient(90deg, #F59E0B, #FCD34D, #F59E0B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                마음을 차분히 돌아볼 준비를 해주세요
              </h2>

              <p style={{
                fontSize: '1.125rem',
                color: 'var(--text-secondary)',
                marginBottom: '2rem',
                lineHeight: 1.8
              }}>
                마음을 차분하게 가라앉히고 지금 느끼는<br />
                솔직한 감정에 집중해보세요.
              </p>

              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '2rem',
                textAlign: 'left'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>✨</span>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)'
                  }}>
                    코칭 전 준비사항
                  </span>
                </div>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <li style={{
                    fontSize: '0.9375rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'start',
                    gap: '0.5rem',
                    lineHeight: 1.6
                  }}>
                    <span style={{ color: 'var(--primary-gold)', flexShrink: 0 }}>•</span>
                    <span>조용한 공간에서 마음을 편안하게 하세요</span>
                  </li>
                  <li style={{
                    fontSize: '0.9375rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'start',
                    gap: '0.5rem',
                    lineHeight: 1.6
                  }}>
                    <span style={{ color: 'var(--primary-gold)', flexShrink: 0 }}>•</span>
                    <span>궁금한 관계에 대해 깊이 생각해보세요</span>
                  </li>
                  <li style={{
                    fontSize: '0.9375rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'start',
                    gap: '0.5rem',
                    lineHeight: 1.6
                  }}>
                    <span style={{ color: 'var(--primary-gold)', flexShrink: 0 }}>•</span>
                    <span>친구나 상황에 대해 솔직하게 떠올려보세요</span>
                  </li>
                </ul>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartPreparation}
                style={{
                  background: 'linear-gradient(135deg, rgba(107, 70, 193, 0.8), rgba(139, 92, 246, 0.8))',
                  border: '1px solid var(--primary-purple)',
                  borderRadius: '0.75rem',
                  padding: '1rem 2.5rem',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  boxShadow: '0 0 30px rgba(107, 70, 193, 0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                마음의 준비가 되었어요
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breathing Phase */}
      <AnimatePresence>
        {animationPhase === 'breathing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              zIndex: 5
            }}
          >
            <motion.div
              style={{
                textAlign: 'center',
                maxWidth: '600px'
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  width: '200px',
                  height: '200px',
                  margin: '0 auto 2rem',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3), rgba(139, 92, 246, 0.2))',
                  border: '2px solid rgba(245, 158, 11, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 60px rgba(245, 158, 11, 0.4)',
                  position: 'relative'
                }}
              >
              </motion.div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'var(--primary-gold)',
                marginBottom: '1rem'
              }}>
                깊게 호흡하며 내 마음에 집중하세요
              </h3>

              <p style={{
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                marginBottom: '2rem',
                lineHeight: 1.6
              }}>
                친구와의 관계나 답답한 마음을 조용히 생각해봐요.<br />
                숨을 들이마시고 내쉬는 것에 집중해요.
              </p>

              {/* Progress Bar */}
              <div style={{
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                height: '8px',
                overflow: 'hidden',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${focusProgress}%` }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #F59E0B, #FCD34D)',
                    borderRadius: '1rem',
                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.6)'
                  }}
                />
              </div>

              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                marginTop: '1rem'
              }}>
                마음 집중: {focusProgress}%
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ready Phase */}
      <AnimatePresence>
        {animationPhase === 'ready' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              zIndex: 50
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                textAlign: 'center',
                maxWidth: '600px',
                marginBottom: '3rem'
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✨
              </motion.div>

              <motion.h3
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--primary-gold)',
                  marginBottom: '1.5rem',
                  background: 'linear-gradient(90deg, #F59E0B, #FCD34D, #F59E0B)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                마음을 살펴볼 준비가 되었어요
              </motion.h3>

              <p style={{
                fontSize: '1.125rem',
                color: 'var(--text-secondary)',
                marginBottom: '0',
                lineHeight: 1.8
              }}>
                눈을 감고 마음이 가는 카드를 골라보세요.
                <br />
                준비가 되면 아래를 눌러 카드를 펼쳐보세요.
              </p>
            </motion.div>

            {/* Begin Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.5,
                duration: 0.5,
                ease: "easeOut"
              }}
              style={{
                position: 'relative',
                zIndex: 100
              }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBegin}
                disabled={isAnimating}
                style={{
                  width: '400px',
                  height: '400px',
                  border: 'none',
                  cursor: isAnimating ? 'not-allowed' : 'pointer',
                  opacity: isAnimating ? 0.5 : 1,
                  transition: 'all 0.3s ease',
                  background: 'transparent',
                  padding: 0,
                  pointerEvents: 'auto',
                  filter: 'drop-shadow(0 0 60px rgba(245, 158, 11, 0.6))'
                }}
              >
                <img 
                  src={beginButtonImg}
                  alt="카드 뽑기 시작"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Drawing Area */}
      {showCards && (
        <div style={{
          position: 'relative',
          height: 'calc(100vh - 120px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          zIndex: 10
        }}>
          {/* Cards Container */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '800px',
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Spinning phase - single card stack */}
            <AnimatePresence>
              {animationPhase === 'spinning' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotateY: [0, 360, 720, 1080]
                  }}
                  transition={{ 
                    rotateY: { duration: 1.5, ease: "linear" },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 }
                  }}
                  style={{
                    width: '180px',
                    height: '280px',
                    position: 'absolute',
                    filter: 'drop-shadow(0 0 30px rgba(245, 158, 11, 0.6))'
                  }}
                >
                  <img 
                    src={cardBackImg} 
                    alt="Card"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Spreading phase - 3 cards spread out */}
            <AnimatePresence>
              {animationPhase === 'spreading' && (
                <>
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      initial={{ 
                        x: 0,
                        y: 0,
                        opacity: 1,
                        scale: 1
                      }}
                      animate={{ 
                        x: (index - 1) * 220,
                        y: index === 1 ? -20 : 0,
                        scale: index === 1 ? 1.05 : 1
                      }}
                      transition={{ 
                        duration: 1,
                        ease: "easeOut",
                        delay: index * 0.1
                      }}
                      style={{
                        width: '180px',
                        height: '280px',
                        position: 'absolute',
                        filter: `drop-shadow(0 0 ${index === 1 ? '40' : '20'}px rgba(245, 158, 11, ${index === 1 ? '0.8' : '0.4'}))`
                      }}
                    >
                      <img 
                        src={cardBackImg} 
                        alt="Card"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Flipping phase - cards flip with glow */}
            <AnimatePresence>
              {animationPhase === 'flipping' && (
                <>
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      initial={{ 
                        x: (index - 1) * 220,
                        y: index === 1 ? -20 : 0,
                        rotateY: 0,
                        scale: index === 1 ? 1.05 : 1
                      }}
                      animate={{ 
                        rotateY: 180,
                        scale: [
                          index === 1 ? 1.05 : 1,
                          index === 1 ? 1.15 : 1.1,
                          index === 1 ? 1.05 : 1
                        ]
                      }}
                      transition={{ 
                        rotateY: { duration: 0.8, delay: index * 0.2 },
                        scale: { duration: 0.8, delay: index * 0.2 }
                      }}
                      style={{
                        width: '180px',
                        height: '280px',
                        position: 'absolute',
                        filter: `drop-shadow(0 0 50px rgba(245, 158, 11, 1))`
                      }}
                    >
                      <img 
                        src={cardBackImg} 
                        alt="Card"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Card Position Labels */}
          {animationPhase === 'spreading' || animationPhase === 'flipping' ? (
            <div style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '220px',
              width: '800px',
              justifyContent: 'center'
            }}>
              {['나의 마음', '친구 쪽 생각', '해볼 방향'].map((label, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.2 }}
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: index === 1 ? 'var(--primary-gold)' : 'var(--text-secondary)',
                    textAlign: 'center',
                    textShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
                    width: '180px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {label}
                </motion.div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
