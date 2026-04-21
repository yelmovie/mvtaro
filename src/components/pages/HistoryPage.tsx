import { useState, useEffect } from 'react';
import { Trash2, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { getHistory, deleteReading, type ReadingHistory } from '../../lib/storage';
import { getAllCards, formatReadingDate } from '../../lib/tarot-utils';
import questionsData from '../../data/questions.json';

export function HistoryPage() {
  const [history, setHistory] = useState<ReadingHistory[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('이 기록을 삭제하시겠습니까?')) {
      deleteReading(id);
      setHistory(getHistory());
    }
  };

  const getQuestionText = (questionId: string) => {
    const question = questionsData.questions.find((q) => q.id === questionId);
    return question?.text || '알 수 없는 질문';
  };

  const getCardInfo = (cardId: string) => {
    const cards = getAllCards();
    return cards.find((c) => c.id === cardId);
  };

  if (history.length === 0) {
    return (
      <div className="min-h-screen p-4 py-8 pb-24">
        <div className="max-w-2xl mx-auto">
          <h2 style={{
            fontSize: 'var(--text-display)',
            marginBottom: '2rem',
            textAlign: 'center',
            color: 'var(--tarot-text)'
          }}>
            리딩 기록
          </h2>

          <div className="text-center py-16">
            <div style={{
              fontSize: '3.75rem',
              marginBottom: '1rem',
              opacity: 0.3
            }}>📖</div>
            <p style={{
              fontSize: 'var(--text-body-lg)',
              color: 'var(--tarot-text-muted)',
              opacity: 0.6
            }}>
              아직 리딩 기록이 없습니다
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        <h2 style={{
          fontSize: 'var(--text-display)',
          marginBottom: '2rem',
          textAlign: 'center',
          color: 'var(--tarot-text)'
        }}>
          리딩 기록
        </h2>

        <div className="space-y-4">
          {history.map((reading) => (
            <div
              key={reading.id}
              className="glass-card"
              style={{
                padding: '1rem',
                borderRadius: '1rem'
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '0.75rem'
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: 'var(--text-body-lg)',
                    color: 'var(--tarot-text)',
                    lineHeight: 'var(--line-height-relaxed)',
                    marginBottom: '0.25rem'
                  }}>
                    {getQuestionText(reading.questionId)}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem',
                    opacity: 0.6,
                    color: 'var(--tarot-text-muted)'
                  }}>
                    <Calendar style={{ width: '0.75rem', height: '0.75rem' }} />
                    {formatReadingDate(new Date(reading.date))}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(reading.id)}
                  style={{
                    color: '#ef4444'
                  }}
                >
                  <Trash2 style={{ width: '1rem', height: '1rem' }} />
                </Button>
              </div>

              {/* Cards */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                overflowX: 'auto'
              }}>
                {reading.cards.map((cardData, index) => {
                  const card = getCardInfo(cardData.cardId);
                  if (!card) return null;
                  
                  return (
                    <div
                      key={index}
                      style={{
                        flexShrink: 0,
                        width: '4rem',
                        textAlign: 'center'
                      }}
                    >
                      <div 
                        style={{ 
                          fontSize: '1.875rem',
                          marginBottom: '0.25rem',
                          transform: cardData.isReversed ? 'rotate(180deg)' : 'none',
                        }}
                      >
                        {card.symbol}
                      </div>
                      <p style={{
                        fontSize: '0.75rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'var(--tarot-text-muted)'
                      }}>
                        {card.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
