import { Easing, interpolate, spring } from "remotion";
import {
  ARKANAYA_DURATIONS,
  ARKANAYA_EASINGS,
  ARKANAYA_MOTION_INTENSITY,
  type MotionIntensity,
} from "../theme/tokens";
import { hash1D, signedHash } from "../utils/deterministic";

export const EDITORIAL_EASE = Easing.bezier(...ARKANAYA_EASINGS.editorial);
export const SHARP_EXIT_EASE = Easing.bezier(...ARKANAYA_EASINGS.sharpExit);
export const ANALOG_EASE = Easing.bezier(...ARKANAYA_EASINGS.analog);

export const resolveMotionIntensity = (
  intensity: MotionIntensity = "editorial",
): number => ARKANAYA_MOTION_INTENSITY[intensity];

export const scaleMotionDuration = (
  frames: number = ARKANAYA_DURATIONS.enter,
  intensity: MotionIntensity = "editorial",
): number => {
  const factor = ARKANAYA_MOTION_INTENSITY[intensity];
  return Math.max(4, Math.round(frames / Math.max(0.5, factor)));
};

export type MotionContext = {
  frame: number;
  durationInFrames: number;
  fps: number;
};

export type MotionPresetName =
  | "slowZoomIn"
  | "slowZoomOut"
  | "archivalPan"
  | "typewriterReveal"
  | "headlineImpact"
  | "paperReveal"
  | "documentSlide"
  | "stampImpact"
  | "evidenceAppear"
  | "fadeToBlack"
  | "glitchInterruption"
  | "filmFlicker"
  | "verticalWipe"
  | "subtleParallax"
  | "highlighterSweep"
  | "microfilmScroll"
  | "cameraRackFocus"
  | "redactWipe"
  | "pulseBeacon"
  | "handheldDrift";

export const slowZoomIn = (
  ctx: MotionContext,
  options: { from?: number; to?: number } = {},
): number => {
  const { from = 1, to = 1.14 } = options;
  return interpolate(
    ctx.frame,
    [0, Math.max(1, ctx.durationInFrames - 1)],
    [from, to],
    {
      easing: ANALOG_EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
};

export const slowZoomOut = (
  ctx: MotionContext,
  options: { from?: number; to?: number } = {},
): number => {
  const { from = 1.16, to = 1 } = options;
  return interpolate(
    ctx.frame,
    [0, Math.max(1, ctx.durationInFrames - 1)],
    [from, to],
    {
      easing: ANALOG_EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
};

export const archivalPan = (
  ctx: MotionContext,
  options: {
    xFrom?: number;
    xTo?: number;
    yFrom?: number;
    yTo?: number;
  } = {},
): { x: number; y: number } => {
  const { xFrom = -16, xTo = 16, yFrom = 0, yTo = -8 } = options;
  const end = Math.max(1, ctx.durationInFrames - 1);
  return {
    x: interpolate(ctx.frame, [0, end], [xFrom, xTo], {
      easing: ANALOG_EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    y: interpolate(ctx.frame, [0, end], [yFrom, yTo], {
      easing: ANALOG_EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  };
};

export const typewriterReveal = (
  ctx: MotionContext,
  options: {
    totalChars: number;
    startFrame?: number;
    charsPerSecond?: number;
  },
): { visibleChars: number; isTyping: boolean; completed: boolean } => {
  const { totalChars, startFrame = 0, charsPerSecond = 26 } = options;
  const elapsed = Math.max(0, ctx.frame - startFrame);
  const charsPerFrame = charsPerSecond / Math.max(1, ctx.fps);
  const visibleChars = Math.min(totalChars, Math.floor(elapsed * charsPerFrame));
  return {
    visibleChars,
    isTyping: ctx.frame >= startFrame && visibleChars < totalChars,
    completed: visibleChars >= totalChars,
  };
};

export const headlineImpact = (
  ctx: MotionContext,
  options: { enterFrames?: number; exitFrames?: number; exit?: boolean } = {},
): { progress: number; translateY: number; opacity: number } => {
  const { enterFrames = 18, exitFrames = 14, exit = true } = options;
  const inP = interpolate(ctx.frame, [0, Math.max(1, enterFrames)], [0, 1], {
    easing: EDITORIAL_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outStart = Math.max(enterFrames, ctx.durationInFrames - exitFrames);
  const outP = exit
    ? interpolate(
        ctx.frame,
        [outStart, Math.max(outStart + 1, ctx.durationInFrames - 1)],
        [0, 1],
        {
          easing: SHARP_EXIT_EASE,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      )
    : 0;

  return {
    progress: inP * (1 - outP),
    translateY: (1 - inP) * 105 - outP * 105,
    opacity: inP * (1 - outP),
  };
};

export const paperReveal = (
  ctx: MotionContext,
  options: { delay?: number; duration?: number } = {},
): { clipPercent: number; opacity: number; translateY: number } => {
  const { delay = 0, duration = 22 } = options;
  const t = interpolate(
    ctx.frame,
    [delay, delay + Math.max(1, duration)],
    [0, 1],
    {
      easing: EDITORIAL_EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return {
    clipPercent: (1 - t) * 100,
    opacity: interpolate(t, [0, 0.25], [0, 1], { extrapolateRight: "clamp" }),
    translateY: (1 - t) * 28,
  };
};

export const documentSlide = (
  ctx: MotionContext,
  options: { delay?: number; duration?: number; distance?: number } = {},
): { translateY: number; opacity: number; rotationDelta: number } => {
  const { delay = 0, duration = 24, distance = 90 } = options;
  const t = interpolate(
    ctx.frame,
    [delay, delay + Math.max(1, duration)],
    [0, 1],
    {
      easing: EDITORIAL_EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return {
    translateY: (1 - t) * distance,
    opacity: t,
    rotationDelta: (1 - t) * -2.5,
  };
};

export const stampImpact = (
  ctx: MotionContext,
  options: { delay?: number } = {},
): { scale: number; opacity: number; shakeX: number; shakeY: number } => {
  const { delay = 8 } = options;
  const localFrame = Math.max(0, ctx.frame - delay);
  const s = spring({
    frame: localFrame,
    fps: ctx.fps,
    config: { damping: 14, stiffness: 260, mass: 0.7 },
  });
  const scale = interpolate(s, [0, 1], [2.4, 1]);
  const opacity = ctx.frame < delay ? 0 : Math.min(1, localFrame / 3);
  const shakeEnv =
    ctx.frame >= delay && localFrame < 8
      ? Math.max(0, 1 - localFrame / 8) * 5
      : 0;
  return {
    scale,
    opacity,
    shakeX: signedHash(localFrame * 3.1) * shakeEnv,
    shakeY: signedHash(localFrame * 5.7) * shakeEnv,
  };
};

export const evidenceAppear = (
  ctx: MotionContext,
  options: { delay?: number; exit?: boolean; exitFrames?: number } = {},
): { scale: number; translateY: number; opacity: number } => {
  const { delay = 0, exit = false, exitFrames = 14 } = options;
  const s = spring({
    frame: Math.max(0, ctx.frame - delay),
    fps: ctx.fps,
    config: { damping: 18, stiffness: 160, mass: 0.85 },
  });
  const outStart = Math.max(delay + 12, ctx.durationInFrames - exitFrames);
  const outT = exit
    ? interpolate(
        ctx.frame,
        [outStart, Math.max(outStart + 1, ctx.durationInFrames - 1)],
        [0, 1],
        {
          easing: SHARP_EXIT_EASE,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      )
    : 0;
  return {
    scale: (0.9 + 0.1 * s) * (1 - outT * 0.06),
    translateY: (1 - s) * 42 - outT * 28,
    opacity: (ctx.frame < delay ? 0 : Math.min(1, s * 1.4)) * (1 - outT),
  };
};

export const fadeToBlack = (
  ctx: MotionContext,
  options: { fadeInFrames?: number; fadeOutFrames?: number } = {},
): number => {
  const { fadeInFrames = 12, fadeOutFrames = 18 } = options;
  const inOpacity =
    fadeInFrames > 0
      ? interpolate(ctx.frame, [0, fadeInFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const outStart = Math.max(fadeInFrames, ctx.durationInFrames - fadeOutFrames);
  const outOpacity =
    fadeOutFrames > 0
      ? interpolate(
          ctx.frame,
          [outStart, Math.max(outStart + 1, ctx.durationInFrames - 1)],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 0;
  return Math.max(inOpacity, outOpacity);
};

export const glitchInterruption = (
  ctx: MotionContext,
  options: { intensity?: number; seed?: number } = {},
): { active: boolean; offsetX: number; rgbSplit: number; sliceShift: number } => {
  const { intensity = 0.5, seed = 11 } = options;
  const gate = hash1D(Math.floor(ctx.frame / 2) + seed);
  const active = gate > 1 - intensity * 0.35;
  if (!active) {
    return { active: false, offsetX: 0, rgbSplit: 0, sliceShift: 0 };
  }
  const amp = intensity * 18;
  return {
    active: true,
    offsetX: signedHash(ctx.frame * 7.3 + seed) * amp,
    rgbSplit: (2 + hash1D(ctx.frame * 3.9 + seed) * 6) * intensity,
    sliceShift: signedHash(ctx.frame * 13.7 + seed) * amp * 1.4,
  };
};

export const filmFlicker = (
  ctx: MotionContext,
  options: { amount?: number; seed?: number } = {},
): number => {
  const { amount = 0.06, seed = 3 } = options;
  const slowWave = Math.sin(ctx.frame * 0.43 + seed) * 0.5;
  const jitter = signedHash(ctx.frame * 1.7 + seed) * 0.5;
  return 1 - Math.abs(slowWave + jitter) * amount;
};

export const verticalWipe = (
  ctx: MotionContext,
  options: { direction?: "up" | "down" } = {},
): number => {
  const { direction = "up" } = options;
  const t = interpolate(
    ctx.frame,
    [0, Math.max(1, ctx.durationInFrames - 1)],
    [0, 1],
    {
      easing: EDITORIAL_EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return direction === "up" ? (1 - t) * 100 : -(1 - t) * 100;
};

export const subtleParallax = (
  ctx: MotionContext,
  options: { depth?: number; rangePx?: number } = {},
): number => {
  const { depth = 1, rangePx = 22 } = options;
  return interpolate(
    ctx.frame,
    [0, Math.max(1, ctx.durationInFrames - 1)],
    [-rangePx * depth * 0.5, rangePx * depth * 0.5],
    {
      easing: ANALOG_EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
};

export const highlighterSweep = (
  ctx: MotionContext,
  options: { startFrame?: number; durationFrames?: number } = {},
): number => {
  const { startFrame = 10, durationFrames = 22 } = options;
  return interpolate(
    ctx.frame,
    [startFrame, startFrame + Math.max(1, durationFrames)],
    [0, 1],
    {
      easing: EDITORIAL_EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
};

export const microfilmScroll = (
  ctx: MotionContext,
  options: { distancePx?: number; stepFrames?: number } = {},
): number => {
  const { distancePx = 120, stepFrames = 1 } = options;
  const steppedFrame =
    stepFrames > 1 ? Math.floor(ctx.frame / stepFrames) * stepFrames : ctx.frame;
  return interpolate(
    steppedFrame,
    [0, Math.max(1, ctx.durationInFrames - 1)],
    [0, -distancePx],
    {
      easing: ANALOG_EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
};

export const cameraRackFocus = (
  ctx: MotionContext,
  options: {
    startFrame?: number;
    durationFrames?: number;
    maxBlurPx?: number;
    startScale?: number;
  } = {},
): { blurPx: number; scale: number; opacity: number } => {
  const {
    startFrame = 0,
    durationFrames = 24,
    maxBlurPx = 10,
    startScale = 1.06,
  } = options;
  const t = interpolate(
    ctx.frame,
    [startFrame, startFrame + Math.max(1, durationFrames)],
    [0, 1],
    {
      easing: EDITORIAL_EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return {
    blurPx: (1 - t) * maxBlurPx,
    scale: startScale - t * (startScale - 1),
    opacity: interpolate(t, [0, 0.45, 1], [0.25, 0.85, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  };
};

export const redactWipe = (
  ctx: MotionContext,
  options: {
    startFrame?: number;
    durationFrames?: number;
    mode?: "redact" | "declassify";
  } = {},
): number => {
  const { startFrame = 8, durationFrames = 18, mode = "redact" } = options;
  const t = interpolate(
    ctx.frame,
    [startFrame, startFrame + Math.max(1, durationFrames)],
    [0, 1],
    {
      easing: EDITORIAL_EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return mode === "redact" ? t * 100 : (1 - t) * 100;
};

export const pulseBeacon = (
  ctx: MotionContext,
  options: { periodFrames?: number; maxScale?: number } = {},
): { scale: number; opacity: number } => {
  const { periodFrames = 45, maxScale = 2.1 } = options;
  const cycle = (ctx.frame % Math.max(1, periodFrames)) / Math.max(1, periodFrames);
  const eased = EDITORIAL_EASE(cycle);
  return {
    scale: 1 + eased * (maxScale - 1),
    opacity: (1 - eased) * 0.75,
  };
};

export const handheldDrift = (
  ctx: MotionContext,
  options: { amplitudePx?: number; rotationDeg?: number; seed?: number } = {},
): { x: number; y: number; rotate: number } => {
  const { amplitudePx = 4, rotationDeg = 0.25, seed = 11 } = options;
  const t = (ctx.frame / Math.max(1, ctx.fps)) * 0.85 + seed;
  return {
    x: (Math.sin(t * 1.3) * 0.6 + Math.cos(t * 2.1) * 0.4) * amplitudePx,
    y: (Math.cos(t * 1.1) * 0.65 + Math.sin(t * 1.9) * 0.35) * amplitudePx,
    rotate: Math.sin(t * 0.9) * rotationDeg,
  };
};
