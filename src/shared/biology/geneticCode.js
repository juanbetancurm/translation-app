//
// The standard nuclear genetic code: 64 three-letter RNA codons mapped to
// either an amino acid (3-letter abbreviation) or the literal string "STOP".
//
// Three codons are STOP signals: UAA, UAG, UGA.
// Sixty-one codons code for the 20 standard amino acids.
//
// This table is the single source of truth for all translation in the app.

export const GC = {
  // Phenylalanine, Leucine
  UUU: "Phe", UUC: "Phe", UUA: "Leu", UUG: "Leu",
  CUU: "Leu", CUC: "Leu", CUA: "Leu", CUG: "Leu",
  // Isoleucine, Methionine (start codon)
  AUU: "Ile", AUC: "Ile", AUA: "Ile", AUG: "Met",
  // Valine
  GUU: "Val", GUC: "Val", GUA: "Val", GUG: "Val",
  // Serine
  UCU: "Ser", UCC: "Ser", UCA: "Ser", UCG: "Ser",
  // Proline
  CCU: "Pro", CCC: "Pro", CCA: "Pro", CCG: "Pro",
  // Threonine
  ACU: "Thr", ACC: "Thr", ACA: "Thr", ACG: "Thr",
  // Alanine
  GCU: "Ala", GCC: "Ala", GCA: "Ala", GCG: "Ala",
  // Tyrosine, STOP, STOP
  UAU: "Tyr", UAC: "Tyr", UAA: "STOP", UAG: "STOP",
  // Histidine, Glutamine
  CAU: "His", CAC: "His", CAA: "Gln", CAG: "Gln",
  // Asparagine, Lysine
  AAU: "Asn", AAC: "Asn", AAA: "Lys", AAG: "Lys",
  // Aspartate, Glutamate
  GAU: "Asp", GAC: "Asp", GAA: "Glu", GAG: "Glu",
  // Cysteine, STOP, Tryptophan
  UGU: "Cys", UGC: "Cys", UGA: "STOP", UGG: "Trp",
  // Arginine
  CGU: "Arg", CGC: "Arg", CGA: "Arg", CGG: "Arg",
  // Serine, Arginine
  AGU: "Ser", AGC: "Ser", AGA: "Arg", AGG: "Arg",
  // Glycine
  GGU: "Gly", GGC: "Gly", GGA: "Gly", GGG: "Gly",
};

// Display colors for each amino acid, used to paint the polypeptide chain
// beads and the tRNA amino-acid labels. Values are CSS-compatible hex
// strings. These are visual choices, not biology — keep them in sync with
// the design token palette in index.css.
export const AA_COL = {
  Met: "#2dd4a8",
  Pro: "#3db9f5",
  Glu: "#f56b81",
  Phe: "#a07bf5",
  Gly: "#f5b731",
  Lys: "#25cdb7",
  Ala: "#6d8cff",
  Arg: "#e879a8",
  Ser: "#4ade80",
  Trp: "#c084fc",
  Tyr: "#f5b731",
  His: "#22d3ee",
  Ile: "#f56b81",
  Val: "#a3e635",
  Leu: "#fb923c",
  Thr: "#3db9f5",
  Asn: "#2dd4a8",
  Asp: "#f56b81",
  Gln: "#6d8cff",
  Cys: "#f5b731",
};