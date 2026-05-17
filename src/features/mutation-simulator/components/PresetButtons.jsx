//
// Preset mutation buttons. Each button dispatches an APPLY_PRESET action
// with the matching preset id. The list is driven by PRESETS data.

import { PRESETS } from "../mutationReducer.js";
import "./PresetButtons.css";

export default function PresetButtons({ onApplyPreset }) {
  return (
    <div className="preset-buttons">
      <h4>Presets</h4>
      <div className="preset-grid">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="preset-btn"
            onClick={() => onApplyPreset(preset.id)}
            title={preset.classification}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
