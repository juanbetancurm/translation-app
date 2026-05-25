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

import { RIBOSOME_WIDTH } from "./ribosomeGeometry.js";

export function computeCodonCenter(codonRect, containerRect) {
  if (!codonRect || !containerRect) return null;

  const codonLeftRelative = codonRect.left - containerRect.left;
  return codonLeftRelative + codonRect.width / 2;
}

export function computeRibosomeLeft(
  codonRect,
  containerRect,
  ribosomeWidth = RIBOSOME_WIDTH
) {
  if (!codonRect || !containerRect) return 0;

  const codonCenter = computeCodonCenter(codonRect, containerRect);
  return codonCenter - ribosomeWidth / 2;
}
