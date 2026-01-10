import React, { useState } from "react";
import {
  getTarotData,
  getTodayReading,
} from "../../utils/tarotService";
import { QuestionCard } from "../components/QuestionCard";
import { Sparkles } from "lucide-react";
import backgroundImage from "@/assets/backgrounds/5.png";

interface HomeScreenProps {
  onSelectQuestion: (questionId: string) => void;
  onViewHistory: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

export function HomeScreen({
  onSelectQuestion,
  onViewHistory,
  onToggleTheme,
  isDarkMode,
}: HomeScreenProps) {
  const data = getTarotData();
  const todayReading = getTodayReading();

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      <div className="relative w-full max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-6 py-12">
        {/* Central focus overlay */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            backgroundColor: 'rgba(20, 18, 40, 0.55)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        />

        <div className="relative">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Sparkles className="w-8 h-8 text-tarot-purple" />
              <h1 
                className="text-[28px] md:text-[32px] font-semibold text-[#F5F4FA]"
                style={{
                  letterSpacing: '-0.01em',
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)',
                }}
              >
                우정 타로
              </h1>
              <Sparkles className="w-8 h-8 text-tarot-purple" />
            </div>
            <p className="text-white text-lg mt-3">
              친구 관계에 대한 부드러운 통찰을 받아보세요
            </p>
          </div>

          {/* Today's reading notice */}
          {todayReading && (
            <div className="mb-7 p-4 md:p-5 rounded-xl bg-tarot-purple/10 border border-tarot-purple/30 max-w-[640px] mx-auto">
              <p 
                className="text-center text-base md:text-lg text-[#D6D3E3] font-medium leading-relaxed" 
                style={{ fontFamily: 'var(--font-family-display)', lineHeight: '1.5' }}
              >
                ✨ 타로가 알려주는 것
                <br />
                우정의 현재 흐름과 가능성, 주목 할 징후와 변화의 신호, 앞으로 선택할수 있는 방향
              </p>
            </div>
          )}

          {/* Question selection */}
          <div className="space-y-5">
            <h2 
              className="text-lg md:text-xl font-semibold text-center mb-5 text-white"
              style={{
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              어떤 고민이 있나요?
            </h2>
            <div className="grid gap-4">
              {data.questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onClick={() => onSelectQuestion(question.id)}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-14 text-center text-sm text-white">
            <p>
              이 해석은 가능성 중 하나이며, 선택은 당신에게
              있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}