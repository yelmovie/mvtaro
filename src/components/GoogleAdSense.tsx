import { useEffect } from 'react';
import { getEnv } from '@/lib/config/env';

interface GoogleAdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  adStyle?: React.CSSProperties;
  isPremium?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export function GoogleAdSense({
  adSlot,
  adFormat = 'auto',
  adStyle = {},
  isPremium = false,
}: GoogleAdSenseProps) {
  useEffect(() => {
    if (isPremium) return;
    const { adsenseClientId } = getEnv();
    // AdSense Client ID 없으면 push 하지 않음 (콘솔 오류 방지)
    if (!adsenseClientId) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // AdSense 로드 실패는 무시 (개발 환경에서는 정상)
    }
  }, [isPremium]);

  if (isPremium) return null;

  const { adsenseClientId } = getEnv();

  // AdSense Client ID 없으면 개발용 placeholder 표시
  if (!adsenseClientId) {
    if (!import.meta.env.DEV) return null;
    return (
      <div style={{
        width: '100%',
        minHeight: '90px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '1.5rem 0',
        background: 'rgba(99,102,241,0.06)',
        border: '1px dashed rgba(99,102,241,0.3)',
        borderRadius: '0.5rem',
        color: '#64748b',
        fontSize: '0.75rem',
        ...adStyle,
      }}>
        광고 영역 (AdSense Client ID 미설정 — ENV 버튼에서 입력)
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '1.5rem 0',
      ...adStyle,
    }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '300px', maxWidth: '100%', minHeight: '100px' }}
        data-ad-client={adsenseClientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function MysticAdWrapper({
  children,
  isPremium = false,
}: {
  children: React.ReactNode;
  isPremium?: boolean;
}) {
  if (isPremium) return <>{children}</>;

  return (
    <div className="glass-card" style={{
      borderRadius: '1rem',
      padding: '1rem',
      marginTop: '2rem',
      border: '1px solid rgba(139, 92, 246, 0.2)',
    }}>
      <div style={{
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
      }}>
        <span>✨</span>
        <span>프리미엄으로 광고 없이 즐기세요</span>
        <span>✨</span>
      </div>
      {children}
    </div>
  );
}

/**
 * AdSense 스크립트를 <head>에 주입합니다.
 * adsenseClientId 가 없으면 아무것도 하지 않습니다 (콘솔 오류 방지).
 */
export function initializeAdSense(): void {
  if (typeof window === 'undefined') return;
  if (document.getElementById('adsense-script')) return;

  const { adsenseClientId } = getEnv();
  if (!adsenseClientId) return; // 미설정 시 스크립트 주입 안 함

  const script = document.createElement('script');
  script.id = 'adsense-script';
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}
