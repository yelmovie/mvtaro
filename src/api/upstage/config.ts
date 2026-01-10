export const UPSTAGE_API_KEY = import.meta.env.VITE_UPSTAGE_API_KEY ?? '';

export const UPSTAGE_API_URL = 'https://api.upstage.ai/v1/chat/completions';
export const UPSTAGE_MODEL = 'solar-1-mini-chat';

export function isUpstageApiEnabled(): boolean {
  return UPSTAGE_API_KEY.length > 0;
}