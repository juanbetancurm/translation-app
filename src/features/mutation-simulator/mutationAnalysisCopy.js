import { MUTATION_TYPES } from "./mutationClassifier.js";

const TYPE_KEYS = {
  [MUTATION_TYPES.NO_CHANGE]: "noChange",
  [MUTATION_TYPES.START_LOST]: "startLost",
  [MUTATION_TYPES.FRAMESHIFT_INS]: "frameshiftIns",
  [MUTATION_TYPES.FRAMESHIFT_DEL]: "frameshiftDel",
  [MUTATION_TYPES.IN_FRAME_INS]: "inFrameIns",
  [MUTATION_TYPES.IN_FRAME_DEL]: "inFrameDel",
  [MUTATION_TYPES.NONSENSE]: "nonsense",
  [MUTATION_TYPES.MISSENSE]: "missense",
  [MUTATION_TYPES.SYNONYMOUS]: "synonymous",
};

const IMPACT_KEYS = {
  None: "none",
  High: "high",
  Moderate: "moderate",
  Low: "low",
};

export function getMutationTypeKey(type) {
  return TYPE_KEYS[type] ?? "missense";
}

export function getImpactKey(impact) {
  return IMPACT_KEYS[impact] ?? "moderate";
}

export function getAnalysisCopy(analysis, t) {
  const typeKey = getMutationTypeKey(analysis.type);
  const impactKey = getImpactKey(analysis.impact);
  const params = {
    ...analysis,
    diffCount: analysis.diffPositions?.length ?? 0,
    originalProteinLength: analysis.originalProtein?.length ?? 0,
  };

  let explanationKey = typeKey;
  if (typeKey === "inFrameIns" || typeKey === "inFrameDel") {
    explanationKey = "inFrame";
  } else if (typeKey === "frameshiftIns" || typeKey === "frameshiftDel") {
    explanationKey = "frameshift";
  }

  return {
    typeLabel: t(`mutation.analysis.types.${typeKey}`),
    impactLabel: t(`mutation.analysis.impacts.${impactKey}`),
    explanation: t(`mutation.analysis.explanations.${explanationKey}`, params),
  };
}
