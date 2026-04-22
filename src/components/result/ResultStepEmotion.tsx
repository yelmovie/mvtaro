import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ResultStepEmotionProps, SoftParagraph } from './result-step-types';

export function ResultStepEmotion({ emotionInsight, friendPerspective, onPrev, onNext }: ResultStepEmotionProps) {
  return (
    <div className="result-step-stage">
      <div className="result-step-stage__header">
        <h3 className="result-step-stage__title">오늘의 마음 코칭</h3>
        <p className="result-step-stage__caption">
          카드가 전하는 마음의 흐름을 천천히 살펴보세요.
        </p>
      </div>

      <div className="result-story-grid">
        <article className="result-story-card emotion">
          <strong className="result-story-card__title">
            💛 내가 왜 이렇게 느꼈을까
          </strong>
          <div className="result-story-card__body">
            <SoftParagraph text={emotionInsight} layout="sentence" />
          </div>
        </article>

        <article className="result-story-card friend">
          <strong className="result-story-card__title">
            🩵 친구는 어떻게 느꼈을까
          </strong>
          <div className="result-story-card__body">
            <SoftParagraph text={friendPerspective} layout="sentence" />
          </div>
        </article>
      </div>

      <div className="result-step-actions result-step-actions--between">
        <button
          type="button"
          className="result-followup-btn result-followup-btn-secondary"
          onClick={onPrev}
        >
          <ArrowLeft size={18} /> 처음으로
        </button>
        <button
          type="button"
          className="result-followup-btn result-followup-btn-primary"
          onClick={onNext}
        >
          다음으로 넘어가기 <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
