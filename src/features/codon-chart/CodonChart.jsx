import { useMemo, useState } from "react";
import { useTranslation } from "../../i18n/i18nContext.js";
import { BASES, CODONS, LEGEND_GROUPS } from "./codonChartData.js";
import "./CodonChart.css";

const DEFAULT_CODON = "AUG";

function groupLabelKey(group) {
  return `codonChart.groups.${group}`;
}

function aminoAcidName(t, codonData) {
  return t(`codonChart.aminoAcids.${codonData.nameKey}`);
}

function descriptionFor(t, codon, codonData) {
  if (codonData.special === "stop") {
    return t("codonChart.descriptions.stop", { codon });
  }

  const name = aminoAcidName(t, codonData).toLocaleLowerCase();
  if (codonData.special === "start") {
    return t("codonChart.descriptions.start", { codon, name });
  }

  return t("codonChart.descriptions.standard", { codon, name });
}

function tagsFor(t, codonData) {
  const tags = [];

  if (codonData.special === "start") tags.push(t("codonChart.tags.start"));
  if (codonData.special === "stop") tags.push(t("codonChart.tags.stop"));
  if (codonData.single) tags.push(t("codonChart.tags.single"));
  tags.push(t(groupLabelKey(codonData.group)));

  return tags;
}

export default function CodonChart() {
  const { t } = useTranslation();
  const [selectedCodon, setSelectedCodon] = useState(DEFAULT_CODON);
  const selectedData = CODONS[selectedCodon];
  const selectedTags = useMemo(
    () => tagsFor(t, selectedData),
    [selectedData, t]
  );

  return (
    <main className="codon-chart-page">
      <header className="codon-chart-hero">
        <div className="codon-chart-hero-top">
          <div>
            <div className="codon-chart-pill">
              <span>{t("codonChart.hero.pillLabel")}</span>
              {t("codonChart.hero.pillText")}
            </div>
            <h1>{t("codonChart.hero.title")}</h1>
            <p className="codon-chart-lead">{t("codonChart.hero.lead")}</p>
          </div>

          <div
            className="codon-chart-base-legend"
            aria-label={t("codonChart.baseLegend.aria")}
          >
            {BASES.map((base) => (
              <div className="codon-chart-base-card" key={base}>
                <strong>{base}</strong>
                <span>{t(`codonChart.baseLegend.${base}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="codon-chart-layout">
        <div className="codon-chart-product-frame">
          <div className="codon-chart-window-bar" aria-hidden="true">
            <span className="codon-chart-window-dot" />
            <span className="codon-chart-window-dot" />
            <span className="codon-chart-window-dot" />
            <span className="codon-chart-window-title">
              {t("codonChart.matrix.windowTitle")}
            </span>
          </div>

          <div className="codon-chart-matrix-panel">
            <div className="codon-chart-second-title">
              {t("codonChart.matrix.secondNucleotide")}
            </div>
            <div
              className="codon-chart-matrix"
              aria-label={t("codonChart.matrix.aria")}
            >
              <div className="codon-chart-corner">
                {t("codonChart.matrix.firstNucleotideShort")}
              </div>
              {BASES.map((base) => (
                <div className="codon-chart-col-head" key={base}>
                  {base}
                </div>
              ))}

              {BASES.map((first) => (
                <MatrixFirstBaseRow
                  key={first}
                  first={first}
                  selectedCodon={selectedCodon}
                  onSelectCodon={setSelectedCodon}
                  t={t}
                />
              ))}
            </div>
          </div>
        </div>

        <section
          className="codon-chart-description"
          aria-live="polite"
          aria-label={t("codonChart.detail.aria")}
        >
          <p className="codon-chart-detail-label">
            {t("codonChart.detail.label")}
          </p>
          <div>
            <p className="codon-chart-selected-codon">{selectedCodon}</p>
            <h2 className="codon-chart-selected-name">
              {aminoAcidName(t, selectedData)}
            </h2>
            <p className="codon-chart-selected-copy">
              {descriptionFor(t, selectedCodon, selectedData)}
            </p>
          </div>
          <div className="codon-chart-tag-list">
            {selectedTags.map((tag) => (
              <span className="codon-chart-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </section>

        <div
          className="codon-chart-legend"
          aria-label={t("codonChart.legend.aria")}
        >
          {LEGEND_GROUPS.map((group) => (
            <div className={`codon-chart-legend-item ${group}`} key={group}>
              {t(`codonChart.legend.${group}`)}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function MatrixFirstBaseRow({ first, selectedCodon, onSelectCodon, t }) {
  return (
    <>
      <div className="codon-chart-row-head">{first}</div>
      {BASES.map((second) => (
        <div className="codon-chart-codon-cell" key={`${first}-${second}`}>
          {BASES.map((third) => {
            const codon = first + second + third;
            const codonData = CODONS[codon];
            const isSelected = selectedCodon === codon;

            return (
              <div className="codon-chart-codon-row" key={codon}>
                <button
                  type="button"
                  className={`codon-chart-codon${
                    isSelected ? " selected" : ""
                  }`}
                  data-group={codonData.group}
                  data-special={codonData.special}
                  aria-pressed={isSelected}
                  aria-label={t("codonChart.matrix.codonAria", {
                    codon,
                    name: aminoAcidName(t, codonData),
                  })}
                  onClick={() => onSelectCodon(codon)}
                >
                  {codon}
                </button>
                <div className="codon-chart-third-base">{third}</div>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
