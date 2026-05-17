//
// TEMPORARY: Phase 5 step 5.3 smoke test for the mutation classifier.
// This file will be restored to the tabbed app shell in Step 5.4.

import { classifyMutation } from "./features/mutation-simulator/mutationClassifier.js";
import {
  PRESETS,
  initialMutationState,
  mutationReducer,
  getEffectiveSequence,
} from "./features/mutation-simulator/mutationReducer.js";

function buildPresetSeq(preset) {
  const state = mutationReducer(initialMutationState, {
    type: "APPLY_PRESET",
    presetId: preset.id,
  });
  return getEffectiveSequence(state.bases);
}

const SCENARIOS = [
  ...PRESETS.map((preset) => ({
    label: `Preset: ${preset.label}`,
    sequence: buildPresetSeq(preset),
    expectedClassification: preset.classification,
  })),
  {
    label: "Custom: no change",
    sequence: "AUGCCUGAAUUCGGAAAGCCAUGA",
    expectedClassification: "No change",
  },
  {
    label: "Custom: in-frame deletion (3 bases at codon 2)",
    sequence: "AUGGAAUUCGGAAAGCCAUGA",
    expectedClassification: "In-frame deletion",
  },
  {
    label: "Custom: in-frame insertion (3 bases after codon 1)",
    sequence: "AUGAAGCCUGAAUUCGGAAAGCCAUGA",
    expectedClassification: "In-frame insertion",
  },
];

function ScenarioRow({ scenario }) {
  const classification = classifyMutation(scenario.sequence);

  return (
    <div
      style={{
        borderBottom: "1px solid #252d3f",
        padding: "0.6rem 0",
        fontFamily: "monospace",
        fontSize: "12px",
      }}
    >
      <div style={{ color: "#3db9f5", fontWeight: 700 }}>
        {scenario.label}
      </div>
      <div style={{ color: "#8d99b4" }}>
        sequence:{" "}
        <span style={{ color: "#e4e8f1" }}>{scenario.sequence}</span>{" "}
        ({scenario.sequence.length} bases)
      </div>
      <div style={{ color: "#8d99b4" }}>
        expected:{" "}
        <span style={{ color: "#f5b731" }}>
          {scenario.expectedClassification}
        </span>
      </div>
      <div style={{ color: "#8d99b4" }}>
        actual:{" "}
        <span style={{ color: "#2dd4a8" }}>{classification.summary}</span>
      </div>
      <div style={{ color: "#8d99b4", marginTop: 4 }}>
        protein: [{classification.mutantProtein.join("-") || "(empty)"}]
      </div>
      <div style={{ color: "#8d99b4" }}>
        diff positions: [{classification.diffPositions.join(", ") || "(none)"}]
      </div>
      <div style={{ color: "#5a6276", fontSize: 11, marginTop: 4 }}>
        {classification.explanation}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div
      style={{
        padding: "2rem",
        background: "#090b10",
        color: "#e4e8f1",
        minHeight: "100vh",
      }}
    >
      <h1>Phase 5 step 5.3 - Classifier smoke test</h1>
      <p style={{ color: "#8d99b4", marginBottom: "1rem" }}>
        Each row runs the classifier on a mutation scenario. Compare the
        expected line to the actual line. The protein shows what the mutant
        translates to. Diff positions are codon indices where the mutant
        protein differs from the original.
      </p>
      {SCENARIOS.map((scenario) => (
        <ScenarioRow key={scenario.label} scenario={scenario} />
      ))}
    </div>
  );
}
