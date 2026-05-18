//
// The Mutation Simulator feature. Composes the reducer-managed editor,
// preset buttons, classifier wiring, analysis card, and protein comparison.
//
// Step 5.5 will add the mutant translation animation.

import { useReducer } from "react";
import AnalysisCard from "./components/AnalysisCard";
import PresetButtons from "./components/PresetButtons";
import ProteinComparison from "./components/ProteinComparison";
import SequenceEditor from "./components/SequenceEditor";
import ToolPicker from "./components/ToolPicker";
import MrnaStrand from "../../shared/components/MrnaStrand";
import { GC } from "../../shared/biology/geneticCode.js";
import { ORIG_SEQ } from "../../shared/biology/constants.js";
import { splitCodons } from "../../shared/biology/translation.js";
import {
  initialMutationState,
  mutationReducer,
  getEffectiveSequence,
} from "./mutationReducer.js";
import "./MutationSimulator.css";

const STOP_CODONS = new Set(["UAA", "UAG", "UGA"]);

export default function MutationSimulator() {
  const [state, dispatch] = useReducer(
    mutationReducer,
    initialMutationState
  );

  const handleToolChange = (tool) =>
    dispatch({ type: "SET_TOOL", tool });

  const handleBaseClick = (index) =>
    dispatch({ type: "CLICK_BASE", index });

  const handleReset = () =>
    dispatch({ type: "RESET_SEQUENCE" });

  const handleApplyPreset = (presetId) =>
    dispatch({ type: "APPLY_PRESET", presetId });

  const handleTranslate = () =>
    dispatch({ type: "TRANSLATE_MUTANT" });

  const originalCodons = splitCodons(ORIG_SEQ);
  const originalLabels = originalCodons.map((codon) => GC[codon] || "???");
  const originalStates = originalCodons.map(() => "upcoming");

  const effectiveSeq = getEffectiveSequence(state.bases);
  const mutantCodons = splitCodons(effectiveSeq);
  const mutantLabels = mutantCodons.map((codon) => GC[codon] || "???");
  const mutantStates = mutantCodons.map((codon, index) => {
    if (!STOP_CODONS.has(codon)) return "upcoming";

    const isLastCodon = index === mutantCodons.length - 1;
    const originalAtSamePosition =
      index < originalCodons.length ? originalCodons[index] : null;
    const wasOriginallyStop = STOP_CODONS.has(originalAtSamePosition);

    return isLastCodon && wasOriginallyStop ? "upcoming" : "stop-hit";
  });

  return (
    <div className="mutation">
      <div className="mutation-main">
        <div className="stage">
          {state.analysis && (
            <>
              <AnalysisCard analysis={state.analysis} />
              <ProteinComparison
                originalProtein={state.analysis.originalProtein}
                mutantProtein={state.analysis.mutantProtein}
                diffPositions={state.analysis.diffPositions}
              />
            </>
          )}

          <div className="mut-strand-wrapper">
            <MrnaStrand
              codons={mutantCodons}
              labels={mutantLabels}
              states={mutantStates}
              strandId="mutant-strand"
              headerLabel="Mutant mRNA"
            />
            <MrnaStrand
              codons={originalCodons}
              labels={originalLabels}
              states={originalStates}
              strandId="original-strand"
              headerLabel="Original mRNA"
            />
          </div>
        </div>
      </div>

      <aside className="mutation-side">
        <div className="mut-panel">
          <h3>Mutation Lab</h3>
          <p className="mut-instructions">
            Click a base to <strong>change</strong> it. Use the tools to{" "}
            <strong>delete</strong> or <strong>insert</strong> bases. Then
            hit <strong>Translate Mutant</strong> to analyze the altered mRNA.
          </p>

          <ToolPicker
            activeTool={state.tool}
            onToolChange={handleToolChange}
          />

          <SequenceEditor
            bases={state.bases}
            changes={state.changes}
            onClick={handleBaseClick}
          />

          <div className="mut-actions">
            <button
              type="button"
              className="btn btn-1"
              onClick={handleTranslate}
            >
              Translate Mutant -&gt;
            </button>
            <button
              type="button"
              className="btn btn-2"
              onClick={handleReset}
            >
              Reset Sequence
            </button>
          </div>

          <PresetButtons onApplyPreset={handleApplyPreset} />
        </div>
      </aside>
    </div>
  );
}
