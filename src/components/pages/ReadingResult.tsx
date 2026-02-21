import { useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { TarotCard } from '../tarot/TarotCard';
import { READING_POSITIONS, getDisclaimer, type DrawnCard } from '../../lib/tarot-utils';

interface ReadingResultProps {
  questionId: string;
  cards: DrawnCard[];
  onNewReading: () => void;
}

export function ReadingResult({ questionId, cards, onNewReading }: ReadingResultProps) {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  const selectedCard = selectedCardIndex !== null ? cards[selectedCardIndex] : null;
  const interpretation = selectedCard
    ? selectedCard.isReversed
      ? selectedCard.card.reversed
      : selectedCard.card.upright
    : null;

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 style={{
            fontSize: 'var(--text-display)',
            marginBottom: '0.5rem',
            color: 'var(--tarot-text)'
          }}>
            당신의 리딩 결과
          </h2>
          <p style={{
            fontSize: 'var(--text-body-lg)',
            color: 'var(--tarot-text-muted)',
            lineHeight: 'var(--line-height-relaxed)',
            opacity: 0.7
          }}>
            카드를 클릭하여 자세한 해석을 확인하세요
          </p>
        </div>

        {/* Three Cards Display */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
          {cards.map((drawnCard, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="space-y-3"
            >
              <button
                onClick={() => setSelectedCardIndex(index)}
                className="aspect-[2/3] transition-all hover:scale-105"
                style={{
                  width: '100%',
                  borderRadius: '20px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  boxShadow: selectedCardIndex === index 
                    ? `0 0 0 4px ${selectedCardIndex === index ? 'var(--tarot-purple-main)' : 'transparent'}`
                    : 'none',
                  opacity: selectedCardIndex === index ? 1 : 0.9
                }}
              >
                <TarotCard
                  symbol={drawnCard.card.symbol}
                  name={drawnCard.card.name}
                  number={drawnCard.card.number}
                  isReversed={drawnCard.isReversed}
                />
              </button>
              
              <div className="text-center">
                <p style={{
                  fontSize: '0.875rem',
                  opacity: 0.7,
                  color: 'var(--tarot-text-muted)'
                }}>
                  {READING_POSITIONS[index as keyof typeof READING_POSITIONS]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interpretation Panel */}
        {selectedCard && interpretation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card mb-8"
            style={{
              padding: '1.5rem',
              borderRadius: '1.5rem'
            }}
          >
            {/* Card Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid rgba(100, 116, 139, 0.2)'
            }}>
              <div style={{ fontSize: '2.25rem' }}>{selectedCard.card.symbol}</div>
              <div>
                <h3 style={{
                  fontSize: 'var(--text-heading)',
                  color: 'var(--tarot-text)'
                }}>
                  {selectedCard.card.name}
                  {selectedCard.isReversed && (
                    <span style={{
                      fontSize: '0.875rem',
                      marginLeft: '0.5rem',
                      opacity: 0.6
                    }}>(역방향)</span>
                  )}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  opacity: 0.6,
                  color: 'var(--tarot-text-muted)'
                }}>
                  {READING_POSITIONS[selectedCard.position as keyof typeof READING_POSITIONS]}
                </p>
              </div>
            </div>

            {/* Prophecy */}
            <div className="mb-6">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem'
              }}>
                <h4 style={{
                  fontSize: 'var(--text-heading)',
                  color: 'var(--tarot-text)'
                }}>
                  예언
                </h4>
              </div>
              <p style={{
                fontSize: 'var(--text-body-lg)',
                color: 'var(--tarot-text)',
                lineHeight: 'var(--line-height-relaxed)'
              }}>
                {interpretation.prophecy}
              </p>
            </div>

            {/* Signs */}
            <div className="mb-6">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem'
              }}>
                <BookOpen style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  color: 'var(--tarot-purple-main)'
                }} />
                <h4 style={{
                  fontSize: 'var(--text-heading)',
                  color: 'var(--tarot-text)'
                }}>
                  징후
                </h4>
              </div>
              <ul className="space-y-2">
                {interpretation.signs.map((sign, i) => (
                  <li 
                    key={i}
                    style={{
                      fontSize: 'var(--text-body-lg)',
                      color: 'var(--tarot-text)',
                      lineHeight: 'var(--line-height-relaxed)',
                      paddingLeft: '1rem',
                      borderLeft: '2px solid var(--tarot-purple-main)',
                      listStyle: 'none'
                    }}
                  >
                    {sign}
                  </li>
                ))}
              </ul>
            </div>

            {/* Advice */}
            <div className="mb-6">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem'
              }}>
                <span style={{
                  fontSize: '1.25rem',
                  color: 'var(--tarot-purple-main)'
                }}>✦</span>
                <h4 style={{
                  fontSize: 'var(--text-heading)',
                  color: 'var(--tarot-text)'
                }}>
                  긍정적 방향
                </h4>
              </div>
              <div className="grid gap-2">
                {interpretation.advice.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '0.75rem',
                      backgroundColor: 'var(--tarot-purple-glow)',
                      border: '1px solid var(--tarot-purple-light)'
                    }}
                  >
                    <p style={{
                      fontSize: 'var(--text-body)',
                      color: 'var(--tarot-text)',
                      lineHeight: 'var(--line-height-relaxed)'
                    }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{
              fontSize: '0.875rem',
              textAlign: 'center',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(100, 116, 139, 0.2)',
              color: 'var(--tarot-text-muted)'
            }}>
              {getDisclaimer()}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <Button
            onClick={onNewReading}
            className="transition-all hover:scale-105"
            style={{
              padding: '0 2rem',
              height: '3rem',
              borderRadius: '1rem',
              backgroundColor: 'var(--tarot-purple-main)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            새로운 리딩 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}
