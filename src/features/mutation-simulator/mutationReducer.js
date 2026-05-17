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

import { ORIG_SEQ } from "../../shared/biology/constants.js";

const BASE_CYCLE = ["A", "U", "C", "G"];
const ORIG_BASES = ORIG_SEQ.split("");

export const initialMutationState = {
  bases: ORIG_BASES,
  tool: "change",
  changes: new Map(),
};

export function mutationReducer(state, action) {
  switch (action.type) {
    case "SET_TOOL":
      return { ...state, tool: action.tool };

    case "RESET_SEQUENCE":
      return initialMutationState;

    case "CLICK_BASE":
      return applyClick(state, action.index);

    default:
      return state;
  }
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

export function getEffectiveSequence(bases) {
  return bases.filter((base) => base !== "X").join("");
}
