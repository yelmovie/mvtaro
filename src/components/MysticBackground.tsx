import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface MysticBackgroundProps {
  variant?: 'tarot-space' | 'mystic-altar' | 'moon-space' | 'moonlight-nature';
  intensity?: 'low' | 'medium' | 'high';
}

// Background image imports
import bgTarotSpace from 'figma:asset/6c259d4a777c18d80b49337ac11fb66e495d0602.png';
import bgMysticAltar from 'figma:asset/88caa78ab1187604e765043cdea4cdaa77aaba83.png';
import bgMoonSpace from 'figma:asset/51d359264ccba0aca3f242b625c3fe3c3a660837.png';
import bgMoonlightNature from 'figma:asset/49b3f0ad1f1823f8e56f0f9c9a8e8c70f413055c.png';

const backgrounds = {
  'tarot-space': bgTarotSpace,
  'mystic-altar': bgMysticAltar,
  'moon-space': bgMoonSpace,
  'moonlight-nature': bgMoonlightNature,
};

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  depth: number;
  speed: number;
  twinkleDelay: number;
}

export function MysticBackground({ 
  variant = 'tarot-space',
  intensity = 'high'
}: MysticBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<Star[]>([]);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Generate stars on mount
  useEffect(() => {
    const starCount = intensity === 'high' ? 80 : intensity === 'medium' ? 50 : 30;
    const generatedStars: Star[] = [];
    
    for (let i = 0; i < starCount; i++) {
      generatedStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        depth: Math.random() * 3,
        speed: Math.random() * 0.5 + 0.2,
        twinkleDelay: Math.random() * 5,
      });
    }
    
    setStars(generatedStars);
  }, [intensity]);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const parallaxIntensity = intensity === 'high' ? 20 : intensity === 'medium' ? 10 : 5;

  return (
    <div className="mystic-background-container" ref={backgroundRef}>
      {/* Main Background Image with Parallax */}
      <motion.div
        className="mystic-background-layer background-image"
        animate={{
          x: mousePosition.x * parallaxIntensity * 0.5,
          y: mousePosition.y * parallaxIntensity * 0.5,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      >
        <img 
          src={backgrounds[variant]} 
          alt="Mystic Background" 
          className="mystic-bg-image"
        />
        <div className="mystic-bg-overlay" />
      </motion.div>

      {/* Nebula Effect Layer */}
      <div className="mystic-background-layer nebula-layer">
        <div className="nebula nebula-1" />
        <div className="nebula nebula-2" />
        <div className="nebula nebula-3" />
      </div>

      {/* Floating Stars Layer */}
      <motion.div
        className="mystic-background-layer stars-layer"
        animate={{
          x: mousePosition.x * parallaxIntensity * 1.5,
          y: mousePosition.y * parallaxIntensity * 1.5,
        }}
        transition={{ type: 'spring', stiffness: 30, damping: 15 }}
      >
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="floating-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + star.speed * 2,
              repeat: Infinity,
              delay: star.twinkleDelay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      {/* Cosmic Dust Particles */}
      <div className="mystic-background-layer cosmic-dust-layer">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            className="cosmic-dust"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Light Rays Effect */}
      <motion.div
        className="mystic-background-layer light-rays-layer"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="light-ray light-ray-1" />
        <div className="light-ray light-ray-2" />
        <div className="light-ray light-ray-3" />
      </motion.div>

      {/* Shooting Stars */}
      {intensity === 'high' && (
        <div className="mystic-background-layer shooting-stars-layer">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`shooting-${i}`}
              className="shooting-star"
              initial={{ x: -100, y: Math.random() * 50 }}
              animate={{
                x: ['-10%', '110%'],
                y: [
                  `${Math.random() * 50}%`,
                  `${Math.random() * 50 + 40}%`,
                ],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 8 + Math.random() * 5,
                repeatDelay: 10 + Math.random() * 10,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Magical Sparkles */}
      <div className="mystic-background-layer sparkles-layer">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="magical-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              repeatDelay: 3 + Math.random() * 5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
