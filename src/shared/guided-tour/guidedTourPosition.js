const VIEWPORT_GUTTER = 16;
const TARGET_GAP = 18;

function clamp(value, min, max) {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

function fits(rect, size) {
  return (
    rect.left >= VIEWPORT_GUTTER &&
    rect.top >= VIEWPORT_GUTTER &&
    rect.right <= window.innerWidth - VIEWPORT_GUTTER &&
    rect.bottom <= window.innerHeight - VIEWPORT_GUTTER &&
    size.width <= window.innerWidth - VIEWPORT_GUTTER * 2 &&
    size.height <= window.innerHeight - VIEWPORT_GUTTER * 2
  );
}

function candidateFor(targetRect, messageSize, placement) {
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;

  switch (placement) {
    case "top":
      return {
        placement,
        left: targetCenterX - messageSize.width / 2,
        top: targetRect.top - messageSize.height - TARGET_GAP,
      };
    case "left":
      return {
        placement,
        left: targetRect.left - messageSize.width - TARGET_GAP,
        top: targetCenterY - messageSize.height / 2,
      };
    case "right":
      return {
        placement,
        left: targetRect.right + TARGET_GAP,
        top: targetCenterY - messageSize.height / 2,
      };
    case "bottom":
    default:
      return {
        placement: "bottom",
        left: targetCenterX - messageSize.width / 2,
        top: targetRect.bottom + TARGET_GAP,
      };
  }
}

function rectFromCandidate(candidate, messageSize) {
  return {
    left: candidate.left,
    top: candidate.top,
    right: candidate.left + messageSize.width,
    bottom: candidate.top + messageSize.height,
  };
}

export function calculateMessagePosition(targetRect, messageSize, placement) {
  const fallbacks =
    placement === "left" || placement === "right"
      ? [placement, "bottom", "top"]
      : [placement, "bottom", "top", "right", "left"];

  const preferredCandidate = fallbacks
    .map((fallback) => candidateFor(targetRect, messageSize, fallback))
    .find((candidate) => fits(rectFromCandidate(candidate, messageSize), messageSize));

  const candidate =
    preferredCandidate ?? candidateFor(targetRect, messageSize, "bottom");

  const maxLeft = window.innerWidth - messageSize.width - VIEWPORT_GUTTER;
  const maxTop = window.innerHeight - messageSize.height - VIEWPORT_GUTTER;
  const left = clamp(candidate.left, VIEWPORT_GUTTER, maxLeft);
  const top = clamp(candidate.top, VIEWPORT_GUTTER, maxTop);

  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;
  const arrowLeft = clamp(targetCenterX - left, 24, messageSize.width - 24);
  const arrowTop = clamp(targetCenterY - top, 24, messageSize.height - 24);

  const arrowSide = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  }[candidate.placement] ?? "top";

  return {
    left,
    top,
    placement: candidate.placement,
    arrowSide,
    arrowLeft,
    arrowTop,
  };
}
