//
// Mutant translation animation controls. The parent owns the ribosome
// overlay and growing protein so the stage stays focused on the visual
// translation model.

import ControlBar from "../../../shared/components/ControlBar";
import { useAutoPlay } from "../../../shared/hooks/useAutoPlay.js";
import "./MutantAnimationStage.css";

export default function MutantAnimationStage({
  animation,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onTick,
  disabled = false,
}) {
  useAutoPlay({
    isRunning: animation.isPlaying && !disabled,
    speed: animation.speed,
    onTick,
  });

  const handleToggle = () => {
    if (disabled) return;
    if (animation.isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  return (
    <div className="mutant-anim-stage">
      <ControlBar
        onNext={onTick}
        onToggleAuto={handleToggle}
        onReset={onReset}
        onSpeedChange={onSpeedChange}
        isAutoRunning={animation.isPlaying}
        nextDisabled={disabled || animation.isFinished || animation.isPlaying}
        autoDisabled={disabled}
        speed={animation.speed}
      />
    </div>
  );
}
