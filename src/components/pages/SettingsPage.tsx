import { useState, useEffect } from 'react';
import { 
  Sun, Moon, Monitor, Palette, Bell, Volume2, Music, Globe, Mail, 
  ChevronRight, Check 
} from 'lucide-react';
import { Switch } from '../ui/switch';
import { getSettings, saveSettings, type Settings } from '../../lib/storage';
import { getTranslations, type Language } from '../../lib/translations';

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(getSettings());
  const [isDark, setIsDark] = useState(false);
  const t = getTranslations(settings.language);

  useEffect(() => {
    applyTheme();
  }, [settings.theme, settings.colorPalette]);

  const applyTheme = () => {
    const root = document.documentElement;
    
    // Apply color palette
    root.setAttribute('data-palette', settings.colorPalette);
    
    // Apply dark/light mode
    if (settings.theme === 'dark') {
      root.classList.remove('light-mode');
      setIsDark(true);
    } else if (settings.theme === 'light') {
      root.classList.add('light-mode');
      setIsDark(false);
    } else {
      // Auto mode - use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.remove('light-mode');
        setIsDark(true);
      } else {
        root.classList.add('light-mode');
        setIsDark(false);
      }
    }
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleThemeChange = (theme: Settings['theme']) => {
    updateSetting('theme', theme);
  };

  const handleToggleDark = () => {
    const newTheme = isDark ? 'light' : 'dark';
    handleThemeChange(newTheme);
  };

  const colorPalettes = [
    { id: 'mystic' as const, name: t.mysticTheme, color: '#6B46C1', gradient: 'linear-gradient(135deg, #6B46C1, #9333ea)' },
    { id: 'forest' as const, name: t.forestTheme, color: '#047857', gradient: 'linear-gradient(135deg, #047857, #10B981)' },
    { id: 'ocean' as const, name: t.oceanTheme, color: '#0369A1', gradient: 'linear-gradient(135deg, #0369A1, #0EA5E9)' },
    { id: 'sunset' as const, name: t.sunsetTheme, color: '#DB2777', gradient: 'linear-gradient(135deg, #DB2777, #FB923C)' },
  ];

  const handleContactDeveloper = () => {
    window.location.href = 'mailto:support@friendshiptarot.app?subject=피드백 / Feedback';
  };

  return (
    <div className="min-h-screen p-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.8))'
          }}>
            ⚙️
          </div>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            {t.settings}
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            {t.settingsDescription}
          </p>
        </div>

        <div className="space-y-6">
          {/* ========== APPEARANCE SECTION ========== */}
          <div className="glass-card" style={{
            padding: '1.5rem',
            borderRadius: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <Palette style={{ 
                width: '1.5rem', 
                height: '1.5rem',
                color: 'var(--primary-purple)'
              }} />
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                {t.appearance}
              </h3>
            </div>

            {/* Quick Dark Mode Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid var(--surface-border)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                {isDark ? (
                  <Moon style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    color: 'var(--primary-purple)'
                  }} />
                ) : (
                  <Sun style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    color: 'var(--primary-gold)'
                  }} />
                )}
                <div>
                  <p style={{ 
                    color: 'var(--text-primary)',
                    fontWeight: 500
                  }}>
                    {t.darkMode}
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                  }}>
                    {isDark ? t.darkModeDesc : t.lightModeDesc}
                  </p>
                </div>
              </div>
              <Switch
                checked={isDark}
                onCheckedChange={handleToggleDark}
              />
            </div>

            {/* Color Palette Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem'
              }}>
                {t.colorPalette}
              </h4>
              <p style={{
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                marginBottom: '1rem'
              }}>
                {t.colorPaletteDesc}
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.75rem'
              }}>
                {colorPalettes.map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => updateSetting('colorPalette', palette.id)}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      borderRadius: '0.75rem',
                      background: palette.gradient,
                      border: settings.colorPalette === palette.id 
                        ? '3px solid var(--primary-gold)' 
                        : '2px solid var(--surface-border)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: settings.colorPalette === palette.id
                        ? '0 0 20px rgba(245, 158, 11, 0.5)'
                        : 'none'
                    }}
                  >
                    {settings.colorPalette === palette.id && (
                      <Check style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        color: 'white',
                        filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.5))'
                      }} />
                    )}
                  </button>
                ))}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.75rem',
                marginTop: '0.5rem'
              }}>
                {colorPalettes.map((palette) => (
                  <p key={palette.id} style={{
                    fontSize: '0.75rem',
                    color: settings.colorPalette === palette.id 
                      ? 'var(--primary-gold)' 
                      : 'var(--text-secondary)',
                    textAlign: 'center',
                    fontWeight: settings.colorPalette === palette.id ? 600 : 400
                  }}>
                    {palette.name}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* ========== NOTIFICATIONS SECTION ========== */}
          <div className="glass-card" style={{
            padding: '1.5rem',
            borderRadius: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <Bell style={{ 
                width: '1.5rem', 
                height: '1.5rem',
                color: 'var(--primary-purple)'
              }} />
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                {t.notifications}
              </h3>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <p style={{ 
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  marginBottom: '0.25rem'
                }}>
                  {t.pushNotifications}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  {t.pushNotificationsDesc}
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(value) => updateSetting('pushNotifications', value)}
              />
            </div>
          </div>

          {/* ========== SOUND SECTION ========== */}
          <div className="glass-card" style={{
            padding: '1.5rem',
            borderRadius: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <Volume2 style={{ 
                width: '1.5rem', 
                height: '1.5rem',
                color: 'var(--primary-purple)'
              }} />
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                {t.sound}
              </h3>
            </div>

            {/* Sound Effects */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <div>
                <p style={{ 
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  marginBottom: '0.25rem'
                }}>
                  {t.cardSoundEffects}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  {t.cardSoundEffectsDesc}
                </p>
              </div>
              <Switch
                checked={settings.soundEffects}
                onCheckedChange={(value) => updateSetting('soundEffects', value)}
              />
            </div>

            {/* Background Music */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Music style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  color: 'var(--primary-gold)'
                }} />
                <div>
                  <p style={{ 
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                    marginBottom: '0.25rem'
                  }}>
                    {t.backgroundMusic}
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                  }}>
                    {t.backgroundMusicDesc}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.backgroundMusic}
                onCheckedChange={(value) => updateSetting('backgroundMusic', value)}
              />
            </div>
          </div>

          {/* ========== LANGUAGE SECTION ========== */}
          <div className="glass-card" style={{
            padding: '1.5rem',
            borderRadius: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <Globe style={{ 
                width: '1.5rem', 
                height: '1.5rem',
                color: 'var(--primary-purple)'
              }} />
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                {t.language}
              </h3>
            </div>

            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              marginBottom: '1rem'
            }}>
              {t.languageDesc}
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <button
                onClick={() => updateSetting('language', 'ko')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: settings.language === 'ko' 
                    ? '2px solid var(--primary-purple)' 
                    : '1px solid var(--surface-border)',
                  background: settings.language === 'ko' 
                    ? 'rgba(107, 70, 193, 0.1)' 
                    : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{
                  color: 'var(--text-primary)',
                  fontWeight: settings.language === 'ko' ? 600 : 400
                }}>
                  🇰🇷 {t.korean}
                </span>
                {settings.language === 'ko' && (
                  <Check style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    color: 'var(--primary-purple)'
                  }} />
                )}
              </button>

              <button
                onClick={() => updateSetting('language', 'en')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: settings.language === 'en' 
                    ? '2px solid var(--primary-purple)' 
                    : '1px solid var(--surface-border)',
                  background: settings.language === 'en' 
                    ? 'rgba(107, 70, 193, 0.1)' 
                    : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{
                  color: 'var(--text-primary)',
                  fontWeight: settings.language === 'en' ? 600 : 400
                }}>
                  🇺🇸 {t.english}
                </span>
                {settings.language === 'en' && (
                  <Check style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    color: 'var(--primary-purple)'
                  }} />
                )}
              </button>
            </div>
          </div>

          {/* ========== DEVELOPER SECTION ========== */}
          <div className="glass-card" style={{
            padding: '1.5rem',
            borderRadius: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <Mail style={{ 
                width: '1.5rem', 
                height: '1.5rem',
                color: 'var(--primary-purple)'
              }} />
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                {t.developer}
              </h3>
            </div>

            <button
              onClick={handleContactDeveloper}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--surface-border)',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(107, 70, 193, 0.1)';
                e.currentTarget.style.borderColor = 'var(--primary-purple)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'var(--surface-border)';
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <p style={{
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  marginBottom: '0.25rem'
                }}>
                  {t.contactDeveloper}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  {t.contactDeveloperDesc}
                </p>
              </div>
              <ChevronRight style={{
                width: '1.25rem',
                height: '1.25rem',
                color: 'var(--text-secondary)'
              }} />
            </button>
          </div>

          {/* ========== ABOUT SECTION ========== */}
          <div className="glass-card text-center" style={{
            padding: '2rem',
            borderRadius: '1rem'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>
              ✨
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              {t.appName}
            </h3>
            <p style={{
              fontSize: '0.9375rem',
              color: 'var(--text-secondary)',
              marginBottom: '1rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-line'
            }}>
              {t.appDescription}
            </p>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              {t.version}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
