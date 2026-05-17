//
//
// A single codon block: three color-coded base letters in a row,
// surrounded by a border that styles based on the codon's current state.
//
// Props:
//   bases             "AUG" — the three RNA letters to display
//   label             "Met" / "STOP" / "???" — the amino acid name
//   state             "upcoming" | "active" | "done" | "mutated" | "stop-hit"
//   mutatedBaseIndices  optional Set or array of base positions (0-2) that
//                       should be visually marked as mutated
//   id                  optional HTML id for the wrapping element
//   forwardedRef        optional React ref; if provided, attached to the
//                       wrapping div so the parent can measure its DOMRect

import "./Codon.css";

export default function Codon({
  bases,
  label,
  state = "upcoming",
  mutatedBaseIndices,
  id,
  forwardedRef,
}) {
  const mutated =
    mutatedBaseIndices instanceof Set
      ? mutatedBaseIndices
      : new Set(mutatedBaseIndices || []);

  return (
    <div
      className={`cdn cdn-${state}`}
      id={id}
      ref={forwardedRef}
    >
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