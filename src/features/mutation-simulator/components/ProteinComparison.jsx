//
// Side-by-side view of the original protein and mutant protein, with
// differing mutant residues highlighted.

import "./ProteinComparison.css";
import { useTranslation } from "../../../i18n/i18nContext.js";

export default function ProteinComparison({
  originalProtein,
  mutantProtein,
  diffPositions,
  mutantProgress = mutantProtein.length,
  showProgress = false,
  stopCodon,
  stopCodonIndex = null,
  dataGuide,
}) {
  const { t } = useTranslation();
  const diffSet = new Set(diffPositions);
  const stopDisplayIndex =
    Number.isInteger(stopCodonIndex) && stopCodon ? stopCodonIndex : null;
  const maxLen = Math.max(
    originalProtein.length,
    mutantProtein.length,
    stopDisplayIndex == null ? 0 : stopDisplayIndex + 1
  );
  const origRow = Array.from({ length: maxLen }, (_, i) =>
    i < originalProtein.length ? originalProtein[i] : null
  );
  const mutRow = Array.from({ length: maxLen }, (_, i) => {
    if (i < mutantProtein.length) {
      return { label: mutantProtein[i], type: "amino-acid" };
    }

    if (i === stopDisplayIndex) {
      return {
        label: "STOP",
        type: "stop",
        title: t("mutation.proteinComparison.stopCodonTitle", { stopCodon }),
      };
    }

    return null;
  });

  return (
    <div className="protein-compare" data-guide={dataGuide}>
      <div className="protein-row">
        <div className="protein-label">{t("mutation.proteinComparison.original")}</div>
        <div className="protein-beads">
          {origRow.map((aa, i) => (
            <span key={i} className={`bead bead-${aa || "empty"}`}>
              {aa || "-"}
            </span>
          ))}
        </div>
      </div>

      <div className="protein-row">
        <div className="protein-label">{t("mutation.proteinComparison.mutant")}</div>
        <div className="protein-beads">
          {mutantProtein.length === 0 ? (
            <span className="protein-empty-message">
              {t("mutation.proteinComparison.noProtein")}
            </span>
          ) : (
            mutRow.map((bead, i) => {
              const label = bead?.label;
              return (
                <span
                  key={i}
                  className={`bead bead-${label || "empty"}${
                    bead?.type === "stop" ? " bead-stop" : ""
                  }${diffSet.has(i) ? " bead-diff" : ""}${
                    showProgress &&
                    label &&
                    bead?.type !== "stop" &&
                    i >= mutantProgress
                      ? " bead-pending"
                      : ""
                  }`}
                  title={bead?.title}
                >
                  {label || "-"}
                </span>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
