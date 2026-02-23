import React, { createContext, useContext, useState, useEffect } from "react";

const DEFAULT_LANGUAGE = "en";
const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: (lang: string) => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
