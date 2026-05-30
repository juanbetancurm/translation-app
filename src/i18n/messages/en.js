export const en = {
  meta: {
    title: "Translation Lab - mRNA translation and mutation simulator",
  },

  languageToggle: {
    label: "Language",
    switchTo: "Switch language to Spanish",
    english: "EN",
    spanish: "ES",
  },

  nav: {
    walkthroughIcon: "DNA",
    walkthroughWide: "Translation Walkthrough",
    walkthroughShort: "Translation",
    mutationIcon: "Lab",
    mutationWide: "Mutation Simulator",
    mutationShort: "Mutation",
    educationIcon: "Edu",
    educationWide: "Education",
    educationShort: "Education",
  },

  shared: {
    mrna: "mRNA",
    growingPolypeptide: "Growing polypeptide:",
    emergingPolypeptideAria: "Growing polypeptide emerging from ribosome",
    ribosomeAria: "Ribosome",
    largeSubunitAria: "60S large subunit",
    smallSubunitAria: "40S small subunit",
    controls: {
      nextStep: "Next Step ->",
      auto: "Auto",
      pause: "Pause",
      reset: "Reset",
      speed: "Speed",
    },
    phase: {
      init: "Phase 1: Initiation",
      elong: "Phase 2: Elongation",
      term: "Phase 3: Termination",
    },
    guidedTour: {
      introduction: "Introduction",
      stepOf: ({ current, total }) => `Step ${current} of ${total}`,
      back: "Back",
      skip: "Skip",
      next: "Next",
      finish: "Finish",
    },
  },

  walkthrough: {
    readyTitle: "Ready",
    readyText:
      "Press <strong>Next Step</strong> to begin. We'll walk through all " +
      "three phases of translation: <em>initiation</em>, <em>elongation</em>, " +
      "and <em>termination</em>. Each step explains exactly what the " +
      "ribosome does and why.",
    stepLabel: "Step",
    currentCodon: "Current Codon",
    anticodon: "anticodon",
    waiting: "waiting",
    steps: {
      mrnaArrives: {
        title: "mRNA arrives in cytoplasm",
        text:
          "The mature <strong>mRNA</strong> has exited the nucleus after " +
          "transcription and processing (5' cap added, introns spliced out, " +
          "poly-A tail attached). It now floats in the cytoplasm, its sequence " +
          "of codons exposed and ready to be read. Direction is always " +
          "<em>5' -> 3'</em>. Our mRNA has 8 codons: " +
          "<em>AUG CCU GAA UUC GGA AAG CCA UGA</em>.",
      },
      smallSubunit: {
        title: "40S small subunit scans for AUG",
        text:
          "The <strong>40S small ribosomal subunit</strong>, preloaded with " +
          "initiation factors and a special <em>initiator Met-tRNA</em>, " +
          "binds near the 5' cap of the mRNA. It then <strong>scans</strong> " +
          "the mRNA in the 5'->3' direction, looking for the first <em>AUG</em> " +
          "codon. Recognition uses the <strong>Kozak consensus</strong> (the " +
          "surrounding sequence context), not just AUG itself. This is why " +
          "not every AUG in an mRNA is used as a start.",
      },
      augFound: {
        title: "AUG found - Met-tRNA locks into P-site",
        text:
          "The scanner finds <em>AUG</em>. The initiator tRNA's anticodon " +
          "(<em>UAC</em>) base-pairs with <em>AUG</em> and locks into the " +
          "<strong>P-site</strong> (peptidyl site). This is the " +
          "<strong>only</strong> tRNA that ever enters the P-site directly; " +
          "every subsequent tRNA must enter through the A-site. The start " +
          "codon also specifies <em>methionine</em> as the first amino acid.",
      },
      largeSubunit: {
        title: "60S joins -> 80S ribosome assembled",
        text:
          "The <strong>60S large subunit</strong> joins from above, forming " +
          "the complete <strong>80S ribosome</strong>. Initiation factors are " +
          "ejected. The ribosome now has three functional sites:<br><br>" +
          '<span style="color:var(--tx3)">E-site</span> (exit): spent ' +
          "tRNAs leave here<br>" +
          '<span style="color:var(--pu)">P-site</span> (peptidyl): ' +
          "holds the tRNA carrying the growing chain<br>" +
          '<span style="color:var(--am)">A-site</span> (aminoacyl): ' +
          "new tRNAs arrive here<br><br>" +
          "Met-tRNA is in the P-site. The A-site is positioned over the " +
          "<em>second codon</em> (CCU). " +
          '<strong class="hl-green">Initiation complete - elongation begins!' +
          "</strong>",
      },
      arrive: {
        title: ({ aminoAcid, codon }) =>
          `tRNA delivers ${aminoAcid} (codon ${codon})`,
        text: ({ aminoAcid, codon, anticodon }) =>
          "A <strong>charged tRNA</strong> carrying <em>" +
          aminoAcid +
          '</em> enters the <strong style="color:var(--am)">A-site</strong>. ' +
          "Its anticodon <em>" +
          anticodon +
          "</em> base-pairs with the mRNA codon <em>" +
          codon +
          "</em>. The ribosome checks the match. If the anticodon doesn't " +
          "complement the codon, the tRNA is rejected and another tries. This " +
          "is the <strong>physical implementation of the genetic code</strong>: " +
          "codon-anticodon pairing selects the correct amino acid.<br><br>" +
          "Look up in the table: <em>" +
          codon +
          "</em> -> <em>" +
          aminoAcid +
          "</em>.",
      },
      bond: {
        title: ({ aminoAcid }) => `Peptide bond forms with ${aminoAcid}`,
        text:
          "The ribosome's <strong>peptidyl transferase</strong> (catalyzed " +
          "by the rRNA, making the ribosome a <em>ribozyme</em>) transfers " +
          "the growing chain from the P-site tRNA onto the A-site amino " +
          "acid. A new <strong>peptide bond</strong> forms inside the " +
          "ribosome. The P-site tRNA is now empty; the A-site tRNA carries " +
          "the entire polypeptide. You will see the new amino acid emerge " +
          "in the external chain after <strong>translocation</strong>, when " +
          "that peptidyl-tRNA shifts into the P-site.",
      },
      shift: {
        title: "Translocation - ribosome moves one codon",
        text:
          "The ribosome <strong>translocates</strong> one codon forward " +
          "(5'->3'). The empty tRNA exits through the <strong>E-site</strong>, " +
          "the peptidyl-tRNA shifts from A to P, and a new codon is exposed " +
          "in the now-empty <strong>A-site</strong>. This cycle takes about " +
          "<strong>0.5 seconds</strong> in a eukaryotic cell, adding about 2 " +
          "amino acids per second.",
      },
      stop: {
        title: ({ codon }) => `STOP codon: ${codon}`,
        text: ({ codon }) =>
          "The A-site is now positioned over <em>" +
          codon +
          "</em>, a " +
          '<strong class="hl-coral">STOP codon</strong>. No tRNA in the ' +
          "cell has an anticodon matching a stop codon. Instead, a protein " +
          "called <strong>eRF1</strong> (eukaryotic Release Factor 1) " +
          "mimics the shape of a tRNA and enters the A-site. It recognizes " +
          "the stop codon and triggers <strong>hydrolysis</strong>, breaking " +
          "the bond between the polypeptide and the P-site tRNA. The " +
          "completed protein is freed.",
      },
      release: {
        title: "Protein released - translation complete!",
        text:
          "The finished <strong>polypeptide</strong> " +
          "(Met-Pro-Glu-Phe-Gly-Lys-Pro) is released. The ribosome " +
          "<strong>disassembles</strong> into its 40S and 60S subunits, " +
          "which are recycled for the next mRNA. The protein now " +
          "<strong>folds</strong> into its 3D conformation, the shape " +
          "that determines its function.<br><br>" +
          "In your IEI pipeline, the annotation tools trace this exact " +
          "path in reverse: they start from a VCF variant, determine " +
          "which codon it affects, look up the amino acid change, and " +
          "assess whether the protein's function is disrupted.",
      },
    },
  },

  mutation: {
    labels: {
      mutantMrna: "Mutant mRNA",
      originalMrna: "Original mRNA",
      labTitle: "Mutation Lab",
      animationTitle: "Animation",
      helpAria: "Open guided explanation",
    },
    instructions: {
      html:
        "Click a base to <strong>change</strong> it. Use the tools to " +
        "<strong>delete</strong> or <strong>insert</strong> bases. Then hit " +
        "<strong>Translate Mutant</strong> to analyze the altered mRNA.",
      clickBase: "Click a base to",
      change: "change",
      useTools: "it. Use the tools to",
      delete: "delete",
      insert: "insert",
      bases: "bases. Then hit",
      translateMutant: "Translate Mutant",
      analyze: "to analyze the altered mRNA.",
    },
    tools: {
      change: "Change base",
      delete: "Delete base",
      insert: "Insert after",
    },
    actions: {
      translateMutant: "Translate Mutant ->",
      resetSequence: "Reset Sequence",
    },
    sequenceEditor: {
      editBase: ({ index, base }) => `Edit base ${index}: ${base}`,
    },
    presetsTitle: "Presets",
    presets: {
      missense: {
        label: "Missense (mod)",
        title: "Missense - Moderate impact",
      },
      nonsense: {
        label: "Nonsense (high)",
        title: "Nonsense - High impact",
      },
      synonymous: {
        label: "Synonymous (low)",
        title: "Synonymous - Low impact",
      },
      "frameshift-del": {
        label: "Frameshift (del)",
        title: "Frameshift deletion - High impact",
      },
      "frameshift-ins": {
        label: "Frameshift (ins)",
        title: "Frameshift insertion - High impact",
      },
      "start-lost": {
        label: "Start lost (high)",
        title: "Start lost - High impact",
      },
    },
    proteinComparison: {
      original: "Original:",
      mutant: "Mutant:",
      noProtein: "No protein produced",
      stopCodonTitle: ({ stopCodon }) => `${stopCodon} STOP codon`,
    },
    analysis: {
      types: {
        noChange: "No change",
        startLost: "Start lost",
        frameshiftIns: "Frameshift insertion",
        frameshiftDel: "Frameshift deletion",
        inFrameIns: "In-frame insertion",
        inFrameDel: "In-frame deletion",
        nonsense: "Nonsense",
        missense: "Missense",
        synonymous: "Synonymous",
      },
      impacts: {
        none: "No impact",
        high: "High impact",
        moderate: "Moderate impact",
        low: "Low impact",
      },
      explanations: {
        noChange:
          "The sequence is identical to the original. No mutation has been applied.",
        startLost: ({ mutantStart }) =>
          `The first codon is "${mutantStart}", not AUG. The ribosome's small ` +
          "subunit scans for AUG to initiate translation; without it, no " +
          "protein is produced from this mRNA. This is one of the most damaging " +
          "classes of variant.",
        inFrame: ({ lengthDiff }) =>
          `The sequence length changed by ${lengthDiff} bases, a multiple of 3. ` +
          "The reading frame is preserved, but the protein gains or loses " +
          "one or more amino acids. Protein function may be partially preserved.",
        frameshift: ({ lengthDiff }) =>
          `${Math.abs(lengthDiff)} ${
            lengthDiff > 0 ? "extra" : "missing"
          } base(s). The number is not a multiple of 3, so the reading frame ` +
          "shifts from the indel onward. Every downstream codon is now read " +
          "incorrectly, usually leading to a premature STOP. Function is almost " +
          "always lost.",
        nonsense: ({ stopCodonIndex, stopCodon, originalProteinLength }) =>
          `Codon ${stopCodonIndex + 1} is now a STOP codon (${stopCodon}). ` +
          "The ribosome terminates translation early, producing a truncated " +
          `protein with ${stopCodonIndex} amino acids instead of ` +
          `${originalProteinLength}. Truncated proteins almost always fail ` +
          "to fold correctly and are typically degraded.",
        synonymous:
          "Bases have changed but the protein is unchanged. This is possible " +
          "because the genetic code is degenerate: multiple codons can encode " +
          "the same amino acid. Synonymous variants are generally tolerated.",
        missense: ({ diffCount }) =>
          `${diffCount} amino acid(s) differ from the original. Each changed ` +
          "codon now encodes a different amino acid. Whether the protein still " +
          "functions depends on which residues changed and what they were " +
          "replaced with.",
      },
    },
    guide: {
      welcome: "Welcome",
      purposeTitle: "Mutation simulator",
      purposeText:
        "This lab lets you change an mRNA sequence. Change an mRNA sequence and see how that changes the polypeptide the ribosome builds. The app may use the word protein as shorthand, but this view focuses on the chain made by the ribosome.",
      chooseTitle: "Choose a mutation",
      translateTitle: "Translate Mutant",
      translateText:
        "After choosing a preset or editing bases, click Translate Mutant. The simulator reads the mutant mRNA in codons and updates the polypeptide result.",
      statusTitle: "Read the impact",
      statusStop: ({ stopCodon }) =>
        `Now the result card names the mutation and its impact. Here ${stopCodon} is a STOP codon, so the ribosome stops early.`,
      statusDefault:
        "Now the result card names the mutation and explains why it matters.",
      changedTitle: "Trace it to the bases",
      nextStepTitle: "Next Step",
      nextStepText:
        "Next Step advances translation one event at a time. Here the guide has stepped through AUG and CCU, so Met and Pro have been added before the STOP codon.",
      ribosomeTitle: "Watch the ribosome",
      ribosomeText: ({ mutantCodon }) =>
        `This paused view shows the ribosome moving along the codons. It is approaching ${mutantCodon}, where translation will end early.`,
      autoTitle: "Auto",
      autoText:
        "Auto runs the same steps continuously instead of one click at a time. In this nonsense example, it stops when the early STOP codon is reached.",
      speedTitle: "Speed",
      speedText:
        "Speed controls how fast Auto runs. Slower motion is usually better when a teacher wants students to follow each codon.",
      compareTitle: "Compare the outputs",
      compareText: ({ stopCodon }) =>
        `After translation reaches ${stopCodon}, compare the outputs. The original chain keeps going, but the mutant chain stops early and is shorter.`,
      resetTitle: "Reset Sequence",
      resetText:
        "Reset Sequence returns the bases to the original mRNA and clears the result, so users can test another mutation.",
      helpTitle: "Open help again",
      helpText:
        "Press this question mark whenever you want to see these explanations again.",
      changedCodonFallback:
        "The highlighted base show where the codon changed. In this example, the mutation creates a STOP codon.",
      changedCodon: ({
        codonLabel,
        originalCodon,
        mutantCodon,
        originalAminoAcid,
      }) =>
        `The highlighted base show where ${codonLabel} changed: ${originalCodon} becomes ${mutantCodon}, so ${originalAminoAcid} becomes STOP.`,
      codonNumber: ({ codonNumber }) => `codon ${codonNumber}`,
      thisCodon: "this codon",
      fallbackAminoAcid: "an amino acid",
      nonsensePresetFallback:
        "For example, you can select Nonsense (high), which creates an early STOP codon. You can also edit the bases above directly to create a specific mutation instead of using a preset.",
      nonsensePreset: ({ originalCodon, mutantCodon }) =>
        `For example, you can select Nonsense (high). It changes ${originalCodon} into ${mutantCodon}, creating an early STOP codon. You can also edit the bases above directly to create a specific mutation instead of using a preset.`,
      stopCodonFallback: "the STOP codon",
      stopFallback: "STOP",
    },
  },
};
