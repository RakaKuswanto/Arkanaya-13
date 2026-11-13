import { type EpisodeData, validateEpisode } from "../schema/episode";
import { sampleCooperEpisode } from "./ep01-cooper";
import { ep02Setiabudi13Episode } from "./ep02-setiabudi-13";
import { ep03TheFallOfNokiaEpisode } from "./ep03-the-fall-of-nokia";

/**
 * Central episode registry for ARKANAYA 13.
 * Every episode listed here is validated at load time and auto-registered in Root.tsx.
 */
export const EPISODES: readonly EpisodeData[] = [
  validateEpisode(sampleCooperEpisode),
  validateEpisode(ep02Setiabudi13Episode),
  validateEpisode(ep03TheFallOfNokiaEpisode),
];

export {
  ep02Setiabudi13Episode,
  ep03TheFallOfNokiaEpisode,
  sampleCooperEpisode,
};
