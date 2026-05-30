//
// Preset mutation buttons. Each button dispatches an APPLY_PRESET action
// with the matching preset id. The list is driven by PRESETS data.

import { PRESETS } from "../mutationReducer.js";
import { useTranslation } from "../../../i18n/i18nContext.js";
import "./PresetButtons.css";

export default function PresetButtons({ onApplyPreset }) {
  const { t } = useTranslation();

  return (
    <div className="preset-buttons">
      <h4>{t("mutation.presetsTitle")}</h4>
      <div className="preset-grid">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="preset-btn"
            onClick={() => onApplyPreset(preset.id)}
            title={t(`mutation.presets.${preset.id}.title`)}
            data-guide={preset.id === "nonsense" ? "nonsense-preset" : undefined}
          >
            {t(`mutation.presets.${preset.id}.label`)}
          </button>
        ))}
      </div>
    </div>
  );
}
