import type { Transition } from 'motion/react';
import { tokens } from '../tokens/tokens';

const { duration, ease, spring } = tokens.motion;
type Bezier = [number, number, number, number];
const bezier = (e: readonly [number, number, number, number]): Bezier => [...e];

/** Raw motion tokens: durations in seconds, bezier tuples and spring configs. */
export const motionTokens = tokens.motion;

/**
 * Ready-made Motion transitions built only from the motion tokens.
 * Every animated component uses these; use them for your own animations to stay in family.
 */
export const transitions = {
  instant: { duration: duration.instant },
  fast: { duration: duration.fast, ease: bezier(ease.standard) },
  base: { duration: duration.base, ease: bezier(ease.out) },
  slow: { duration: duration.slow, ease: bezier(ease.out) },
  slower: { duration: duration.slower, ease: bezier(ease.out) },
  snappy: { ...spring.snappy },
  smooth: { ...spring.smooth },
  gentle: { ...spring.gentle },
} satisfies Record<string, Transition>;

/** Name of a preset in {@link transitions}. */
export type TransitionName = keyof typeof transitions;
