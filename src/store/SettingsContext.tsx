import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSettings } from '../api/service';
import type { Settings } from '../types';

const defaultSettings: Settings = {
  title: 'QASAK BY MAIRA - Premium Fashion Store',
  siteName: 'QASAK',
  logo: '',
  heroImage: '',
  headerText: 'QASAK BY MAIRA',
  footerText: '\u00A9 2026 QASAK BY MAIRA. All Rights Reserved.',
  mobile: '+92 300 0000000',
  email: 'info@qasakbymaira.com',
  address: 'Fashion District, Pakistan'
};

interface SettingsContextType {
  settings: Settings;
  refreshSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  refreshSettings: () => {}
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await getSettings();
      if (data && typeof data === 'object') {
        setSettings({ ...defaultSettings, ...data });
      }
    } catch {
      // use defaults
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
