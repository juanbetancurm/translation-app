// 
//
// The mRNA strand: a row of Codon blocks with the 5' / 3' direction
// indicators above them. This is the canvas on which the ribosome appears
// to slide during translation.
//
// Props:
//   codons         array of 3-letter strings, e.g. ["AUG", "CCU", ...]
//   labels         array of amino acid labels for each codon
//   states         array of state strings, one per codon
//   mutatedPositions  optional Set of mutated base indices, indexed across
//                     the full sequence (0..(codons.length*3 - 1))
//   strandId       optional unique HTML id prefix for the codon elements;
//                  each codon gets id = `${strandId}-c${codonIndex}`. Used
//                  by the ribosome positioning code in Phase 4.
//   headerLabel    optional override for the middle header label
//                  (default "mRNA"; the Mutation Simulator uses "Mutated mRNA")

import Codon from "./Codon";
import "./MrnaStrand.css";

export default function MrnaStrand({
  codons,
  labels,
  states,
  mutatedPositions,
  strandId,
  headerLabel = "mRNA",
}) {
  // For each codon, derive which of its three base positions are mutated.
  // The incoming mutatedPositions Set is sequence-wide, so we have to
  // partition it per codon.
  function basesMutatedInCodon(codonIndex) {
    if (!mutatedPositions) return null;
    const start = codonIndex * 3;
    const set = new Set();
    for (let i = 0; i < 3; i++) {
      if (mutatedPositions.has(start + i)) set.add(i);
    }
    return set.size > 0 ? set : null;
  }

  return (
    <div className="mrna-row">
      <div className="mrna-lbl">
        <span>5' ─</span>
        <span>{headerLabel}</span>
        <span>─ 3'</span>
      </div>
      <div className="mrna">
        {codons.map((codonBases, i) => (
          <Codon
            key={i}
            id={strandId ? `${strandId}-c${i}` : undefined}
            bases={codonBases}
            label={labels[i]}
            state={states[i]}
            mutatedBaseIndices={basesMutatedInCodon(i)}
          />
        ))}
      </div>
    </div>
  );
}