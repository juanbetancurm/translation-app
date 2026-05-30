// 
//
// The colored pill that appears at the top of the stage labeling the
// current phase of translation. Returns null when there is no phase,
// so callers can pass whatever they have without checking first.
//
// Three valid phase values: "init", "elong", "term". Each maps to a
// label and a CSS state class.
//
// Custom labels are also supported via the `label` prop, for one-off
// states like "Translation Failed" used by the Mutation Simulator when
// the start codon is lost.
//
// Props:
//   phase   "init" | "elong" | "term" | null/undefined
//   label   optional custom label string that overrides the default

import "./PhaseBanner.css";
import { useTranslation } from "../../i18n/i18nContext.js";

const PHASE_CLASSES = {
  init: "pb-init",
  elong: "pb-elong",
  term: "pb-term",
};

export default function PhaseBanner({ phase, label }) {
  const { t } = useTranslation();

  if (!phase) return null;

  const text = label ?? t(`shared.phase.${phase}`) ?? phase;
  const cls = PHASE_CLASSES[phase] ?? "pb-init";

  return <div className={`phase-banner ${cls}`}>{text}</div>;
}
