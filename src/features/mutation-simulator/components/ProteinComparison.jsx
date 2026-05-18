//
// Side-by-side view of the original protein and mutant protein, with
// differing mutant residues highlighted.

import "./ProteinComparison.css";

export default function ProteinComparison({
  originalProtein,
  mutantProtein,
  diffPositions,
}) {
  const diffSet = new Set(diffPositions);
  const maxLen = Math.max(originalProtein.length, mutantProtein.length);
  const origRow = Array.from({ length: maxLen }, (_, i) =>
    i < originalProtein.length ? originalProtein[i] : null
  );
  const mutRow = Array.from({ length: maxLen }, (_, i) =>
    i < mutantProtein.length ? mutantProtein[i] : null
  );

  return (
    <div className="protein-compare">
      <div className="protein-row">
        <div className="protein-label">Original:</div>
        <div className="protein-beads">
          {origRow.map((aa, i) => (
            <span key={i} className={`bead bead-${aa || "empty"}`}>
              {aa || "-"}
            </span>
          ))}
        </div>
      </div>

      <div className="protein-row">
        <div className="protein-label">Mutant:</div>
        <div className="protein-beads">
          {mutRow.map((aa, i) => (
            <span
              key={i}
              className={`bead bead-${aa || "empty"}${
                diffSet.has(i) ? " bead-diff" : ""
              }`}
            >
              {aa || "-"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
