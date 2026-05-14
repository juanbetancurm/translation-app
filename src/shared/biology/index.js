//
// Barrel re-export for the shared/biology module.
//
// Consumers import from "shared/biology" (or a relative path to this folder)
// and receive the public API of the biology layer without needing to know
// which internal file each symbol comes from.
//
// If you reorganize the internal files, update this barrel — but every
// consumer continues to work unchanged. This is the encapsulation benefit
// of barrel files.

export { GC, AA_COL } from "./geneticCode";
export { splitCodons, translateSeq, ac } from "./translation";
export { ORIG_SEQ, ORIG_CODONS, ORIG_PROTEIN } from "./constants";