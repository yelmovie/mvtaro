'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/contexts/SettingsContext';
import Button from '@/components/Button';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { settings, updateSettings } = useSettings();

  const ToggleButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`
        flex-1 px-6 py-3 rounded-button
        transition-all duration-base
        ${active 
          ? 'bg-primary text-white shadow-button' 
          : 'bg-surface text-muted hover:bg-surface/80'
        }
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="container-main py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="text-4xl">⚙️</div>
          <h1 className="text-3xl font-bold">설정</h1>
          <p className="text-muted">
            앱 환경을 조정하세요
          </p>
        </div>

        <div className="space-y-6">
          {/* Theme */}
          <div className="glass-card p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold mb-1">테마</h2>
              <p className="text-sm text-muted">라이트 모드와 다크 모드 선택</p>
            </div>
            <div className="flex gap-3">
              <ToggleButton
                active={theme === 'light'}
                onClick={() => theme === 'dark' && toggleTheme()}
              >
                <span className="mr-2">☀️</span>
                라이트
              </ToggleButton>
              <ToggleButton
                active={theme === 'dark'}
                onClick={() => theme === 'light' && toggleTheme()}
              >
                <span className="mr-2">🌙</span>
                다크
              </ToggleButton>
            </div>
          </div>

          {/* Font Size */}
          <div className="glass-card p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold mb-1">글자 크기</h2>
              <p className="text-sm text-muted">가독성을 위해 글자 크기 조정</p>
            </div>
            <div className="flex gap-3">
              <ToggleButton
                active={settings.fontSize === 'small'}
                onClick={() => updateSettings('fontSize', 'small')}
              >
                작게
              </ToggleButton>
              <ToggleButton
                active={settings.fontSize === 'medium'}
                onClick={() => updateSettings('fontSize', 'medium')}
              >
                보통
              </ToggleButton>
              <ToggleButton
                active={settings.fontSize === 'large'}
                onClick={() => updateSettings('fontSize', 'large')}
              >
                크게
              </ToggleButton>
            </div>
          </div>

          {/* Animation */}
          <div className="glass-card p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold mb-1">애니메이션 강도</h2>
              <p className="text-sm text-muted">애니메이션 속도와 강도 조절</p>
            </div>
            <div className="flex gap-3">
              <ToggleButton
                active={settings.animation === 'low'}
                onClick={() => updateSettings('animation', 'low')}
              >
                낮음
              </ToggleButton>
              <ToggleButton
                active={settings.animation === 'medium'}
                onClick={() => updateSettings('animation', 'medium')}
              >
                보통
              </ToggleButton>
              <ToggleButton
                active={settings.animation === 'high'}
                onClick={() => updateSettings('animation', 'high')}
              >
                높음
              </ToggleButton>
            </div>
          </div>

          {/* About */}
          <div className="glass-card p-6 space-y-3">
            <h2 className="text-lg font-bold">우정 타로에 대하여</h2>
            <p className="text-sm leading-relaxed">
              이 신비로운 도구는 우정의 아름다운 유대를 기념하고 키우기 위해 만들어졌습니다. 
              각 리딩은 가능성과 부드러운 안내를 제공하며, 경고나 단정을 하지 않습니다.
            </p>
            <p className="text-sm text-muted italic">
              ❤️ 사랑으로 만들어졌습니다 ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
