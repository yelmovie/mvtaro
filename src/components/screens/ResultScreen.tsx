import { getCoachingCard } from '../../data/coaching-cards';
import { motion } from 'motion/react';
import { ExternalLink, RefreshCw, MessageCircle, Lightbulb, Heart } from 'lucide-react';
// @ts-ignore
import bearImg from '../../assets/bear.png';
// @ts-ignore
import cardImg1 from '../../assets/card1.png';
// @ts-ignore
import cardImg2 from '../../assets/card2.png';
// @ts-ignore
import cardImg3 from '../../assets/card3.png';

interface ResultScreenProps {
  questionTitle: string;
  mood: { icon: string; label: string };
  cardIds: string[];
  onBack: () => void;
  onNavigateToGuide?: (cardId: string) => void;
}

interface CoachingInterpretation {
  empathy: string;
  situation: string;
  actions: string[];
  dialogues: string[];
  cheer: string;
}

interface CardData {
  id: string;
  name: string;
  symbol?: string;
  interpretation?: CoachingInterpretation;
  loading?: boolean;
}

const CARD_POSITIONS = [
  { label: '나의 속마음', subtitle: '내가 느끼는 진짜 감정', color: '#10B981', icon: Heart }, // Green
  { label: '친구의 입장 상상', subtitle: '친구는 어떤 마음일까?', color: '#3B82F6', icon: MessageCircle }, // Blue
  { label: '추천하는 행동', subtitle: '이렇게 해보면 어떨까?', color: '#8B5CF6', icon: Lightbulb } // Purple
];

export function ResultScreen({ questionTitle, mood, cardIds, onBack, onNavigateToGuide }: ResultScreenProps) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  useEffect(() => {
    const initializeCards = async () => {
      const initialCards = cardIds.map((id: string) => {
        return {
          id: id,
          name: "...", 
          loading: true,
        };
      }) as CardData[];

      setCards(initialCards);

      setTimeout(() => {
        setCards(prevCards => 
          prevCards.map(c => {
            const staticCardData = getCoachingCard(c.id, "마음 카드");
            return {
              ...c,
              name: staticCardData.name,
              loading: false,
              interpretation: {
                ...staticCardData.coaching
              }
            };
          })
        );
      }, 1500);
    };

    initializeCards();
  }, [cardIds]);

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Background Image */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0
      }}>
        <img 
          src={resultBgImg} 
          alt="background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.7)', // Darken background slightly to match UI mockup
          backdropFilter: 'blur(10px)'
        }} />
      </div>

      {/* Content wrapper */}
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

        {/* Top Header Row (Mimicking sidebar header but placed top) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.6))' }}>✨</span>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              color: '#fff',
              letterSpacing: '0.05em',
              margin: 0
            }}>
              마음 코칭 카드
              <span style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', fontWeight: 'normal', marginTop: '0.25rem' }}>
                카드의 지혜로 내 마음을 들여다봐요
              </span>
            </h1>
          </div>
          
          <button
            onClick={onBack}
            className="glass-card cosmic-glow"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              background: 'rgba(245, 158, 11, 0.1)',
              color: 'var(--primary-gold)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s'
            }}
          >
            <RefreshCw size={18} /> 처음으로
          </button>
        </div>

        {/* Title Section */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            color: 'var(--primary-gold)',
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            ✨ 3장의 카드가 전하는 오늘의 마음 코칭 ✨
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            각 카드의 내용을 천천히 읽어보세요. ({mood.icon} {mood.label} 기분)
          </p>
        </div>

        {/* 3 Column Horizontal Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
          flex: 1
        }}>
          {cards.map((card: CardData, index: number) => {
            const pos = CARD_POSITIONS[index];
            const isLoaded = !card.loading && card.interpretation;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}
              >
                {/* 1. Card Image Region */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `2px solid ${pos.color}40`,
                  borderRadius: '1.5rem',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: `0 10px 40px ${pos.color}15`,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Decorative background glow */}
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: `radial-gradient(circle at center, ${pos.color}20 0%, transparent 50%)`,
                    pointerEvents: 'none'
                  }} />

                  {/* Header Badge */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginBottom: '1.5rem',
                    zIndex: 1
                  }}>
                    <div style={{
                      background: pos.color,
                      color: '#fff',
                      padding: '0.25rem 1rem',
                      borderRadius: '1rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '1.125rem'
                    }}>
                      <span style={{ 
                        background: 'rgba(255,255,255,0.2)', 
                        width: '24px', 
                        height: '24px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        borderRadius: '50%',
                        fontSize: '0.875rem'
                      }}>{index + 1}</span>
                      {pos.label}
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{pos.subtitle}</span>
                  </div>

                  {/* Card Placeholder (Assuming generic style since images aren't generated yet) */}
                  <div style={{
                    width: '100%',
                    aspectRatio: '3/4',
                    background: `linear-gradient(135deg, ${pos.color}20 0%, transparent 100%)`,
                    border: `1px solid ${pos.color}50`,
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
                    {card.loading ? (
                      <div className="animate-pulse flex flex-col items-center">
                        <span style={{ fontSize: '3rem' }}>✨</span>
                        <p style={{ color: pos.color, marginTop: '1rem' }}>카드 확인중...</p>
                      </div>
                    ) : (
                      <>
                        <img 
                          src={index === 0 ? cardImg1 : index === 1 ? cardImg2 : cardImg3}
                          alt={pos.label}
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
                          {/* We only show the title here since the image covers the card */}
                          <h3 style={{ 
                            fontWeight: 700, 
                            color: '#fff',
                            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                          }}>{card.name}</h3>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {isLoaded && (
                    <p style={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      textAlign: 'center',
                      zIndex: 1,
                      margin: 0
                    }}>
                      {/* Short summary slice from empathy or situation */}
                      {card.interpretation!.empathy.split('.')[0]}.
                    </p>
                  )}
                </div>

                {/* 2. Detailed Breakdown Region */}
                {isLoaded && (
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderTop: `4px solid ${pos.color}80`,
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }}>
                    {/* Role specific content layout depending on the column index */}
                    
                    {/* COLUMN 1: My Mind */}
                    {index === 0 && (
                      <>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <Heart size={20} color={pos.color} />
                            <h4 style={{ color: pos.color, fontWeight: 700, margin: 0 }}>나의 속마음</h4>
                          </div>
                          <p style={{ color: '#fff', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                            {card.interpretation!.empathy}
                          </p>
                        </div>
                        <div style={{
                          background: `${pos.color}15`,
                          padding: '1rem',
                          borderRadius: '0.75rem',
                          marginTop: 'auto'
                        }}>
                          <span style={{ display: 'block', fontSize: '0.875rem', color: pos.color, fontWeight: 700, marginBottom: '0.25rem' }}>✨ 마음 토닥 한마디</span>
                          <span style={{ color: '#fff', fontSize: '0.9375rem' }}>"{card.interpretation!.cheer}"</span>
                        </div>
                      </>
                    )}

                    {/* COLUMN 2: Friend Mind */}
                    {index === 1 && (
                      <>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <MessageCircle size={20} color={pos.color} />
                            <h4 style={{ color: pos.color, fontWeight: 700, margin: 0 }}>상황 및 친구의 입장</h4>
                          </div>
                          <p style={{ color: '#fff', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                            {card.interpretation!.situation}
                          </p>
                        </div>
                        <div style={{
                          background: `${pos.color}15`,
                          padding: '1rem',
                          borderRadius: '0.75rem',
                          marginTop: 'auto'
                        }}>
                          <span style={{ display: 'block', fontSize: '0.875rem', color: pos.color, fontWeight: 700, marginBottom: '0.5rem' }}>⭐ 한 걸음 더 생각해보기</span>
                          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#fff', fontSize: '0.9375rem' }}>
                            <li>친구가 그런 행동을 한 진짜 이유는 뭘까?</li>
                            <li>나의 기분만큼 친구도 속상했을까?</li>
                          </ul>
                        </div>
                      </>
                    )}

                    {/* COLUMN 3: Actions */}
                    {index === 2 && (
                      <>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <Lightbulb size={20} color={pos.color} />
                            <h4 style={{ color: pos.color, fontWeight: 700, margin: 0 }}>추천하는 행동</h4>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {card.interpretation!.actions.map((act, i) => (
                              <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'start' }}>
                                <span style={{ background: pos.color, color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0, marginTop: '0.125rem' }}>{i + 1}</span>
                                <span style={{ color: '#fff', fontSize: '0.9375rem', lineHeight: 1.5 }}>{act}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{
                          background: 'rgba(236, 72, 153, 0.15)', // Pinkish for dialogue
                          padding: '1rem',
                          borderRadius: '0.75rem',
                          border: '1px solid rgba(236, 72, 153, 0.3)',
                          marginTop: 'auto'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', color: '#EC4899', fontWeight: 700, marginBottom: '0.75rem' }}>
                            💬 이렇게 말해보세요!
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {card.interpretation!.dialogues.map((dlg, i) => (
                              <div key={i} style={{
                                background: 'rgba(255,255,255,0.9)',
                                color: '#1e293b',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                borderBottomLeftRadius: i === 0 ? '0.125rem' : '0.75rem', // Speech bubble effect
                                fontSize: '0.9375rem',
                                fontWeight: 500
                              }}>
                                "{dlg}"
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        
        {/* Mascot Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          padding: '1.5rem',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '1rem',
          color: 'rgba(255,255,255,0.9)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{
             width: '80px',
             height: '80px',
             background: 'rgba(255,255,255,0.1)',
             borderRadius: '50%',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             overflow: 'hidden',
             flexShrink: 0
          }}>
            <img 
              src={bearImg} 
              alt="마음 토닥 도우미" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 2.5rem;">🐻</span>';
              }}
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <strong style={{ display: 'block', fontSize: '1.125rem', marginBottom: '0.25rem', color: '#FCD34D' }}>💖 토닥 곰의 조언</strong>
            <span style={{ fontSize: '1rem', lineHeight: 1.6 }}>
              모든 관계는 서로의 마음을 이해하려는 작은 노력에서 시작돼요.<br/>
              네 마음을 믿고 천천히 해나가면 꼭 괜찮아질 거야!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
