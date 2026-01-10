'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { getReadings, deleteReading } from '@/lib/storage';

export default function JournalPage() {
  const router = useRouter();
  const [readings, setReadings] = useState([]);
  const [selectedReading, setSelectedReading] = useState(null);

  useEffect(() => {
    setReadings(getReadings());
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDelete = (id) => {
    if (confirm('이 기록을 삭제하시겠습니까?')) {
      deleteReading(id);
      setReadings(getReadings());
      setSelectedReading(null);
    }
  };

  if (selectedReading) {
    return (
      <div className="container-main py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelectedReading(null)}>
              ← 목록으로
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleDelete(selectedReading.id)}
              className="text-red-500 hover:text-red-600"
            >
              삭제
            </Button>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="text-sm text-muted">
              {formatDate(selectedReading.date)}
            </div>
            <h2 className="text-xl font-bold">"{selectedReading.question}"</h2>
          </div>

          <div className="space-y-4">
            {selectedReading.cards.map((card) => (
              <div key={card.id} className="glass-card p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{card.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold">{card.name}</h3>
                    <p className="text-sm text-muted">{card.subtitle}</p>
                  </div>
                </div>
                <p className="text-base">{card.coreMessage}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">리딩 기록</h1>
          <p className="text-muted">
            지금까지의 타로 리딩을 다시 살펴보세요
          </p>
        </div>

        {readings.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-4">
            <div className="text-5xl">📖</div>
            <p className="text-muted">아직 저장된 리딩이 없습니다</p>
            <Button onClick={() => router.push('/')}>
              첫 리딩 시작하기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {readings.map((reading) => (
              <button
                key={reading.id}
                onClick={() => setSelectedReading(reading)}
                className="w-full glass-card p-6 text-left hover:border-primary transition-colors duration-base"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="text-sm text-muted">
                      {formatDate(reading.date)}
                    </div>
                    <p className="text-base font-medium">
                      "{reading.question}"
                    </p>
                    <div className="flex gap-2">
                      {reading.cards.map((card) => (
                        <span key={card.id} className="text-2xl">
                          {card.icon}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-muted">→</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
