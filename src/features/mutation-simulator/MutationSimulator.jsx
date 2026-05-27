//
// The Mutation Simulator feature. Composes the reducer-managed editor,
// preset buttons, classifier wiring, analysis card, and protein comparison.
//
// Step 5.5 adds the mutant translation animation.

import {
  createRef,
  useCallback,
  useEffect,
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
import GuidedTour from "../../shared/guided-tour/GuidedTour.jsx";
import EmergingPolypeptide from "../../shared/components/EmergingPolypeptide";
import ReleaseFactor from "../../shared/components/ReleaseFactor";
import Ribosome from "../../shared/components/Ribosome";
import RibosomeMrnaOverlay from "../../shared/components/RibosomeMrnaOverlay";
import SequenceEditor from "./components/SequenceEditor";
import ToolPicker from "./components/ToolPicker";
import MrnaStrand from "../../shared/components/MrnaStrand";
import TrnaMolecule from "../../shared/components/TrnaMolecule";
import { GC } from "../../shared/biology/geneticCode.js";
import { ORIG_SEQ } from "../../shared/biology/constants.js";
import { ac, splitCodons } from "../../shared/biology/translation.js";
import { getGuideStatus } from "../../shared/guided-tour/guidedTourStorage.js";
import {
  computeTranslationSceneLayout,
  readFixedRibosomeMode,
  readSceneScale,
} from "../../lib/translationSceneLayout.js";
import {
  RELEASE_FACTOR_BOTTOM,
  RELEASE_FACTOR_HALF_WIDTH,
  RIBOSOME_WIDTH,
  TRNA_BOTTOM,
  TRNA_HALF_WIDTH,
} from "../../lib/ribosomeGeometry.js";
import {
  buildMutationAnimationSteps,
  initialMutationState,
  mutationReducer,
  getEffectiveSequence,
} from "./mutationReducer.js";
import { MUTATION_TYPES } from "./mutationClassifier.js";
import {
  MUTATION_GUIDE_STORAGE_KEY,
  mutationGuideSteps,
} from "./mutationGuideSteps.js";
import { createMutationGuideHooks } from "./mutationGuideHooks.js";
import "./MutationSimulator.css";

const STOP_CODONS = new Set(["UAA", "UAG", "UGA"]);

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
  const [trackOffset, setTrackOffset] = useState(0);
  const [codonCenters, setCodonCenters] = useState([]);
  const [sceneScale, setSceneScale] = useState(1);
  const [guideRun, setGuideRun] = useState(null);
  const autoGuideScheduledRef = useRef(false);

  const startGuide = useCallback((source) => {
    setGuideRun({ source, id: Date.now() });
  }, []);

  const closeGuide = useCallback((status) => {
    if (status === "completed" || status === "skipped") {
      dispatch({ type: "RESET_SEQUENCE" });
    }

    setGuideRun(null);
  }, []);

  useEffect(() => {
    if (autoGuideScheduledRef.current) return;
    if (getGuideStatus(MUTATION_GUIDE_STORAGE_KEY) !== null) return;

    autoGuideScheduledRef.current = true;
    const timer = window.setTimeout(() => startGuide("auto"), 500);
    return () => window.clearTimeout(timer);
  }, [startGuide]);

  useLayoutEffect(() => {
    function updatePosition() {
      const container = containerRef.current;
      const codonEl = codonRefs[state.animation.riboCodonIndex]?.current;
      if (!container || !codonEl) return;

      const scale = readSceneScale(container);
      const layout = computeTranslationSceneLayout({
        container,
        codonRefs,
        activeCodonIndex: state.animation.riboCodonIndex,
        ribosomeWidth: RIBOSOME_WIDTH * scale,
        fixedRibosome: readFixedRibosomeMode(container),
        clampRibosome: true,
      });

      setSceneScale((currentScale) =>
        Math.abs(currentScale - scale) < 0.01 ? currentScale : scale
      );
      setCodonCenters(layout.codonCenters);
      setTrackOffset((currentOffset) =>
        Math.abs(currentOffset - layout.trackOffset) < 0.5
          ? currentOffset
          : layout.trackOffset
      );
      setRiboLeft((currentLeft) =>
        Math.abs(currentLeft - layout.ribosomeLeft) < 0.5
          ? currentLeft
          : layout.ribosomeLeft
      );
    }

    updatePosition();
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updatePosition);

    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updatePosition);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updatePosition);
    };
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

  const mutationGuideHooks = useMemo(
    () =>
      createMutationGuideHooks({
        selectNonsensePreset() {
          dispatch({ type: "APPLY_PRESET", presetId: "nonsense" });
        },
        translateCurrentMutation() {
          dispatch({ type: "TRANSLATE_MUTANT" });
        },
        showNonsenseIntermediateStep() {
          dispatch({
            type: "JUMP_TO_ANIMATION_STEP",
            actionName: "shift",
            codonIndex: 1,
          });
        },
        showNonsenseFinishedStep() {
          dispatch({
            type: "JUMP_TO_ANIMATION_STEP",
            actionName: "release",
          });
        },
      }),
    []
  );

  const originalCodons = splitCodons(ORIG_SEQ);
  const originalLabels = originalCodons.map((codon) => GC[codon] || "???");
  const originalStates = originalCodons.map(() => "upcoming");
  const isStartLost = state.analysis?.type === MUTATION_TYPES.START_LOST;

  const effectiveSeq = getEffectiveSequence(state.bases);
  const mutantCodons = splitCodons(effectiveSeq);
  const mutantLabels = mutantCodons.map((codon) => GC[codon] || "???");
  const animationSteps = buildMutationAnimationSteps(mutantCodons);
  const currentAnimationStep =
    state.animation.stepIndex >= 0
      ? animationSteps[state.animation.stepIndex]
      : null;
  const activeCodonIndices = new Set(
    currentAnimationStep?.activeIndices || []
  );
  const animationStarted =
    state.analysis &&
    (state.animation.isPlaying ||
      state.animation.stepIndex >= 0 ||
      state.animation.isFinished);
  const mutantStates = mutantCodons.map((codon, index) => {
    const isCurrent = animationStarted && activeCodonIndices.has(index);
    const isPast =
      animationStarted &&
      currentAnimationStep &&
      index < Math.min(...currentAnimationStep.activeIndices);
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

  const ribosomeVisible =
    Boolean(state.analysis) &&
    !isStartLost &&
    state.animation.stepIndex >= 0;
  const ribosomeLargeVisible =
    ribosomeVisible &&
    currentAnimationStep?.action !== "showSmall" &&
    currentAnimationStep?.action !== "initTRNA";
  const ribosomeLargePreview =
    ribosomeVisible && currentAnimationStep?.action === "initTRNA";
  const ribosomeFading =
    ribosomeVisible && currentAnimationStep?.action === "release";
  const releaseFactor =
    currentAnimationStep?.action === "stop"
      ? { codonIndex: currentAnimationStep.codonIndex }
      : null;
  const trnas = getAnimationTrnas(currentAnimationStep, mutantCodons);
  const showProteinProgress =
    Boolean(animationStarted) &&
    !isStartLost &&
    state.animation.stepIndex >= 0;
  const isNonsense = state.analysis?.type === MUTATION_TYPES.NONSENSE;
  const prematureStopIndex = mutantCodons.findIndex(
    (codon, index) =>
      STOP_CODONS.has(codon) && index < originalCodons.length - 1
  );
  const guideStopCodonIndex =
    state.analysis?.stopCodonIndex ??
    (prematureStopIndex >= 0 ? prematureStopIndex : null);
  const guideStopCodon =
    state.analysis?.stopCodon ??
    (guideStopCodonIndex != null ? mutantCodons[guideStopCodonIndex] : null);
  const guideOriginalCodon =
    state.analysis?.originalCodon ??
    (guideStopCodonIndex != null ? originalCodons[guideStopCodonIndex] : null);
  const guideOriginalAminoAcid =
    state.analysis?.originalAminoAcid ??
    (guideOriginalCodon ? GC[guideOriginalCodon] : null);
  const guideContext = {
    stopCodon: guideStopCodon,
    stopCodonIndex: guideStopCodonIndex,
    originalCodon: guideOriginalCodon,
    mutantCodon: guideStopCodon,
    originalAminoAcid: guideOriginalAminoAcid,
    originalProtein: state.analysis?.originalProtein,
    mutantProtein: state.analysis?.mutantProtein,
  };

  return (
    <>
      <div className="mutation" data-guide="mutation-simulator">
        <div className="mutation-main">
          <div className="stage" data-guide="animation-stage">
            {state.analysis && (
              <div className="mutation-result-band">
                <AnalysisCard
                  analysis={state.analysis}
                  dataGuide="mutation-status"
                />
                <ProteinComparison
                  originalProtein={state.analysis.originalProtein}
                  mutantProtein={state.analysis.mutantProtein}
                  diffPositions={state.analysis.diffPositions}
                  mutantProgress={state.animation.protein.length}
                  showProgress={showProteinProgress}
                  stopCodon={isNonsense ? state.analysis.stopCodon : null}
                  stopCodonIndex={
                    isNonsense ? state.analysis.stopCodonIndex : null
                  }
                  dataGuide="protein-comparison"
                />
              </div>
            )}

            <div className="mut-strand-wrapper">
              <div
                className={`mutation-strand-with-ribo${
                  ribosomeVisible ? " mutation-strand-with-ribo-animated" : ""
                }`}
                ref={containerRef}
                style={{ "--track-offset": `${trackOffset}px` }}
              >
                {state.analysis && (
                  <div className="mutant-ribo-overlay">
                    <Ribosome
                      left={riboLeft}
                      visible={ribosomeVisible}
                      largeVisible={ribosomeLargeVisible}
                      largePreview={ribosomeLargePreview}
                      fadingOut={ribosomeFading}
                      dataGuide="ribosome-sprite"
                    />
                    <RibosomeMrnaOverlay
                      codons={mutantCodons}
                      codonCenters={codonCenters}
                      states={mutantStates}
                      visible={ribosomeVisible}
                    />
                    <EmergingPolypeptide
                      aminoAcids={state.animation.protein}
                      ribosomeLeft={riboLeft}
                      visible={ribosomeVisible && ribosomeLargeVisible}
                      released={ribosomeFading}
                      sceneScale={sceneScale}
                    />
                    {trnas.map((trna, index) => {
                      const codonCenter = codonCenters[trna.codonIndex];
                      if (codonCenter == null) return null;
                      return (
                        <TrnaMolecule
                          key={`${trna.site}-${trna.codonIndex}-${index}`}
                          left={codonCenter - TRNA_HALF_WIDTH * sceneScale}
                          bottom={TRNA_BOTTOM * sceneScale}
                          site={trna.site}
                          anticodon={trna.anticodon}
                          aminoAcid={trna.aminoAcid}
                          entering={trna.entering}
                        />
                      );
                    })}
                    {releaseFactor && (() => {
                      const codonCenter =
                        codonCenters[releaseFactor.codonIndex];
                      if (codonCenter == null) return null;
                      return (
                        <ReleaseFactor
                          left={
                            codonCenter -
                            RELEASE_FACTOR_HALF_WIDTH * sceneScale
                          }
                          bottom={RELEASE_FACTOR_BOTTOM * sceneScale}
                        />
                      );
                    })()}
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
            </div>
          </div>
        </div>

        <aside className="mutation-side">
          <div className="mutation-side-scroll">
            <div className="mut-panel" data-guide="mutation-lab">
              <div className="mut-panel-heading">
                <h3>Mutation Lab</h3>
                <button
                  type="button"
                  className="guide-help-button"
                  aria-label="Open guided explanation"
                  onClick={() => startGuide("manual")}
                  data-guide="help-button"
                >
                  ?
                </button>
              </div>
              <p className="mut-instructions">
                Click a base to <strong>change</strong> it. Use the tools to{" "}
                <strong>delete</strong> or <strong>insert</strong> bases. Then
                hit <strong>Translate Mutant</strong> to analyze the altered
                mRNA.
              </p>

              <ToolPicker
                activeTool={state.tool}
                onToolChange={handleToolChange}
              />

              <SequenceEditor
                bases={state.bases}
                changes={state.changes}
                onClick={handleBaseClick}
                highlightCodonIndex={
                  guideStopCodonIndex
                }
                dataGuide="sequence-grid"
              />

              <div className="mut-actions">
                <button
                  type="button"
                  className="btn btn-1"
                  onClick={handleStartTranslation}
                  data-guide="translate-mutant-button"
                >
                  Translate Mutant -&gt;
                </button>
                <button
                  type="button"
                  className="btn btn-2"
                  onClick={handleReset}
                  data-guide="reset-sequence-button"
                >
                  Reset Sequence
                </button>
              </div>
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
                  guideTargets={{
                    controls: "animation-controls",
                    next: "next-step-button",
                    auto: "auto-button",
                    speed: "speed-control",
                  }}
                />
              </div>
            )}

            <div className="mut-presets-panel">
              <PresetButtons onApplyPreset={handleApplyPreset} />
            </div>
          </div>
        </aside>
      </div>

      {guideRun && (
        <GuidedTour
          key={guideRun.id}
          isOpen
          steps={mutationGuideSteps}
          hooks={mutationGuideHooks}
          storageKey={MUTATION_GUIDE_STORAGE_KEY}
          context={guideContext}
          onClose={closeGuide}
        />
      )}
    </>
  );
}

function getAnimationTrnas(step, codons) {
  if (!step) return [];

  switch (step.action) {
    case "initTRNA":
    case "showLarge":
      return [
        {
          site: "p",
          codonIndex: 0,
          anticodon: ac(codons[0]),
          aminoAcid: "Met",
          entering: step.action === "initTRNA",
        },
      ];

    case "arrive":
    case "bond": {
      const codon = codons[step.codonIndex];
      return [
        {
          site: "p",
          codonIndex: step.codonIndex - 1,
          anticodon: ac(codons[step.codonIndex - 1]),
          aminoAcid: null,
          entering: false,
        },
        {
          site: "a",
          codonIndex: step.codonIndex,
          anticodon: ac(codon),
          aminoAcid: GC[codon],
          entering: step.action === "arrive",
        },
      ];
    }

    case "shift":
      // A STOP codon recruits release factors, not an incoming aminoacyl-tRNA.
      // Hide the spent P-site tRNA in this simplified view so the pause reads
      // as "approaching termination" instead of "GGA is arriving next".
      if (STOP_CODONS.has(codons[step.codonIndex + 1])) {
        return [];
      }

      return [
        {
          site: "p",
          codonIndex: step.codonIndex,
          anticodon: ac(codons[step.codonIndex]),
          aminoAcid: null,
          entering: false,
        },
      ];

    default:
      return [];
  }
}
