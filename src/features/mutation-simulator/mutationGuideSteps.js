export const MUTATION_GUIDE_STORAGE_KEY =
  "translation_lab_mutation_specific_guide_status";

function changedCodonText(context) {
  if (!context.originalCodon || !context.mutantCodon) {
    return "The highlighted base show where the codon changed. In this example, the mutation creates a STOP codon.";
  }

  const codonNumber =
    Number.isInteger(context.stopCodonIndex) ? context.stopCodonIndex + 1 : "";
  const codonLabel = codonNumber ? `codon ${codonNumber}` : "this codon";

  return `The highlighted base show where ${codonLabel} changed: ${context.originalCodon} becomes ${context.mutantCodon}, so ${context.originalAminoAcid ?? "an amino acid"} becomes STOP.`;
}

function nonsensePresetText(context) {
  if (!context.originalCodon || !context.mutantCodon) {
    return "For example, you can select Nonsense (high), which creates an early STOP codon. You can also edit the bases above directly to create a specific mutation instead of using a preset.";
  }

  return `For example, you can select Nonsense (high). It changes ${context.originalCodon} into ${context.mutantCodon}, creating an early STOP codon. You can also edit the bases above directly to create a specific mutation instead of using a preset.`;
}

export const mutationGuideSteps = [
  {
    id: "mutation-purpose",
    kind: "intro",
    kicker: "Welcome",
    target: "[data-guide='mutation-simulator']",
    title: "Mutation simulator",
    text: 'This lab lets you change an mRNA sequence. Change an mRNA sequence and see how that changes the polypeptide the ribosome builds. The app may use the word protein as shorthand, but this view focuses on the chain made by the ribosome.',
    placement: "bottom",
  },
  {
    id: "nonsense-preset",
    target: "[data-guide='nonsense-preset']",
    title: "Choose a mutation",
    text: nonsensePresetText,
    placement: "left",
    beforeStep: "selectNonsensePreset",
  },
  {
    id: "translate-mutant",
    target: "[data-guide='translate-mutant-button']",
    title: "Translate Mutant",
    text: "After choosing a preset or editing bases, click Translate Mutant. The simulator reads the mutant mRNA in codons and updates the polypeptide result.",
    placement: "top",
    afterStep: "translateCurrentMutation",
  },
  {
    id: "mutation-status",
    target: "[data-guide='mutation-status']",
    title: "Read the impact",
    text: (context) =>
      context.stopCodon
        ? `Now the result card names the mutation and its impact. Here ${context.stopCodon} is a STOP codon, so the ribosome stops early.`
        : "Now the result card names the mutation and explains why it matters.",
    placement: "bottom",
  },
  {
    id: "changed-codon",
    target: "[data-guide='sequence-grid']",
    title: "Trace it to the bases",
    text: changedCodonText,
    placement: "bottom",
  },
  {
    id: "next-step",
    target: "[data-guide='next-step-button']",
    title: "Next Step",
    text: "Next Step advances translation one event at a time. Here the guide has stepped through AUG and CCU, so Met and Pro have been added before the STOP codon.",
    placement: "top",
    beforeStep: "showNonsenseIntermediateStep",
  },
  {
    id: "ribosome-paused",
    target: "[data-guide='ribosome-sprite']",
    title: "Watch the ribosome",
    text: (context) =>
      `This paused view shows the ribosome moving along the codons. It is approaching ${context.mutantCodon ?? "the STOP codon"}, where translation will end early.`,
    placement: "right",
    beforeStep: "showNonsenseIntermediateStep",
  },
  {
    id: "auto",
    target: "[data-guide='auto-button']",
    title: "Auto",
    text: "Auto runs the same steps continuously instead of one click at a time. In this nonsense example, it stops when the early STOP codon is reached.",
    placement: "top",
    beforeStep: "showNonsenseIntermediateStep",
  },
  {
    id: "speed",
    target: "[data-guide='speed-control']",
    title: "Speed",
    text: "Speed controls how fast Auto runs. Slower motion is usually better when a teacher wants students to follow each codon.",
    placement: "top",
    beforeStep: "showNonsenseIntermediateStep",
  },
  {
    id: "protein-comparison",
    target: "[data-guide='protein-comparison']",
    title: "Compare the outputs",
    text: (context) =>
      `After translation reaches ${context.stopCodon ?? "STOP"}, compare the outputs. The original chain keeps going, but the mutant chain stops early and is shorter.`,
    placement: "bottom",
    beforeStep: "showNonsenseFinishedStep",
  },
  {
    id: "reset-sequence",
    target: "[data-guide='reset-sequence-button']",
    title: "Reset Sequence",
    text: "Reset Sequence returns the bases to the original mRNA and clears the result, so users can test another mutation.",
    placement: "top",
  },
  {
    id: "help",
    target: "[data-guide='help-button']",
    title: "Open help again",
    text: "Press this question mark whenever you want to see these explanations again.",
    placement: "left",
  },
];
