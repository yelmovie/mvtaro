'use client';

import { useState } from 'react';

export default function Card({ card, isRevealed, onReveal, position }) {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleClick = () => {
    if (isRevealed || isFlipping) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      onReveal();
      setIsFlipping(false);
    }, 300);
  };

  const positions = {
    left: '마음',
    center: '길',
    right: '약속',
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleClick}
        disabled={isRevealed}
        className={`
          relative w-32 h-48 rounded-card
          transition-transform duration-slow
          ${isFlipping ? 'scale-95' : 'scale-100'}
          ${!isRevealed ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
        `}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back */}
        <div
          className={`
            absolute inset-0 glass-card
            flex flex-col items-center justify-center
            border-2 border-gold
            transition-opacity duration-base
            ${isRevealed ? 'opacity-0' : 'opacity-100'}
          `}
        >
          <div className="text-4xl mb-2">⭐</div>
          <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center">
            <span className="text-2xl">⭐</span>
          </div>
        </div>

        {/* Card Front */}
        <div
          className={`
            absolute inset-0 glass-card
            flex flex-col items-center justify-center p-4
            border-2 border-gold
            transition-opacity duration-base
            ${isRevealed ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div className="text-5xl mb-3">{card.icon}</div>
          <h3 className="text-lg font-bold text-center">{card.name}</h3>
          <p className="text-sm text-muted mt-1">{card.subtitle}</p>
        </div>
      </button>

      <span className="text-sm text-gold font-medium">{positions[position]}</span>
    </div>
  );
}
