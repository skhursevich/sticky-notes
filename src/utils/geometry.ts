import type { Rect } from '../types';

export function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Fraction (0..1) of rect `a`'s area that is covered by rect `b`
 */
export function overlapRatio(a: Rect, b: Rect): number {
  const overlapWidth = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const overlapHeight = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  const overlapArea = overlapWidth * overlapHeight;
  const areaA = a.width * a.height;

  if (areaA === 0) return 0;

  return overlapArea / areaA;
}
