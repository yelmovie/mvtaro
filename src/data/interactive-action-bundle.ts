/**
 * 행동 DB + 말하기 스크립트를 묶어 인터랙티브 결과용 패키지 생성
 * — behaviorDB(규칙 확장 200줄) + 감정 말투 + 강도 + generateScripts(toSpeech)
 */

import type { EmotionIntensity } from './coaching-engine-v2-data';
import { pickNineBehaviorLines, type BehaviorSuitKey } from './coaching-complete-data';
import {
  applyEmotionToneToAction,
  applyIntensityFromEmotion,
  applyIntensityToActionLine,
  generateScripts
} from './behavior-expand-engine';
import { normalizeSuitForActions, type SuitKey } from './action-step-matrix';

export type ActionTierKey = 'easy' | 'medium' | 'hard';

export interface ActionWithScriptsRow {
  text: string;
  scripts: string[];
}

export interface TierActionBlockResolved {
  label: string;
  actions: ActionWithScriptsRow[];
}

export type CoachingInteractiveActionSetResolved = Record<ActionTierKey, TierActionBlockResolved>;

/** 메이저 등은 행동 풀을 완드로 통일 */
function toBehaviorSuitKey(suit: string): BehaviorSuitKey {
  const n = normalizeSuitForActions(suit) as SuitKey;
  if (n === 'cups' || n === 'swords' || n === 'wands' || n === 'pentacles') return n;
  return 'wands';
}

export function buildInteractiveActionBundle(opts: {
  suit: string;
  emotionKey: string;
  intensity: EmotionIntensity;
  seed: number;
  tierLabels: Record<ActionTierKey, string>;
}): {
  interactive: CoachingInteractiveActionSetResolved;
  actionSteps: Record<ActionTierKey, string[]>;
} {
  const suitKey = toBehaviorSuitKey(opts.suit);
  const seedMix =
    opts.intensity === 'weak' ? 0 : opts.intensity === 'strong' ? 97 : 41;
  const bundles = pickNineBehaviorLines(suitKey, opts.intensity, opts.seed + seedMix);

  const tiers: ActionTierKey[] = ['easy', 'medium', 'hard'];
  const interactive = {} as CoachingInteractiveActionSetResolved;
  const actionSteps = {} as Record<ActionTierKey, string[]>;

  for (const tk of tiers) {
    const texts = bundles[tk];
    const actions: ActionWithScriptsRow[] = texts.map((poolLine, lineIdx) => {
      const salt = opts.seed + lineIdx * 53 + tk.charCodeAt(0);
      const toned = applyEmotionToneToAction(poolLine, opts.emotionKey, salt);
      const displayText = applyIntensityToActionLine(toned, opts.intensity);

      const [u, v] = generateScripts(poolLine);
      const scripts = [
        applyIntensityFromEmotion(u, opts.intensity),
        applyIntensityFromEmotion(v, opts.intensity)
      ];

      return {
        text: displayText,
        scripts
      };
    });

    interactive[tk] = {
      label: opts.tierLabels[tk],
      actions
    };

    actionSteps[tk] = actions.map((x) => x.text);
  }

  return { interactive, actionSteps };
}
