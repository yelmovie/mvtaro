'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import InterpretationCard from '@/components/InterpretationCard';
import Button from '@/components/Button';
import { saveReading } from '@/lib/storage';

export default function ResultsPage() {
  const router = useRouter();
  const [reading, setReading] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('currentReading');
    if (stored) {
      setReading(JSON.parse(stored));
    } else {
      router.push('/');
    }
  }, [router]);

  const handleSave = () => {
    if (reading) {
      saveReading(reading);
      setSaved(true);
      setTimeout(() => {
        router.push('/journal');
      }, 1500);
    }
  };

  const handleNewReading = () => {
    sessionStorage.removeItem('currentReading');
    sessionStorage.removeItem('selectedQuestion');
    router.push('/');
  };

  if (!reading) {
    return (
      <div className="container-main py-16 flex items-center justify-center">
        <p className="text-muted">리딩을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="container-main py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="text-4xl">✨</div>
          <h1 className="text-2xl font-bold">오늘의 우정 리딩</h1>
          <p className="text-base text-muted italic">
            "{reading.question}"
          </p>
        </div>

        <div className="space-y-6">
          {reading.cards.map((card, index) => (
            <InterpretationCard key={card.id} card={card} />
          ))}
        </div>

        <div className="glass-card p-6 bg-primary/10 border-2 border-primary">
          <h3 className="text-sm font-bold text-muted mb-2">기억 문장</h3>
          <p className="text-base font-medium">
            이 우정은 가능성으로 가득합니다. 
            단정하지 않고, 너그러운 마음으로 나아가세요. 
            모든 순간이 선택이고, 모든 선택이 소중합니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!saved ? (
            <>
              <Button size="large" onClick={handleSave}>
                기록에 저장하기
              </Button>
              <Button variant="secondary" size="large" onClick={handleNewReading}>
                새로운 리딩
              </Button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-primary font-medium">저장되었습니다! 기록 페이지로 이동합니다...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
