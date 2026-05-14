//
// A single codon block: three color-coded base letters in a row,
// surrounded by a border that styles based on the codon's current state.
// Below the bases sits a small label with the amino acid name (or "STOP",
// or "???" for unknown).
//
// Props:
//   bases             "AUG" — the three RNA letters to display
//   label             "Met" / "STOP" / "???" — the amino acid name
//   state             "upcoming" | "active" | "done" | "mutated" | "stop-hit"
//   mutatedBaseIndices  optional Set or array; which of the three base
//                       positions (0, 1, 2) should be visually marked as
//                       mutated (red background tint).
//   id                optional string for the wrapping element's HTML id.
//                     Used by the ribosome positioning code in Phase 4.

import "./Codon.css";

export default function Codon({
  bases,
  label,
  state = "upcoming",
  mutatedBaseIndices,
  id,
}) {
  // Normalize mutatedBaseIndices into a Set so .has() always works,
  // regardless of whether the caller passed an array or a Set.
  const mutated =
    mutatedBaseIndices instanceof Set
      ? mutatedBaseIndices
      : new Set(mutatedBaseIndices || []);

  return (
    <div className={`cdn cdn-${state}`} id={id}>
      <div className="cdn-bases">
        {bases.split("").map((base, baseIndex) => (
          <span
            key={baseIndex}
            className={`b b-${base}${
              mutated.has(baseIndex) ? " b-mutated" : ""
            }`}
          >
            {base}
          </span>
        ))}
      </div>
      <div className="cdn-lbl">{label}</div>
    </div>
  );
}