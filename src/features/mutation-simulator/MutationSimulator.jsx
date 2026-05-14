//
//
// PHASE 3 PLACEHOLDER. The actual mutation editor, classification engine,
// and mutant translation animation arrive in Phase 5. For now this
// component shares the same layout shell as the Translation Walkthrough.

import MrnaStrand from "../../shared/components/MrnaStrand";
import PolypeptideChain from "../../shared/components/PolypeptideChain";
import Ribosome from "../../shared/components/Ribosome";
import PhaseBanner from "../../shared/components/PhaseBanner";
import { ORIG_CODONS, GC } from "../../shared/biology";
import "./MutationSimulator.css";

export default function MutationSimulator() {
  const labels = ORIG_CODONS.map((c) => GC[c] || "???");
  const allUpcoming = ORIG_CODONS.map(() => "upcoming");

  return (
    <div className="mutation">
      <div className="mutation-main">
        <div className="stage">
          <PhaseBanner phase={null} />
          <div className="ribo-zone">
            <Ribosome visible={false} />
          </div>
          <MrnaStrand
            codons={ORIG_CODONS}
            labels={labels}
            states={allUpcoming}
            strandId="mutation-strand"
            headerLabel="Mutated mRNA"
          />
          <PolypeptideChain aminoAcids={[]} label="Mutated protein:" />
        </div>
      </div>
      <aside className="mutation-side">
        <div className="mut-panel">
          <h3>Mutation Lab</h3>
          <p className="mut-instructions">
            (Phase 5 will wire this sidebar to the mutation editor,
            preset buttons, and the analysis card.)
          </p>
        </div>
      </aside>
    </div>
  );
}