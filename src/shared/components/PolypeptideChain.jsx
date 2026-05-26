// 
//
// The growing polypeptide chain: a row of colored amino acid beads with
// em-dash peptide bond separators between them. New beads pop in with a
// scale-from-zero animation when the array grows.
//
// In the Translation Walkthrough, this renders once and grows as the
// ribosome works. In the Mutation Simulator, two instances are rendered:
// one for the normal protein, one for the mutant, and the mutant one uses
// wrongFromIndex to mark mismatched amino acids with a dashed border.
//
// Props:
//   aminoAcids       array of amino acid name strings, e.g. ["Met", "Pro"]
//   wrongFromIndex   optional number; beads at index >= this value are
//                    rendered with a dashed border (the "wrong" style)
//   label            caption text above the chain
//                    (default: "Growing polypeptide:")
//   dataGuide        optional stable tour target

import { AA_COL } from "../biology/geneticCode.js";
import "./PolypeptideChain.css";

export default function PolypeptideChain({
  aminoAcids,
  wrongFromIndex,
  label = "Growing polypeptide:",
  dataGuide,
}) {
  return (
    <div className="pep-area" data-guide={dataGuide}>
      <div className="pep-lbl">{label}</div>
      <div className="pep">
        {aminoAcids.map((aa, i) => {
          const color = AA_COL[aa] || "#8d99b4";
          const isWrong =
            wrongFromIndex !== undefined && i >= wrongFromIndex;
          return (
            <span key={i} style={{ display: "contents" }}>
              {i > 0 && <span className="pep-bond">—</span>}
              <span
                className={`aa${isWrong ? " aa-wrong" : ""}`}
                style={{
                  background: `${color}55`,
                  color: color,
                  borderColor: `${color}b8`,
                }}
              >
                {aa}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
