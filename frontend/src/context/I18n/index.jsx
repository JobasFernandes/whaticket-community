import { useState, useEffect, useRef } from "react";
import { i18n } from "../../translate/i18n";
import { I18nContext } from "./context";

const I18nProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "pt");
  const [isLoading, setIsLoading] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const timeoutRef = useRef();

  useEffect(() => {
    const handleLanguageChange = lng => {
      setCurrentLanguage(lng);
      setIsLoading(false);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setRenderKey(prev => prev + 1);
      }, 10);
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const changeLanguage = async languageCode => {
    if (languageCode === currentLanguage) return;

    setIsLoading(true);
    try {
      await i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
    } catch (error) {
      console.error("Erro ao trocar idioma:", error);
      setIsLoading(false);
    }
  };

  const t = (key, options) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return i18n.t(key, options);
  };

  return (
    <I18nContext.Provider
      key={renderKey}
      value={{
        currentLanguage,
        changeLanguage,
        isLoading,
        t,
        renderKey
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export default I18nProvider;
