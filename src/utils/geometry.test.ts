import { describe, expect, it } from 'vitest';
import { clamp, overlapRatio } from './geometry';

describe('clamp', () => {
  it('returns the value when inside the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps to the minimum', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('clamps to the maximum', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('falls back to min when max < min', () => {
    expect(clamp(5, 10, 0)).toBe(10);
  });
});

describe('overlapRatio', () => {
  it('is 1 when a is fully inside b', () => {
    const a = { x: 5, y: 5, width: 5, height: 5 };
    const b = { x: 0, y: 0, width: 20, height: 20 };
    expect(overlapRatio(a, b)).toBe(1);
  });

  it('is 0 when rects do not overlap', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 100, y: 100, width: 10, height: 10 };
    expect(overlapRatio(a, b)).toBe(0);
  });

  it('is 0.5 when exactly half of a is covered by b', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 5, y: 0, width: 10, height: 10 };
    expect(overlapRatio(a, b)).toBeCloseTo(0.5);
  });
});
