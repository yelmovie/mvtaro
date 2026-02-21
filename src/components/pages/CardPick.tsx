import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { FlipCard } from '../tarot/FlipCard';
import { CardBack } from '../tarot/CardBack';
import { TarotCard } from '../tarot/TarotCard';
import { getAllCards, type TarotCard as TarotCardType, type DrawnCard } from '../../lib/tarot-utils';

interface CardPickProps {
  questionId: string;
  onComplete: (cards: DrawnCard[]) => void;
  onBack: () => void;
}

export function CardPick({ questionId, onComplete, onBack }: CardPickProps) {
  const [shuffledCards, setShuffledCards] = useState<TarotCardType[]>([]);
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set());
  const [isShuffling, setIsShuffling] = useState(true);

  useEffect(() => {
    // Shuffle cards on mount
    const cards = getAllCards();
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    
    // Show shuffling animation
    setTimeout(() => setIsShuffling(false), 1500);
  }, []);

  const handleCardSelect = (index: number) => {
    if (selectedCards.length >= 3 || flippedIndices.has(index)) return;

    const card = shuffledCards[index];
    const isReversed = Math.random() < 0.5;
    
    const drawnCard: DrawnCard = {
      card,
      isReversed,
      position: selectedCards.length,
    };

    setSelectedCards([...selectedCards, drawnCard]);
    setFlippedIndices(new Set([...flippedIndices, index]));

    // If 3 cards selected, proceed to results after a delay
    if (selectedCards.length === 2) {
      setTimeout(() => {
        onComplete([...selectedCards, drawnCard]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={isShuffling}
            style={{
              marginBottom: '1rem',
              marginLeft: '-0.5rem',
              color: 'var(--tarot-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
            돌아가기
          </Button>
          
          <div className="text-center max-w-2xl mx-auto">
            <h2 style={{
              fontSize: 'var(--text-display)',
              marginBottom: '0.5rem',
              color: 'var(--tarot-text)'
            }}>
              {isShuffling ? '카드를 섞고 있습니다...' : '3장의 카드를 선택하세요'}
            </h2>
            <p style={{
              fontSize: 'var(--text-body-lg)',
              color: 'var(--tarot-text-muted)',
              lineHeight: 'var(--line-height-relaxed)',
              opacity: 0.7
            }}>
              {isShuffling ? (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  마음을 집중하세요
                </span>
              ) : (
                `${selectedCards.length} / 3 선택됨`
              )}
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gap: '1rem',
          maxWidth: '64rem',
          marginLeft: 'auto',
          marginRight: 'auto'
        }} className="grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
          {shuffledCards.slice(0, 21).map((card, index) => (
            <motion.div
              key={`${card.id}-${index}`}
              initial={{ opacity: 0, y: 20, rotateY: -180 }}
              animate={{ 
                opacity: isShuffling ? 0.5 : 1, 
                y: 0,
                rotateY: 0,
              }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.5,
              }}
              className="aspect-[2/3]"
            >
              <FlipCard
                front={
                  <TarotCard
                    symbol={card.symbol}
                    name={card.name}
                    number={card.number}
                    isReversed={selectedCards.find((_, i) => flippedIndices.has(index))?.isReversed}
                  />
                }
                back={<CardBack />}
                isFlipped={flippedIndices.has(index)}
                onFlip={() => !isShuffling && handleCardSelect(index)}
                className={`h-full ${isShuffling ? 'pointer-events-none' : ''}`}
              />
            </motion.div>
          ))}
        </div>

        {/* Progress indicator */}
        {!isShuffling && selectedCards.length > 0 && (
          <div style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  borderRadius: '9999px',
                  transition: 'all 150ms',
                  backgroundColor: i < selectedCards.length 
                    ? 'var(--tarot-purple-main)' 
                    : 'var(--tarot-glass-border)'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
