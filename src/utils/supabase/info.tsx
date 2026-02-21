/**
 * Supabase 프로젝트 정보.
 *
 * 환경 변수(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)에서 값을 읽습니다.
 * .env.example 을 참고해 프로젝트 루트 .env 파일에 설정하세요.
 *
 * 아래 하드코딩 값은 Figma Make가 자동 생성한 fallback입니다.
 * 실제 환경에서는 반드시 .env 파일로 덮어써야 합니다.
 */

const VITE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const VITE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Figma Make 자동생성 fallback (개발 편의용, 프로덕션에서는 .env 로 덮어쓰세요)
const FALLBACK_PROJECT_ID  = 'tyvumqwadcsyrnpyndei';
const FALLBACK_ANON_KEY    = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dnVtcXdhZGNzeXJucHluZGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyODg4NzAsImV4cCI6MjA4Njg2NDg3MH0._xEV0-s-ld_dYGuuN0QOLIyEEybck6gm_9yFaOU2BKw';

/** Supabase 프로젝트 ID (URL에서 추출) */
export const projectId: string =
  VITE_URL
    ? (VITE_URL.split('//')[1]?.split('.')[0] ?? FALLBACK_PROJECT_ID)
    : FALLBACK_PROJECT_ID;

/** Supabase Anon (Public) Key */
export const publicAnonKey: string = VITE_KEY ?? FALLBACK_ANON_KEY;