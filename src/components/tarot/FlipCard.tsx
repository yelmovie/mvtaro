import { useState } from 'react';
import { motion } from 'motion/react';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  isFlipped: boolean;
  onFlip?: () => void;
  className?: string;
}

export function FlipCard({ front, back, isFlipped, onFlip, className = '' }: FlipCardProps) {
  const [hasFlipped, setHasFlipped] = useState(false);

  const handleClick = () => {
    if (!hasFlipped && onFlip) {
      setHasFlipped(true);
      onFlip();
    }
  };

  return (
    <div className={`perspective-1000 ${className}`} onClick={handleClick}>
      <motion.div
        className="relative w-full h-full cursor-pointer preserve-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Back of card (shown when not flipped) */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          {back}
        </div>

        {/* Front of card (shown when flipped) */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {front}
        </div>
      </motion.div>
    </div>
  );
}
