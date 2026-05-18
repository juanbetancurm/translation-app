//
// The Mutation Simulator feature. Composes the reducer-managed editor,
// preset buttons, classifier wiring, analysis card, and protein comparison.
//
// Step 5.5 adds the mutant translation animation.

import {
  createRef,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import AnalysisCard from "./components/AnalysisCard";
import MutantAnimationStage from "./components/MutantAnimationStage";
import PresetButtons from "./components/PresetButtons";
import ProteinComparison from "./components/ProteinComparison";
import Ribosome from "../../shared/components/Ribosome";
import SequenceEditor from "./components/SequenceEditor";
import ToolPicker from "./components/ToolPicker";
import MrnaStrand from "../../shared/components/MrnaStrand";
import PolypeptideChain from "../../shared/components/PolypeptideChain";
import { GC } from "../../shared/biology/geneticCode.js";
import { ORIG_SEQ } from "../../shared/biology/constants.js";
import { splitCodons } from "../../shared/biology/translation.js";
import { computeRibosomeLeft } from "../../lib/ribosomePositioning.js";
import {
  initialMutationState,
  mutationReducer,
  getEffectiveSequence,
} from "./mutationReducer.js";
import "./MutationSimulator.css";

const STOP_CODONS = new Set(["UAA", "UAG", "UGA"]);
const START_LOST_TYPE = "Start lost";

export default function MutationSimulator() {
  const [state, dispatch] = useReducer(
    mutationReducer,
    initialMutationState
  );
  const containerRef = useRef(null);
  const codonRefs = useMemo(
    () => Array.from({ length: 30 }, () => createRef()),
    []
  );
  const [riboLeft, setRiboLeft] = useState(0);

  useLayoutEffect(() => {
    function updatePosition() {
      const container = containerRef.current;
      const codonEl = codonRefs[state.animation.riboCodonIndex]?.current;
      if (!container || !codonEl) return;

      setRiboLeft(
        computeRibosomeLeft(
          codonEl.getBoundingClientRect(),
          container.getBoundingClientRect()
        )
      );
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [
    state.animation.riboCodonIndex,
    state.animation.stepIndex,
    codonRefs,
    containerRef,
  ]);

  const handleToolChange = (tool) =>
    dispatch({ type: "SET_TOOL", tool });

  const handleBaseClick = (index) =>
    dispatch({ type: "CLICK_BASE", index });

  const handleReset = () =>
    dispatch({ type: "RESET_SEQUENCE" });

  const handleApplyPreset = (presetId) =>
    dispatch({ type: "APPLY_PRESET", presetId });

  const handleStartTranslation = () =>
    dispatch({ type: "TRANSLATE_MUTANT" });

  const handleAnimationTick = () =>
    dispatch({ type: "ANIMATION_TICK" });

  const handleAnimationPlay = () =>
    dispatch({ type: "START_TRANSLATION" });

  const handleAnimationPause = () =>
    dispatch({ type: "STOP_TRANSLATION" });

  const handleAnimationReset = () =>
    dispatch({ type: "TRANSLATE_MUTANT" });

  const handleAnimationSpeedChange = (speed) =>
    dispatch({ type: "SET_ANIMATION_SPEED", speed });

  const originalCodons = splitCodons(ORIG_SEQ);
  const originalLabels = originalCodons.map((codon) => GC[codon] || "???");
  const originalStates = originalCodons.map(() => "upcoming");
  const isStartLost = state.analysis?.type === START_LOST_TYPE;

  const effectiveSeq = getEffectiveSequence(state.bases);
  const mutantCodons = splitCodons(effectiveSeq);
  const mutantLabels = mutantCodons.map((codon) => GC[codon] || "???");
  const animationStarted =
    state.analysis &&
    (state.animation.isPlaying ||
      state.animation.stepIndex >= 0 ||
      state.animation.isFinished);
  const mutantStates = mutantCodons.map((codon, index) => {
    const isCurrent =
      animationStarted && index === state.animation.riboCodonIndex;
    const isPast = animationStarted && index < state.animation.riboCodonIndex;
    const isStop = STOP_CODONS.has(codon);

    const isLastCodon = index === mutantCodons.length - 1;
    const originalAtSamePosition =
      index < originalCodons.length ? originalCodons[index] : null;
    const wasOriginallyStop = STOP_CODONS.has(originalAtSamePosition);

    if (isStop && (isCurrent || !(isLastCodon && wasOriginallyStop))) {
      return "stop-hit";
    }

    if (isCurrent) return "active";
    if (isPast) return "done";
    return "upcoming";
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
            <div
              className={`mutation-strand-with-ribo${
                state.analysis ? " mutation-strand-with-ribo-animated" : ""
              }`}
              ref={containerRef}
            >
              {state.analysis && (
                <div className="mutant-ribo-overlay">
                  <Ribosome
                    left={riboLeft}
                    visible={
                      state.animation.isPlaying ||
                      state.animation.stepIndex >= 0
                    }
                    largeVisible={true}
                    fadingOut={state.animation.isFinished}
                  />
                </div>
              )}
              <MrnaStrand
                codons={mutantCodons}
                labels={mutantLabels}
                states={mutantStates}
                strandId="mutant-strand"
                headerLabel="Mutant mRNA"
                codonRefs={codonRefs}
              />
            </div>
            <MrnaStrand
              codons={originalCodons}
              labels={originalLabels}
              states={originalStates}
              strandId="original-strand"
              headerLabel="Original mRNA"
            />
            {state.analysis && !isStartLost && (
              <PolypeptideChain
                aminoAcids={state.animation.protein}
                label="Mutant protein:"
              />
            )}
            {state.analysis && isStartLost && (
              <div className="mut-no-protein">
                <div className="pep-lbl">Mutant protein:</div>
                <div className="mut-no-protein-msg">No protein produced</div>
              </div>
            )}
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
              onClick={handleStartTranslation}
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

          {state.analysis && (
            <div className="mut-animation-panel">
              <h3>Animation</h3>
              <MutantAnimationStage
                animation={state.animation}
                onPlay={handleAnimationPlay}
                onPause={handleAnimationPause}
                onReset={handleAnimationReset}
                onSpeedChange={handleAnimationSpeedChange}
                onTick={handleAnimationTick}
                disabled={isStartLost}
              />
            </div>
          )}

          <PresetButtons onApplyPreset={handleApplyPreset} />
        </div>
      </aside>
    </div>
  );
}
