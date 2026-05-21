//
// A faint copy of the mRNA threaded through the ribosome scene.
// The bottom mRNA row remains the readable sequence overview; this layer
// exists only to show that the ribosome is physically reading the strand.

import "./RibosomeMrnaOverlay.css";

export default function RibosomeMrnaOverlay({
  codons,
  codonCenters,
  states,
  visible = true,
}) {
  if (!visible || codonCenters.length === 0) return null;

  return (
    <div className="ribo-mrna-overlay" aria-hidden="true">
      <div className="ribo-mrna-thread" />
      {codons.map((codon, codonIndex) => {
        const center = codonCenters[codonIndex];
        if (center == null) return null;

        return (
          <div
            key={codonIndex}
            className={`ribo-mrna-codon ribo-mrna-codon-${states[codonIndex]}`}
            style={{ left: `${center}px` }}
          >
            {codon.split("").map((base, baseIndex) => (
              <span key={baseIndex} className={`ribo-mrna-base b-${base}`}>
                {base}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
