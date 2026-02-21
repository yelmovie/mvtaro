/**
 * EnvSetupModal
 *
 * 로컬 개발 시 .env 파일 없이도 환경 변수를 UI에서 입력할 수 있는
 * 보안 설정 창입니다.
 *
 * 보안 원칙:
 * - 값은 localStorage('__dev_env__') 에 저장됩니다.
 * - 프로덕션 빌드(import.meta.env.PROD)에서는 렌더링 자체를 막습니다.
 * - OPENAI_API_KEY 같은 서버 비밀 키는 절대 이 창에서 받지 않습니다.
 * - 저장 후 페이지를 새로고침해야 변경사항이 반영됩니다.
 */

import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Save, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { supabaseSmoke } from '@/lib/config/env';

const STORAGE_KEY = '__dev_env__';

interface EnvValues {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_OPENAI_API_KEY: string;
  VITE_PAYPAL_CLIENT_ID: string;
  VITE_ADSENSE_CLIENT_ID: string;
}

const EMPTY: EnvValues = {
  VITE_SUPABASE_URL: '',
  VITE_SUPABASE_ANON_KEY: '',
  VITE_OPENAI_API_KEY: '',
  VITE_PAYPAL_CLIENT_ID: '',
  VITE_ADSENSE_CLIENT_ID: '',
};

const FIELD_META: Array<{
  key: keyof EnvValues;
  label: string;
  hint: string;
  required: boolean;
  secret: boolean;
  placeholder: string;
  docUrl: string;
  devOnly?: boolean;
  group?: string;
}> = [
  {
    key: 'VITE_SUPABASE_URL',
    label: 'Supabase URL',
    hint: 'Supabase Dashboard → Settings → API → Project URL',
    required: true,
    secret: false,
    placeholder: 'https://abcdefgh.supabase.co',
    docUrl: 'https://supabase.com/dashboard',
    group: 'Supabase',
  },
  {
    key: 'VITE_SUPABASE_ANON_KEY',
    label: 'Supabase Anon Key',
    hint: 'Supabase Dashboard → Settings → API → anon / public',
    required: true,
    secret: true,
    placeholder: 'eyJhbGciOiJIUzI1NiIsIn...',
    docUrl: 'https://supabase.com/dashboard',
    group: 'Supabase',
  },
  {
    key: 'VITE_OPENAI_API_KEY',
    label: 'OpenAI API Key (GPT-4o mini)',
    hint: 'platform.openai.com → API Keys → Create new secret key\n⚠️ 개발 전용 — 프로덕션에서는 Supabase Edge Function Secrets에 설정하세요',
    required: false,
    secret: true,
    placeholder: 'sk-proj-...',
    docUrl: 'https://platform.openai.com/api-keys',
    devOnly: true,
    group: 'GPT AI',
  },
  {
    key: 'VITE_PAYPAL_CLIENT_ID',
    label: 'PayPal Client ID (Sandbox)',
    hint: 'developer.paypal.com → Apps & Credentials → Sandbox → Client ID',
    required: false,
    secret: false,
    placeholder: 'AXxx...sandbox_client_id',
    docUrl: 'https://developer.paypal.com/dashboard/',
    group: '결제',
  },
  {
    key: 'VITE_ADSENSE_CLIENT_ID',
    label: 'Google AdSense Publisher ID',
    hint: 'AdSense 대시보드 → 계정 → 계정 정보 → 게시자 ID',
    required: false,
    secret: false,
    placeholder: 'ca-pub-0000000000000000',
    docUrl: 'https://www.google.com/adsense',
    group: '광고',
  },
];

function loadSaved(): EnvValues {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

/** 저장된 dev env 값을 import.meta.env 처럼 읽어옵니다. */
export function getDevEnv(): Partial<EnvValues> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** VITE_ 변수가 .env 에 없으면 localStorage fallback 을 사용합니다. */
export function resolveEnv(key: keyof EnvValues): string {
  const fromVite = (import.meta.env as Record<string, string>)[key];
  if (fromVite) return fromVite;
  const devEnv = getDevEnv();
  return devEnv[key] ?? '';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function EnvSetupModal({ isOpen, onClose }: Props) {
  const [values, setValues] = useState<EnvValues>(EMPTY);
  const [visible, setVisible] = useState<Record<keyof EnvValues, boolean>>({
    VITE_SUPABASE_URL: true,
    VITE_SUPABASE_ANON_KEY: false,
    VITE_OPENAI_API_KEY: false,
    VITE_PAYPAL_CLIENT_ID: true,
    VITE_ADSENSE_CLIENT_ID: true,
  });
  const [saved, setSaved] = useState(false);
  const [smokeResult, setSmokeResult] = useState<'idle' | 'ok' | 'fail'>('idle');
  const [smokeTesting, setSmokeTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValues(loadSaved());
      setSaved(false);
      setSmokeResult('idle');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 프로덕션 빌드에서는 이 창을 열 수 없습니다
  if (import.meta.env.PROD) {
    return (
      <div style={overlay}>
        <div style={{ ...card, maxWidth: 420 }}>
          <AlertTriangle size={32} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: '#ef4444', textAlign: 'center' }}>
            이 창은 개발 환경에서만 사용할 수 있습니다.
          </p>
          <button onClick={onClose} style={closeBtn}>닫기</button>
        </div>
      </div>
    );
  }

  const handleChange = (key: keyof EnvValues, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }));
    setSaved(false);
    setSmokeResult('idle');
  };

  const handleSave = () => {
    const toSave: Partial<EnvValues> = {};
    (Object.keys(values) as (keyof EnvValues)[]).forEach(k => {
      if (values[k].trim()) toSave[k] = values[k].trim();
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    setSaved(true);
  };

  const handleClear = () => {
    if (!window.confirm('저장된 환경 변수를 모두 삭제할까요?')) return;
    localStorage.removeItem(STORAGE_KEY);
    setValues(EMPTY);
    setSaved(false);
    setSmokeResult('idle');
  };

  const handleSmokeTest = async () => {
    const url = values.VITE_SUPABASE_URL.trim();
    const key = values.VITE_SUPABASE_ANON_KEY.trim();
    if (!url || !key) {
      alert('Supabase URL 과 Anon Key 를 먼저 입력하세요.');
      return;
    }
    setSmokeTesting(true);
    setSmokeResult('idle');
    const result = await supabaseSmoke(url, key);
    setSmokeResult(result.ok ? 'ok' : 'fail');
    setSmokeTesting(false);
  };

  const handleApply = () => {
    handleSave();
    window.location.reload();
  };

  return (
    <div style={overlay}>
      <div style={card}>
        {/* 헤더 */}
        <div style={header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🔐</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary, #f1f5f9)' }}>
                개발 환경 설정
              </h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted, #94a3b8)' }}>
                로컬 .env 파일 없이 API 키를 안전하게 입력합니다
              </p>
            </div>
          </div>
          <button onClick={onClose} style={iconBtn} title="닫기">
            <X size={20} />
          </button>
        </div>

        {/* 경고 배너 */}
        <div style={warnBanner}>
          <Info size={14} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            값은 이 브라우저의 <code>localStorage</code>에만 저장됩니다.
            GPT 키는 개발 전용입니다. 프로덕션에서는 Supabase Edge Functions → Secrets에서 설정하세요.
          </span>
        </div>

        {/* 입력 필드 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: '1.25rem 0' }}>
          {FIELD_META.map((field, idx) => {
            const prevGroup = idx > 0 ? FIELD_META[idx - 1].group : null;
            const showGroupHeader = field.group && field.group !== prevGroup;
            return (
            <div key={field.key}>
              {/* 그룹 구분선 */}
              {showGroupHeader && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  marginTop: idx === 0 ? 0 : '0.25rem',
                }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {field.group}
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(100,116,139,0.25)' }} />
                  {field.devOnly && (
                    <span style={{ fontSize: '0.65rem', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.35)', color: '#fbbf24', borderRadius: '4px', padding: '1px 6px' }}>
                      개발 전용
                    </span>
                  )}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary, #f1f5f9)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {field.label}
                  {field.required && (
                    <span style={{ color: '#f87171', fontSize: '0.75rem' }}>필수</span>
                  )}
                </label>
                <a
                  href={field.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.7rem', color: '#818cf8', textDecoration: 'none' }}
                >
                  어디서 찾나요? →
                </a>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)', margin: '0 0 0.4rem', whiteSpace: 'pre-line' }}>
                {field.hint}
              </p>
              <div style={{ position: 'relative' }}>
                <input
                  type={field.secret && !visible[field.key] ? 'password' : 'text'}
                  value={values[field.key]}
                  onChange={e => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  autoComplete="off"
                  spellCheck={false}
                  style={inputStyle(!!values[field.key])}
                />
                {field.secret && (
                  <button
                    onClick={() => setVisible(v => ({ ...v, [field.key]: !v[field.key] }))}
                    style={eyeBtn}
                    title={visible[field.key] ? '숨기기' : '보기'}
                  >
                    {visible[field.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </div>
            );
          })}
        </div>

        {/* Supabase Smoke Test */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <button onClick={handleSmokeTest} disabled={smokeTesting} style={secondaryBtn}>
            <RefreshCw size={14} style={{ animation: smokeTesting ? 'spin 1s linear infinite' : 'none' }} />
            {smokeTesting ? '연결 테스트 중...' : 'Supabase 연결 테스트'}
          </button>
          {smokeResult === 'ok' && (
            <span style={{ color: '#4ade80', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle size={14} /> 연결 성공
            </span>
          )}
          {smokeResult === 'fail' && (
            <span style={{ color: '#f87171', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertTriangle size={14} /> 연결 실패 (URL/Key 확인)
            </span>
          )}
        </div>

        {/* 하단 버튼 */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleClear} style={dangerBtn} title="저장된 모든 값 삭제">
            초기화
          </button>
          <div style={{ flex: 1 }} />
          <button onClick={handleSave} style={secondaryBtn}>
            <Save size={14} />
            임시 저장
          </button>
          <button onClick={handleApply} style={primaryBtn}>
            <RefreshCw size={14} />
            저장 후 새로고침 적용
          </button>
        </div>

        {saved && (
          <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: '#4ade80', textAlign: 'center' }}>
            ✓ 저장되었습니다. "저장 후 새로고침 적용" 버튼을 눌러야 앱에 반영됩니다.
          </p>
        )}

        {/* 서버 비밀 키 안내 */}
        <div style={{ ...warnBanner, marginTop: '1rem', background: 'rgba(30,41,59,0.6)', borderColor: 'rgba(100,116,139,0.3)' }}>
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 2, color: '#fb923c' }} />
          <span style={{ color: '#94a3b8' }}>
            <strong style={{ color: '#cbd5e1' }}>서버 전용 키 (이 창에서 입력 불가)</strong><br />
            <code style={{ fontSize: '0.7rem' }}>OPENAI_API_KEY</code>,{' '}
            <code style={{ fontSize: '0.7rem' }}>PAYPAL_CLIENT_SECRET</code> →{' '}
            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8' }}>
              Supabase Dashboard → Settings → Edge Functions → Secrets
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── 스타일 상수 ─────────────────────────────────────────────────────────── */

const overlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.75)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  padding: '1rem',
};

const card: React.CSSProperties = {
  background: 'var(--bg-card, #1e293b)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '1.25rem',
  padding: '1.75rem',
  width: '100%',
  maxWidth: '540px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
};

const header: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: '1rem',
};

const warnBanner: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.6rem',
  background: 'rgba(251,191,36,0.08)',
  border: '1px solid rgba(251,191,36,0.25)',
  borderRadius: '0.6rem',
  padding: '0.75rem 1rem',
  fontSize: '0.75rem',
  color: '#fbbf24',
  lineHeight: 1.5,
};

const inputStyle = (hasValue: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '0.6rem 2.5rem 0.6rem 0.75rem',
  background: hasValue ? 'rgba(99,102,241,0.08)' : 'rgba(30,41,59,0.8)',
  border: `1px solid ${hasValue ? 'rgba(99,102,241,0.4)' : 'rgba(100,116,139,0.3)'}`,
  borderRadius: '0.5rem',
  color: 'var(--text-primary, #f1f5f9)',
  fontSize: '0.85rem',
  fontFamily: 'monospace',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
});

const iconBtn: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-muted, #94a3b8)',
  padding: '0.25rem',
  borderRadius: '0.4rem',
  display: 'flex',
  alignItems: 'center',
};

const eyeBtn: React.CSSProperties = {
  position: 'absolute',
  right: '0.6rem',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: '#64748b',
  display: 'flex',
  alignItems: 'center',
};

const baseBtn: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.55rem 1rem',
  borderRadius: '0.6rem',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
  border: 'none',
  transition: 'opacity 0.2s',
};

const primaryBtn: React.CSSProperties = {
  ...baseBtn,
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  color: '#fff',
};

const secondaryBtn: React.CSSProperties = {
  ...baseBtn,
  background: 'rgba(99,102,241,0.15)',
  border: '1px solid rgba(99,102,241,0.4)',
  color: '#a5b4fc',
};

const dangerBtn: React.CSSProperties = {
  ...baseBtn,
  background: 'rgba(239,68,68,0.1)',
  border: '1px solid rgba(239,68,68,0.3)',
  color: '#f87171',
};

const closeBtn: React.CSSProperties = {
  ...primaryBtn,
  marginTop: '1rem',
  width: '100%',
  justifyContent: 'center',
};
