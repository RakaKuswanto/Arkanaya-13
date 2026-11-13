import { useCurrentFrame } from "remotion";
import { computePolyphonyScale } from "../../audio/mixing";
import {
  deduplicateSfxEvents,
  resolveSfxEvent,
  type ResolvedSfxEvent,
} from "../../audio/timeline";
import type { SfxTimelineEvent } from "../../audio/types";
import type { DuckRange } from "./AudioDuck";
import { SoundEffect } from "./SoundEffect";

export type SfxTimelinePlayerProps = {
  events: readonly (SfxTimelineEvent | ResolvedSfxEvent)[];
  voDuckRanges?: readonly DuckRange[];
  sfxPolyphonyCeiling?: number;
};

export const SfxTimelinePlayer = ({
  events,
  voDuckRanges = [],
  sfxPolyphonyCeiling = 0.9,
}: SfxTimelinePlayerProps) => {
  const frame = useCurrentFrame();
  const resolvedList = deduplicateSfxEvents(events.map(resolveSfxEvent));

  const polyphonyWindows = resolvedList.map((ev) => ({
    startFrame: ev.resolvedStartFrame,
    endFrame: ev.resolvedEndFrame,
    volume: ev.resolvedVolume,
  }));

  const polyphonyScale = computePolyphonyScale(
    polyphonyWindows,
    frame,
    sfxPolyphonyCeiling,
  );

  return (
    <>
      {resolvedList.map((ev) => (
        <SoundEffect
          key={ev.id}
          event={ev}
          voDuckRanges={voDuckRanges}
          polyphonyScale={polyphonyScale}
        />
      ))}
    </>
  );
};
