import React from 'react';
import { TarotCard } from '../../types/tarot';
import { getCardImagePath } from '../../utils/tarotService';

interface TarotCardFrontProps {
  card: TarotCard;
  orientation: 'upright' | 'reversed';
  className?: string;
}

export function TarotCardFront({ card, orientation, className = '' }: TarotCardFrontProps) {
  const isReversed = orientation === 'reversed';
  const cardImagePath = getCardImagePath(card.id, card.number);

  return (
    <div
      className={`relative aspect-[2/3] rounded-[var(--radius-card)] overflow-hidden ${className}`}
      style={{
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        transform: isReversed ? 'rotate(180deg)' : 'none',
      }}
    >
      <img 
        src={cardImagePath} 
        alt={card.name}
        className="w-full h-full object-cover"
      />

      {/* Reversed indicator */}
      {isReversed && (
        <div className="absolute top-2 right-2 bg-tarot-purple text-primary-foreground text-xs px-2 py-1 rounded-full">
          역방향
        </div>
      )}
    </div>
  );
}
