"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language } from "./i18n";
import { loadLanguage, saveLanguage } from "./storage";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedLang = loadLanguage();
    setLanguageState(savedLang);
    setLoaded(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
