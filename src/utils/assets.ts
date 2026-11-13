import { staticFile } from "remotion";

const EXTERNAL_PROTOCOL_REGEX = /^(https?:|data:|blob:|\/)/i;

/**
 * Resolves media/audio asset paths cleanly:
 * - External URLs (http/https/data/blob) or root-relative paths (/...) pass through unchanged.
 * - Relative paths (e.g. "media/ep01/photo.jpg", "audio/vo/ep01.mp3") resolve via Remotion staticFile() from public/.
 */
export const resolveMediaSrc = (src?: string): string | undefined => {
  if (!src) return undefined;
  const trimmed = src.trim();
  if (!trimmed) return undefined;
  if (EXTERNAL_PROTOCOL_REGEX.test(trimmed)) {
    return trimmed;
  }
  return staticFile(trimmed);
};
