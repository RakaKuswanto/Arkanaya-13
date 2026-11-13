/**
 * Deterministic math and pseudo-random helpers for frame-accurate Remotion rendering.
 * Never uses Math.random().
 */

export const clamp01 = (value: number): number =>
  Math.max(0, Math.min(1, value));

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

/**
 * Deterministic hash returning a value in [0, 1).
 */
export const hash1D = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

/**
 * Deterministic 2D hash returning a value in [0, 1).
 */
export const hash2D = (x: number, y: number, seed = 0): number => {
  const h = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return h - Math.floor(h);
};

/**
 * Deterministic signed hash returning a value in [-1, 1].
 */
export const signedHash = (n: number): number => hash1D(n) * 2 - 1;

/**
 * Parses a minimal SRT or VTT timestamp (HH:MM:SS,mmm or MM:SS.mmm) into milliseconds.
 */
export const parseTimestampToMs = (raw: string): number => {
  const cleaned = raw.trim().replace(",", ".");
  const parts = cleaned.split(":");
  if (parts.length === 3) {
    const hours = Number(parts[0]) || 0;
    const minutes = Number(parts[1]) || 0;
    const seconds = Number(parts[2]) || 0;
    return Math.round((hours * 3600 + minutes * 60 + seconds) * 1000);
  }
  if (parts.length === 2) {
    const minutes = Number(parts[0]) || 0;
    const seconds = Number(parts[1]) || 0;
    return Math.round((minutes * 60 + seconds) * 1000);
  }
  return 0;
};
