import { create } from "zustand";
import { persist } from "zustand/middleware";
import { en, type Translations } from "./locales/en";
import { vi } from "./locales/vi";

type Language = "en" | "vi";

interface LanguageState {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      t: en,
      setLanguage: (lang) => {
        set({
          language: lang,
          t: lang === "en" ? en : vi,
        });
      },
    }),
    {
      name: "nostella-language",
      partialize: (state) => ({ language: state.language }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.t = state.language === "en" ? en : vi;
        }
      },
    }
  )
);
