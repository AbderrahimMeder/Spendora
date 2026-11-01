"use client";

import { useEffect } from "react";
import i18n from "@/src/i18n/config";

const STORAGE_KEY = "spendora-language";

const supportedLanguages = ["en", "fr", "ar"];

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);

    const browserLanguage = navigator.language
      .split("-")[0]
      .toLowerCase();

    const language = savedLanguage && supportedLanguages.includes(savedLanguage)
      ? savedLanguage
      : supportedLanguages.includes(browserLanguage)
        ? browserLanguage
        : "en";

    i18n.changeLanguage(language);
  }, []);

  useEffect(() => {
    const updateDirection = (language: string) => {
      const isArabic = language === "ar";

      document.documentElement.lang = language;
      document.documentElement.dir = isArabic ? "rtl" : "ltr";
    };

    updateDirection(i18n.language);

    i18n.on("languageChanged", updateDirection);

    return () => {
      i18n.off("languageChanged", updateDirection);
    };
  }, []);

  return <>{children}</>;
}
