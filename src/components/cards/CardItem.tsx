import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { getCardImage } from '../../data/tarot-card-images';

interface CardItemProps {
  index: number;
  label: string;
  subtitle: string;
  cardId: string;
  cardName: string;
  isReversed: boolean;
  color: string;
  isLoaded: boolean;
  delay?: number;
}

export function CardItem({
  index,
  label,
  subtitle,
  cardId,
  cardName,
  isReversed,
  color,
  isLoaded,
  delay = 0
}: CardItemProps) {
  const cardImage = getCardImage(cardId);
  const [hasImageError, setHasImageError] = useState(false);
  const showFallback = !cardImage || hasImageError;

  useEffect(() => {
    setHasImageError(false);
  }, [cardId, cardImage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card"
      style={{
        background: 'var(--color-card)',
        border: `2px solid ${color}40`,
        borderRadius: '20px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem',
        marginBottom: '1rem',
        zIndex: 1
      }}>
        <div style={{
          background: color,
          color: '#fff',
          padding: '0.25rem 1rem',
          borderRadius: '1rem',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1rem'
        }}>
          <span style={{ 
            background: 'rgba(255,255,255,0.2)', 
            width: '20px', 
            height: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: '50%',
            fontSize: '0.75rem'
          }}>{index + 1}</span>
          {label}
        </div>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>{subtitle}</span>
      </div>

      <div style={{
        width: '100%',
        aspectRatio: '3/4',
        background: `linear-gradient(135deg, ${color}20 0%, transparent 100%)`,
        border: `1px solid ${color}50`,
        borderRadius: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
        zIndex: 1,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {!isLoaded ? (
          <div className="animate-pulse flex flex-col items-center">
            <span style={{ fontSize: '3rem' }}>✨</span>
            <p style={{ color: color, marginTop: '1rem' }}>확인중...</p>
          </div>
        ) : (
          <>
            {!showFallback && (
              <img 
                src={cardImage}
                alt={label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  inset: 0,
                  zIndex: 0,
                  opacity: 0.9,
                  transform: isReversed ? 'rotate(180deg)' : 'none'
                }}
                onError={() => {
                  setHasImageError(true);
                }}
              />
            )}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: showFallback
                ? `linear-gradient(180deg, ${color}33 0%, rgba(15,23,42,0.94) 100%)`
                : 'linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 60%)',
              zIndex: 1
            }} />
            <div style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              height: '100%',
              padding: showFallback ? '1.2rem' : '0 0 1rem'
            }}>
              {showFallback && (
                <div style={{
                  marginTop: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.6rem',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '2.4rem' }}>🃏</span>
                  <p style={{
                    margin: 0,
                    color: 'rgba(255,255,255,0.82)',
                    fontSize: '0.86rem',
                    lineHeight: 1.5
                  }}>
                    카드 이미지를 불러오지 못해도
                    <br />
                    코칭 내용은 그대로 확인할 수 있어요.
                  </p>
                </div>
              )}
              <h3 style={{ 
                fontWeight: 700, 
                color: '#fff',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)'
              }}>{cardName}</h3>
              <span style={{
                marginTop: '0.35rem',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.9)',
                background: 'rgba(15, 23, 42, 0.58)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '9999px',
                padding: '0.2rem 0.55rem'
              }}>
                {isReversed ? '이 카드는 뒤집혀 나왔어요' : '이 카드는 정방향으로 나왔어요'}
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
