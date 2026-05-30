import { forwardRef } from "react";
import { useTranslation } from "../../i18n/i18nContext.js";

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
  const { t } = useTranslation();
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
          {t("shared.guidedTour.back")}
        </button>
        <button
          type="button"
          className="guided-tour-btn guided-tour-btn-ghost"
          onClick={onSkip}
        >
          {t("shared.guidedTour.skip")}
        </button>
        <button
          ref={nextButtonRef}
          type="button"
          className="guided-tour-btn guided-tour-btn-primary"
          onClick={onNext}
        >
          {isFinalStep
            ? t("shared.guidedTour.finish")
            : t("shared.guidedTour.next")}
        </button>
      </div>
    </section>
  );
});

export default GuidedTourMessage;
