export const MUTATION_GUIDE_STORAGE_KEY =
  "translation_lab_mutation_specific_guide_status";

function changedCodonText(t, context) {
  if (!context.originalCodon || !context.mutantCodon) {
    return t("mutation.guide.changedCodonFallback");
  }

  const codonNumber =
    Number.isInteger(context.stopCodonIndex) ? context.stopCodonIndex + 1 : "";
  const codonLabel = codonNumber
    ? t("mutation.guide.codonNumber", { codonNumber })
    : t("mutation.guide.thisCodon");

  return t("mutation.guide.changedCodon", {
    codonLabel,
    originalCodon: context.originalCodon,
    mutantCodon: context.mutantCodon,
    originalAminoAcid:
      context.originalAminoAcid ?? t("mutation.guide.fallbackAminoAcid"),
  });
}

function nonsensePresetText(t, context) {
  if (!context.originalCodon || !context.mutantCodon) {
    return t("mutation.guide.nonsensePresetFallback");
  }

  return t("mutation.guide.nonsensePreset", {
    originalCodon: context.originalCodon,
    mutantCodon: context.mutantCodon,
  });
}

export function getMutationGuideSteps(t) {
  return [
    {
      id: "mutation-purpose",
      kind: "intro",
      kicker: t("mutation.guide.welcome"),
      target: "[data-guide='mutation-simulator']",
      title: t("mutation.guide.purposeTitle"),
      text: t("mutation.guide.purposeText"),
      placement: "bottom",
    },
    {
      id: "nonsense-preset",
      target: "[data-guide='nonsense-preset']",
      title: t("mutation.guide.chooseTitle"),
      text: (context) => nonsensePresetText(t, context),
      placement: "left",
      beforeStep: "selectNonsensePreset",
    },
    {
      id: "translate-mutant",
      target: "[data-guide='translate-mutant-button']",
      title: t("mutation.guide.translateTitle"),
      text: t("mutation.guide.translateText"),
      placement: "top",
      afterStep: "translateCurrentMutation",
    },
    {
      id: "mutation-status",
      target: "[data-guide='mutation-status']",
      title: t("mutation.guide.statusTitle"),
      text: (context) =>
        context.stopCodon
          ? t("mutation.guide.statusStop", { stopCodon: context.stopCodon })
          : t("mutation.guide.statusDefault"),
      placement: "bottom",
    },
    {
      id: "changed-codon",
      target: "[data-guide='sequence-grid']",
      title: t("mutation.guide.changedTitle"),
      text: (context) => changedCodonText(t, context),
      placement: "bottom",
    },
    {
      id: "next-step",
      target: "[data-guide='next-step-button']",
      title: t("mutation.guide.nextStepTitle"),
      text: t("mutation.guide.nextStepText"),
      placement: "top",
      beforeStep: "showNonsenseIntermediateStep",
    },
    {
      id: "ribosome-paused",
      target: "[data-guide='ribosome-sprite']",
      title: t("mutation.guide.ribosomeTitle"),
      text: (context) =>
        t("mutation.guide.ribosomeText", {
          mutantCodon:
            context.mutantCodon ?? t("mutation.guide.stopCodonFallback"),
        }),
      placement: "right",
      beforeStep: "showNonsenseIntermediateStep",
    },
    {
      id: "auto",
      target: "[data-guide='auto-button']",
      title: t("mutation.guide.autoTitle"),
      text: t("mutation.guide.autoText"),
      placement: "top",
      beforeStep: "showNonsenseIntermediateStep",
    },
    {
      id: "speed",
      target: "[data-guide='speed-control']",
      title: t("mutation.guide.speedTitle"),
      text: t("mutation.guide.speedText"),
      placement: "top",
      beforeStep: "showNonsenseIntermediateStep",
    },
    {
      id: "protein-comparison",
      target: "[data-guide='protein-comparison']",
      title: t("mutation.guide.compareTitle"),
      text: (context) =>
        t("mutation.guide.compareText", {
          stopCodon: context.stopCodon ?? t("mutation.guide.stopFallback"),
        }),
      placement: "bottom",
      beforeStep: "showNonsenseFinishedStep",
    },
    {
      id: "reset-sequence",
      target: "[data-guide='reset-sequence-button']",
      title: t("mutation.guide.resetTitle"),
      text: t("mutation.guide.resetText"),
      placement: "top",
    },
    {
      id: "help",
      target: "[data-guide='help-button']",
      title: t("mutation.guide.helpTitle"),
      text: t("mutation.guide.helpText"),
      placement: "left",
    },
  ];
}
