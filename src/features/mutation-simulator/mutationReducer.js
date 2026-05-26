//
// State machine for the Mutation Simulator.
//
// State shape:
//   bases       array of single-character strings (A/U/C/G/X).
//               Same length as ORIG_SEQ plus any insertions. Deleted bases
//               are represented by "X" to preserve the original slot.
//   tool        currently selected editing tool: "change" | "delete" | "insert"
//   changes     Map<number, { type, originalBase? }> describing which
//               positions in `bases` have been modified and how.
//
// Actions:
//   { type: "SET_TOOL", tool }
//   { type: "CLICK_BASE", index }
//   { type: "RESET_SEQUENCE" }
//   { type: "APPLY_PRESET_AND_TRANSLATE", presetId }
//   { type: "JUMP_TO_ANIMATION_STEP", actionName?, codonIndex?, stepIndex? }

import { ORIG_SEQ } from "../../shared/biology/constants.js";
import { GC } from "../../shared/biology/geneticCode.js";
import { splitCodons } from "../../shared/biology/translation.js";
import { classifyMutation, MUTATION_TYPES } from "./mutationClassifier.js";

const BASE_CYCLE = ["A", "U", "C", "G"];
const ORIG_BASES = ORIG_SEQ.split("");

const initialAnimationState = {
  isPlaying: false,
  stepIndex: -1,
  riboCodonIndex: 0,
  protein: [],
  isFinished: false,
  speed: 1000,
};

export const PRESETS = [
  {
    id: "missense",
    label: "Missense (mod)",
    classification: "Missense - Moderate impact",
    edits: [{ op: "change", index: 4, to: "A" }],
  },
  {
    id: "nonsense",
    label: "Nonsense (high)",
    classification: "Nonsense - High impact",
    edits: [{ op: "change", index: 6, to: "U" }],
  },
  {
    id: "synonymous",
    label: "Synonymous (low)",
    classification: "Synonymous - Low impact",
    edits: [{ op: "change", index: 11, to: "U" }],
  },
  {
    id: "frameshift-del",
    label: "Frameshift (del)",
    classification: "Frameshift deletion - High impact",
    edits: [{ op: "delete", index: 3 }],
  },
  {
    id: "frameshift-ins",
    label: "Frameshift (ins)",
    classification: "Frameshift insertion - High impact",
    edits: [{ op: "insert", afterIndex: 2, base: "G" }],
  },
  {
    id: "start-lost",
    label: "Start lost (high)",
    classification: "Start lost - High impact",
    edits: [{ op: "change", index: 0, to: "G" }],
  },
];

export const initialMutationState = {
  bases: ORIG_BASES,
  tool: "change",
  changes: new Map(),
  analysis: null,
  animation: initialAnimationState,
};

export function mutationReducer(state, action) {
  switch (action.type) {
    case "SET_TOOL":
      return { ...state, tool: action.tool };

    case "RESET_SEQUENCE":
      return initialMutationState;

    case "CLICK_BASE":
      return applyClick(state, action.index);

    case "APPLY_PRESET":
      return {
        ...applyPreset(action.presetId),
        analysis: null,
        animation: initialAnimationState,
      };

    case "APPLY_PRESET_AND_TRANSLATE": {
      const presetState = applyPreset(action.presetId);
      const effectiveSeq = getEffectiveSequence(presetState.bases);
      const analysis = classifyMutation(effectiveSeq);
      return { ...presetState, analysis, animation: initialAnimationState };
    }

    case "TRANSLATE_MUTANT": {
      const effectiveSeq = getEffectiveSequence(state.bases);
      const analysis = classifyMutation(effectiveSeq);
      return { ...state, analysis, animation: initialAnimationState };
    }

    case "START_TRANSLATION": {
      if (isStartLost(state)) {
        return {
          ...state,
          animation: {
            ...state.animation,
            isPlaying: false,
            stepIndex: -1,
            riboCodonIndex: 0,
            protein: [],
            isFinished: true,
          },
        };
      }

      const shouldResume =
        state.animation.stepIndex >= 0 && !state.animation.isFinished;
      return {
        ...state,
        animation: {
          ...state.animation,
          isPlaying: true,
          stepIndex: shouldResume ? state.animation.stepIndex : -1,
          riboCodonIndex: shouldResume ? state.animation.riboCodonIndex : 0,
          protein: shouldResume ? state.animation.protein : [],
          isFinished: false,
        },
      };
    }

    case "ANIMATION_TICK":
      return advanceAnimation(state);

    case "JUMP_TO_ANIMATION_STEP":
      return jumpToAnimationStep(state, action);

    case "STOP_TRANSLATION":
      return {
        ...state,
        animation: {
          ...state.animation,
          isPlaying: false,
        },
      };

    case "SET_ANIMATION_SPEED":
      return {
        ...state,
        animation: {
          ...state.animation,
          speed: action.speed,
        },
      };

    case "RESET_TRANSLATION_ANIMATION":
      return {
        ...state,
        animation: initialAnimationState,
      };

    default:
      return state;
  }
}

function advanceAnimation(state) {
  const { animation } = state;
  if (isStartLost(state)) {
    return {
      ...state,
      animation: {
        ...animation,
        isPlaying: false,
        stepIndex: -1,
        riboCodonIndex: 0,
        protein: [],
        isFinished: true,
      },
    };
  }
  if (animation.isFinished) return state;

  const codons = splitCodons(getEffectiveSequence(state.bases));
  const steps = buildMutationAnimationSteps(codons);
  const nextStep = animation.stepIndex + 1;

  if (nextStep >= steps.length) {
    return {
      ...state,
      animation: {
        ...animation,
        isPlaying: false,
        isFinished: true,
      },
    };
  }

  const nextAnimation = applyAnimationVisualStep(
    animation,
    steps[nextStep],
    codons
  );

  return {
    ...state,
    animation: nextAnimation,
  };
}

function jumpToAnimationStep(state, action) {
  if (!state.analysis || isStartLost(state)) return state;

  const codons = splitCodons(getEffectiveSequence(state.bases));
  const steps = buildMutationAnimationSteps(codons);
  if (steps.length === 0) return state;

  const stepIndex = resolveAnimationStepIndex(steps, action);
  if (stepIndex < 0) return state;

  let animation = {
    ...initialAnimationState,
    speed: state.animation.speed,
  };

  for (let i = 0; i <= stepIndex; i++) {
    animation = applyAnimationVisualStep(animation, steps[i], codons);
  }

  return {
    ...state,
    animation: {
      ...animation,
      isPlaying: false,
    },
  };
}

function resolveAnimationStepIndex(steps, action) {
  if (Number.isInteger(action.stepIndex)) {
    return Math.min(Math.max(action.stepIndex, 0), steps.length - 1);
  }

  return steps.findIndex((step) => {
    const actionMatches =
      !action.actionName || step.action === action.actionName;
    const codonMatches =
      !Number.isInteger(action.codonIndex) ||
      step.codonIndex === action.codonIndex;

    return actionMatches && codonMatches;
  });
}

function applyAnimationVisualStep(animation, visualStep, codons) {
  const isRelease = visualStep.action === "release";
  const aminoAcid =
    visualStep.action === "showLarge" ? "Met" :
    visualStep.action === "shift" ? GC[codons[visualStep.codonIndex]] :
    null;
  const nextProtein =
    aminoAcid && animation.protein.length < visualStep.proteinLength
      ? [...animation.protein, aminoAcid]
      : animation.protein;

  return {
    ...animation,
    stepIndex: visualStep.stepIndex ?? animation.stepIndex + 1,
    riboCodonIndex: visualStep.riboCodonIndex,
    protein: nextProtein,
    isPlaying: isRelease ? false : animation.isPlaying,
    isFinished: isRelease,
  };
}

export function buildMutationAnimationSteps(codons) {
  if (codons.length === 0 || codons[0] !== "AUG") return [];

  const steps = [
    {
      action: "showSmall",
      codonIndex: 0,
      riboCodonIndex: 0,
      activeIndices: [0],
      proteinLength: 0,
    },
    {
      action: "initTRNA",
      codonIndex: 0,
      riboCodonIndex: 0,
      activeIndices: [0],
      proteinLength: 0,
    },
    {
      action: "showLarge",
      codonIndex: 0,
      riboCodonIndex: 0,
      activeIndices: [0, 1],
      proteinLength: 1,
    },
  ];

  for (let i = 1; i < codons.length; i++) {
    const aminoAcid = GC[codons[i]];

    if (aminoAcid === "STOP") {
      steps.push({
        action: "stop",
        codonIndex: i,
        riboCodonIndex: Math.max(0, i - 1),
        activeIndices: [i],
        proteinLength: steps.at(-1)?.proteinLength ?? 0,
      });
      steps.push({
        action: "release",
        codonIndex: i,
        riboCodonIndex: Math.max(0, i - 1),
        activeIndices: [i],
        proteinLength: steps.at(-1)?.proteinLength ?? 0,
      });
      break;
    }

    if (!aminoAcid) break;

    const previousProteinLength = steps.at(-1)?.proteinLength ?? 0;
    steps.push({
      action: "arrive",
      codonIndex: i,
      riboCodonIndex: i - 1,
      activeIndices: [i - 1, i],
      proteinLength: previousProteinLength,
    });
    steps.push({
      action: "bond",
      codonIndex: i,
      riboCodonIndex: i - 1,
      activeIndices: [i - 1, i],
      proteinLength: previousProteinLength,
    });
    steps.push({
      action: "shift",
      codonIndex: i,
      riboCodonIndex: i,
      activeIndices: i + 1 < codons.length ? [i, i + 1] : [i],
      proteinLength: previousProteinLength + 1,
    });
  }

  const last = steps.at(-1);
  if (last && last.action !== "release") {
    steps.push({
      action: "release",
      codonIndex: last.codonIndex,
      riboCodonIndex: last.riboCodonIndex,
      activeIndices: last.activeIndices,
      proteinLength: last.proteinLength,
    });
  }

  return steps;
}

function isStartLost(state) {
  return state.analysis?.type === MUTATION_TYPES.START_LOST;
}

function applyClick(state, index) {
  switch (state.tool) {
    case "change":
      return applyChangeClick(state, index);
    case "delete":
      return applyDeleteClick(state, index);
    case "insert":
      return applyInsertClick(state, index);
    default:
      return state;
  }
}

function applyChangeClick(state, index) {
  const current = state.bases[index];
  const cycleIdx = BASE_CYCLE.indexOf(current);
  const nextBase = BASE_CYCLE[(cycleIdx + 1) % BASE_CYCLE.length];

  const newBases = [...state.bases];
  newBases[index] = nextBase;

  const newChanges = new Map(state.changes);
  const originalAtIndex = ORIG_BASES[index];
  const existing = newChanges.get(index);

  if (existing?.type === "insert") {
    newChanges.set(index, { type: "insert" });
  } else if (index < ORIG_BASES.length && nextBase !== originalAtIndex) {
    newChanges.set(index, { type: "change", originalBase: originalAtIndex });
  } else {
    newChanges.delete(index);
  }

  return { ...state, bases: newBases, changes: newChanges };
}

function applyDeleteClick(state, index) {
  const existing = state.changes.get(index);
  const newBases = [...state.bases];
  const newChanges = new Map(state.changes);

  if (existing?.type === "delete") {
    newBases[index] = existing.originalBase ?? ORIG_BASES[index] ?? "A";
    newChanges.delete(index);
  } else {
    newChanges.set(index, {
      type: "delete",
      originalBase: state.bases[index],
    });
    newBases[index] = "X";
  }

  return { ...state, bases: newBases, changes: newChanges };
}

function applyInsertClick(state, index) {
  const newBases = [...state.bases];
  newBases.splice(index + 1, 0, "A");

  const newChanges = new Map();
  for (const [pos, change] of state.changes) {
    if (pos > index) {
      newChanges.set(pos + 1, change);
    } else {
      newChanges.set(pos, change);
    }
  }
  newChanges.set(index + 1, { type: "insert" });

  return { ...state, bases: newBases, changes: newChanges };
}

function applyPreset(presetId) {
  const preset = PRESETS.find((candidate) => candidate.id === presetId);
  if (!preset) return initialMutationState;

  let state = initialMutationState;

  for (const edit of preset.edits) {
    if (edit.op === "change") {
      let current = state.bases[edit.index];
      let safety = 0;
      while (current !== edit.to && safety < BASE_CYCLE.length) {
        state = applyChangeClick(state, edit.index);
        current = state.bases[edit.index];
        safety++;
      }
    } else if (edit.op === "delete") {
      state = applyDeleteClick(state, edit.index);
    } else if (edit.op === "insert") {
      state = applyInsertClick(state, edit.afterIndex);
      const insertedIndex = edit.afterIndex + 1;
      let current = state.bases[insertedIndex];
      let safety = 0;
      while (current !== edit.base && safety < BASE_CYCLE.length) {
        state = applyChangeClick(state, insertedIndex);
        current = state.bases[insertedIndex];
        safety++;
      }
    }
  }

  return state;
}

export function getEffectiveSequence(bases) {
  return bases.filter((base) => base !== "X").join("");
}
