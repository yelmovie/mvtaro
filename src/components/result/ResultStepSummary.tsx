import { ArrowLeft } from 'lucide-react';
import { RESULT_SCREEN_DISCLAIMER } from '../../data/result-screen-presets';
import { ResultStepSummaryProps, SECTION_EMOJI } from './result-step-types';

export function ResultStepSummary({
  dialogues,
  todaySmallAction,
  todayMindSummary,
  teacherTip,
  followupGuideText,
  behaviorFeedback,
  onPrev,
  onTryDifferentMethod,
  onTryTomorrow
}: ResultStepSummaryProps) {
  return (
    <div className="result-step-stage">
      <div className="result-step-stage__header">
        <h3 className="result-step-stage__title">이렇게 말해볼까 {SECTION_EMOJI.dialogue}</h3>
        <p className="result-step-stage__caption">
          말해보기 예시를 보고, 오늘 해볼 한 걸음과 내 마음 한 줄까지 차근차근 정리해봐요.
        </p>
      </div>

      {behaviorFeedback && (
        <div className="result-feedback result-feedback--in-summary" role="status">
          <span className="result-feedback__emoji" aria-hidden>
            🌱
          </span>
          <p className="result-feedback__text">{behaviorFeedback}</p>
        </div>
      )}

      <div className="result-final-grid">
        <div className="result-final-card result-final-card--dialogue">
          <strong className="result-final-card__title">
            {SECTION_EMOJI.dialogue} 말하기 예시
          </strong>
          <div className="result-dialogue-list">
            {dialogues.map((dlg, i) => (
              <p key={i} className="result-dialogue-bubble">
                “{dlg}”
              </p>
            ))}
          </div>
        </div>

        <div className="result-final-card result-final-card--action">
          <strong className="result-final-card__title">
            {SECTION_EMOJI.todayAction} 오늘 해볼 작은 행동
          </strong>
          <p className="result-final-card__emphasis">{todaySmallAction}</p>
        </div>

        <div className="result-final-card result-final-card--summary">
          <strong className="result-final-card__title">
            {SECTION_EMOJI.mindSummary} 오늘 마음 한 줄 정리
          </strong>
          <p className="result-final-card__emphasis">{todayMindSummary}</p>
        </div>

        <div className="result-final-card result-final-card--choice">
          <strong className="result-final-card__title">
            {SECTION_EMOJI.choice} 선택의 여지
          </strong>
          <p className="result-final-card__body">
            모든 문장은 참고일 뿐이고, 마음 편한 속도가 정답에 가까워요.
          </p>
        </div>

        <p className="result-coaching-safety result-coaching-safety--muted">
          {RESULT_SCREEN_DISCLAIMER.split('\n').map((line, i) => (
            <span key={line}>
              {i > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </p>

        {teacherTip && (
          <div className="result-final-card result-final-card--teacher">
            <strong className="result-final-card__title">
              {SECTION_EMOJI.teacher} 교사용 지도 팁
            </strong>
            <p className="result-final-card__body">{teacherTip}</p>
          </div>
        )}
      </div>

      <div className="result-step-actions result-step-actions--between">
        <button
          type="button"
          className="result-followup-btn result-followup-btn-secondary"
          onClick={onPrev}
        >
          <ArrowLeft size={18} /> 이전 단계
        </button>

        <div className="result-followup-buttons result-followup-buttons--final">
          <button
            type="button"
            className="result-followup-btn result-followup-btn-primary"
            onClick={onTryDifferentMethod}
          >
            다른 방법도 보기
          </button>
          <button
            type="button"
            className="result-followup-btn result-followup-btn-secondary"
            onClick={onTryTomorrow}
          >
            내일 다시 해보기
          </button>
        </div>
      </div>

      {followupGuideText && (
        <div className="result-followup-panel">
          <p className="result-followup-feedback" style={{ marginTop: 0 }}>
            {followupGuideText}
          </p>
        </div>
      )}

      <p className="result-followup-note result-followup-note--final">
        오늘은 여기까지 생각해보고, 내일 다시 해봐도 괜찮아요.
      </p>
    </div>
  );
}
