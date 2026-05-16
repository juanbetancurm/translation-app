//
// Pure functions that operate on mRNA sequences.
// No DOM access, no React, no side effects — these functions are
// deterministic and safe to call from any context (UI, tests, server).
//
// All sequences are uppercase RNA strings using only A, U, C, G.
// "X" is used elsewhere in the app to represent a deleted base in the
// mutation editor, but should be filtered out *before* calling these
// functions. They expect clean sequences.

import { GC } from "./geneticCode.js";

// Split a sequence into an array of three-letter codons.
// Any trailing partial codon (1 or 2 leftover bases) is discarded,
// because a ribosome reads in strict triplets.
//
// Example: splitCodons("AUGCCUGA") => ["AUG", "CCU"]   (the trailing "GA" is dropped)
export function splitCodons(seq) {
  const codons = [];
  for (let i = 0; i + 3 <= seq.length; i += 3) {
    codons.push(seq.substring(i, i + 3));
  }
  return codons;
}

// Translate an mRNA sequence into an array of amino acid names.
// Stops at the first STOP codon (which is NOT included in the result)
// or at the end of the input. Unknown codons also terminate translation,
// mimicking what the ribosome would do when faced with malformed input.
//
// Example: translateSeq("AUGCCUGAAUGA") => ["Met", "Pro", "Glu"]
//   (the final UGA is a STOP and ends translation)
export function translateSeq(seq) {
  const codons = splitCodons(seq);
  const protein = [];
  for (const codon of codons) {
    const aa = GC[codon];
    if (!aa) break;             // unknown codon (defensive)
    if (aa === "STOP") break;   // normal termination
    protein.push(aa);
  }
  return protein;
}

// Compute the anticodon — the Watson-Crick complement of a codon.
// In RNA: A pairs with U, G pairs with C, and vice versa.
// The anticodon is what's displayed on the tRNA molecule's head,
// matching the mRNA codon it reads.
//
// Example: ac("AUG") => "UAC"
//          ac("CCU") => "GGA"
export function ac(codon) {
  const pair = { A: "U", U: "A", G: "C", C: "G" };
  return codon
    .split("")
    .map((base) => pair[base])
    .join("");
}