// 
//
// PHASE 3 PLACEHOLDER. The actual state machine and step-by-step
// behavior arrive in Phase 4. For now this component renders the
// shared stage components with hardcoded "starting state" props
// so you can see the layout.

import MrnaStrand from "../../shared/components/MrnaStrand";
import PolypeptideChain from "../../shared/components/PolypeptideChain";
import Ribosome from "../../shared/components/Ribosome";
import PhaseBanner from "../../shared/components/PhaseBanner";
import ControlBar from "../../shared/components/ControlBar";
import { ORIG_CODONS, GC } from "../../shared/biology";
import "./TranslationWalkthrough.css";

export default function TranslationWalkthrough() {
  const labels = ORIG_CODONS.map((c) => GC[c] || "???");
  const allUpcoming = ORIG_CODONS.map(() => "upcoming");

  return (
    <div className="walkthrough">
      <div className="walkthrough-main">
        <div className="stage">
          <PhaseBanner phase={null} />
          <div className="ribo-zone">
            <Ribosome visible={false} />
          </div>
          <MrnaStrand
            codons={ORIG_CODONS}
            labels={labels}
            states={allUpcoming}
            strandId="walkthrough-strand"
          />
          <PolypeptideChain aminoAcids={[]} />
        </div>
      </div>
      <aside className="walkthrough-side">
        <div className="sb-section">
          <h3>Step 0 — Ready</h3>
          <p className="sb-text">
            (Phase 4 will wire this sidebar to the 24-step state machine.)
          </p>
        </div>
        <ControlBar
          onNext={() => {}}
          onToggleAuto={() => {}}
          onReset={() => {}}
          onSpeedChange={() => {}}
        />
      </aside>
    </div>
  );
}