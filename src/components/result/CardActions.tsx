import { useState } from 'react';

/** 단일 티어·단일 목록용 — 행동 + 말하기 2개 (다른 화면에서 재사용) */
export interface CardActionItem {
  text: string;
  scripts: readonly string[];
}

interface CardActionsProps {
  actions: readonly CardActionItem[];
  className?: string;
}

/**
 * 행동 카드를 세로로 쌓고, 클릭 시 말하기 박스 표시 (모바일 스택 UX)
 */
export function CardActions({ actions, className }: CardActionsProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className={className ?? 'card-actions-stack'}>
      {actions.map((a, i) => {
        const open = selectedIndex === i;
        return (
          <div
            key={`${a.text}-${i}`}
            className="action-card"
            role="button"
            tabIndex={0}
            onClick={() => setSelectedIndex((prev) => (prev === i ? null : i))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev === i ? null : i));
              }
            }}
          >
            <p className="action-card__text">{a.text}</p>

            {open && (
              <div className="speech-box speech-box--enter" role="region" aria-live="polite">
                <p className="speech-box__title">말하기 예시</p>
                <ul className="speech-box__lines">
                  {a.scripts.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
