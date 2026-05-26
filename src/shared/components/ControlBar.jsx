//
//
// The row of action buttons that drives the animation: Next Step, Auto
// (or Pause), Reset, and a speed slider. Used by both the Translation
// Walkthrough and the Mutation Simulator.
//
// All buttons are dumb — they fire the corresponding callback. The
// parent owns the state (whether auto is running, whether next is
// disabled, current speed) and reflects that state through props.
//
// Props:
//   onNext           callback for the Next button
//   onToggleAuto     callback for the Auto/Pause button
//   onReset          callback for the Reset button
//   onSpeedChange    callback fired with the new speed (number, ms)
//                    when the user drags the slider
//   isAutoRunning    boolean; switches button label to "Pause" and adds
//                    the .on style
//   nextDisabled     boolean; disables the Next button
//   autoDisabled     boolean; disables the Auto/Pause button
//   speed            current speed in milliseconds
//   minSpeed         slider minimum (default 400)
//   maxSpeed         slider maximum (default 2500)
//   speedStep        slider step (default 100)
//   showSpeed        whether to render the slider (default true)
//   guideTargets     optional data-guide targets for tour integration

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
  return (
    <div className="controls" data-guide={guideTargets.controls}>
      <button
        type="button"
        className="btn btn-1"
        onClick={onNext}
        disabled={nextDisabled}
        data-guide={guideTargets.next}
      >
        Next Step →
      </button>

      <button
        type="button"
        className={`btn btn-3${isAutoRunning ? " btn-on" : ""}`}
        onClick={onToggleAuto}
        disabled={autoDisabled}
        data-guide={guideTargets.auto}
      >
        {isAutoRunning ? "⏸ Pause" : "▶ Auto"}
      </button>

      <button
        type="button"
        className="btn btn-2"
        onClick={onReset}
        data-guide={guideTargets.reset}
      >
        Reset
      </button>

      {showSpeed && (
        <div className="speed" data-guide={guideTargets.speedGroup}>
          <label htmlFor="speed-slider">Speed</label>
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
