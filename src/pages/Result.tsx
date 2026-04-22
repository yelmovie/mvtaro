import { useState, useEffect, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import resultBgImg from 'figma:asset/51d359264ccba0aca3f242b625c3fe3c3a660837.png';

import { useCardLogic } from '../hooks/useCardLogic';
import { CardItem } from '../components/cards/CardItem';
import { CoachCharacter } from '../components/coach/CoachCharacter';
import { ResultStepEmotion } from '../components/result/ResultStepEmotion';
import { ResultStepAction } from '../components/result/ResultStepAction';
import { ResultStepSummary } from '../components/result/ResultStepSummary';
import {
  FEEDBACK_BY_ACTION_TIER,
  normalizeActionSteps,
  ResultStep,
  type ActionStepKey
} from '../components/result/result-step-types';
import { DrawnCard } from '../types/app-types';
import { tarotCards78Data } from '../data/tarot-cards-78';
import {
  COACHING_TONE_MAP,
  FOLLOWUP_ENCOURAGEMENT_ROUND2,
  hashCoachingSeed,
  resolveNextRoundTarotId
} from '../data/coaching-registry';
import { BRAND_NAME, BRAND_TAGLINE } from '../constants/branding';

interface ResultProps {
  problemType: string;
  questionTitle: string;
  mood: { icon: string; label: string };
  selectedFeelingText: string;
  cards: DrawnCard[];
  onBack: () => void;
}

const POSITIONS = [
  { label: '내가 왜 이렇게 느꼈을까', subtitle: '나의 마음', color: 'var(--color-emotion)' },
  { label: '친구는 어떻게 느꼈을까', subtitle: '친구 쪽 생각', color: 'var(--color-friend)' },
  { label: '지금 해보면 좋은 것', subtitle: '해볼 방향', color: 'var(--color-action)' }
];

const EMOTION_KEY_MAP: Record<string, string> = {
  화남: 'angry',
  속상함: 'sad',
  불안함: 'anxious',
  답답함: 'frustrated'
};

const RESULT_STEPS: Array<{ id: ResultStep; label: string }> = [
  { id: 1, label: '감정 이해' },
  { id: 2, label: '해결 방향' },
  { id: 3, label: '행동 정리' }
];

export function Result({ problemType, questionTitle, mood, selectedFeelingText, cards, onBack }: ResultProps) {
  const { getCardResult, getDailyAction } = useCardLogic();
  const [isLoaded, setIsLoaded] = useState(false);
  const [alternativeRound, setAlternativeRound] = useState(0);
  const [followupGuideText, setFollowupGuideText] = useState('');
  const [currentStep, setCurrentStep] = useState<ResultStep>(1);
  const [selectedAction, setSelectedAction] = useState<{ tier: ActionStepKey; index: number } | null>(null);

  const emotionKey = EMOTION_KEY_MAP[mood.label] ?? 'sad';
  const safeFeelingText = selectedFeelingText.trim() || '마음이 조금 복잡해';
  const visibleCards = cards.slice(0, 3);

  const baseResults = visibleCards.map((card, index) =>
    getCardResult(problemType, emotionKey, safeFeelingText, card, index, 0)
  );
  const actionVariantResults = visibleCards.map((card, index) =>
    getCardResult(problemType, emotionKey, safeFeelingText, card, index, alternativeRound)
  );
  const finalResult = actionVariantResults[2];
  const todaySmallAction =
    finalResult?.todayAction ??
    getDailyAction(
      mood.label,
      safeFeelingText,
      actionVariantResults.flatMap((item) => item.actions),
      alternativeRound
    );
  const todayMindSummary =
    actionVariantResults.find((item) => item.oneLineSummary)?.oneLineSummary ??
    actionVariantResults.find((item) => item.mindSummary)?.mindSummary ??
    '나는 오늘 내 마음을 차분하게 말해보고 싶다';
  const actionSteps = normalizeActionSteps(finalResult?.actionSteps);
  const interactiveActionSet = finalResult?.interactiveActionSet ?? null;

  const behaviorFeedback =
    selectedAction != null ? FEEDBACK_BY_ACTION_TIER[selectedAction.tier] : undefined;

  useEffect(() => {
    setSelectedAction(null);
  }, [alternativeRound, safeFeelingText, mood.label, problemType]);

  const nextRoundPreview = useMemo(() => {
    if (!selectedAction) return null;
    const seed = hashCoachingSeed(
      `${problemType}-${emotionKey}-${visibleCards.map((c) => c.id).join('|')}-${selectedAction.tier}-${selectedAction.index}`
    );
    const id = resolveNextRoundTarotId({
      tier: selectedAction.tier,
      excludeIds: new Set(visibleCards.map((c) => c.id)),
      seed
    });
    return { id, seed };
  }, [selectedAction, problemType, emotionKey, visibleCards]);

  const nextRoundMeta = useMemo(() => {
    if (!nextRoundPreview) return null;
    const meta = tarotCards78Data.cards.find((c) => c.id === nextRoundPreview.id);
    if (!meta) return null;
    const suit = meta.suit;
    const toneLine =
      suit === 'cups'
        ? COACHING_TONE_MAP.cups
        : suit === 'swords'
          ? COACHING_TONE_MAP.swords
          : suit === 'wands'
            ? COACHING_TONE_MAP.wands
            : suit === 'pentacles'
              ? COACHING_TONE_MAP.pentacles
              : COACHING_TONE_MAP.major;
    return { meta, toneLine };
  }, [nextRoundPreview]);
  const safeDialogues =
    finalResult?.dialogues?.filter(Boolean) ?? ['우리 잠깐 이야기해볼래?', '내 마음을 차분하게 말해보고 싶어.'];
  const safeTeacherTip = finalResult?.teacherTip ?? '학생이 스스로 말문을 열려는 시도를 먼저 칭찬해 주세요.';
  const safeActionGuide =
    finalResult?.actionGuide ??
    '지금은 한 번에 다 해결하려고 하기보다, 작은 행동 하나를 골라 천천히 시작해보는 게 좋아.';

  const handleTryDifferentMethod = () => {
    setAlternativeRound((prev) => prev + 1);
    setCurrentStep(3);
    setFollowupGuideText('관계에는 여러 방법이 있어요. 지금 보여준 다른 방법 중에서 더 편한 걸 골라봐도 괜찮아요.');
  };

  const handleTryTomorrow = () => {
    setFollowupGuideText('내일은 또 다른 마음으로 천천히 해봐도 괜찮아요. 오늘 생각한 걸 가볍게 마음에 남겨 두어도 좋아요.');
    window.setTimeout(() => {
      onBack();
    }, 700);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const currentStepLabel = RESULT_STEPS.find((step) => step.id === currentStep)?.label ?? '감정 이해';

  if (visibleCards.length < 3) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'var(--color-bg)'
      }}>
        <div className="result-step-panel" style={{ width: 'min(100%, 36rem)' }}>
          <div className="result-step-stage">
            <div className="result-step-stage__header">
              <h1 className="result-step-stage__title">{BRAND_NAME}</h1>
              <p className="result-step-stage__caption">
                카드 정보를 다시 불러오는 중 문제가 생겼어요. 처음 화면으로 돌아가서 다시 뽑아보면 돼요.
              </p>
            </div>
            <button
              type="button"
              className="result-followup-btn result-followup-btn-primary"
              onClick={onBack}
            >
              <RefreshCw size={18} /> 처음으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img src={resultBgImg} alt="background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'var(--color-bg)', opacity: 0.8, backdropFilter: 'blur(10px)' }} />
      </div>

      <div style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem',
        maxWidth: '1120px',
        margin: '0 auto',
        width: '100%',
        gap: '1.75rem'
      }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>✨</span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>
              {BRAND_NAME}
              <span style={{ display: 'block', fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', fontWeight: 'normal', marginTop: '0.25rem' }}>
                {BRAND_TAGLINE}
              </span>
            </h1>
          </div>
          <button onClick={onBack} style={{
            padding: '0.75rem 1.4rem', borderRadius: '0.9rem', border: '1px solid rgba(245, 158, 11, 0.4)',
            background: 'rgba(245, 158, 11, 0.12)', color: 'var(--primary-gold)', fontSize: '1rem', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <RefreshCw size={18} /> 처음으로
          </button>
        </div>

        {/* 상단 요약 */}
        <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-gold)', fontWeight: 700, marginBottom: '0.5rem' }}>
            오늘의 마음 코칭
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
            고민: {questionTitle}
            <br />
            감정: {mood.label} · 내가 고른 마음: {safeFeelingText}
          </p>
        </div>

        <section className="result-step-overview">
          <div className="result-step-overview__title">
            <span className="result-step-overview__count">{currentStep} / 3</span>
            <strong>{currentStepLabel}</strong>
          </div>
          <div className="result-step-track" aria-label="단계 진행 표시">
            {RESULT_STEPS.map((step) => (
              <button
                key={step.id}
                type="button"
                className={`result-step-pill ${step.id === currentStep ? 'is-active' : ''} ${step.id < currentStep ? 'is-complete' : ''}`}
                onClick={() => setCurrentStep(step.id)}
              >
                {step.id} / 3 {step.label}
              </button>
            ))}
          </div>
        </section>

        {/* 3장의 카드 */}
        <div className="result-cards-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.1rem'
        }}>
          {baseResults.map((result, index) => {
            const pos = POSITIONS[index];
            const cardMeta = tarotCards78Data.cards.find((c) => c.id === visibleCards[index].id);
            return (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.7rem',
                minWidth: 0
              }}>
                <CardItem
                  index={index}
                  label={pos.label}
                  subtitle={pos.subtitle}
                  cardId={visibleCards[index].id}
                  cardName={cardMeta?.name ?? visibleCards[index].id}
                  isReversed={visibleCards[index].isReversed}
                  color={pos.color}
                  isLoaded={isLoaded}
                  delay={index * 0.2}
                />
                {isLoaded && (
                  <p style={{
                    margin: 0,
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.78)',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    minHeight: 66
                  }}>
                    {result.summary}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <section className="result-step-panel" key={`step-${currentStep}-${alternativeRound}`}>
          {currentStep === 1 && (
            <ResultStepEmotion
              emotionInsight={baseResults[0]?.emotionInsight ?? ''}
              friendPerspective={baseResults[1]?.friendPerspective ?? ''}
              onPrev={onBack}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <ResultStepAction
              actionGuide={safeActionGuide}
              actionSteps={actionSteps}
              interactiveActionSet={interactiveActionSet}
              selectedAction={selectedAction}
              onSelectAction={(tier, index) => setSelectedAction({ tier, index })}
              onPrev={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <ResultStepSummary
              dialogues={safeDialogues}
              todaySmallAction={todaySmallAction}
              todayMindSummary={todayMindSummary}
              teacherTip={safeTeacherTip}
              followupGuideText={followupGuideText}
              behaviorFeedback={behaviorFeedback}
              onPrev={() => setCurrentStep(2)}
              onTryDifferentMethod={handleTryDifferentMethod}
              onTryTomorrow={handleTryTomorrow}
            />
          )}
        </section>

        {currentStep === 2 && selectedAction && nextRoundPreview && nextRoundMeta?.meta && (
          <section className="coaching-round2" aria-label="행동 선택 이후 안내">
            <div className="coaching-round2__encourage">
              {FOLLOWUP_ENCOURAGEMENT_ROUND2.map((line, i) => (
                <p key={i} className="coaching-round2__line">
                  <span className="coaching-round2__sprout" aria-hidden>
                    🌱
                  </span>
                  {line}
                </p>
              ))}
            </div>
            <div className="coaching-round2__card-wrap coaching-round2__card-wrap--fadein">
              <p className="coaching-round2__heading">다음에 살펴보면 좋은 카드</p>
              <CardItem
                index={0}
                label="2회차 안내"
                subtitle="선택한 행동과 맞물리는 흐름"
                cardId={nextRoundPreview.id}
                cardName={nextRoundMeta.meta.name}
                isReversed={nextRoundPreview.seed % 4 === 0}
                color="var(--color-action)"
                isLoaded={isLoaded}
                delay={0}
              />
              <p className="coaching-round2__tone">{nextRoundMeta.toneLine}</p>
            </div>
          </section>
        )}

        {currentStep === 3 && (
          <CoachCharacter
            message={<>{baseResults[0]?.cheer ?? '모든 관계는 서로의 마음을 이해하려는 작은 노력에서 시작돼요.'}<br/>네 마음을 믿고 천천히 해나가면 꼭 괜찮아질 거야!</>}
          />
        )}
      </div>
    </div>
  );
}
