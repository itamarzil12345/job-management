import { useTranslation } from "react-i18next";
import { useEffect } from "react";

/**
 * Enhanced useTranslation hook with RTL support and language utilities
 * Provides the same interface as the old useLanguage hook for easy migration
 */
export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const language = i18n.language as "en" | "he";
  const isRTL = language === "he";

  const setLanguage = (lang: "en" | "he") => {
    i18n.changeLanguage(lang);
  };

  // Update HTML attributes when language changes
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return {
    t,
    language,
    setLanguage,
    isRTL,
    // Additional utilities
    isEnglish: language === "en",
    isHebrew: language === "he",
  };
};
