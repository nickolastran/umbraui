import { createContext, useContext, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

/** `system` follows `prefers-reduced-motion`; `always` / `never` force it. */
export type ReducedMotionSetting = 'system' | 'always' | 'never';

const QUERY = '(prefers-reduced-motion: reduce)';
const subscribe = (cb: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};
const getSnapshot = () => window.matchMedia(QUERY).matches;

const MotionPreferenceContext = createContext<ReducedMotionSetting>('system');

/** Props for {@link MotionPreferenceProvider}. */
export interface MotionPreferenceProviderProps {
  /** Preference applied to every animated component below, unless one sets its own `reducedMotion` prop. */
  reducedMotion: ReducedMotionSetting;
  /** Subtree to configure. */
  children?: ReactNode;
}

/** Overrides the reduced-motion preference for a subtree, e.g. for an in-app "reduce motion" setting. */
export function MotionPreferenceProvider({ reducedMotion, children }: MotionPreferenceProviderProps) {
  return <MotionPreferenceContext.Provider value={reducedMotion}>{children}</MotionPreferenceContext.Provider>;
}

/**
 * `true` when movement should be replaced with instant or opacity-only transitions and loops stopped.
 * Resolution order: the `override` argument, then the nearest {@link MotionPreferenceProvider}, then the OS setting.
 */
export function useReducedMotion(override?: ReducedMotionSetting): boolean {
  const inherited = useContext(MotionPreferenceContext);
  const system = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const setting = override && override !== 'system' ? override : inherited;
  return setting === 'system' ? system : setting === 'always';
}
