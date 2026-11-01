
"use client";

import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";
import i18n from "@/src/i18n/config";

export default function LanguageSwitcher() {
  const { i18n: translation } = useTranslation();
  const TwoFisrtLetter = translation.language?.split("-")[0]
  const lang = TwoFisrtLetter.slice(0,2)
  const changeLanguage = (language: string) => {
    localStorage.setItem("spendora-language", language);
    i18n.changeLanguage(language);
  };

  return (
    <div className="relative w-fit">
      <Globe
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none"
      />

      <select
        value={lang}
        onChange={(e) => changeLanguage(e.target.value)}
        className="
          appearance-none
          bg-[#111111]
          text-white
          border border-[#292929]
          hover:border-emerald-500/50
          focus:border-emerald-500
          focus:ring-2 focus:ring-emerald-500/10
          rounded-xl
          pl-10 pr-10 py-2.5
          text-sm font-medium
          outline-none
          cursor-pointer
          transition-all duration-200
        "
      >
        <option value="en">En</option>
        <option value="fr">Fr</option>
        <option value="ar">ar</option>
      </select>

      <ChevronDown
        size={15}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
      />
    </div>
  );
}
