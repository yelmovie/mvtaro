import { Button } from '../ui/button';

interface HomePageProps {
  onStart: () => void;
}

export function HomePage({ onStart }: HomePageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center space-y-8">
        {/* Logo / Title */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div style={{
              width: '6rem',
              height: '6rem',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              backgroundColor: 'var(--tarot-purple-glow)',
              color: 'var(--tarot-purple-main)'
            }}>
              ✨
            </div>
          </div>
          
          <h1 style={{
            fontSize: 'var(--text-hero)',
            color: 'var(--tarot-text)',
            letterSpacing: '-0.025em'
          }}>
            우정 타로
          </h1>
          
          <p style={{
            fontSize: 'var(--text-body-lg)',
            color: 'var(--tarot-text-muted)',
            lineHeight: 'var(--line-height-relaxed)',
            opacity: 0.8
          }}>
            친구관계의 흐름을 읽고<br />
            긍정적인 방향을 찾아보세요
          </p>
        </div>

        {/* Start Button */}
        <div className="space-y-4">
          <Button
            onClick={onStart}
            style={{
              width: '100%',
              height: '3.5rem',
              fontSize: '1.125rem',
              borderRadius: '1rem',
              transition: 'all 150ms',
              backgroundColor: 'var(--tarot-purple-main)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            className="hover:scale-105"
          >
            오늘의 리딩 시작하기
          </Button>
          
          <p style={{
            fontSize: '0.875rem',
            opacity: 0.6,
            color: 'var(--tarot-text-muted)'
          }}>
            3장의 카드로 과거, 현재, 미래를 읽어드립니다
          </p>
        </div>

        {/* Decorative elements */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          paddingTop: '2rem',
          opacity: 0.4
        }}>
          <span style={{ color: 'var(--tarot-purple-main)' }}>✦</span>
          <span style={{ color: 'var(--tarot-purple-main)' }}>✦</span>
          <span style={{ color: 'var(--tarot-purple-main)' }}>✦</span>
        </div>
      </div>
    </div>
  );
}
