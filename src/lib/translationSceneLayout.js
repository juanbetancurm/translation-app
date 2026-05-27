import { computeCodonCenter } from "./ribosomePositioning.js";

export function readSceneScale(element) {
  const scale = Number.parseFloat(
    getComputedStyle(element).getPropertyValue("--scene-scale")
  );
  return Number.isFinite(scale) && scale > 0 ? scale : 1;
}

export function readFixedRibosomeMode(element) {
  const fixed = getComputedStyle(element)
    .getPropertyValue("--fixed-ribosome")
    .trim();
  return fixed === "1" || fixed === "true";
}

export function computeCodonLayoutCenter(codonElement, containerElement) {
  if (!codonElement || !containerElement) return null;

  const offsetCenter = computeOffsetCenter(codonElement, containerElement);
  if (offsetCenter != null) return offsetCenter;

  return computeCodonCenter(
    codonElement.getBoundingClientRect(),
    containerElement.getBoundingClientRect()
  );
}

export function computeTranslationSceneLayout({
  container,
  codonRefs,
  activeCodonIndex,
  ribosomeWidth,
  fixedRibosome,
  clampRibosome = false,
}) {
  const containerRect = container.getBoundingClientRect();
  const codonCenters = codonRefs.map((ref) =>
    computeCodonLayoutCenter(ref.current, container)
  );
  const activeCenter = codonCenters[activeCodonIndex];

  let ribosomeLeft = 0;
  let trackOffset = 0;

  if (activeCenter != null) {
    ribosomeLeft = activeCenter - ribosomeWidth / 2;
  }

  if (fixedRibosome) {
    ribosomeLeft = Math.max(0, (containerRect.width - ribosomeWidth) / 2);
    if (activeCenter != null) {
      trackOffset = ribosomeLeft + ribosomeWidth / 2 - activeCenter;
    }
  } else if (clampRibosome) {
    const maxRibosomeLeft = Math.max(0, containerRect.width - ribosomeWidth);
    ribosomeLeft = Math.min(Math.max(ribosomeLeft, 0), maxRibosomeLeft);
  }

  return {
    codonCenters: codonCenters.map((center) =>
      center == null ? null : center + trackOffset
    ),
    ribosomeLeft,
    trackOffset,
  };
}

function computeOffsetCenter(element, ancestor) {
  let left = 0;
  let current = element;

  while (current && current !== ancestor) {
    left += current.offsetLeft ?? 0;
    current = current.offsetParent;
  }

  if (current !== ancestor) return null;

  return left + element.offsetWidth / 2;
}
