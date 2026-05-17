//
//
// Pure helper for computing the ribosome's pixel `left` position so it
// centers horizontally over a given codon block within a container.
//
// The math:
//   - Get the codon's left edge and width (from its DOM rect).
//   - Get the container's left edge (from its DOM rect).
//   - Subtract container.left from codon.left to get the codon's
//     position RELATIVE to the container.
//   - Add half the codon's width to find the codon's center.
//   - Subtract half the ribosome's width to align the ribosome's
//     center with the codon's center.
//
// This function does not touch the DOM. It accepts two DOMRect objects
// (produced by getBoundingClientRect) and returns a number. That keeps
// the math pure and isolated from React.

// Half the ribosome's visible width. The 60S subunit is 168px wide
// (defined in src/shared/components/Ribosome.css). To center the
// ribosome over a codon, we offset its `left` by -RIBOSOME_HALF_WIDTH
// from the codon's center.
const RIBOSOME_HALF_WIDTH = 84;

export function computeCodonCenter(codonRect, containerRect) {
  if (!codonRect || !containerRect) return null;

  const codonLeftRelative = codonRect.left - containerRect.left;
  return codonLeftRelative + codonRect.width / 2;
}

export function computeRibosomeLeft(codonRect, containerRect) {
  if (!codonRect || !containerRect) return 0;

  const codonCenter = computeCodonCenter(codonRect, containerRect);
  return codonCenter - RIBOSOME_HALF_WIDTH;
}
