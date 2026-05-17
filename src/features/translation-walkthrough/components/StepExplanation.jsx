//
//
// The sidebar content for the Translation Walkthrough.
// Displays:
//   - Step number and title in a header
//   - Step explanation text (HTML rendered from the step's text field)
//   - The current codon lookup (codon → amino acid + anticodon)
//
// The text field is rendered with dangerouslySetInnerHTML because the
// step definitions contain HTML markup (<strong>, <em>, <br>). This is
// safe here because the HTML is hard-coded in our own source file —
// none of it ever comes from user input. If we ever sourced step text
// from a database, an API, or a config file, this would need to change
// to use a sanitizer or a Markdown renderer.

import "./StepExplanation.css";
import { GC } from "../../../shared/biology/geneticCode.js";
import { ac } from "../../../shared/biology/translation.js";

export default function StepExplanation({
  stepIndex,
  stepTitle,
  stepText,
  lookupCodon,
}) {
  // Compute lookup display from the codon
  const lookupAminoAcid = lookupCodon ? GC[lookupCodon] : null;
  const lookupAnticodon = lookupCodon ? ac(lookupCodon) : null;

  return (
    <>
      <div className="sb-section">
        <h3>
          Step <span>{stepIndex < 0 ? 0 : stepIndex + 1}</span> —{" "}
          <span>{stepTitle}</span>
        </h3>
        <div
          className="sb-text"
          dangerouslySetInnerHTML={{ __html: stepText }}
        />
      </div>

      <div className="sb-section">
        <h3>Current Codon</h3>
        <div className="lookup">
          {lookupCodon ? (
            <>
              <div className="lookup-row">
                <span className="lookup-codon">{lookupCodon}</span>
                <span className="lookup-arrow">→</span>
                <span className="lookup-aa">{lookupAminoAcid}</span>
              </div>
              <div className="lookup-row" style={{ marginTop: "3px" }}>
                <span className="lookup-anticodon">
                  anticodon: {lookupAnticodon}
                </span>
              </div>
            </>
          ) : (
            <div className="lookup-row">
              <span className="lookup-codon">---</span>
              <span className="lookup-arrow">→</span>
              <span className="lookup-aa">waiting</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}