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
  Met: "#0f9f77",
  Pro: "#2563eb",
  Glu: "#d42f50",
  Phe: "#7c3aed",
  Gly: "#c48a12",
  Lys: "#0f766e",
  Ala: "#3b82f6",
  Arg: "#db2777",
  Ser: "#16a34a",
  Trp: "#7c3aed",
  Tyr: "#c48a12",
  His: "#0891b2",
  Ile: "#e11d48",
  Val: "#65a30d",
  Leu: "#ea580c",
  Thr: "#2563eb",
  Asn: "#0f9f77",
  Asp: "#d42f50",
  Gln: "#3b82f6",
  Cys: "#c48a12",
};
