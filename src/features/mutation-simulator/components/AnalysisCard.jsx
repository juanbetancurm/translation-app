//
// Displays the classifier result: mutation type, impact tag, and a
// plain-English explanation.

import "./AnalysisCard.css";

const IMPACT_CLASS = {
  None: "impact-none",
  High: "impact-high",
  Moderate: "impact-mod",
  Low: "impact-low",
};

export default function AnalysisCard({ analysis, dataGuide }) {
  if (!analysis) return null;

  const impactClass = IMPACT_CLASS[analysis.impact] || "impact-mod";
  const impactLabel =
    analysis.impact === "None" ? "No impact" : `${analysis.impact} impact`;

  return (
    <div className={`analysis-card ${impactClass}`} data-guide={dataGuide}>
      <div className="analysis-row">
        <span className="analysis-type">{analysis.type}</span>
        <span className={`impact-tag ${impactClass}-tag`}>
          {impactLabel}
        </span>
      </div>
      <p className="analysis-explanation">{analysis.explanation}</p>
    </div>
  );
}
