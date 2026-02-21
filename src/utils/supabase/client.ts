/**
 * Supabase 클라이언트 싱글톤.
 *
 * 값 우선순위:
 *   1. .env → VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
 *   2. EnvSetupModal localStorage (개발 전용)
 *   3. info.tsx fallback (Figma Make 자동생성 키)
 *
 * fallback 키가 있으므로 .env 없이도 앱이 실행됩니다.
 * 자체 Supabase 프로젝트를 연결하려면 .env 또는 ENV 버튼으로 설정하세요.
 */

import { createClient } from '@supabase/supabase-js';
import { getEnv } from '@/lib/config/env';

declare global {
  var __supabaseClient: ReturnType<typeof createClient> | undefined;
}

function buildClient() {
  const { supabaseUrl, supabaseAnonKey } = getEnv();
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: `sb-${supabaseUrl.split('//')[1]?.split('.')[0] ?? 'app'}-auth-token`,
      flowType: 'pkce',
    },
  });
}

if (!globalThis.__supabaseClient) {
  globalThis.__supabaseClient = buildClient();
}

export const supabase = globalThis.__supabaseClient!;

export function getSupabaseClient() {
  return supabase;
}
