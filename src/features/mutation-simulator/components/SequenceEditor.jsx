//
// The clickable row of base tiles. Each tile shows one base letter
// (A/U/C/G) or an X placeholder for deletions. Tile styling reflects
// the reducer's changes map: changed, inserted, or deleted.

import "./SequenceEditor.css";

export default function SequenceEditor({
  bases,
  changes,
  onClick,
  highlightCodonIndex = null,
  dataGuide,
}) {
  return (
    <div className="mut-mrna" data-guide={dataGuide}>
      {bases.map((base, i) => {
        const change = changes.get(i);
        const isCodonStart = i % 3 === 0;
        const codonNumber = i / 3 + 1;
        const isHighlightedCodon =
          highlightCodonIndex != null &&
          Math.floor(i / 3) === highlightCodonIndex;

        let className = `mut-base mut-base-${base}`;
        if (change?.type === "change") className += " mut-base-changed";
        if (change?.type === "insert") className += " mut-base-inserted";
        if (change?.type === "delete") className += " mut-base-deleted";
        if (isHighlightedCodon) className += " mut-base-guide-codon";

        return (
          <button
            key={i}
            type="button"
            className={className}
            onClick={() => onClick(i)}
            aria-label={`Edit base ${i + 1}: ${base}`}
          >
            {isCodonStart && <span className="pos">{codonNumber}</span>}
            {base}
          </button>
        );
      })}
    </div>
  );
}
