# Step 4.4 Auto-play and Speed Slider

This note documents the files changed for Step 4.4: adding auto-play, pause, reset cleanup, and speed-slider wiring to the Translation Walkthrough.

## Found

The walkthrough could advance with the `Next Step` button, but the `Auto` button, pause state, and speed slider were still wired to no-op callbacks. The app also needed reusable timer logic so later features can reuse the same behavior without duplicating interval code.

The PDF suggested using a separate effect to stop auto-play at the final step, but React 19 lint rejects synchronous `setState` inside an effect. The final implementation keeps the same behavior by stopping auto-play inside the interval tick handler instead.

## Changed

Created a shared `useAutoPlay` hook that runs the latest `onTick` callback every `speed` milliseconds while `isRunning` is true. The hook stores `onTick` in a ref to avoid stale interval closures and cleans up the interval whenever running state or speed changes.

Updated `TranslationWalkthrough.jsx` to track `isAutoRunning` and `speed`, wire `ControlBar` to real handlers, disable manual Next while auto-play is active, stop auto-play on Reset, restart from the beginning if Auto is clicked at the final step, and stop automatically when the final step is reached.

## Expected

Clicking `Auto` starts timed walkthrough progression. The button switches to `Pause`, clicking it stops the timer, dragging the speed slider changes the interval immediately, Reset stops auto-play and returns to the initial state, and auto-play stops when it reaches the final walkthrough step.

## File Diffs

### `src/shared/hooks/useAutoPlay.js`

Current state: new file. Lines 10-24 import React hooks and define the reusable auto-play interval hook.

```diff
+//
+// Generic auto-play hook: while isRunning is true, calls onTick every
+// `speed` milliseconds. The consumer is responsible for setting
+// isRunning to false when the timer should stop.
+//
+// We hold onTick in a ref so the running interval always calls the
+// latest version, even if the consumer's state has changed between
+// renders. This avoids the classic React "stale closure" problem.
+
+import { useEffect, useRef } from "react";
+
+export function useAutoPlay({ isRunning, speed, onTick }) {
+  const onTickRef = useRef(onTick);
+
+  useEffect(() => {
+    onTickRef.current = onTick;
+  }, [onTick]);
+
+  useEffect(() => {
+    if (!isRunning) return;
+    const id = setInterval(() => onTickRef.current(), speed);
+    return () => clearInterval(id);
+  }, [isRunning, speed]);
+}
```

### `src/features/translation-walkthrough/TranslationWalkthrough.jsx`

Current state: lines 3-5 describe `useAutoPlay`, line 43 imports it, lines 58-59 hold auto-play state, lines 101-121 define and install the auto tick behavior, lines 133-151 define the control handlers, and lines 216-223 wire `ControlBar`.

```diff
 // The Translation Walkthrough feature. Uses useReducer for state,
-// useRef for DOM access, and useEffect for ribosome positioning.
-//
-// Auto-play and the speed slider are still wired to no-op callbacks in
-// this step; they'll be implemented in Step 4.4.
+// useRef for DOM access, useLayoutEffect for ribosome positioning, and
+// useAutoPlay for timed progression.
```

```diff
 import {
   TRANSLATION_STEPS,
 } from "./stepDefinitions.js";
+import { useAutoPlay } from "../../shared/hooks/useAutoPlay.js";
 import "./TranslationWalkthrough.css";
```

```diff
   const [riboLeft, setRiboLeft] = useState(0);
   const [codonCenters, setCodonCenters] = useState([]);
+  const [isAutoRunning, setIsAutoRunning] = useState(false);
+  const [speed, setSpeed] = useState(1200);
```

```diff
+  const handleAutoTick = () => {
+    const lastStepIndex = TRANSLATION_STEPS.length - 1;
+
+    if (state.stepIndex >= lastStepIndex) {
+      setIsAutoRunning(false);
+      return;
+    }
+
+    dispatch({ type: "NEXT_STEP" });
+
+    if (state.stepIndex + 1 >= lastStepIndex) {
+      setIsAutoRunning(false);
+    }
+  };
+
+  // Auto-play: fire NEXT_STEP every `speed` ms while isAutoRunning is true.
+  useAutoPlay({
+    isRunning: isAutoRunning,
+    speed,
+    onTick: handleAutoTick,
+  });
```

```diff
   const handleNext = () => dispatch({ type: "NEXT_STEP" });
-  const handleReset = () => dispatch({ type: "RESET" });
+
+  const handleReset = () => {
+    setIsAutoRunning(false);
+    dispatch({ type: "RESET" });
+  };
+
+  const handleToggleAuto = () => {
+    if (isAutoRunning) {
+      setIsAutoRunning(false);
+      return;
+    }
+
+    if (state.stepIndex >= TRANSLATION_STEPS.length - 1) {
+      dispatch({ type: "RESET" });
+    }
+
+    setIsAutoRunning(true);
+  };
+
+  const handleSpeedChange = (newSpeed) => setSpeed(newSpeed);
```

```diff
         <ControlBar
           onNext={handleNext}
-          onToggleAuto={() => {}}
+          onToggleAuto={handleToggleAuto}
           onReset={handleReset}
-          onSpeedChange={() => {}}
-          isAutoRunning={false}
-          nextDisabled={nextDisabled}
-          speed={1200}
+          onSpeedChange={handleSpeedChange}
+          isAutoRunning={isAutoRunning}
+          nextDisabled={nextDisabled || isAutoRunning}
+          speed={speed}
         />
```

## Verification

`node --check src\shared\hooks\useAutoPlay.js` passed.

`npm.cmd run lint` passed.

`npm.cmd run build` passed.
