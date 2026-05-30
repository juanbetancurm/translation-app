//
//
// Pure state-transition function for the Translation Walkthrough.
//
// State shape is documented in the body of initialState below.
//
// Actions:
//   { type: "NEXT_STEP" }           advance one step
//   { type: "RESET" }               return to initialState
//   { type: "JUMP_TO_STEP", index } jump to step `index`
//                                   (used by the smoke test and tests)
//
// The reducer takes the current state and the action and returns a NEW
// state object. It must be pure: no DOM access, no setTimeout, no Math.random.
// All animations and DOM measurements happen in effects in the view layer.

import { GC } from "../../shared/biology/geneticCode.js";
import { ac } from "../../shared/biology/translation.js";
import { ORIG_CODONS } from "../../shared/biology/constants.js";
import { TRANSLATION_STEPS } from "./stepDefinitions.js";

// ─────────────────────────────────────────────────────────────────────
// Initial state — the state when the page first loads or after Reset
// ─────────────────────────────────────────────────────────────────────

export const initialState = {
  stepIndex: -1,
  phase: null,
  protein: [],
  codonStates: ORIG_CODONS.map(() => "upcoming"),
  riboVisible: false,
  riboLargeVisible: true,
  riboLargePreview: false,
  riboFading: false,
  riboCodonIndex: 0,
  trnas: [],
  releaseFactor: null,
  lookupCodon: null,
};

// ─────────────────────────────────────────────────────────────────────
// The reducer
// ─────────────────────────────────────────────────────────────────────

export function walkthroughReducer(state, action) {
  switch (action.type) {
    case "RESET":
      return initialState;

    case "NEXT_STEP": {
      const nextIndex = state.stepIndex + 1;
      if (nextIndex >= TRANSLATION_STEPS.length) {
        // Already at the last step; no-op.
        return state;
      }
      return computeStateAtStep(state, nextIndex);
    }

    case "JUMP_TO_STEP": {
      const idx = action.index;
      if (idx < -1 || idx >= TRANSLATION_STEPS.length) return state;
      if (idx === -1) return initialState;
      // Build state by replaying from the initial state up to idx.
      // This keeps the polypeptide and codon-state evolution correct.
      let s = initialState;
      for (let i = 0; i <= idx; i++) {
        s = computeStateAtStep(s, i);
      }
      return s;
    }

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────
// Step computation — given the previous state and the new step index,
// produce the new state. The previous state is needed because the
// protein array carries over from one step to the next.
// ─────────────────────────────────────────────────────────────────────

function computeStateAtStep(prevState, newIndex) {
  const step = TRANSLATION_STEPS[newIndex];

  // Start from a copy of the previous state, then mutate the copy
  // according to the step's action. This is safe because we never
  // touch `prevState` itself.
  const next = {
    ...prevState,
    stepIndex: newIndex,
    phase: step.phase,
  };

  switch (step.action) {
    case "showMRNA": {
      // The mRNA appears. Ribosome stays hidden.
      next.riboVisible = false;
      next.riboLargePreview = false;
      next.lookupCodon = null;
      next.trnas = [];
      next.releaseFactor = null;
      break;
    }

    case "showSmall": {
      // 40S subunit lands on AUG. Mark codon 0 active.
      next.riboVisible = true;
      next.riboLargeVisible = false;
      next.riboLargePreview = false;
      next.riboCodonIndex = 0;
      next.codonStates = makeStates(0, [0]);
      next.lookupCodon = "AUG";
      next.trnas = [];
      next.releaseFactor = null;
      break;
    }

    case "initTRNA": {
      // Initiator Met-tRNA arrives at P-site.
      next.riboLargePreview = true;
      next.trnas = [
        {
          site: "p",
          codonIndex: 0,
          anticodon: ac(ORIG_CODONS[0]),  // UAC
          aminoAcid: "Met",
          entering: true,
        },
      ];
      break;
    }

    case "showLarge": {
      // 60S subunit joins, Met is added to polypeptide,
      // codon 1 becomes active alongside codon 0.
      next.riboLargeVisible = true;
      next.riboLargePreview = false;
      next.protein = ["Met"];
      next.codonStates = makeStates(0, [0, 1]);
      break;
    }

    case "arrive": {
      // A new charged tRNA arrives at A-site. The P-site tRNA from
      // the previous codon is now empty (its amino acid was bonded).
      const ci = step.codonIndex;
      const codon = ORIG_CODONS[ci];
      const aa = GC[codon];
      next.trnas = [
        {
          site: "p",
          codonIndex: ci - 1,
          anticodon: ac(ORIG_CODONS[ci - 1]),
          aminoAcid: null, // empty after bonding
          entering: false,
        },
        {
          site: "a",
          codonIndex: ci,
          anticodon: ac(codon),
          aminoAcid: aa,
          entering: true,
        },
      ];
      next.codonStates = makeStates(ci - 1, [ci - 1, ci]);
      next.lookupCodon = codon;
      break;
    }

    case "bond": {
      // Peptide bond forms inside the ribosome. We wait until
      // translocation to show the new amino acid in the external chain,
      // so students see it emerge only after the peptidyl-tRNA reaches P.
      break;
    }

    case "shift": {
      // Translocation: ribosome slides forward one codon.
      const ci = step.codonIndex;
      const aa = GC[ORIG_CODONS[ci]];
      next.riboCodonIndex = ci;
      next.codonStates = makeStates(ci, [ci, ci + 1]);
      if (aa && aa !== "STOP" && prevState.protein.length < ci + 1) {
        next.protein = [...prevState.protein, aa];
      }
      next.trnas = [
        {
          site: "p",
          codonIndex: ci,
          anticodon: ac(ORIG_CODONS[ci]),
          aminoAcid: null,
          entering: false,
        },
      ];
      next.lookupCodon =
        ci + 1 < ORIG_CODONS.length ? ORIG_CODONS[ci + 1] : null;
      break;
    }

    case "stop": {
      // STOP codon reached. Release factor enters; tRNAs cleared.
      const ci = step.codonIndex;
      next.codonStates = ORIG_CODONS.map((_, i) =>
        i === ci ? "stop-hit" : i < ci ? "done" : "upcoming"
      );
      next.trnas = [];
      next.releaseFactor = { codonIndex: ci };
      next.lookupCodon = ORIG_CODONS[ci];
      break;
    }

    case "release": {
      // Protein is released, ribosome fades out.
      next.riboFading = true;
      next.releaseFactor = null;
      next.trnas = [];
      next.lookupCodon = null;
      break;
    }

    default:
      // Unknown action — leave state unchanged.
      break;
  }

  return next;
}

// ─────────────────────────────────────────────────────────────────────
// Helpers for computing the codonStates array.
// ─────────────────────────────────────────────────────────────────────

// Build a codonStates array where codons [0..riboPos-1] are "done",
// codons in `activeIndices` are "active", and the rest are "upcoming".
function makeStates(riboPos, activeIndices) {
  const activeSet = new Set(activeIndices);
  return ORIG_CODONS.map((_, i) => {
    if (activeSet.has(i)) return "active";
    if (i < riboPos) return "done";
    return "upcoming";
  });
}

