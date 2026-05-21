//
// A visual polypeptide chain that emerges from the ribosome exit tunnel.
// It uses the same amino acid data as the sequence summary, but renders
// as a curved overlay anchored to the moving ribosome.

import { AA_COL } from "../biology/geneticCode.js";
import { PEPTIDE_EXIT_OFFSET } from "../../lib/ribosomeGeometry.js";
import "./EmergingPolypeptide.css";

function pointFor(indexFromEnd) {
  const x = -indexFromEnd * 34;
  const y = -Math.sin(indexFromEnd * 0.88) * 18 - indexFromEnd * 3;
  return { x, y };
}

function bondBetween(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return {
    left: `${from.x + 14}px`,
    top: `${from.y + 12}px`,
    width: `${Math.max(0, length - 28)}px`,
    transform: `rotate(${angle}deg)`,
  };
}

export default function EmergingPolypeptide({
  aminoAcids,
  ribosomeLeft,
  visible = true,
  released = false,
}) {
  if (!visible || aminoAcids.length === 0) return null;

  const points = aminoAcids.map((_, i) =>
    pointFor(aminoAcids.length - 1 - i)
  );

  return (
    <div
      className={`emerging-peptide${released ? " emerging-peptide-released" : ""}`}
      style={{
        left: `${ribosomeLeft + PEPTIDE_EXIT_OFFSET.x}px`,
        top: `${PEPTIDE_EXIT_OFFSET.y}px`,
      }}
      aria-label="Growing polypeptide emerging from ribosome"
    >
      {points.slice(1).map((point, i) => (
        <span
          key={`bond-${i}`}
          className="emerging-bond"
          style={bondBetween(points[i], point)}
          aria-hidden="true"
        />
      ))}

      {aminoAcids.map((aa, i) => {
        const color = AA_COL[aa] || "#8d99b4";
        const point = points[i];

        return (
          <span
            key={`${aa}-${i}`}
            className="emerging-aa"
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              background: `${color}66`,
              borderColor: `${color}c8`,
              color,
            }}
          >
            {aa}
          </span>
        );
      })}
    </div>
  );
}
