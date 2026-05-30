import { GC } from "../../shared/biology/geneticCode.js";
import { ac } from "../../shared/biology/translation.js";
import { ORIG_CODONS } from "../../shared/biology/constants.js";

function fixedStep(copyKey, config) {
  return {
    copyKey,
    copyParams: {},
    ...config,
  };
}

function buildSteps() {
  const steps = [];

  steps.push(
    fixedStep("walkthrough.steps.mrnaArrives", {
      phase: "init",
      action: "showMRNA",
    })
  );

  steps.push(
    fixedStep("walkthrough.steps.smallSubunit", {
      phase: "init",
      action: "showSmall",
    })
  );

  steps.push(
    fixedStep("walkthrough.steps.augFound", {
      phase: "init",
      action: "initTRNA",
    })
  );

  steps.push(
    fixedStep("walkthrough.steps.largeSubunit", {
      phase: "init",
      action: "showLarge",
    })
  );

  for (let i = 1; i < ORIG_CODONS.length; i++) {
    const codon = ORIG_CODONS[i];
    const aminoAcid = GC[codon];

    if (aminoAcid === "STOP") {
      steps.push({
        phase: "term",
        copyKey: "walkthrough.steps.stop",
        copyParams: { codon },
        action: "stop",
        codonIndex: i,
      });

      steps.push(
        fixedStep("walkthrough.steps.release", {
          phase: "term",
          action: "release",
        })
      );
      break;
    }

    steps.push({
      phase: "elong",
      copyKey: "walkthrough.steps.arrive",
      copyParams: {
        aminoAcid,
        codon,
        anticodon: ac(codon),
      },
      action: "arrive",
      codonIndex: i,
    });

    steps.push({
      phase: "elong",
      copyKey: "walkthrough.steps.bond",
      copyParams: { aminoAcid },
      action: "bond",
      codonIndex: i,
    });

    steps.push({
      phase: "elong",
      copyKey: "walkthrough.steps.shift",
      copyParams: {},
      action: "shift",
      codonIndex: i,
    });
  }

  return steps;
}

export const TRANSLATION_STEPS = buildSteps();

export function getTranslationStepCopy(stepIndex, t) {
  if (stepIndex < 0) {
    return {
      title: t("walkthrough.readyTitle"),
      text: t("walkthrough.readyText"),
    };
  }

  const step = TRANSLATION_STEPS[stepIndex];
  if (!step) {
    return {
      title: "",
      text: "",
    };
  }

  return {
    title: t(`${step.copyKey}.title`, step.copyParams),
    text: t(`${step.copyKey}.text`, step.copyParams),
  };
}
