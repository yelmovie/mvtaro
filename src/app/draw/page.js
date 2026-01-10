'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import cardsData from '@/data/cards.json';
import button1Image from '@/assets/buttons/1.png';

export default function DrawPage() {
  const router = useRouter();
  const [selectedCards, setSelectedCards] = useState([]);
  const [revealedCards, setRevealedCards] = useState([false, false, false]);

  useEffect(() => {
    // Randomly select 3 cards
    const shuffled = [...cardsData].sort(() => Math.random() - 0.5);
    setSelectedCards(shuffled.slice(0, 3));
  }, []);

  const handleReveal = (index) => {
    const newRevealed = [...revealedCards];
    newRevealed[index] = true;
    setRevealedCards(newRevealed);
  };

  const allRevealed = revealedCards.every(r => r);

  const handleContinue = () => {
    const question = sessionStorage.getItem('selectedQuestion') || '';
    const reading = {
      question,
      cards: selectedCards,
    };
    sessionStorage.setItem('currentReading', JSON.stringify(reading));
    router.push('/results');
  };

  if (selectedCards.length === 0) {
    return (
      <div className="container-main py-16 flex items-center justify-center">
        <p className="text-muted">카드를 준비하는 중...</p>
      </div>
    );
  }

  return (
    <div className="container-main py-12">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="text-4xl">✨</div>
          <h1 className="text-2xl font-bold">
            {sessionStorage.getItem('selectedQuestion') || '오늘의 우정 리딩'}
          </h1>
          <p className="text-muted">
            각 카드를 클릭하여 뒤집어보세요
          </p>
        </div>

        <div className="flex justify-center items-center gap-8">
          {selectedCards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              isRevealed={revealedCards[index]}
              onReveal={() => handleReveal(index)}
              position={['left', 'center', 'right'][index]}
            />
          ))}
        </div>

        {allRevealed && (
          <div className="flex justify-center animate-fade-in">
            <button
              onClick={handleContinue}
              className="mx-auto hover:scale-105 transition-transform duration-300"
            >
              <img 
                src={button1Image} 
                alt="해석 보러 가기"
                className="w-48 h-auto drop-shadow-2xl"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
