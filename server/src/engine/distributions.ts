import seedrandom from 'seedrandom';

export function createSeededRng(seed: number): () => number {
  return seedrandom(String(seed));
}

/**
 * Sample from a triangular distribution.
 * @param rng - seeded random number generator returning [0, 1)
 * @param low - minimum value
 * @param mode - most likely value
 * @param high - maximum value
 */
export function sampleTriangular(rng: () => number, low: number, mode: number, high: number): number {
  if (high <= low) return mode;
  const u = rng();
  const fc = (mode - low) / (high - low);
  if (u < fc) {
    return low + Math.sqrt(u * (high - low) * (mode - low));
  }
  return high - Math.sqrt((1 - u) * (high - low) * (high - mode));
}

/**
 * Compute interpolated percentile from a sorted array.
 */
export function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const idx = p * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  const frac = idx - lo;
  return sorted[lo] * (1 - frac) + sorted[hi] * frac;
}
