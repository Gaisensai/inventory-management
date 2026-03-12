'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Settings } from '@/lib/types';
import { defaultSettings } from '@/lib/sampleData';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  updateExpiryThresholds: (thresholds: Partial<Settings['expiryThresholds']>) => void;
  updateGlobalLowStockThreshold: (threshold: number) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<Settings>(
    'inventory-settings',
    defaultSettings
  );

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateExpiryThresholds = (
    thresholds: Partial<Settings['expiryThresholds']>
  ) => {
    setSettings((prev) => ({
      ...prev,
      expiryThresholds: { ...prev.expiryThresholds, ...thresholds },
    }));
  };

  const updateGlobalLowStockThreshold = (threshold: number) => {
    setSettings((prev) => ({
      ...prev,
      globalLowStockThreshold: threshold,
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateExpiryThresholds,
        updateGlobalLowStockThreshold,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
