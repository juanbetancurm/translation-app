import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import GuidedTourMessage from "./GuidedTourMessage.jsx";
import GuidedTourRing from "./GuidedTourRing.jsx";
import { calculateMessagePosition } from "./guidedTourPosition.js";
import { setGuideStatus } from "./guidedTourStorage.js";
import "./guidedTour.css";

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function waitForFrame() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resolve);
    });
  });
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function resolveValue(value, context) {
  return typeof value === "function" ? value(context) : value;
}

function isFocusableElement(element) {
  return element && typeof element.focus === "function";
}

function isIntroStep(step) {
  return step?.kind === "intro";
}

function getStepKicker(steps, stepIndex) {
  const activeStep = steps[stepIndex];

  if (isIntroStep(activeStep)) {
    return activeStep.kicker ?? "Introduction";
  }

  const stepCount = steps.filter((step) => !isIntroStep(step)).length;
  const currentStep = steps
    .slice(0, stepIndex + 1)
    .filter((step) => !isIntroStep(step)).length;

  return `Step ${currentStep} of ${stepCount}`;
}

export default function GuidedTour({
  isOpen,
  steps,
  hooks = {},
  storageKey,
  context = {},
  onClose,
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [messagePosition, setMessagePosition] = useState(null);
  const messageRef = useRef(null);
  const nextButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const requestRef = useRef(0);
  const hooksRef = useRef(hooks);
  const contextRef = useRef(context);

  const activeStepConfig = steps[stepIndex];
  const activeStep = useMemo(() => {
    if (!activeStepConfig) return null;

    return {
      ...activeStepConfig,
      title: resolveValue(activeStepConfig.title, context),
      text: resolveValue(activeStepConfig.text, context),
    };
  }, [activeStepConfig, context]);

  useEffect(() => {
    hooksRef.current = hooks;
    contextRef.current = context;
  }, [context, hooks]);

  const closeWithoutStatus = useCallback(() => {
    setTargetRect(null);
    setMessagePosition(null);
    onClose?.(null);

    window.setTimeout(() => {
      if (isFocusableElement(previousFocusRef.current)) {
        previousFocusRef.current.focus({ preventScroll: true });
      }
    }, 0);
  }, [onClose]);

  const closeWithStatus = useCallback(
    (status) => {
      if (storageKey) {
        setGuideStatus(storageKey, status);
      }

      setTargetRect(null);
      setMessagePosition(null);
      onClose?.(status);

      window.setTimeout(() => {
        if (isFocusableElement(previousFocusRef.current)) {
          previousFocusRef.current.focus({ preventScroll: true });
        }
      }, 0);
    },
    [onClose, storageKey]
  );

  const runStepHook = useCallback(
    async (hookRef, step) => {
      if (!hookRef) return;

      try {
        if (typeof hookRef === "function") {
          await hookRef({ step, context: contextRef.current });
          return;
        }

        const hook = hooksRef.current[hookRef];
        if (hook) {
          await hook({ step, context: contextRef.current });
        }
      } catch (error) {
        console.warn("Guide step hook failed:", step.id, error);
      }
    },
    []
  );

  const skipUnavailableStep = useCallback(() => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((current) => Math.min(current + 1, steps.length - 1));
      return;
    }

    closeWithoutStatus();
  }, [closeWithoutStatus, stepIndex, steps.length]);

  const measureTarget = useCallback(() => {
    if (!activeStepConfig?.target) return null;

    const target = document.querySelector(activeStepConfig.target);
    if (!target) return null;

    const rect = target.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;

    return rect;
  }, [activeStepConfig]);

  const positionCurrentStep = useCallback(
    async (shouldRunBeforeStep) => {
      if (!isOpen || !activeStepConfig) return;

      const requestId = requestRef.current + 1;
      requestRef.current = requestId;
      setTargetRect(null);
      setMessagePosition(null);

      if (shouldRunBeforeStep) {
        await runStepHook(activeStepConfig.beforeStep, activeStepConfig);
        await waitForFrame();
      }

      const target = document.querySelector(activeStepConfig.target);
      if (!target) {
        if (requestRef.current === requestId) skipUnavailableStep();
        return;
      }

      target.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "center",
        inline: "center",
      });

      await wait(prefersReducedMotion() ? 40 : 320);
      if (requestRef.current !== requestId) return;

      const rect = measureTarget();
      if (!rect) {
        skipUnavailableStep();
        return;
      }

      setTargetRect(rect);
    },
    [
      activeStepConfig,
      isOpen,
      measureTarget,
      runStepHook,
      skipUnavailableStep,
    ]
  );

  const refreshTargetRect = useCallback(() => {
    if (!isOpen) return;

    const rect = measureTarget();
    if (rect) {
      setTargetRect(rect);
    }
  }, [isOpen, measureTarget]);

  const handleBack = useCallback(() => {
    setStepIndex((current) => Math.max(0, current - 1));
  }, []);

  const handleSkip = useCallback(() => {
    closeWithStatus("skipped");
  }, [closeWithStatus]);

  const handleNext = useCallback(async () => {
    if (!activeStepConfig) return;

    await runStepHook(activeStepConfig.afterStep, activeStepConfig);

    if (stepIndex >= steps.length - 1) {
      closeWithStatus("completed");
      return;
    }

    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }, [
    activeStepConfig,
    closeWithStatus,
    runStepHook,
    stepIndex,
    steps.length,
  ]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !activeStepConfig) return;

    const timer = window.setTimeout(() => positionCurrentStep(true), 0);

    return () => {
      window.clearTimeout(timer);
      requestRef.current += 1;
    };
  }, [activeStepConfig, isOpen, positionCurrentStep]);

  useLayoutEffect(() => {
    if (!isOpen || !targetRect || !messageRef.current || !activeStepConfig) {
      return;
    }

    const messageRect = messageRef.current.getBoundingClientRect();
    const nextPosition = calculateMessagePosition(
      targetRect,
      {
        width: messageRect.width,
        height: messageRect.height,
      },
      activeStepConfig.placement
    );

    setMessagePosition(nextPosition);
  }, [activeStepConfig, activeStep, isOpen, targetRect]);

  useEffect(() => {
    if (!isOpen || !messagePosition) return;

    nextButtonRef.current?.focus({ preventScroll: true });
  }, [isOpen, messagePosition, stepIndex]);

  useEffect(() => {
    if (!isOpen) return;

    let frame = 0;
    const scheduleRefresh = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(refreshTargetRect);
    };

    window.addEventListener("resize", scheduleRefresh);
    window.addEventListener("orientationchange", scheduleRefresh);
    window.addEventListener("scroll", scheduleRefresh, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", scheduleRefresh);
      window.removeEventListener("orientationchange", scheduleRefresh);
      window.removeEventListener("scroll", scheduleRefresh, true);
    };
  }, [isOpen, refreshTargetRect]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleSkip();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleBack, handleNext, handleSkip, isOpen]);

  if (!isOpen || !activeStep || typeof document === "undefined") {
    return null;
  }

  const titleId = `guided-tour-title-${activeStep.id}`;
  const textId = `guided-tour-text-${activeStep.id}`;
  const stepKicker = getStepKicker(steps, stepIndex);

  return createPortal(
    <div className="guided-tour-layer active">
      <div className="guided-tour-scrim" aria-hidden="true" />
      <GuidedTourRing rect={targetRect} />
      <GuidedTourMessage
        ref={messageRef}
        step={activeStep}
        stepKicker={stepKicker}
        messagePosition={messagePosition}
        onBack={handleBack}
        onSkip={handleSkip}
        onNext={handleNext}
        isFirstStep={stepIndex === 0}
        isFinalStep={stepIndex === steps.length - 1}
        nextButtonRef={nextButtonRef}
        titleId={titleId}
        textId={textId}
      />
    </div>,
    document.body
  );
}
