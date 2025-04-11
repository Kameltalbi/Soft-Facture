import { useState, useEffect } from 'react';

interface FactureSettings {
  applyTVA: boolean;
  showDiscount: boolean;
  showAdvancePayment: boolean;
  currency: string;
}

const defaultSettings: FactureSettings = {
  applyTVA: true,
  showDiscount: false,
  showAdvancePayment: true,
  currency: "TND"
};

export function useFactureSettings() {
  // Initialiser avec les valeurs par défaut
  const [settings, setSettings] = useState<FactureSettings>(defaultSettings);

  // Charger les paramètres depuis le stockage local au montage
  useEffect(() => {
    const storedSettings = localStorage.getItem('factureSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  // Sauvegarder les paramètres dans le stockage local à chaque changement
  useEffect(() => {
    localStorage.setItem('factureSettings', JSON.stringify(settings));
  }, [settings]);

  // Fonctions pour mettre à jour les paramètres
  const setApplyTVA = (value: boolean) => {
    setSettings(prev => ({ ...prev, applyTVA: value }));
  };

  const setShowDiscount = (value: boolean) => {
    setSettings(prev => ({ ...prev, showDiscount: value }));
  };

  const setShowAdvancePayment = (value: boolean) => {
    setSettings(prev => ({ ...prev, showAdvancePayment: value }));
  };

  const setCurrency = (value: string) => {
    setSettings(prev => ({ ...prev, currency: value }));
  };

  return {
    ...settings,
    setApplyTVA,
    setShowDiscount,
    setShowAdvancePayment,
    setCurrency,
  };
}
