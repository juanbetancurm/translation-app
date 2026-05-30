import "./StepExplanation.css";
import { GC } from "../../../shared/biology/geneticCode.js";
import { ac } from "../../../shared/biology/translation.js";
import { useTranslation } from "../../../i18n/i18nContext.js";

export default function StepExplanation({
  stepIndex,
  stepTitle,
  stepText,
  lookupCodon,
  dataGuide,
}) {
  const { t } = useTranslation();
  const lookupAminoAcid = lookupCodon ? GC[lookupCodon] : null;
  const lookupAnticodon = lookupCodon ? ac(lookupCodon) : null;

  return (
    <>
      <div className="sb-section" data-guide={dataGuide}>
        <h3>
          {t("walkthrough.stepLabel")} <span>{stepIndex < 0 ? 0 : stepIndex + 1}</span>{" "}
          - <span>{stepTitle}</span>
        </h3>
        <div
          className="sb-text"
          dangerouslySetInnerHTML={{ __html: stepText }}
        />
      </div>

      <div className="sb-section">
        <h3>{t("walkthrough.currentCodon")}</h3>
        <div className="lookup">
          {lookupCodon ? (
            <>
              <div className="lookup-row">
                <span className="lookup-codon">{lookupCodon}</span>
                <span className="lookup-arrow">-&gt;</span>
                <span className="lookup-aa">{lookupAminoAcid}</span>
              </div>
              <div className="lookup-row" style={{ marginTop: "3px" }}>
                <span className="lookup-anticodon">
                  {t("walkthrough.anticodon")}: {lookupAnticodon}
                </span>
              </div>
            </>
          ) : (
            <div className="lookup-row">
              <span className="lookup-codon">---</span>
              <span className="lookup-arrow">-&gt;</span>
              <span className="lookup-aa">{t("walkthrough.waiting")}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
