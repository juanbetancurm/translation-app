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

const PHASE_LABELS = {
  init: "Phase 1: Initiation",
  elong: "Phase 2: Elongation",
  term: "Phase 3: Termination",
};

const PHASE_CLASSES = {
  init: "pb-init",
  elong: "pb-elong",
  term: "pb-term",
};

export default function PhaseBanner({ phase, label }) {
  if (!phase) return null;

  const text = label ?? PHASE_LABELS[phase] ?? phase;
  const cls = PHASE_CLASSES[phase] ?? "pb-init";

  return <div className={`phase-banner ${cls}`}>{text}</div>;
}