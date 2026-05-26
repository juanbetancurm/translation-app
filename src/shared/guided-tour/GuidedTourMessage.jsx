import { forwardRef } from "react";

const GuidedTourMessage = forwardRef(function GuidedTourMessage(
  {
    step,
    stepKicker,
    messagePosition,
    onBack,
    onSkip,
    onNext,
    isFirstStep,
    isFinalStep,
    nextButtonRef,
    titleId,
    textId,
  },
  ref
) {
  const positionStyle = messagePosition
    ? {
        left: messagePosition.left,
        top: messagePosition.top,
        "--arrow-left": `${messagePosition.arrowLeft}px`,
        "--arrow-top": `${messagePosition.arrowTop}px`,
      }
    : {
        left: 16,
        top: 16,
        visibility: "hidden",
      };

  return (
    <section
      ref={ref}
      className={`guided-tour-message arrow-${messagePosition?.arrowSide ?? "top"}`}
      style={positionStyle}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={textId}
    >
      <div className="guided-tour-kicker">{stepKicker}</div>
      <h2 id={titleId}>{step.title}</h2>
      <p id={textId}>{step.text}</p>
      <div className="guided-tour-controls">
        <button
          type="button"
          className="guided-tour-btn guided-tour-btn-secondary"
          onClick={onBack}
          disabled={isFirstStep}
        >
          Back
        </button>
        <button
          type="button"
          className="guided-tour-btn guided-tour-btn-ghost"
          onClick={onSkip}
        >
          Skip
        </button>
        <button
          ref={nextButtonRef}
          type="button"
          className="guided-tour-btn guided-tour-btn-primary"
          onClick={onNext}
        >
          {isFinalStep ? "Finish" : "Next"}
        </button>
      </div>
    </section>
  );
});

export default GuidedTourMessage;
