import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import questionsData from '../../data/questions.json';

interface Question {
  id: string;
  text: string;
  category: string;
}

interface QuestionSelectProps {
  onSelect: (questionId: string) => void;
  onBack: () => void;
}

export function QuestionSelect({ onSelect, onBack }: QuestionSelectProps) {
  const questions = questionsData.questions as Question[];

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            style={{
              marginBottom: '1rem',
              marginLeft: '-0.5rem',
              color: 'var(--tarot-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
            돌아가기
          </Button>
          
          <h2 style={{
            fontSize: 'var(--text-display)',
            marginBottom: '0.5rem',
            color: 'var(--tarot-text)'
          }}>
            어떤 고민이 있나요?
          </h2>
          <p style={{
            fontSize: 'var(--text-body-lg)',
            color: 'var(--tarot-text-muted)',
            lineHeight: 'var(--line-height-relaxed)',
            opacity: 0.7
          }}>
            마음에 드는 질문을 선택해주세요
          </p>
        </div>

        {/* Questions Grid */}
        <div className="space-y-3">
          {questions.map((question) => (
            <button
              key={question.id}
              onClick={() => onSelect(question.id)}
              className="glass-card hover:scale-[1.02] active:scale-[0.98]"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '1rem',
                textAlign: 'left',
                transition: 'all 150ms'
              }}
            >
              <p style={{
                fontSize: 'var(--text-body-lg)',
                color: 'var(--tarot-text)',
                lineHeight: 'var(--line-height-relaxed)',
                whiteSpace: 'pre-line'
              }}>
                {question.text}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
