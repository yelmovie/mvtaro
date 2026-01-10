import React from 'react';
import { Question } from '../../types/tarot';

interface QuestionCardProps {
  question: Question;
  onClick: () => void;
}

export function QuestionCard({ question, onClick }: QuestionCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-center py-4 px-6 rounded-xl bg-surface-glass/85 border border-surface-glass-border hover:bg-surface-glass hover:border-tarot-purple transition-all duration-300 group"
      style={{
        paddingTop: '14px',
        paddingBottom: '16px',
      }}
    >
      <h3 
        className="font-semibold mb-2 text-[#1A1A1A] text-base md:text-[17px] leading-[1.45]" 
        style={{ 
          fontFamily: 'var(--font-family-display)',
          lineHeight: '1.45',
        }}
      >
        {question.title}
      </h3>
      <p 
        className="text-[16px] text-gray-700 leading-[1.45]" 
        style={{ lineHeight: '1.45' }}
      >
        {question.description}
      </p>
    </button>
  );
}