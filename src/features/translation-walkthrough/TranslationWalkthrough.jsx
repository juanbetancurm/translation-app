//
//
// The Translation Walkthrough feature. Uses useReducer for state,
// useRef for DOM access, and useEffect for ribosome positioning.
//
// Auto-play and the speed slider are still wired to no-op callbacks in
// this step; they'll be implemented in Step 4.4.
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
import PolypeptideChain from "../../shared/components/PolypeptideChain";
import Ribosome from "../../shared/components/Ribosome";
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
  initialState,
  walkthroughReducer,
} from "./walkthroughReducer.js";
import {
  TRANSLATION_STEPS,
} from "./stepDefinitions.js";
import "./TranslationWalkthrough.css";

const STRAND_ID = "walkthrough-strand";

export default function TranslationWalkthrough() {
  // ── Reducer-managed state ────────────────────────────────────────
  const [state, dispatch] = useReducer(walkthroughReducer, initialState);

  // ── Local UI-only state ──────────────────────────────────────────
  // The pixel left of the ribosome — derived from the DOM by the
  // positioning effect below. Not stored in the reducer because the
  // reducer is pure (cannot touch the DOM).
  const [riboLeft, setRiboLeft] = useState(0);
  const [codonCenters, setCodonCenters] = useState([]);

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
      const centers = codonRefs.map((ref) => {
        if (!ref.current) return null;
        return computeCodonCenter(
          ref.current.getBoundingClientRect(),
          containerRect
        );
      });

      setCodonCenters(centers);
      setRiboLeft(
        computeRibosomeLeft(codonEl.getBoundingClientRect(), containerRect)
      );
    }

    updateOverlayPositions();
    window.addEventListener("resize", updateOverlayPositions);
    return () => window.removeEventListener("resize", updateOverlayPositions);
  }, [codonRefs, state.stepIndex, state.riboCodonIndex, state.riboVisible]);

  // ── Derived display data ─────────────────────────────────────────
  // The mRNA codon labels come from the genetic code. Constant per render.
  const codonLabels = ORIG_CODONS.map((c) => GC[c] || "???");

  // The Next button is disabled when we've reached the last step.
  const nextDisabled = state.stepIndex >= TRANSLATION_STEPS.length - 1;

  // ── Event handlers ───────────────────────────────────────────────
  const handleNext = () => dispatch({ type: "NEXT_STEP" });
  const handleReset = () => dispatch({ type: "RESET" });

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
              fadingOut={state.riboFading}
            />

            {state.trnas.map((trna, i) => {
              const codonCenter = codonCenters[trna.codonIndex];
              if (codonCenter == null) return null;
              // P-site sits centered; A-site offset to the right; E-site to the left.
              const siteOffset =
                trna.site === "p" ? 0 : trna.site === "a" ? 56 : -56;
              return (
                <TrnaMolecule
                  key={`${trna.site}-${trna.codonIndex}-${i}`}
                  left={codonCenter - 14 + siteOffset}
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
                <ReleaseFactor left={codonCenter - 18 + 56} />
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
        <StepExplanation
          stepIndex={state.stepIndex}
          stepTitle={state.stepTitle}
          stepText={state.stepText}
          lookupCodon={state.lookupCodon}
        />
        <ControlBar
          onNext={handleNext}
          onToggleAuto={() => {}}
          onReset={handleReset}
          onSpeedChange={() => {}}
          isAutoRunning={false}
          nextDisabled={nextDisabled}
          speed={1200}
        />
      </aside>
    </div>
  );
}
