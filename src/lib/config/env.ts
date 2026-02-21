/**
 * Single Source of Truth for all environment variables.
 *
 * 우선순위:
 *   1. .env 파일 (VITE_ 변수 → import.meta.env, 빌드 타임 주입)
 *   2. EnvSetupModal이 저장한 localStorage '__dev_env__' (개발 전용)
 *   3. info.tsx fallback (Figma Make 자동생성 키)
 *
 * ⚠️ 모듈 최상위에서 값을 읽지 않습니다.
 *    getEnv() 호출 시점에 읽어야 localStorage 값이 반영됩니다.
 */

import { projectId as fallbackProjectId, publicAnonKey as fallbackAnonKey } from '@/utils/supabase/info';

const DEV_STORAGE_KEY = '__dev_env__';

function getDevStorage(): Record<string, string> {
  if (!import.meta.env.DEV) return {};
  try {
    const raw = localStorage.getItem(DEV_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** 단일 환경 변수를 해석합니다. 호출 시점에 읽으므로 localStorage 값이 반영됩니다. */
export function resolveVar(key: string, fallback = ''): string {
  // 1순위: Vite 빌드 타임 .env
  const fromVite = (import.meta.env as Record<string, string>)[key];
  if (fromVite) return fromVite;

  // 2순위: EnvSetupModal localStorage (개발 전용)
  if (import.meta.env.DEV) {
    const devVal = getDevStorage()[key];
    if (devVal) return devVal;
  }

  return fallback;
}

/** 앱 환경 변수 모음. 호출할 때마다 최신 값을 반환합니다. */
export function getEnv() {
  const supabaseUrl =
    resolveVar('VITE_SUPABASE_URL') ||
    `https://${fallbackProjectId}.supabase.co`;

  const supabaseAnonKey =
    resolveVar('VITE_SUPABASE_ANON_KEY') || fallbackAnonKey;

  return {
    supabaseUrl,
    supabaseAnonKey,
    paypalClientId:  resolveVar('VITE_PAYPAL_CLIENT_ID'),
    adsenseClientId: resolveVar('VITE_ADSENSE_CLIENT_ID'),
    /**
     * GPT API 키 (개발 전용 — 프론트엔드 직접 호출).
     * 프로덕션에서는 반드시 Supabase Edge Function을 통해 서버 측에서 사용하세요.
     * ENV 버튼 → VITE_OPENAI_API_KEY 에 입력하거나 .env 파일에 설정합니다.
     */
    openaiApiKey: resolveVar('VITE_OPENAI_API_KEY'),
  };
}

/** 하위 호환용 정적 스냅샷 (모듈 로드 시점 값). supabase/client.ts 에서 사용. */
export const env = getEnv();

/**
 * 미설정 필수 변수 경고를 개발 환경에서 1회만 출력합니다.
 * .env 또는 EnvSetupModal로 설정하면 사라집니다.
 */
let _warnedOnce = false;
export function warnMissingEnv(): void {
  if (!import.meta.env.DEV || _warnedOnce) return;
  const { supabaseUrl, supabaseAnonKey } = getEnv();
  const usingFallback =
    supabaseUrl === `https://${fallbackProjectId}.supabase.co` ||
    supabaseAnonKey === fallbackAnonKey;

  if (usingFallback) {
    console.info(
      '%c[ENV] Supabase fallback 키 사용 중\n' +
      '.env 파일 또는 우측 상단 [ENV] 버튼으로 직접 키를 입력하면 이 메시지가 사라집니다.',
      'color:#fbbf24;font-weight:bold'
    );
    _warnedOnce = true;
  }
}

/**
 * Supabase 연결 smoke test.
 * 브라우저 콘솔에서 window.__supabaseSmoke() 로 호출하거나
 * EnvSetupModal의 "연결 테스트" 버튼에서 호출합니다.
 */
export async function supabaseSmoke(
  overrideUrl?: string,
  overrideKey?: string,
): Promise<{ ok: boolean; message: string }> {
  const { supabaseUrl, supabaseAnonKey } = getEnv();
  const url = overrideUrl || supabaseUrl;
  const key = overrideKey || supabaseAnonKey;

  if (!url || !key) {
    return { ok: false, message: 'URL 또는 ANON_KEY 미설정' };
  }
  try {
    const res = await fetch(`${url}/rest/v1/`, { headers: { apikey: key } });
    if (res.ok) {
      console.info('[Supabase Smoke] ✅ 연결 성공');
      return { ok: true, message: '연결 성공' };
    }
    const msg = `응답 ${res.status} ${res.statusText}`;
    console.warn('[Supabase Smoke] ⚠️', msg);
    return { ok: false, message: msg };
  } catch (e) {
    const msg = String(e);
    console.error('[Supabase Smoke] ❌', msg);
    return { ok: false, message: msg };
  }
}

if (import.meta.env.DEV) {
  (window as any).__supabaseSmoke = () => supabaseSmoke();
}
