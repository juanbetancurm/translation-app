import Codon from "./Codon";
import { useTranslation } from "../../i18n/i18nContext.js";
import "./MrnaStrand.css";

export default function MrnaStrand({
  codons,
  labels,
  states,
  mutatedPositions,
  strandId,
  codonRefs,
  headerLabel,
  dataGuide,
}) {
  const { t } = useTranslation();
  const resolvedHeaderLabel = headerLabel ?? t("shared.mrna");

  function basesMutatedInCodon(codonIndex) {
    if (!mutatedPositions) return null;
    const start = codonIndex * 3;
    const set = new Set();
    for (let i = 0; i < 3; i++) {
      if (mutatedPositions.has(start + i)) set.add(i);
    }
    return set.size > 0 ? set : null;
  }

  return (
    <div className="mrna-row" data-guide={dataGuide}>
      <div className="mrna-lbl">
        <span>5' -</span>
        <span>{resolvedHeaderLabel}</span>
        <span>- 3'</span>
      </div>
      <div className="mrna">
        {codons.map((codonBases, i) => (
          <Codon
            key={i}
            id={strandId ? `${strandId}-c${i}` : undefined}
            bases={codonBases}
            label={labels[i]}
            state={states[i]}
            mutatedBaseIndices={basesMutatedInCodon(i)}
            forwardedRef={codonRefs?.[i]}
          />
        ))}
      </div>
    </div>
  );
}
