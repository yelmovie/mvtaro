'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RadioCard from '@/components/RadioCard';
import Button from '@/components/Button';
import questionsData from '@/data/questions.json';

export default function QuestionPage() {
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] = useState('');

  const handleSubmit = () => {
    if (!selectedQuestion) return;
    
    sessionStorage.setItem('selectedQuestion', selectedQuestion);
    router.push('/draw');
  };

  return (
    <div className="container-main py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">질문을 선택해주세요</h1>
          <p className="text-muted">
            지금 마음에 와닿는 질문을 하나 골라주세요
          </p>
        </div>

        <div className="space-y-6">
          {questionsData.map((category) => (
            <div key={category.category} className="space-y-3">
              <h2 className="text-sm font-bold text-gold uppercase tracking-wider">
                {category.categoryLabel}
              </h2>
              <div className="space-y-2">
                {category.questions.map((question, index) => (
                  <RadioCard
                    key={`${category.category}-${index}`}
                    id={`${category.category}-${index}`}
                    label={question}
                    checked={selectedQuestion === question}
                    onChange={() => setSelectedQuestion(question)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button
            size="large"
            disabled={!selectedQuestion}
            onClick={handleSubmit}
          >
            카드 뽑으러 가기
          </Button>
        </div>
      </div>
    </div>
  );
}
