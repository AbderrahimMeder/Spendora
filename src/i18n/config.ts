import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import fr from "../locales/fr.json";
import ar from "../locales/ar.json";

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  ar: { translation: ar },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "fr", "ar"],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;