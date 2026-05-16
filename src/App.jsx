// Smoke test for reducer. This fiel will be replaced in step 4.3 with the real React wiring.

import {
  initialState,
  walkthroughReducer,
} from "./features/translation-walkthrough/walkthroughReducer.js";

// Build the full sequence of states by dispatching NEXT_STEP repeatedly.
function buildAllStates() {
  const states = [initialState];
  let s = initialState;
  for (let i = 0; i < 24; i++) {
    s = walkthroughReducer(s, { type: "NEXT_STEP" });
    states.push(s);
  }
  return states;
}

const ALL_STATES = buildAllStates();

function StateBlock({ index, state }) {
  // Render an excerpt of the state — only the fields that matter for
  // verifying the biology. Skip the long stepText.
  const tRnaSummary =
    state.trnas.length === 0
      ? "(none)"
      : state.trnas
          .map(
            (t) =>
              `${t.site}-site:${t.anticodon}` +
              (t.aminoAcid ? `(${t.aminoAcid})` : "(empty)")
          )
          .join(", ");

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
        Step {index === 0 ? "initial" : state.stepIndex} — {state.stepTitle}
      </div>
      <div style={{ color: "#8d99b4" }}>
        phase={String(state.phase)} | ribo:{state.riboVisible ? "on" : "off"}
        {state.riboFading ? "(fading)" : ""} @ codon {state.riboCodonIndex}
        {" | "}
        codonStates=[
        {state.codonStates
          .map((c) => c[0].toUpperCase())
          .join("")}
        ]
        {" | "}
        protein=[{state.protein.join("-") || "(empty)"}]
        {" | "}
        trnas={tRnaSummary}
        {" | "}
        rf={state.releaseFactor ? `@${state.releaseFactor.codonIndex}` : "none"}
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
      <h1>Phase 4 step 4.2 — Reducer smoke test</h1>
      <p style={{ color: "#8d99b4", marginBottom: "1rem" }}>
        Each row is the state of the walkthrough at one step. Read top to
        bottom. The protein should grow Met → Pro → Glu → Phe → Gly → Lys →
        Pro across the 7 bond steps. codonStates uses one letter per codon:
        U=upcoming, A=active, D=done, S=stop-hit. The ribosome's codon
        index advances during shift steps.
      </p>

      {ALL_STATES.map((state, i) => (
        <StateBlock key={i} index={i} state={state} />
      ))}
    </div>
  );
}