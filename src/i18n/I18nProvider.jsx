import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { en } from "./messages/en.js";
import { es } from "./messages/es.js";
import { I18nContext } from "./i18nContext.js";

const STORAGE_KEY = "translation_lab_language";
const DEFAULT_LANGUAGE = "en";

const MESSAGES = {
  en,
  es,
};

function readStoredLanguage() {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && MESSAGES[stored] ? stored : DEFAULT_LANGUAGE;
}

function getByPath(source, path) {
  return path.split(".").reduce((current, part) => {
    if (current == null) return undefined;
    return current[part];
  }, source);
}

function interpolate(template, params = {}) {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    params[key] == null ? match : String(params[key])
  );
}

function formatMessage(message, params) {
  if (typeof message === "function") return message(params ?? {});
  if (typeof message === "string") return interpolate(message, params);
  return message;
}

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(readStoredLanguage);

  const setLanguage = useCallback((nextLanguage) => {
    if (!MESSAGES[nextLanguage]) return;

    setLanguageState(nextLanguage);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "es" : "en");
  }, [language, setLanguage]);

  const t = useCallback(
    (key, params) => {
      const message =
        getByPath(MESSAGES[language], key) ?? getByPath(MESSAGES.en, key);

      if (message == null) return key;
      return formatMessage(message, params);
    },
    [language]
  );

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.lang = language;
    document.title = t("meta.title");
  }, [language, t]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
    }),
    [language, setLanguage, toggleLanguage, t]
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}
