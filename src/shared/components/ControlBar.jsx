import { useTranslation } from "../../i18n/i18nContext.js";
import "./ControlBar.css";

export default function ControlBar({
  onNext,
  onToggleAuto,
  onReset,
  onSpeedChange,
  isAutoRunning = false,
  nextDisabled = false,
  autoDisabled = false,
  speed = 1200,
  minSpeed = 400,
  maxSpeed = 2500,
  speedStep = 100,
  showSpeed = true,
  guideTargets = {},
}) {
  const { t } = useTranslation();

  return (
    <div className="controls" data-guide={guideTargets.controls}>
      <button
        type="button"
        className="btn btn-1"
        onClick={onNext}
        disabled={nextDisabled}
        data-guide={guideTargets.next}
      >
        {t("shared.controls.nextStep")}
      </button>

      <button
        type="button"
        className={`btn btn-3${isAutoRunning ? " btn-on" : ""}`}
        onClick={onToggleAuto}
        disabled={autoDisabled}
        data-guide={guideTargets.auto}
      >
        {isAutoRunning ? t("shared.controls.pause") : t("shared.controls.auto")}
      </button>

      <button
        type="button"
        className="btn btn-2"
        onClick={onReset}
        data-guide={guideTargets.reset}
      >
        {t("shared.controls.reset")}
      </button>

      {showSpeed && (
        <div className="speed" data-guide={guideTargets.speedGroup}>
          <label htmlFor="speed-slider">{t("shared.controls.speed")}</label>
          <input
            id="speed-slider"
            type="range"
            min={minSpeed}
            max={maxSpeed}
            step={speedStep}
            value={speed}
            onChange={(e) => onSpeedChange?.(Number(e.target.value))}
            data-guide={guideTargets.speed}
          />
        </div>
      )}
    </div>
  );
}
