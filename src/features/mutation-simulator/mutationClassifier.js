//
// Pure mutation classification: given a mutated mRNA sequence, return
// what kind of mutation it represents and what it does to the protein.
//
// The order of checks is significant. Length-changing variants must be
// classified before codon-by-codon comparisons, because frameshifts can
// otherwise look like many missense changes.

import { ORIG_SEQ, ORIG_CODONS } from "../../shared/biology/constants.js";
import { GC } from "../../shared/biology/geneticCode.js";
import { splitCodons, translateSeq } from "../../shared/biology/translation.js";

const STOP_CODONS = new Set(["UAA", "UAG", "UGA"]);

export const MUTATION_TYPES = {
  NO_CHANGE: "No change",
  START_LOST: "Start lost",
  FRAMESHIFT_INS: "Frameshift insertion",
  FRAMESHIFT_DEL: "Frameshift deletion",
  IN_FRAME_INS: "In-frame insertion",
  IN_FRAME_DEL: "In-frame deletion",
  NONSENSE: "Nonsense",
  MISSENSE: "Missense",
  SYNONYMOUS: "Synonymous",
};

export function classifyMutation(mutantSeq) {
  const originalSeq = ORIG_SEQ;
  const originalProtein = translateSeq(originalSeq);

  if (mutantSeq === originalSeq) {
    return result({
      type: MUTATION_TYPES.NO_CHANGE,
      impact: "None",
      summary: "No change",
      explanation:
        "The sequence is identical to the original. No mutation has been applied.",
      mutantProtein: originalProtein,
      originalProtein,
      diffPositions: [],
    });
  }

  const mutantStart = mutantSeq.slice(0, 3);
  if (mutantStart !== "AUG") {
    return result({
      type: MUTATION_TYPES.START_LOST,
      impact: "High",
      summary: "Start lost - High impact",
      explanation:
        `The first codon is "${mutantStart}", not AUG. The ribosome's small ` +
        "subunit scans for AUG to initiate translation; without it, no " +
        "protein is produced from this mRNA. This is one of the most damaging " +
        "classes of variant.",
      mutantProtein: [],
      originalProtein,
      diffPositions: [],
    });
  }

  const lengthDiff = mutantSeq.length - originalSeq.length;
  if (lengthDiff !== 0) {
    const mutantProtein = translateSeq(mutantSeq);
    const diffPositions = diffProteinPositions(originalProtein, mutantProtein);
    const isInFrame = Math.abs(lengthDiff) % 3 === 0;

    if (isInFrame) {
      return result({
        type:
          lengthDiff > 0
            ? MUTATION_TYPES.IN_FRAME_INS
            : MUTATION_TYPES.IN_FRAME_DEL,
        impact: "Moderate",
        summary:
          lengthDiff > 0
            ? "In-frame insertion - Moderate impact"
            : "In-frame deletion - Moderate impact",
        explanation:
          `The sequence length changed by ${lengthDiff} bases, a multiple of 3. ` +
          "The reading frame is preserved, but the protein gains or loses " +
          "one or more amino acids. Protein function may be partially preserved.",
        mutantProtein,
        originalProtein,
        diffPositions,
      });
    }

    return result({
      type:
        lengthDiff > 0
          ? MUTATION_TYPES.FRAMESHIFT_INS
          : MUTATION_TYPES.FRAMESHIFT_DEL,
      impact: "High",
      summary:
        lengthDiff > 0
          ? "Frameshift insertion - High impact"
          : "Frameshift deletion - High impact",
      explanation:
        `${Math.abs(lengthDiff)} ${lengthDiff > 0 ? "extra" : "missing"} base(s). ` +
        "The number is not a multiple of 3, so the reading frame shifts from " +
        "the indel onward. Every downstream codon is now read incorrectly, " +
        "usually leading to a premature STOP. Function is almost always lost.",
      mutantProtein,
      originalProtein,
      diffPositions,
    });
  }

  const mutantCodons = splitCodons(mutantSeq);
  const mutantProtein = translateSeq(mutantSeq);
  const originalStopIndex = ORIG_CODONS.length - 1;
  const mutantStopIndex = mutantCodons.findIndex((codon) =>
    STOP_CODONS.has(codon)
  );

  if (mutantStopIndex !== -1 && mutantStopIndex < originalStopIndex) {
    return result({
      type: MUTATION_TYPES.NONSENSE,
      impact: "High",
      summary: "Nonsense - High impact",
      explanation:
        `Codon ${mutantStopIndex + 1} is now a STOP codon ` +
        `(${mutantCodons[mutantStopIndex]}). The ribosome terminates ` +
        "translation early, producing a truncated protein with " +
        `${mutantStopIndex} amino acids instead of ${originalProtein.length}. ` +
        "Truncated proteins almost always fail to fold correctly and are " +
        "typically degraded.",
      mutantProtein,
      originalProtein,
      diffPositions: positionsFrom(mutantStopIndex, originalProtein.length),
      stopCodon: mutantCodons[mutantStopIndex],
      stopCodonIndex: mutantStopIndex,
      originalCodon: ORIG_CODONS[mutantStopIndex],
      mutantCodon: mutantCodons[mutantStopIndex],
      originalAminoAcid: translateCodon(ORIG_CODONS[mutantStopIndex]),
    });
  }

  const diffPositions = diffProteinPositions(originalProtein, mutantProtein);
  if (diffPositions.length === 0) {
    return result({
      type: MUTATION_TYPES.SYNONYMOUS,
      impact: "Low",
      summary: "Synonymous - Low impact",
      explanation:
        "Bases have changed but the protein is unchanged. This is possible " +
        "because the genetic code is degenerate: multiple codons can encode " +
        "the same amino acid. Synonymous variants are generally tolerated.",
      mutantProtein,
      originalProtein,
      diffPositions: [],
    });
  }

  return result({
    type: MUTATION_TYPES.MISSENSE,
    impact: "Moderate",
    summary: "Missense - Moderate impact",
    explanation:
      `${diffPositions.length} amino acid(s) differ from the original. ` +
      "Each changed codon now encodes a different amino acid. Whether the " +
      "protein still functions depends on which residues changed and what " +
      "they were replaced with.",
    mutantProtein,
    originalProtein,
    diffPositions,
  });
}

function result(obj) {
  return obj;
}

function diffProteinPositions(originalProtein, mutantProtein) {
  const len = Math.max(originalProtein.length, mutantProtein.length);
  const diff = [];
  for (let i = 0; i < len; i++) {
    if (originalProtein[i] !== mutantProtein[i]) {
      diff.push(i);
    }
  }
  return diff;
}

function positionsFrom(start, end) {
  const out = [];
  for (let i = start; i < end; i++) out.push(i);
  return out;
}

function translateCodon(codon) {
  return codon ? GC[codon] : null;
}
