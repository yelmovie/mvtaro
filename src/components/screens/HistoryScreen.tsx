import { ArrowLeft, Clock, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { MysticBackground } from '../MysticBackground';
import { motion } from 'motion/react';
import { tarotCardsData } from '../../data/tarot-cards';

interface HistoryScreenProps {
  onBack: () => void;
  userProfile: {
    name?: string;
  } | null;
}

// Mock history data
const generateMockHistory = () => {
  const questions = [
    '친구와 갈등이 있어요',
    '친구와 거리가 생긴 것 같아요',
    '새로운 친구와 친해지고 싶어요',
    '친구의 마음을 알고 싶어요',
    '우리 관계를 더 좋게 만들고 싶어요'
  ];

  const history = [];
  const today = new Date();

  for (let i = 0; i < 8; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i * 3);
    
    const randomCards = [];
    for (let j = 0; j < 3; j++) {
      const randomCard = tarotCardsData.cards[Math.floor(Math.random() * tarotCardsData.cards.length)];
      randomCards.push(randomCard);
    }

    history.push({
      id: `reading-${i}`,
      question: questions[Math.floor(Math.random() * questions.length)],
      date: date,
      cards: randomCards,
      summary: '과거-현재-미래의 흐름을 통해 관계의 발전 가능성을 확인했습니다.'
    });
  }

  return history;
};

export function HistoryScreen({ onBack, userProfile }: HistoryScreenProps) {
  const history = generateMockHistory();

  // Group by month
  const groupedHistory = history.reduce((acc: any, item) => {
    const monthKey = item.date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen relative">
      <MysticBackground variant="moonlight-nature" intensity="medium" />

      <div className="relative z-10 py-8 px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button className="back-button mb-6" onClick={onBack}>
            <ArrowLeft size={20} />
            돌아가기
          </button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div style={{
              fontSize: '2rem',
              marginBottom: '1rem',
              filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.5))'
            }}>
              🕐
            </div>
            <h1 className="text-2xl font-semibold mb-2 text-primary">
              타로 히스토리
            </h1>
            <p className="text-sm text-secondary">
              {userProfile?.name || '당신'}의 타로 리딩 기록
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}
          >
            <div className="glass-card" style={{
              padding: '1.25rem',
              borderRadius: '1rem',
              textAlign: 'center'
            }}>
              <Clock size={28} color="var(--primary-purple)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>전체 리딩</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {history.length}회
              </p>
            </div>

            <div className="glass-card" style={{
              padding: '1.25rem',
              borderRadius: '1rem',
              textAlign: 'center'
            }}>
              <TrendingUp size={28} color="var(--primary-gold)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>이번 달</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {Math.floor(history.length / 2)}회
              </p>
            </div>

            <div className="glass-card" style={{
              padding: '1.25rem',
              borderRadius: '1rem',
              textAlign: 'center'
            }}>
              <BarChart3 size={28} color="var(--primary-pink)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>인기 주제</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                관계 개선
              </p>
            </div>
          </motion.div>

          {/* History List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {Object.entries(groupedHistory).map(([month, items]: [string, any], monthIndex) => (
              <div key={month} style={{ marginBottom: '2rem' }}>
                {/* Month Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  paddingLeft: '0.5rem'
                }}>
                  <Calendar size={18} color="var(--primary-gold)" />
                  <h2 style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)'
                  }}>
                    {month}
                  </h2>
                  <div style={{
                    flex: 1,
                    height: '1px',
                    background: 'var(--surface-border)'
                  }} />
                </div>

                {/* History Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {items.map((item: any, index: number) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: monthIndex * 0.1 + index * 0.05 }}
                      className="glass-card cursor-pointer"
                      style={{
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary-purple)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--surface-border)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                      onClick={() => alert('상세 내용 보기 기능은 곧 제공됩니다!')}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            marginBottom: '0.5rem'
                          }}>
                            {item.question}
                          </h3>
                          <p style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)'
                          }}>
                            {item.summary}
                          </p>
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          marginLeft: '1rem'
                        }}>
                          {item.date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>

                      {/* Card Preview */}
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--surface-border)'
                      }}>
                        {item.cards.map((card: any, cardIndex: number) => (
                          <div
                            key={cardIndex}
                            style={{
                              flex: 1,
                              padding: '0.75rem 0.5rem',
                              background: 'rgba(107, 70, 193, 0.1)',
                              borderRadius: '0.5rem',
                              textAlign: 'center',
                              border: '1px solid rgba(107, 70, 193, 0.2)'
                            }}
                          >
                            <div style={{
                              fontSize: '1.25rem',
                              marginBottom: '0.25rem'
                            }}>
                              {cardIndex === 0 ? '⏪' : cardIndex === 1 ? '⏺️' : '⏩'}
                            </div>
                            <p style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-primary)',
                              fontWeight: 500,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {card.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Empty State or Load More */}
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            marginTop: '1rem'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✨</div>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
              fontStyle: 'italic'
            }}>
              타로는 과거를 기억하고, 현재를 이해하며, 미래를 안내합니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
