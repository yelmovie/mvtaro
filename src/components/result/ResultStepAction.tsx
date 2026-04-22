import { ArrowLeft, ArrowRight } from 'lucide-react';
import { RESULT_SCREEN_DISCLAIMER } from '../../data/result-screen-presets';
import {
  ACTION_STEP_META,
  FEEDBACK_BY_ACTION_TIER,
  ResultStepActionProps,
  SECTION_EMOJI,
  SoftParagraph
} from './result-step-types';

export function ResultStepAction({
  actionGuide,
  actionSteps,
  interactiveActionSet,
  selectedAction,
  onSelectAction,
  onPrev,
  onNext
}: ResultStepActionProps) {
  return (
    <div className="result-step-stage">
      <div className="result-step-stage__header">
        <h3 className="result-step-stage__title">
          {SECTION_EMOJI.goodAction} 지금 해보면 좋은 것
        </h3>
        <p className="result-step-stage__caption">
          한 번에 해결하려고 하기보다, 작은 방향부터 정해봐도 괜찮아요. 행동을 누르면 말하기 예시가 열려요.
        </p>
      </div>

      <article className="result-story-card action">
        <strong className="result-story-card__title">
          {SECTION_EMOJI.goodAction} 지금 관계를 풀어가는 방향
        </strong>
        <div className="result-story-card__body">
          <SoftParagraph text={actionGuide} layout="sentence" />
        </div>
      </article>

      <div className="action-guide-grid action-card-actions">
        {ACTION_STEP_META.map(({ key, heading, emoji }) => {
          const block = interactiveActionSet?.[key];
          const useRich = block && block.actions.length > 0;
          const isOpen = (t: string, i: number) => selectedAction?.tier === t && selectedAction.index === i;

          return (
            <div key={key} className="action-card-actions__column">
              <article className="action-guide-item action-guide-item--card action-guide-item--stack">
                <p className="action-guide-heading">
                  {emoji} {block?.label ?? heading}
                </p>
                {useRich ? (
                  <div className="action-btn-list">
                    {block.actions.map((item, idx) => (
                      <button
                        key={`${key}-${idx}-${item.text.slice(0, 8)}`}
                        type="button"
                        className={`action-inline-btn ${isOpen(key, idx) ? 'is-selected' : ''}`}
                        onClick={() => onSelectAction?.(key, idx)}
                      >
                        {item.text}
                      </button>
                    ))}
                  </div>
                ) : (
                  <ul className="action-guide-lines">
                    {(actionSteps[key] ?? []).map((line, idx) => (
                      <li key={`${key}-${idx}`} className="action-guide-lines__item">
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </article>

              {useRich && selectedAction?.tier === key && block.actions[selectedAction.index] && (
                <div className="speech-box speech-box--enter" role="region" aria-live="polite">
                  <p className="speech-box__title">말하기 예시</p>
                  <ul className="speech-box__lines">
                    {block.actions[selectedAction.index].scripts.map((line, si) => (
                      <li key={`speech-${key}-${selectedAction.index}-${si}`}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedAction && (
        <div className="result-feedback" role="status">
          <span className="result-feedback__emoji" aria-hidden>
            🌱
          </span>
          <p className="result-feedback__text">{FEEDBACK_BY_ACTION_TIER[selectedAction.tier]}</p>
        </div>
      )}

      <p className="result-coaching-safety">
        {RESULT_SCREEN_DISCLAIMER.split('\n').map((line, i) => (
          <span key={line}>
            {i > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </p>

      <div className="result-step-actions result-step-actions--between">
        <button
          type="button"
          className="result-followup-btn result-followup-btn-secondary"
          onClick={onPrev}
        >
          <ArrowLeft size={18} /> 이전 단계
        </button>
        <button
          type="button"
          className="result-followup-btn result-followup-btn-primary"
          onClick={onNext}
        >
          이렇게 말해볼까 <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
