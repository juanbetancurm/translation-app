//
// The reference (wild-type) mRNA sequence used throughout the app, plus
// its precomputed codon and protein representations.
//
// Both modules in the app refer to this:
// - Translation Walkthrough uses it as the sequence to animate.
// - Mutation Simulator uses it as the baseline to mutate from and to
//   diff the resulting mutant protein against.
//
// Changing ORIG_SEQ here is the single point of change for the entire app's
// demonstration sequence. ORIG_CODONS and ORIG_PROTEIN are derived from it
// and recomputed automatically at module load time.

import { splitCodons, translateSeq } from "./translation";

// The 24-base reference mRNA sequence. Encodes Met-Pro-Glu-Phe-Gly-Lys-Pro
// followed by a UGA STOP codon.
export const ORIG_SEQ = "AUGCCUGAAUUCGGAAAGCCAUGA";

// The reference sequence broken into 8 three-letter codons.
// Computed once at module load.
export const ORIG_CODONS = splitCodons(ORIG_SEQ);

// The protein produced by translating the reference sequence.
// 7 amino acids: Met-Pro-Glu-Phe-Gly-Lys-Pro (the trailing UGA is STOP and
// is not represented in the protein).
export const ORIG_PROTEIN = translateSeq(ORIG_SEQ);