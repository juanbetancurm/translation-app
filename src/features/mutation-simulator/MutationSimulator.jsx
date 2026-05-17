//
// The Mutation Simulator feature. Uses useReducer to manage the editing
// state: working sequence, active tool, and tracked changes.
//
// Step 5.1 scope: editor plus tool picker. Translation, classification,
// and animation arrive in Steps 5.3-5.5.

import { useReducer } from "react";
import PresetButtons from "./components/PresetButtons";
import SequenceEditor from "./components/SequenceEditor";
import ToolPicker from "./components/ToolPicker";
import {
  initialMutationState,
  mutationReducer,
} from "./mutationReducer.js";
import "./MutationSimulator.css";

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

  return (
    <div className="mutation">
      <div className="mutation-main">
        <div className="stage">
          <p className="mut-stage-note">
            Stage panel: mutant mRNA, protein comparison, and animation
            will live here in Steps 5.4-5.5.
          </p>
        </div>
      </div>

      <aside className="mutation-side">
        <div className="mut-panel">
          <h3>Mutation Lab</h3>
          <p className="mut-instructions">
            Click a base to <strong>change</strong> it. Use the tools to{" "}
            <strong>delete</strong> or <strong>insert</strong> bases. Then
            hit <strong>Translate Mutant</strong> to watch the ribosome
            process the altered mRNA.
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
              disabled
              title="Coming in Step 5.4"
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
