//
// The top-level layout shell: a row of tabs at the top, then a routed
// feature view below.

import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import TranslationWalkthrough from "./features/translation-walkthrough/TranslationWalkthrough";
import MutationSimulator from "./features/mutation-simulator/MutationSimulator";
import { useTranslation } from "./i18n/i18nContext.js";
import "./App.css";

export default function App() {
  const { language, toggleLanguage, t } = useTranslation();
  const nextLanguageLabel =
    language === "en" ? t("languageToggle.spanish") : t("languageToggle.english");

  return (
    <div className="app-root">
      <nav className="tabs">
        <NavLink
          to="/walkthrough"
          data-guide="walkthrough-tab"
          className={({ isActive }) => `tab${isActive ? " tab-active" : ""}`}
        >
          <span className="tab-icon" aria-hidden="true">{t("nav.walkthroughIcon")}</span>
          <span className="tab-label-wide">{t("nav.walkthroughWide")}</span>
          <span className="tab-label-short">{t("nav.walkthroughShort")}</span>
        </NavLink>
        <NavLink
          to="/mutation"
          data-guide="mutation-tab"
          className={({ isActive }) => `tab${isActive ? " tab-active" : ""}`}
        >
          <span className="tab-icon" aria-hidden="true">{t("nav.mutationIcon")}</span>
          <span className="tab-label-wide">{t("nav.mutationWide")}</span>
          <span className="tab-label-short">{t("nav.mutationShort")}</span>
        </NavLink>
        <a
          href="https://www.labolavs.com/category/education"
          className="tab tab-external"
        >
          <span className="tab-icon" aria-hidden="true">{t("nav.educationIcon")}</span>
          <span className="tab-label-wide">{t("nav.educationWide")}</span>
          <span className="tab-label-short">{t("nav.educationShort")}</span>
        </a>
        <button
          type="button"
          className="language-toggle"
          onClick={toggleLanguage}
          aria-label={t("languageToggle.switchTo")}
          title={t("languageToggle.switchTo")}
        >
          <span className="language-toggle-label">{t("languageToggle.label")}</span>
          <span className="language-toggle-value">{nextLanguageLabel}</span>
        </button>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/walkthrough" replace />} />
        <Route path="/walkthrough" element={<TranslationWalkthrough />} />
        <Route path="/mutation" element={<MutationSimulator />} />
        <Route path="*" element={<Navigate to="/walkthrough" replace />} />
      </Routes>
    </div>
  );
}
