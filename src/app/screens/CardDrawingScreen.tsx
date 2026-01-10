import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TarotCardBack } from '../components/TarotCardBack';
import { Sparkles, ArrowRight } from 'lucide-react';
import button1Image from '@/assets/buttons/1.png';
import backgroundImage from '@/assets/backgrounds/2.png';
import {
  shuffleAndDraw,
  getRandomOrientation,
  getQuestionById,
  getSpreadTypeById,
} from '../../utils/tarotService';

interface CardDrawingScreenProps {
  questionId: string;
  onComplete: (drawnCards: Array<{ cardId: string; orientation: 'upright' | 'reversed' }>) => void;
  onBack: () => void;
}

export function CardDrawingScreen({ questionId, onComplete, onBack }: CardDrawingScreenProps) {
  const [isShuffling, setIsShuffling] = useState(false);
  const [drawnCardIds, setDrawnCardIds] = useState<string[]>([]);
  const [showCards, setShowCards] = useState(false);

  const question = getQuestionById(questionId);
  const spreadType = getSpreadTypeById('three-card');

  const handleShuffle = () => {
    setIsShuffling(true);

    setTimeout(() => {
      const cardIds = shuffleAndDraw(3);
      setDrawnCardIds(cardIds);
      setIsShuffling(false);
      setShowCards(true);
    }, 2000);
  };

  const handleReveal = () => {
    const cards = drawnCardIds.map((cardId, index) => ({
      cardId,
      orientation: getRandomOrientation(),
    }));
    onComplete(cards);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      <div className="relative max-w-5xl mx-auto px-6 py-12">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-8 text-white hover:text-white/80 transition-colors text-xl"
        >
          ← 돌아가기
        </button>

        {/* Question */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-medium mb-3 text-white">{question?.title}</h2>
          <p className="text-white text-xl">{question?.description}</p>
        </div>

        {/* Spread info */}
        <div className="mb-12 p-6 rounded-xl bg-surface-glass border border-surface-glass-border">
          <div className="flex gap-4 justify-center">
            {spreadType?.positions.map((pos) => (
              <div key={pos.position} className="flex-1 text-center">
                <div className="text-xl font-medium text-tarot-purple mb-1" style={{ fontFamily: 'var(--font-family-display)' }}>{pos.label}</div>
                <div className="text-base text-muted-foreground" style={{ fontFamily: 'var(--font-family-display)' }}>{pos.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cards area */}
        {!showCards && !isShuffling && (
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="w-48">
                <TarotCardBack />
              </div>
            </div>
            <button
              onClick={handleShuffle}
              className="mx-auto hover:scale-105 transition-transform duration-300"
            >
              <img 
                src={button1Image} 
                alt="카드 섞기"
                className="w-48 h-auto drop-shadow-2xl"
              />
            </button>
          </div>
        )}

        {isShuffling && (
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <motion.div
                animate={{ rotateY: [0, 360], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-48"
              >
                <TarotCardBack />
              </motion.div>
            </div>
            <p className="text-white text-xl">카드를 섞고 있습니다...</p>
          </div>
        )}

        {showCards && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex gap-6 justify-center mb-12">
              {drawnCardIds.map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="w-48"
                >
                  <TarotCardBack />
                  <div className="mt-3 text-center text-base text-white">
                    {spreadType?.positions[index].label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleReveal}
                className="mx-auto hover:scale-105 transition-transform duration-300"
              >
                <img 
                  src={button1Image} 
                  alt="카드 펼치기"
                  className="w-48 h-auto drop-shadow-2xl"
                />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}