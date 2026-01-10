import Link from 'next/link';
import Button from '@/components/Button';

export default function Home() {
  return (
    <div className="container-main py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <div className="text-6xl">✨</div>
          <h1 className="text-4xl font-bold">우정 타로</h1>
          <p className="text-lg text-muted">
            오늘의 우정 리딩
          </p>
        </div>

        <div className="glass-card p-8 space-y-6">
          <p className="text-base leading-relaxed">
            친구 관계에 대한 부드러운 통찰을 받아보세요.
            <br />
            타로는 단정하지 않고, 가능성과 성찰을 함께 나눕니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/question">
              <Button size="large" className="w-full sm:w-auto">
                리딩 시작하기
              </Button>
            </Link>
            <Link href="/journal">
              <Button variant="secondary" size="large" className="w-full sm:w-auto">
                지난 기록 보기
              </Button>
            </Link>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-3">타로가 알려주는 것</h2>
          <div className="space-y-2 text-sm text-left">
            <div className="flex gap-2">
              <span className="text-primary">•</span>
              <span>우정의 현재 흐름과 가능성</span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary">•</span>
              <span>주목할 징후와 변화의 신호</span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary">•</span>
              <span>앞으로 선택할 수 있는 방향</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
