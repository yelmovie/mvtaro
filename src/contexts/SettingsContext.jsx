'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext();

const defaultSettings = {
  fontSize: 'medium',
  animation: 'medium',
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
      applySettings(parsed);
    }
  }, []);

  const applySettings = (newSettings) => {
    document.documentElement.setAttribute('data-font-size', newSettings.fontSize);
    document.documentElement.setAttribute('data-animation', newSettings.animation);
  };

  const updateSettings = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  if (!mounted) {
    return <div>{children}</div>;
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
