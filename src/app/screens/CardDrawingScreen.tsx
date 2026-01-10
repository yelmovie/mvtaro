import React, { useState, useEffect, useRef } from 'react';
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
import { initRitualAudio, triggerCardPickFeedback } from '../../utils/ritualFeedback';

interface CardDrawingScreenProps {
  questionId: string;
  onComplete: (drawnCards: Array<{ cardId: string; orientation: 'upright' | 'reversed' }>) => void;
  onBack: () => void;
}

type RitualPhase = 'idle' | 'pause' | 'ready';

export function CardDrawingScreen({ questionId, onComplete, onBack }: CardDrawingScreenProps) {
  const [isShuffling, setIsShuffling] = useState(false);
  const [drawnCardIds, setDrawnCardIds] = useState<string[]>([]);
  const [showCards, setShowCards] = useState(false);
  const [showButtonGlow, setShowButtonGlow] = useState(false);
  const [ritualPhase, setRitualPhase] = useState<RitualPhase>('idle');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const ritualTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const question = getQuestionById(questionId);
  const spreadType = getSpreadTypeById('three-card');

  // Reduced motion 감지
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 오디오 초기화
  useEffect(() => {
    initRitualAudio();
  }, []);

  // cleanup timeout
  useEffect(() => {
    return () => {
      if (ritualTimeoutRef.current) {
        clearTimeout(ritualTimeoutRef.current);
      }
    };
  }, []);

  const handleShuffle = () => {
    // 2초 정적 연출 시작
    setRitualPhase('pause');

    ritualTimeoutRef.current = setTimeout(() => {
      setRitualPhase('ready');
      setIsShuffling(true);

      setTimeout(() => {
        const cardIds = shuffleAndDraw(3);
        setDrawnCardIds(cardIds);
        setIsShuffling(false);
        setShowCards(true);
      }, 2000);
    }, 2000);
  };

  const handleReveal = () => {
    // 카드 선택 시 사운드 + 진동
    triggerCardPickFeedback();
    
    const cards = drawnCardIds.map((cardId, index) => ({
      cardId,
      orientation: getRandomOrientation(),
    }));
    onComplete(cards);
  };

  const isRitualPause = ritualPhase === 'pause';

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
          {isRitualPause ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.4 }}
              className="text-xl text-center"
              style={{
                color: '#E8C97A',
                textShadow: '0 0 12px rgba(232, 201, 122, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              숨을 한번 고르고… 그 친구를 떠올려 보세요.
            </motion.p>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-xl text-center"
              style={{
                color: '#E8C97A',
                textShadow: '0 0 12px rgba(232, 201, 122, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
              onAnimationComplete={() => {
                setTimeout(() => setShowButtonGlow(true), 200);
              }}
            >
              ✦ 그 친구의 얼굴을 떠올린 뒤, 준비가 되면 버튼을 눌러주세요.
            </motion.p>
          )}
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
              <motion.div
                className="w-48"
                animate={
                  isRitualPause && !prefersReducedMotion
                    ? { scale: [1, 1.015, 1] }
                    : { scale: 1 }
                }
                transition={
                  isRitualPause && !prefersReducedMotion
                    ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                    : {}
                }
              >
                <TarotCardBack />
              </motion.div>
            </div>
            <button
              onClick={handleShuffle}
              disabled={isRitualPause}
              className="mx-auto hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div
                className="drop-shadow-2xl"
                style={{
                  boxShadow: showButtonGlow ? '0 0 8px rgba(232, 201, 122, 0.4)' : undefined,
                }}
              >
                <img 
                  src={button1Image} 
                  alt="카드 섞기"
                  className="w-48 h-auto"
                />
              </div>
            </button>
          </div>
        )}

        {/* 베일 오버레이 */}
        {isRitualPause && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
            className="fixed inset-0 pointer-events-none z-40"
            style={{
              background: 'rgba(0, 0, 0, 0.12)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
            }}
          />
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