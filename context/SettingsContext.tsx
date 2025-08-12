import React, { createContext, useContext, useMemo, useState } from 'react';

type SettingsContextValue = {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  setVibrationEnabled: (v: boolean) => void;
  goalTarget: number;
  setGoalTarget: (v: number) => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [goalTarget, setGoalTarget] = useState<number>(10);

  const value = useMemo(
    () => ({ soundEnabled, vibrationEnabled, setSoundEnabled, setVibrationEnabled, goalTarget, setGoalTarget }),
    [soundEnabled, vibrationEnabled, goalTarget]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};


