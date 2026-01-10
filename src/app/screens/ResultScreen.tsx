import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { TarotCardFront } from "../components/TarotCardFront";
import { DrawnCard } from "../../types/tarot";
import {
  getCardById,
  getQuestionById,
  getSpreadTypeById,
  saveReading,
  generateId,
} from "../../utils/tarotService";
import { Home, Sparkles } from "lucide-react";
import backgroundImage from "@/assets/backgrounds/3.png";
import { debugTarotLog } from "@/utils/debugTarot";
import {
  mapQuestionIdToType,
  getTarotInterpretation,
} from "@/lib/getTarotInterpretation";
import {
  isUpstageApiEnabled,
  generateTarotInterpretation,
  type TarotInterpretationResponse,
} from "@/api/upstage";
import {
  getCachedInterpretation,
  setCachedInterpretation,
  createCacheKey,
} from "@/api/upstage/cache";

interface ResultScreenProps {
  questionId: string;
  drawnCards: DrawnCard[];
  onGoHome: () => void;
}

interface InterpretationData {
  core_message: string;
  helpful_hint: string;
  positive_actions: [string, string, string];
}

export function ResultScreen({
  questionId,
  drawnCards,
  onGoHome,
}: ResultScreenProps) {
  const [flippedCards, setFlippedCards] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [interpretations, setInterpretations] = useState<
    (InterpretationData | null)[]
  >([null, null, null]);
  const [loadingStates, setLoadingStates] = useState<boolean[]>([
    true,
    true,
    true,
  ]);

  const question = getQuestionById(questionId);
  const spreadType = getSpreadTypeById("three-card");
  const questionType = mapQuestionIdToType(questionId);

  const fallbackInterpretation: InterpretationData = {
    core_message: "이 카드 해석은 준비 중이에요.",
    helpful_hint: "조금만 기다리면 더 다양한 해석을 보여줄게요.",
    positive_actions: [
      "한 번 더 생각해보기",
      "친구에게 부드럽게 말하기",
      "어른에게 상담하기",
    ],
  };

  // Upstage API 또는 fallback으로 해석 가져오기
  useEffect(() => {
    const fetchInterpretations = async () => {
      const newInterpretations: (InterpretationData | null)[] = [
        null,
        null,
        null,
      ];
      const newLoadingStates = [true, true, true];

      for (let index = 0; index < drawnCards.length; index++) {
        const drawnCard = drawnCards[index];
        const card = getCardById(drawnCard.cardId);

        if (!card) {
          newInterpretations[index] = fallbackInterpretation;
          newLoadingStates[index] = false;
          continue;
        }

        const orientation = drawnCard.orientation || "upright";
        const position = spreadType?.positions[index];
        const cacheKey = createCacheKey(
          questionId,
          drawnCard.cardId,
          orientation,
          index
        );

        // 캐시 확인
        const cached = getCachedInterpretation(cacheKey);
        if (cached) {
          newInterpretations[index] = {
            core_message: cached.core_message,
            helpful_hint: cached.helpful_hint,
            positive_actions: cached.positive_actions,
          };
          newLoadingStates[index] = false;
          continue;
        }

        // Upstage API 시도
        if (isUpstageApiEnabled()) {
          try {
            const upstageResult = await generateTarotInterpretation(
              {
                cardId: drawnCard.cardId,
                cardName: card.name,
                cardNameEn: card.nameEn,
                orientation,
                questionId,
                questionTitle: question?.title || "",
                positionLabel: position?.label || "",
              },
              questionType
            );

            if (upstageResult) {
              const interpretation: InterpretationData = {
                core_message: upstageResult.core_message,
                helpful_hint: upstageResult.helpful_hint,
                positive_actions: upstageResult.positive_actions,
              };
              newInterpretations[index] = interpretation;
              setCachedInterpretation(cacheKey, upstageResult);
              newLoadingStates[index] = false;
              continue;
            }
          } catch (error) {
            console.warn(
              "[Upstage] Failed to generate interpretation, using fallback",
              { error, cardId: drawnCard.cardId, index }
            );
          }
        }

        // Fallback to local interpretation
        try {
          const localInterpretation = getTarotInterpretation(
            drawnCard.cardId,
            orientation,
            questionType
          );
          if (localInterpretation) {
            newInterpretations[index] = {
              core_message: localInterpretation.core_message,
              helpful_hint:
                localInterpretation.prediction ||
                fallbackInterpretation.helpful_hint,
              positive_actions: localInterpretation.positive_actions,
            };
          } else {
            newInterpretations[index] = fallbackInterpretation;
          }
        } catch (error) {
          console.warn(
            "[Non-blocking] Failed to get interpretation, using fallback",
            { error, cardId: drawnCard.cardId }
          );
          newInterpretations[index] = fallbackInterpretation;
        }

        newLoadingStates[index] = false;
      }

      setInterpretations(newInterpretations);
      setLoadingStates(newLoadingStates);
    };

    fetchInterpretations();
  }, [questionId, drawnCards, questionType]);

  debugTarotLog({
    screen: "ResultScreen",
    interpretationSource: isUpstageApiEnabled() ? "upstage_api" : "static_json",
    questionId,
    drawnCards: drawnCards?.map((c) => ({
      cardId: c.cardId,
      orientation: c.orientation,
      position: c.position,
    })),
  });

  const handleCardClick = (index: number) => {
    const newFlipped = [...flippedCards];
    newFlipped[index] = !newFlipped[index];
    setFlippedCards(newFlipped);
  };

  const handleSaveReading = () => {
    const reading = {
      id: generateId(),
      date: new Date().toISOString(),
      questionId,
      spreadType: "three-card",
      cards: drawnCards,
    };
    saveReading(reading);
    onGoHome();
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-tarot-purple" />
            <h1
              className="text-4xl md:text-5xl font-bold text-[#F5F4FA]"
              style={{
                textShadow: "0 2px 6px rgba(0,0,0,0.55)",
              }}
            >
              타로 해석
            </h1>
            <Sparkles className="w-6 h-6 text-tarot-purple" />
          </div>
          <p className="text-[#D6D3E3] text-base md:text-lg font-semibold mb-6">
            {question?.title}
          </p>
        </div>

        {/* Cards and Interpretations */}
        <div className="space-y-12 mb-12">
          {drawnCards.map((drawnCard, index) => {
            const card = getCardById(drawnCard.cardId);
            const position = spreadType?.positions[index];
            const cardInterpretation = card?.[drawnCard.orientation];

            if (!card || !cardInterpretation) return null;

            const interpretationData =
              interpretations[index] || fallbackInterpretation;
            const isLoading = loadingStates[index];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.3,
                  duration: 0.5,
                }}
                className="p-8 rounded-2xl bg-surface-glass/90 border border-surface-glass-border"
              >
                {/* Position label */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tarot-purple/10 border border-tarot-purple/30">
                    <span className="font-medium text-tarot-purple text-3xl">
                      {position?.label}
                    </span>
                    <span className="text-2xl text-muted-foreground">
                      · {position?.description}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-[320px_1fr] gap-8">
                  {/* Card */}
                  <div className="flex justify-center">
                    <motion.button
                      onClick={() => handleCardClick(index)}
                      className="w-full max-w-[320px] cursor-pointer"
                      style={{
                        boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        style={{
                          perspective: "1000px",
                        }}
                      >
                        <motion.div
                          animate={{
                            rotateY: flippedCards[index] ? 180 : 0,
                          }}
                          transition={{ duration: 0.6 }}
                          style={{
                            transformStyle: "preserve-3d",
                          }}
                        >
                          {flippedCards[index] ? (
                            <div
                              style={{
                                transform: "rotateY(180deg)",
                              }}
                            >
                              <TarotCardFront
                                card={card}
                                orientation={drawnCard.orientation}
                              />
                            </div>
                          ) : (
                            <div>
                              <TarotCardFront
                                card={card}
                                orientation={drawnCard.orientation}
                              />
                            </div>
                          )}
                        </motion.div>
                      </div>
                      <p
                        className="text-sm md:text-base text-[#D6D3E3] mt-2 text-center"
                        style={{
                          textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                        }}
                      >
                        카드를 클릭하여 뒤집기
                      </p>
                    </motion.button>
                  </div>

                  {/* Interpretation */}
                  <div className="space-y-7">
                    {isLoading ? (
                      <div className="mt-0">
                        <p className="text-[#D6D3E3] text-base">
                          해석을 준비 중이에요…
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Core Message */}
                        <div className="mt-0">
                          <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-[#F5F4FA] flex items-center gap-2">
                            <span>✦</span>
                            <span>핵심 메시지</span>
                          </h3>
                          <p
                            className="text-black text-2xl leading-relaxed"
                            style={{
                              lineHeight: "1.6",
                              fontFamily: "'Jua', sans-serif",
                            }}
                          >
                            {interpretationData.core_message}
                          </p>
                        </div>

                        {/* Helpful Hint */}
                        <div className="mt-7 md:mt-9">
                          <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-[#F5F4FA]">
                            지금 도움이 되는 힌트
                          </h4>
                          <p
                            className="text-black text-2xl leading-relaxed"
                            style={{
                              lineHeight: "1.6",
                              fontFamily: "'Jua', sans-serif",
                            }}
                          >
                            {interpretationData.helpful_hint}
                          </p>
                        </div>

                        {/* Positive Actions */}
                        <div className="mt-7 md:mt-9">
                          <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-[#F5F4FA]">
                            오늘 할 수 있는 작은 행동 3가지
                          </h4>
                          <ul className="space-y-2">
                            {interpretationData.positive_actions.map(
                              (action, i) => (
                                <li
                                  key={i}
                                  className="text-black flex gap-2 text-2xl"
                                  style={{
                                    lineHeight: "1.6",
                                    fontFamily: "'Jua', sans-serif",
                                  }}
                                >
                                  <span className="text-tarot-purple mt-1">
                                    •
                                  </span>
                                  <span>{action}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Warning */}
        <div className="mb-8 p-4 rounded-xl bg-muted/30 border border-border">
          <p className="text-center text-3xl text-pink-600">
            ⚠️ 이 해석은 가능성 중 하나이며, 선택은 당신에게 있습니다.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onGoHome}
            className="px-6 py-3 rounded-xl bg-surface-glass border border-surface-glass-border hover:border-tarot-purple transition-all flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>처음으로</span>
          </button>
        </div>
      </div>
    </div>
  );
}
