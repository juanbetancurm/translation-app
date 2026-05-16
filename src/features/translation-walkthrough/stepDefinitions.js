//
//
// The 24 animation steps of the Translation Walkthrough, generated once
// at module load from the reference sequence and the genetic code.
//
// Each step is a plain object describing what the animation should look
// like at that point in time. The reducer in walkthroughReducer.js
// indexes into this array to compute the full state for a given step.
//
// Step shape:
//   phase     "init" | "elong" | "term" — used by the phase banner
//   title     short heading shown in the sidebar
//   text      HTML string explaining what's happening, shown in the sidebar
//   action    machine-readable identifier for what visually changes at
//             this step. The reducer reads it to decide which fields of
//             the state to update.
//   codonIndex  optional — which codon (0-based) this step is about.
//               Used for elongation, bond, shift, and termination steps.
//
// The action values are:
//   "showMRNA"   the mRNA strand appears, no ribosome
//   "showSmall"  40S subunit lands on AUG, 60S still hidden
//   "initTRNA"   initiator Met-tRNA enters P-site
//   "showLarge"  60S subunit joins, Met added to polypeptide
//   "arrive"     new charged tRNA arrives at A-site
//   "bond"       peptide bond forms, amino acid added to chain
//   "shift"      translocation: ribosome slides one codon right
//   "stop"       STOP codon reached, release factor enters
//   "release"    ribosome disassembles, protein released

import { GC } from "../../shared/biology/geneticCode.js";
import { ac } from "../../shared/biology/translation.js";
import { ORIG_CODONS } from "../../shared/biology/constants.js";

function buildSteps() {
  const steps = [];

  // ── INITIATION (4 fixed steps) ─────────────────────────────────────
  steps.push({
    phase: "init",
    title: "mRNA arrives in cytoplasm",
    text:
      'The mature <strong>mRNA</strong> has exited the nucleus after ' +
      "transcription and processing (5' cap added, introns spliced out, " +
      "poly-A tail attached). It now floats in the cytoplasm, its sequence " +
      "of codons exposed and ready to be read. Direction is always " +
      "<em>5' → 3'</em>. Our mRNA has 8 codons: " +
      "<em>AUG CCU GAA UUC GGA AAG CCA UGA</em>.",
    action: "showMRNA",
  });

  steps.push({
    phase: "init",
    title: "40S small subunit scans for AUG",
    text:
      "The <strong>40S small ribosomal subunit</strong> — preloaded with " +
      "initiation factors and a special <em>initiator Met-tRNA</em> — " +
      "binds near the 5' cap of the mRNA. It then <strong>scans</strong> " +
      "the mRNA in the 5'→3' direction, looking for the first <em>AUG</em> " +
      "codon. Recognition uses the <strong>Kozak consensus</strong> (the " +
      "surrounding sequence context), not just AUG itself. This is why " +
      "not every AUG in an mRNA is used as a start.",
    action: "showSmall",
  });

  steps.push({
    phase: "init",
    title: "AUG found — Met-tRNA locks into P-site",
    text:
      "The scanner finds <em>AUG</em>. The initiator tRNA's anticodon " +
      "(<em>UAC</em>) base-pairs with <em>AUG</em> and locks into the " +
      "<strong>P-site</strong> (peptidyl site). This is the " +
      "<strong>only</strong> tRNA that ever enters the P-site directly — " +
      "every subsequent tRNA must enter through the A-site. The start " +
      "codon also specifies <em>methionine</em> as the first amino acid.",
    action: "initTRNA",
  });

  steps.push({
    phase: "init",
    title: "60S joins → 80S ribosome assembled",
    text:
      "The <strong>60S large subunit</strong> joins from above, forming " +
      "the complete <strong>80S ribosome</strong>. Initiation factors are " +
      "ejected. The ribosome now has three functional sites:<br><br>" +
      '• <strong style="color:var(--tx3)">E-site</strong> (exit): spent ' +
      "tRNAs leave here<br>" +
      '• <strong style="color:var(--pu)">P-site</strong> (peptidyl): ' +
      "holds the tRNA carrying the growing chain<br>" +
      '• <strong style="color:var(--am)">A-site</strong> (aminoacyl): ' +
      "new tRNAs arrive here<br><br>" +
      "Met-tRNA is in the P-site. The A-site is positioned over the " +
      "<em>second codon</em> (CCU). " +
      '<strong class="hl-green">Initiation complete — elongation begins!' +
      "</strong>",
    action: "showLarge",
  });

  // ── ELONGATION + TERMINATION (3 steps per sense codon, 2 for stop) ─
  for (let i = 1; i < ORIG_CODONS.length; i++) {
    const codon = ORIG_CODONS[i];
    const aminoAcid = GC[codon];

    if (aminoAcid === "STOP") {
      // 2 termination steps when we hit the stop codon
      steps.push({
        phase: "term",
        title: "STOP codon: " + codon,
        text:
          "The A-site is now positioned over <em>" + codon + "</em> — a " +
          '<strong class="hl-coral">STOP codon</strong>. No tRNA in the ' +
          "cell has an anticodon matching a stop codon. Instead, a protein " +
          "called <strong>eRF1</strong> (eukaryotic Release Factor 1) " +
          "mimics the shape of a tRNA and enters the A-site. It recognizes " +
          "the stop codon and triggers <strong>hydrolysis</strong> — " +
          "breaking the bond between the polypeptide and the P-site tRNA. " +
          "The completed protein is freed.",
        action: "stop",
        codonIndex: i,
      });

      steps.push({
        phase: "term",
        title: "Protein released — translation complete!",
        text:
          "The finished <strong>polypeptide</strong> " +
          "(Met-Pro-Glu-Phe-Gly-Lys-Pro) is released. The ribosome " +
          "<strong>disassembles</strong> into its 40S and 60S subunits, " +
          "which are recycled for the next mRNA. The protein now " +
          "<strong>folds</strong> into its 3D conformation — the shape " +
          "that determines its function.<br><br>" +
          "In your IEI pipeline, the annotation tools trace this exact " +
          "path in reverse: they start from a VCF variant, determine " +
          "which codon it affects, look up the amino acid change, and " +
          "assess whether the protein's function is disrupted.",
        action: "release",
      });
      break;
    }

    // 3 elongation steps per sense codon: arrive, bond, shift
    steps.push({
      phase: "elong",
      title: "tRNA delivers " + aminoAcid + " (codon " + codon + ")",
      text:
        "A <strong>charged tRNA</strong> carrying <em>" + aminoAcid +
        '</em> enters the <strong style="color:var(--am)">A-site</strong>. ' +
        "Its anticodon <em>" + ac(codon) + "</em> base-pairs with the " +
        "mRNA codon <em>" + codon + "</em>. The ribosome checks the " +
        "match — if the anticodon doesn't complement the codon, the " +
        "tRNA is rejected and another tries. This is the " +
        "<strong>physical implementation of the genetic code</strong>: " +
        "codon-anticodon pairing selects the correct amino acid.<br><br>" +
        "Look up in the table: <em>" + codon + "</em> → <em>" +
        aminoAcid + "</em>.",
      action: "arrive",
      codonIndex: i,
    });

    steps.push({
      phase: "elong",
      title: "Peptide bond: " + aminoAcid + " added to chain",
      text:
        "The ribosome's <strong>peptidyl transferase</strong> (catalyzed " +
        "by the rRNA — making the ribosome a <em>ribozyme</em>) transfers " +
        "the growing chain from the P-site tRNA onto the A-site amino " +
        "acid. A new <strong>peptide bond</strong> forms. The P-site " +
        "tRNA is now empty; the A-site tRNA carries the entire polypeptide.",
      action: "bond",
      codonIndex: i,
    });

    steps.push({
      phase: "elong",
      title: "Translocation — ribosome moves one codon",
      text:
        "The ribosome <strong>translocates</strong> one codon forward " +
        "(5'→3'). The empty tRNA exits through the <strong>E-site</strong>, " +
        "the peptidyl-tRNA shifts from A→P, and a new codon is exposed " +
        "in the now-empty <strong>A-site</strong>. This cycle takes ~" +
        "<strong>0.5 seconds</strong> in a eukaryotic cell, adding ~2 " +
        "amino acids per second.",
      action: "shift",
      codonIndex: i,
    });
  }

  return steps;
}

export const TRANSLATION_STEPS = buildSteps();