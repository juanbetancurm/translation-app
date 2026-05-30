import { createContext, useContext } from "react";

export const I18nContext = createContext(null);

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used inside I18nProvider");
  }
  return context;
}
