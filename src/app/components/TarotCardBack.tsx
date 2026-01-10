import React from 'react';
import cardBackImage from '@/assets/backcard/ebbb072acc67baec62346e995df8d7e6c58b0f3a.png';

interface TarotCardBackProps {
  className?: string;
}

export function TarotCardBack({ className = '' }: TarotCardBackProps) {
  return (
    <div
      className={`relative aspect-[2/3] rounded-[var(--radius-card)] overflow-hidden ${className}`}
      style={{
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      }}
    >
      <img 
        src={cardBackImage} 
        alt="Tarot Card Back"
        className="w-full h-full object-cover"
      />
    </div>
  );
}