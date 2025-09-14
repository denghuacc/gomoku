// Utility functions for GameBoard component and tests
export function generateColumnLabels(size: number): string[] {
  return Array.from({ length: size }, (_, i) => String.fromCharCode(65 + i));
}
export function generateRowLabels(size: number): string[] {
  return Array.from({ length: size }, (_, i) => (i + 1).toString());
}
export function getCellSizeUtil(
  size: number,
  containerWidth: number,
  containerHeight: number
): number {
  const containerSize = Math.min(containerWidth * 0.5, containerHeight * 0.6);
  return containerSize / (size + 1);
}
