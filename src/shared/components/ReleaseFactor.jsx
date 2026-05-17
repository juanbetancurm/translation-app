//
//
// The eRF1 release factor sprite, shown at the A-site during termination.
// Visually: a red circle with "eRF1" text, mounted on a thin red stem.
// Same positioning contract as TrnaMolecule — the parent passes a `left`
// pixel coordinate relative to the .ribo-zone container.

import "./ReleaseFactor.css";

export default function ReleaseFactor({ left, bottom = 132 }) {
  return (
    <div
      className="rf"
      style={{ left: `${left}px`, bottom: `${bottom}px` }}
    >
      <div className="rf-body">eRF1</div>
      <div className="rf-stem" />
    </div>
  );
}