import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, MessageCircle, Lightbulb, Heart } from 'lucide-react';
import resultBgImg from 'figma:asset/51d359264ccba0aca3f242b625c3fe3c3a660837.png';

import { useCardLogic } from '../hooks/useCardLogic';
import { CardItem } from '../components/cards/CardItem';
import { CoachCharacter } from '../components/coach/CoachCharacter';

interface ResultProps {
  questionTitle: string;
  mood: { icon: string; label: string };
  cardIds: string[];
  onBack: () => void;
}

const POSITIONS = [
  { label: '나의 속마음', subtitle: '내가 느끼는 진짜 감정', color: 'var(--color-emotion)', icon: Heart },
  { label: '친구의 입장 상상', subtitle: '친구는 어떤 마음일까?', color: 'var(--color-friend)', icon: MessageCircle },
  { label: '추천하는 행동', subtitle: '이렇게 해보면 어떨까?', color: 'var(--color-action)', icon: Lightbulb }
];

export function Result({ questionTitle, mood, cardIds, onBack }: ResultProps) {
  const { getCardResult } = useCardLogic();
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine problem/emotion logic here. (Using generic for demo).
  const emotionKey = mood.label.includes('화남') ? 'angry' : 'sad';

  // Get mapped data passing the index as position
  const results = cardIds.map((id, index) => getCardResult("conflict", emotionKey, id, index));

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img src={resultBgImg} alt="background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'var(--color-bg)', opacity: 0.8, backdropFilter: 'blur(10px)' }} />
      </div>

      <div style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
        gap: '2rem'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>✨</span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>
              마음 코칭 카드
              <span style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', fontWeight: 'normal', marginTop: '0.25rem' }}>
                카드의 지혜로 내 마음을 들여다봐요
              </span>
            </h1>
          </div>
          <button onClick={onBack} style={{
            padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: '1px solid rgba(245, 158, 11, 0.4)',
            background: 'rgba(245, 158, 11, 0.1)', color: 'var(--primary-gold)', fontSize: '1rem', fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <RefreshCw size={18} /> 처음으로
          </button>
        </div>

        {/* Title Section */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-gold)', fontWeight: 700 }}>
            ✨ 3장의 카드가 전하는 오늘의 마음 코칭 ✨
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>
            각 카드의 내용을 천천히 읽어보세요. ({mood.icon} {mood.label} 기분)
          </p>
        </div>

        {/* 3 Column Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', flex: 1 }}>
          {results.map((result, index) => {
            const pos = POSITIONS[index];
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <CardItem 
                  index={index} 
                  label={pos.label} 
                  subtitle={pos.subtitle} 
                  cardName={cardIds[index]} 
                  color={pos.color} 
                  isLoaded={isLoaded} 
                  delay={index * 0.2} 
                />

                {isLoaded && (
                  <div className="card" style={{
                    borderTop: `4px solid ${pos.color}80`,
                    flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem'
                  }}>
                    {index === 0 && (
                      <>
                        <div>
                          <h4 style={{ color: pos.color, fontWeight: 700, marginBottom: '0.75rem' }}>나의 속마음</h4>
                          <p style={{ color: '#fff', lineHeight: 1.7 }}>{result.emotionText}</p>
                        </div>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <div>
                          <h4 style={{ color: pos.color, fontWeight: 700, marginBottom: '0.75rem' }}>상황 및 친구의 입장</h4>
                          <p style={{ color: '#fff', lineHeight: 1.7 }}>{result.friendText}</p>
                        </div>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <div>
                          <h4 style={{ color: pos.color, fontWeight: 700, marginBottom: '0.75rem' }}>추천하는 행동</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {result.actions.map((act, i) => (
                              <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{ background: pos.color, color: '#fff', padding: '0 6px', borderRadius: '10px', fontSize: '12px' }}>{i + 1}</span>
                                <span style={{ color: '#fff', fontSize: '0.9rem' }}>{act}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{ background: 'rgba(236,72,153,0.1)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(236,72,153,0.3)', marginTop: 'auto' }}>
                          <strong style={{ color: '#EC4899', display: 'block', marginBottom: '0.5rem' }}>💬 이렇게 말해보세요!</strong>
                          {result.dialogues.map((dlg, i) => (
                            <div key={i} style={{ background: '#fff', color: '#1e293b', padding: '0.5rem', borderRadius: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>"{dlg}"</div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <CoachCharacter 
          message={<>모든 관계는 서로의 마음을 이해하려는 작은 노력에서 시작돼요.<br/>네 마음을 믿고 천천히 해나가면 꼭 괜찮아질 거야!</>} 
        />
      </div>
    </div>
  );
}
