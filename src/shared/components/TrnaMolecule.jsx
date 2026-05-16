// 
//
// A single tRNA molecule: amino acid badge (optional), stem, head with
// anticodon text. Three site variants control coloring:
//   p  P-site (purple) — currently holding the polypeptide chain
//   a  A-site (amber)  — newly arrived, carrying an amino acid
//   e  E-site (gray)   — empty/exiting (rare in current flows)
//
// Positioned absolutely within its parent .ribo-zone via the `left`
// and `bottom` props. The parent computes pixel coordinates from codon
// DOM measurements (in Phase 4).
//
// Props:
//   left        pixel offset from the left of the ribo-zone
//   bottom      pixel offset from the bottom of the ribo-zone (default 130)
//   site        "p" | "a" | "e" — color variant for stem and head
//   anticodon   three-character string displayed inside the head
//   aminoAcid   optional amino acid name; if absent, no badge is drawn
//   entering    if true, plays the fly-in entrance animation

import { AA_COL } from "../biology/geneticCode.js";
import "./TrnaMolecule.css";

const SITE_COLORS = {
  p: "var(--pu)",
  a: "var(--am)",
  e: "var(--tx3)",
};

export default function TrnaMolecule({
  left,
  bottom = 130,
  site,
  anticodon,
  aminoAcid,
  entering = false,
}) {
  const stemColor = SITE_COLORS[site] || "var(--tx3)";
  const headColor = stemColor;

  // The amino acid badge color is data-driven from the AA_COL table.
  // It is independent of the site color: a Met carried by an A-site
  // tRNA is still green (the Met color), not amber.
  const aaColor = aminoAcid ? AA_COL[aminoAcid] || "#8d99b4" : null;

  return (
    <div
      className={`trna${entering ? " trna-enter" : ""}`}
      style={{ left: `${left}px`, bottom: `${bottom}px` }}
      data-site={site}
    >
      {aminoAcid && aaColor && (
        <div
          className="trna-aa"
          style={{
            background: `${aaColor}30`,
            color: aaColor,
            border: `1px solid ${aaColor}50`,
          }}
        >
          {aminoAcid}
        </div>
      )}
      <div className="trna-stem" style={{ background: stemColor }} />
      <div className="trna-head" style={{ background: headColor }}>
        <span className="trna-ac">{anticodon}</span>
      </div>
    </div>
  );
}