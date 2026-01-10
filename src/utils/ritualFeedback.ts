/**
 * 의식(ritual) 피드백 유틸리티
 * 카드 선택 시 사운드 및 진동 효과 제공
 */

// 상수
// Vite에서는 public 폴더가 루트로 제공됨
export const SFX_URL = '/assets/sfx/chime-soft.mp3';
export const SFX_VOLUME = 0.25; // 0.2~0.35 범위
export const VIBRATE_PATTERN: number | number[] = 12; // 짧은 진동

// 오디오 객체 (싱글톤)
let audioInstance: HTMLAudioElement | null = null;

/**
 * 오디오 객체 초기화 (preload)
 */
export function initRitualAudio(): HTMLAudioElement | null {
  if (audioInstance) {
    return audioInstance;
  }

  try {
    audioInstance = new Audio(SFX_URL);
    audioInstance.volume = SFX_VOLUME;
    audioInstance.preload = 'auto';
    return audioInstance;
  } catch (error) {
    console.warn('[RitualFeedback] Failed to initialize audio:', error);
    return null;
  }
}

/**
 * 카드 선택 효과음 재생
 */
export function playCardPickSfx(): void {
  const audio = initRitualAudio();
  if (!audio) {
    return;
  }

  try {
    audio.currentTime = 0;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // 자동재생 제한 등으로 실패해도 에러 없이 진행
        console.warn('[RitualFeedback] Audio play failed (user interaction may be required):', error);
      });
    }
  } catch (error) {
    console.warn('[RitualFeedback] Failed to play audio:', error);
  }
}

/**
 * 카드 선택 진동 효과
 * navigator.vibrate 지원 시에만 실행
 */
export function vibratePick(): void {
  if (typeof navigator === 'undefined' || !navigator.vibrate) {
    // 지원하지 않는 환경에서는 아무것도 하지 않음
    return;
  }

  try {
    navigator.vibrate(VIBRATE_PATTERN);
  } catch (error) {
    console.warn('[RitualFeedback] Vibration failed:', error);
  }
}

/**
 * 카드 선택 피드백 통합 함수
 * 사운드와 진동을 함께 실행
 */
export function triggerCardPickFeedback(): void {
  playCardPickSfx();
  vibratePick();
}
