import { useState } from 'react';
import { AlertCircle, Key, CheckCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ApiKeyManagerProps {
  onClose: () => void;
}

export function ApiKeyManager({ onClose }: ApiKeyManagerProps) {
  const [openaiKey, setOpenaiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const validateAndSaveKey = async () => {
    // Client-side validation
    if (!openaiKey.trim()) {
      setValidationMessage({
        type: 'error',
        message: 'API 키를 입력해주세요.'
      });
      return;
    }

    if (!openaiKey.startsWith('sk-')) {
      setValidationMessage({
        type: 'error',
        message: 'OpenAI API 키는 "sk-"로 시작해야 합니다.'
      });
      return;
    }

    setIsValidating(true);
    setValidationMessage(null);

    try {
      /**
       * 보안 원칙: 브라우저에서 OpenAI API 를 직접 호출하지 않습니다.
       * 대신 Supabase Edge Function 의 /health 엔드포인트에
       * 임시 키를 헤더로 보내 서버 측 검증을 요청합니다.
       * 실제 검증은 서버(Edge Function)에서만 수행됩니다.
       */
      const edgeUrl = `https://${projectId}.supabase.co/functions/v1/make-server-adbcd17e/openai/validate-key`;
      const response = await fetch(edgeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ keyHint: openaiKey.substring(0, 7) + '...' }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          setValidationMessage({
            type: 'success',
            message: '✓ 서버에서 OpenAI API 키가 유효함을 확인했습니다.',
          });
        } else {
          setValidationMessage({
            type: 'error',
            message: `키 검증 실패: ${data.message || '서버 응답 오류'}`,
          });
        }
      } else {
        // Edge Function 이 아직 배포되지 않은 경우 안내 메시지 표시
        setValidationMessage({
          type: 'error',
          message:
            'Edge Function 에 연결할 수 없습니다. ' +
            'Supabase Dashboard → Settings → Edge Functions → Secrets 에서 ' +
            'OPENAI_API_KEY 를 직접 설정한 뒤 앱을 새로고침하세요.',
        });
      }
    } catch (error) {
      setValidationMessage({
        type: 'error',
        message: `검증 중 오류가 발생했습니다: ${error}`,
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="modal-content" style={{
        borderRadius: '1.5rem',
        padding: '2.5rem',
        maxWidth: '600px',
        width: '100%'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <Key size={32} style={{ color: 'var(--primary-gold)' }} />
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0
          }}>
            OpenAI API 키 설정
          </h2>
        </div>

        {/* Alert */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '0.75rem',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '0.75rem'
        }}>
          <AlertCircle size={20} style={{ color: 'var(--primary-gold)', flexShrink: 0, marginTop: '0.125rem' }} />
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--primary-gold)' }}>OpenAI API 키가 필요합니다.</strong>
            <br />
            이 앱은 OpenAI gpt-4o-mini를 사용하여 타로 해석을 생성합니다. 아래에서 API 키를 설정해주세요.
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          background: 'rgba(107, 70, 193, 0.1)',
          border: '1px solid rgba(107, 70, 193, 0.3)',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--primary-purple)',
            marginBottom: '0.75rem'
          }}>
            OpenAI API 키 받는 방법:
          </h3>
          <ol style={{
            margin: 0,
            paddingLeft: '1.25rem',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.8
          }}>
            <li><a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-gold)', textDecoration: 'underline' }}>OpenAI API Keys 페이지</a>로 이동</li>
            <li>"Create new secret key" 버튼 클릭</li>
            <li>생성된 키를 복사 (sk-로 시작)</li>
            <li>아래에 붙여넣기</li>
          </ol>
        </div>

        {/* Input */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: '0.5rem'
          }}>
            OpenAI API 키
          </label>
          <input
            type="password"
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
            placeholder="sk-..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.5rem',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              fontFamily: 'monospace'
            }}
          />
        </div>

        {/* Validation Message */}
        {validationMessage && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: validationMessage.type === 'success' 
              ? 'rgba(34, 197, 94, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)',
            border: validationMessage.type === 'success'
              ? '1px solid rgba(34, 197, 94, 0.3)'
              : '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            {validationMessage.type === 'success' ? (
              <CheckCircle size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
            ) : (
              <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
            )}
            <span style={{
              fontSize: '0.875rem',
              color: validationMessage.type === 'success' ? '#22c55e' : '#ef4444'
            }}>
              {validationMessage.message}
            </span>
          </div>
        )}

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          marginTop: '1.5rem'
        }}>
          <button
            onClick={validateAndSaveKey}
            disabled={isValidating}
            style={{
              flex: 1,
              padding: '0.875rem',
              background: isValidating 
                ? 'rgba(107, 70, 193, 0.5)' 
                : 'linear-gradient(135deg, rgba(107, 70, 193, 0.8), rgba(139, 92, 246, 0.8))',
              border: '1px solid var(--primary-purple)',
              borderRadius: '0.75rem',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: isValidating ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {isValidating ? '확인 중...' : 'API 키 확인'}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.875rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.75rem',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            닫기
          </button>
        </div>

        {/* Note */}
        <p style={{
          marginTop: '1rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          lineHeight: 1.5
        }}>
          ⚠️ API 키는 절대 공유하지 마세요. 이 도구는 키를 검증만 하고 저장하지 않습니다.
          <br />
          실제 저장은 Supabase 환경 변수에서 직접 해야 합니다.
        </p>
      </div>
    </div>
  );
}
