//
//
// The Translation Walkthrough feature. Uses useReducer for state,
// useRef for DOM access, useLayoutEffect for ribosome positioning, and
// useAutoPlay for timed progression.
//
// Architecture:
//   - walkthroughReducer holds all the step state.
//   - dispatch({ type: "NEXT_STEP" }) advances one step.
//   - A ref-based effect measures the active codon's DOM position
//     after each render and updates `riboLeft` so the Ribosome can
//     position itself correctly.

import {
  createRef,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import MrnaStrand from "../../shared/components/MrnaStrand";
import EmergingPolypeptide from "../../shared/components/EmergingPolypeptide";
import PolypeptideChain from "../../shared/components/PolypeptideChain";
import Ribosome from "../../shared/components/Ribosome";
import RibosomeMrnaOverlay from "../../shared/components/RibosomeMrnaOverlay";
import TrnaMolecule from "../../shared/components/TrnaMolecule";
import PhaseBanner from "../../shared/components/PhaseBanner";
import ReleaseFactor from "../../shared/components/ReleaseFactor";
import ControlBar from "../../shared/components/ControlBar";
import StepExplanation from "./components/StepExplanation";
import { GC } from "../../shared/biology/geneticCode.js";
import { ORIG_CODONS } from "../../shared/biology/constants.js";
import {
  computeCodonCenter,
  computeRibosomeLeft,
} from "../../lib/ribosomePositioning.js";
import {
  RELEASE_FACTOR_BOTTOM,
  RELEASE_FACTOR_HALF_WIDTH,
  RIBOSOME_WIDTH,
  TRNA_BOTTOM,
  TRNA_HALF_WIDTH,
} from "../../lib/ribosomeGeometry.js";
import {
  initialState,
  walkthroughReducer,
} from "./walkthroughReducer.js";
import {
  TRANSLATION_STEPS,
} from "./stepDefinitions.js";
import { useAutoPlay } from "../../shared/hooks/useAutoPlay.js";
import "./TranslationWalkthrough.css";

const STRAND_ID = "walkthrough-strand";

function readSceneScale(element) {
  const scale = Number.parseFloat(
    getComputedStyle(element).getPropertyValue("--scene-scale")
  );
  return Number.isFinite(scale) && scale > 0 ? scale : 1;
}

export default function TranslationWalkthrough() {
  // ── Reducer-managed state ────────────────────────────────────────
  const [state, dispatch] = useReducer(walkthroughReducer, initialState);

  // ── Local UI-only state ──────────────────────────────────────────
  // The pixel left of the ribosome — derived from the DOM by the
  // positioning effect below. Not stored in the reducer because the
  // reducer is pure (cannot touch the DOM).
  const [riboLeft, setRiboLeft] = useState(0);
  const [codonCenters, setCodonCenters] = useState([]);
  const [sceneScale, setSceneScale] = useState(1);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [speed, setSpeed] = useState(1200);

  // ── Refs for DOM measurement ─────────────────────────────────────
  // The container ref points to the .strand-with-ribo wrapper. The codonRefs
  // array holds one ref per codon block. After each render, the
  // effect below uses these to compute riboLeft.
  const containerRef = useRef(null);
  const codonRefs = useMemo(
    () => ORIG_CODONS.map(() => createRef()),
    []
  );

  // ── Positioning effect ───────────────────────────────────────────
  // After every render, recompute the ribosome's pixel position based
  // on the currently active codon. The effect re-runs whenever
  // state.riboCodonIndex changes.
  useLayoutEffect(() => {
    function updateOverlayPositions() {
      const container = containerRef.current;
      const codonEl = codonRefs[state.riboCodonIndex]?.current;
      if (!container || !codonEl) return;

      const containerRect = container.getBoundingClientRect();
      const scale = readSceneScale(container);
      const centers = codonRefs.map((ref) => {
        if (!ref.current) return null;
        return computeCodonCenter(
          ref.current.getBoundingClientRect(),
          containerRect
        );
      });

      setSceneScale((currentScale) =>
        Math.abs(currentScale - scale) < 0.01 ? currentScale : scale
      );
      setCodonCenters(centers);
      setRiboLeft(
        computeRibosomeLeft(
          codonEl.getBoundingClientRect(),
          containerRect,
          RIBOSOME_WIDTH * scale
        )
      );
    }

    updateOverlayPositions();
    window.addEventListener("resize", updateOverlayPositions);
    return () => window.removeEventListener("resize", updateOverlayPositions);
  }, [codonRefs, state.stepIndex, state.riboCodonIndex, state.riboVisible]);

  const handleAutoTick = () => {
    const lastStepIndex = TRANSLATION_STEPS.length - 1;

    if (state.stepIndex >= lastStepIndex) {
      setIsAutoRunning(false);
      return;
    }

    dispatch({ type: "NEXT_STEP" });

    if (state.stepIndex + 1 >= lastStepIndex) {
      setIsAutoRunning(false);
    }
  };

  // Auto-play: fire NEXT_STEP every `speed` ms while isAutoRunning is true.
  useAutoPlay({
    isRunning: isAutoRunning,
    speed,
    onTick: handleAutoTick,
  });

  // ── Derived display data ─────────────────────────────────────────
  // The mRNA codon labels come from the genetic code. Constant per render.
  const codonLabels = ORIG_CODONS.map((c) => GC[c] || "???");

  // The Next button is disabled when we've reached the last step.
  const nextDisabled = state.stepIndex >= TRANSLATION_STEPS.length - 1;

  // ── Event handlers ───────────────────────────────────────────────
  const handleNext = () => dispatch({ type: "NEXT_STEP" });

  const handleReset = () => {
    setIsAutoRunning(false);
    dispatch({ type: "RESET" });
  };

  const handleToggleAuto = () => {
    if (isAutoRunning) {
      setIsAutoRunning(false);
      return;
    }

    if (state.stepIndex >= TRANSLATION_STEPS.length - 1) {
      dispatch({ type: "RESET" });
    }

    setIsAutoRunning(true);
  };

  const handleSpeedChange = (newSpeed) => setSpeed(newSpeed);

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="walkthrough">
      <div className="walkthrough-main">
        <div className="stage">
          <PhaseBanner phase={state.phase} />

        <div className="strand-with-ribo" ref={containerRef}>
          <div className="ribo-zone">
            <Ribosome
              left={riboLeft}
              visible={state.riboVisible}
              largeVisible={state.riboLargeVisible}
              largePreview={state.riboLargePreview}
              fadingOut={state.riboFading}
            />

            <RibosomeMrnaOverlay
              codons={ORIG_CODONS}
              codonCenters={codonCenters}
              states={state.codonStates}
              visible={state.riboVisible}
            />

            <EmergingPolypeptide
              aminoAcids={state.protein}
              ribosomeLeft={riboLeft}
              visible={state.riboVisible && state.riboLargeVisible}
              released={state.riboFading}
              sceneScale={sceneScale}
            />

            {state.trnas.map((trna, i) => {
              const codonCenter = codonCenters[trna.codonIndex];
              if (codonCenter == null) return null;
              return (
                <TrnaMolecule
                  key={`${trna.site}-${trna.codonIndex}-${i}`}
                  left={codonCenter - TRNA_HALF_WIDTH * sceneScale}
                  bottom={TRNA_BOTTOM * sceneScale}
                  site={trna.site}
                  anticodon={trna.anticodon}
                  aminoAcid={trna.aminoAcid}
                  entering={trna.entering}
                />
              );
            })}

            {state.releaseFactor && (() => {
              const codonCenter = codonCenters[state.releaseFactor.codonIndex];
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

          <MrnaStrand
            codons={ORIG_CODONS}
            labels={codonLabels}
            states={state.codonStates}
            strandId={STRAND_ID}
            codonRefs={codonRefs}
          />
        </div>

          <PolypeptideChain aminoAcids={state.protein} />
        </div>
      </div>

      <aside className="walkthrough-side">
        <div className="walkthrough-side-scroll">
          <StepExplanation
            stepIndex={state.stepIndex}
            stepTitle={state.stepTitle}
            stepText={state.stepText}
            lookupCodon={state.lookupCodon}
          />
        </div>
        <ControlBar
          onNext={handleNext}
          onToggleAuto={handleToggleAuto}
          onReset={handleReset}
          onSpeedChange={handleSpeedChange}
          isAutoRunning={isAutoRunning}
          nextDisabled={nextDisabled || isAutoRunning}
          speed={speed}
        />
      </aside>
    </div>
  );
}
