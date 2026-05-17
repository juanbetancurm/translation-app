//
// Generic auto-play hook: while isRunning is true, calls onTick every
// `speed` milliseconds. The consumer is responsible for setting
// isRunning to false when the timer should stop.
//
// We hold onTick in a ref so the running interval always calls the
// latest version, even if the consumer's state has changed between
// renders. This avoids the classic React "stale closure" problem.

import { useEffect, useRef } from "react";

export function useAutoPlay({ isRunning, speed, onTick }) {
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => onTickRef.current(), speed);
    return () => clearInterval(id);
  }, [isRunning, speed]);
}
