import { motion } from 'motion/react';
import React from 'react';

// @ts-ignore
import cardImg1 from '../../assets/card1.png';
// @ts-ignore
import cardImg2 from '../../assets/card2.png';
// @ts-ignore
import cardImg3 from '../../assets/card3.png';

interface CardItemProps {
  index: number;
  label: string;
  subtitle: string;
  cardName: string;
  color: string;
  isLoaded: boolean;
  delay?: number;
}

export function CardItem({ index, label, subtitle, cardName, color, isLoaded, delay = 0 }: CardItemProps) {
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
            <img 
              src={index === 0 ? cardImg1 : index === 1 ? cardImg2 : cardImg3}
              alt={label}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                opacity: 0.9
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.classList.add('fallback-icon');
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 60%)',
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
              paddingBottom: '1rem'
            }}>
              <h3 style={{ 
                fontWeight: 700, 
                color: '#fff',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)'
              }}>{cardName}</h3>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
