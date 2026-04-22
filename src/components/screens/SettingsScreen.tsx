import { ArrowLeft, Palette, Moon, Sun, HelpCircle, Info, Shield, Mail, Globe } from 'lucide-react';
import { MysticBackground } from '../MysticBackground';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../lib/LanguageContext';
import { getTranslations } from '../../lib/translations';
import { ContactModal } from '../ContactModal';

interface SettingsScreenProps {
  onBack: () => void;
  onNavigateToHelp?: () => void;
  onNavigateToPrivacy?: () => void;
}

export function SettingsScreen({ onBack, onNavigateToHelp, onNavigateToPrivacy }: SettingsScreenProps) {
  const { language, setLanguage } = useLanguage();
  const t = getTranslations(language);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const APP_STORAGE_KEYS = ['theme', 'app-language', 'mind-coaching-view-mode', 'tarot-reading-history', 'tarot-settings'];
  
  const [settings, setSettings] = useState(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    return {
      theme: savedTheme as 'dark' | 'light',
      autoSave: true
    };
  });

  // Apply theme on mount and when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    localStorage.setItem('theme', settings.theme);
  }, [settings.theme]);

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const setTheme = (theme: 'dark' | 'light') => {
    setSettings(prev => ({ ...prev, theme }));
  };

  return (
    <div className="min-h-screen relative">
      <MysticBackground variant="moonlight-nature" intensity="low" />

      <div className="relative z-10 py-8 px-4 pb-24">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button className="back-button mb-6" onClick={onBack}>
            <ArrowLeft size={20} />
            {t.back}
          </button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div style={{
              fontSize: '2rem',
              marginBottom: '1rem',
              filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.5))'
            }}>
              ⚙️
            </div>
            <h1 className="text-2xl font-semibold mb-2 text-primary">
              {t.settings}
            </h1>
            <p className="text-sm text-secondary">
              {t.settingsDescription}
            </p>
          </motion.div>

          {/* Settings Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {/* Appearance */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '1.5rem' }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Palette size={22} color="var(--primary-purple)" />
                {t.appearance}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Theme Mode Selection */}
                <div style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '0.75rem'
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {t.themeMode}
                    </p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {t.themeModeDesc}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {[
                      { id: 'dark', icon: Moon, label: t.darkModeShort, desc: t.darkTheme },
                      { id: 'light', icon: Sun, label: t.lightMode, desc: t.lightTheme }
                    ].map((mode) => {
                      const Icon = mode.icon;
                      const isActive = settings.theme === mode.id;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setTheme(mode.id as 'dark' | 'light')}
                          style={{
                            flex: 1,
                            padding: '1rem',
                            background: isActive ? 'rgba(107, 70, 193, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${isActive ? 'var(--primary-purple)' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <Icon 
                            size={24} 
                            color={isActive ? 'var(--primary-purple)' : 'var(--text-secondary)'} 
                          />
                          <div>
                            <p style={{
                              fontSize: '0.9375rem',
                              fontWeight: 500,
                              color: isActive ? 'var(--primary-purple)' : 'var(--text-primary)',
                              marginBottom: '0.125rem'
                            }}>
                              {mode.label}
                            </p>
                            <p style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)'
                            }}>
                              {mode.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* General */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '1.5rem' }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Globe size={22} color="var(--primary-pink)" />
                {t.general}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Language Selection */}
                <div style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '0.75rem'
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {t.language}
                    </p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {t.languageDesc}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {[
                      { id: 'ko', label: t.korean },
                      { id: 'en', label: t.english }
                    ].map((lang) => {
                      const isActive = language === lang.id;
                      return (
                        <button
                          key={lang.id}
                          onClick={() => setLanguage(lang.id as 'ko' | 'en')}
                          style={{
                            flex: 1,
                            padding: '0.875rem',
                            background: isActive ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${isActive ? 'var(--primary-pink)' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: isActive ? 'var(--primary-pink)' : 'var(--text-primary)'
                          }}
                        >
                          {lang.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Auto Save */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '0.75rem'
                }}>
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {t.autoSave}
                    </p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {t.autoSaveDesc}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleSetting('autoSave')}
                    style={{
                      width: '50px',
                      height: '28px',
                      borderRadius: '14px',
                      background: settings.autoSave ? 'var(--primary-purple)' : 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background 0.3s ease'
                    }}
                  >
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: 'white',
                      position: 'absolute',
                      top: '3px',
                      left: settings.autoSave ? '25px' : '3px',
                      transition: 'left 0.3s ease'
                    }} />
                  </button>
                </div>
              </div>
            </div>

            {/* About & Support */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '1.5rem' }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Info size={22} color="#10B981" />
                {t.aboutSupport}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { icon: HelpCircle, label: t.help, value: t.viewGuide, action: 'guide' },
                  { icon: Shield, label: t.privacy, value: t.viewPrivacy, action: 'privacy' },
                  { icon: Info, label: t.appVersion, value: '1.0.0', action: null }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '0.75rem',
                        cursor: item.action ? 'pointer' : 'default',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => {
                        if (item.action === 'guide' && onNavigateToHelp) {
                          onNavigateToHelp();
                        } else if (item.action === 'privacy' && onNavigateToPrivacy) {
                          onNavigateToPrivacy();
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (item.action) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Icon size={18} color="var(--text-secondary)" />
                        <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                          {item.label}
                        </p>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {item.value}
                      </p>
                    </div>
                  );
                })}
                
                {/* Contact Developer Button */}
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="glass-card"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Mail size={18} color="var(--primary-purple)" />
                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                      {t.contactDeveloper}
                    </p>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--primary-purple)' }}>
                    {t.send}
                  </p>
                </button>
              </div>
            </div>

            {/* Data Management */}
            <div className="glass-card" style={{
              padding: '1.5rem',
              borderRadius: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#EF4444',
                marginBottom: '1rem'
              }}>
                {t.dataManagement}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '1rem',
                lineHeight: 1.6
              }}>
                {t.dataManagementDesc}
              </p>
              <button
                className="btn-secondary"
                style={{
                  width: '100%',
                  borderColor: '#EF4444',
                  color: '#EF4444'
                }}
                onClick={() => {
                  if (confirm(t.deleteConfirm)) {
                    APP_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
                    alert(t.dataDeleted);
                    window.location.reload();
                  }
                }}
              >
                {t.deleteAllData}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
