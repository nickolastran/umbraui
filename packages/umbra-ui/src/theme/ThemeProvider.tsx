import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { overridesToCss, type TokenOverrides } from '../tokens/tokens';

/** Theme preference. `system` follows the OS setting. */
export type ThemeMode = 'dark' | 'light' | 'system';
/** Theme actually applied to the document. */
export type ResolvedTheme = 'dark' | 'light';

/** Attribute that switches token values. Set on `<html>` by ThemeProvider; valid on any subtree. */
export const THEME_ATTRIBUTE = 'data-umbra-theme';
/** Default localStorage key for the persisted preference. */
export const THEME_STORAGE_KEY = 'umbra-theme';

/** Value returned by {@link useTheme}. */
export interface ThemeContextValue {
  /** Current preference, including `system`. */
  mode: ThemeMode;
  /** Theme in effect after resolving `system`. */
  resolvedTheme: ResolvedTheme;
  /** Change the preference (persisted unless `storageKey` is `null`). */
  setMode: (mode: ThemeMode) => void;
  /** Flip between dark and light based on the resolved theme. */
  toggle: () => void;
}

/** Props for {@link ThemeProvider}. */
export interface ThemeProviderProps {
  /** Application tree. */
  children?: ReactNode;
  /** Initial preference when nothing is stored. @default "dark" */
  defaultMode?: ThemeMode;
  /** Controlled preference. When set, the provider never reads or writes storage. */
  mode?: ThemeMode;
  /** Called whenever the preference changes. */
  onModeChange?: (mode: ThemeMode) => void;
  /** localStorage key for persistence; `null` disables persistence. @default "umbra-theme" */
  storageKey?: string | null;
  /** Token overrides applied to both themes, e.g. `{ "color-accent": "#e5484d" }`. */
  overrides?: TokenOverrides;
  /** Token overrides applied only while the dark theme is active. */
  darkOverrides?: TokenOverrides;
  /** Token overrides applied only while the light theme is active. */
  lightOverrides?: TokenOverrides;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const QUERY = '(prefers-color-scheme: light)';
const subscribeSystem = (cb: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};
const systemIsLight = () => window.matchMedia(QUERY).matches;

const isMode = (v: unknown): v is ThemeMode => v === 'dark' || v === 'light' || v === 'system';
const readStored = (key: string | null): ThemeMode | null => {
  if (!key) return null;
  try {
    const v = window.localStorage.getItem(key);
    return isMode(v) ? v : null;
  } catch {
    return null; // storage blocked (private mode, sandboxed iframe)
  }
};

/**
 * Provides the Umbra theme. Sets `data-umbra-theme` on `<html>`, persists the preference,
 * follows the OS in `system` mode and injects optional token overrides.
 *
 * For flash-free SSR, also render {@link ThemeScript} in `<head>`.
 */
export function ThemeProvider({
  children,
  defaultMode = 'dark',
  mode: controlled,
  onModeChange,
  storageKey = THEME_STORAGE_KEY,
  overrides,
  darkOverrides,
  lightOverrides,
}: ThemeProviderProps) {
  const [uncontrolled, setUncontrolled] = useState<ThemeMode>(defaultMode);
  const mode = controlled ?? uncontrolled;
  const isControlled = controlled !== undefined;

  // Stored preference is read after mount so server and client markup match.
  useEffect(() => {
    if (isControlled) return;
    const stored = readStored(storageKey);
    if (stored) setUncontrolled(stored);
  }, [isControlled, storageKey]);

  const light = useSyncExternalStore(subscribeSystem, systemIsLight, () => false);
  const resolvedTheme: ResolvedTheme = mode === 'system' ? (light ? 'light' : 'dark') : mode;

  useEffect(() => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, resolvedTheme);
  }, [resolvedTheme]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      if (!isControlled) {
        setUncontrolled(next);
        if (storageKey) {
          try {
            window.localStorage.setItem(storageKey, next);
          } catch {
            /* storage unavailable: preference lasts for this page only */
          }
        }
      }
      onModeChange?.(next);
    },
    [isControlled, onModeChange, storageKey],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, resolvedTheme, setMode, toggle: () => setMode(resolvedTheme === 'dark' ? 'light' : 'dark') }),
    [mode, resolvedTheme, setMode],
  );

  const css = [
    overrides && overridesToCss(overrides, `:root,[${THEME_ATTRIBUTE}]`),
    darkOverrides && overridesToCss(darkOverrides, `:root,[${THEME_ATTRIBUTE}="dark"]`),
    lightOverrides && overridesToCss(lightOverrides, `[${THEME_ATTRIBUTE}="light"]`),
  ]
    .filter(Boolean)
    .join('');

  return (
    <ThemeContext.Provider value={value}>
      {css ? <style data-umbra-overrides="" dangerouslySetInnerHTML={{ __html: css }} /> : null}
      {children}
    </ThemeContext.Provider>
  );
}

/** Reads the current theme. Must be used inside {@link ThemeProvider}. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>.');
  return ctx;
}

/** Props for {@link ThemeScript}. */
export interface ThemeScriptProps {
  /** Must match the provider's `defaultMode`. @default "dark" */
  defaultMode?: ThemeMode;
  /** Must match the provider's `storageKey`. @default "umbra-theme" */
  storageKey?: string | null;
  /** CSP nonce for the inline script. */
  nonce?: string;
}

/**
 * Inline script that applies the stored/system theme before first paint, preventing a flash of the
 * wrong theme under SSR. Render it in `<head>` and add `suppressHydrationWarning` to `<html>`.
 */
export function ThemeScript({ defaultMode = 'dark', storageKey = THEME_STORAGE_KEY, nonce }: ThemeScriptProps) {
  const js = `(function(){try{var m=${storageKey ? `localStorage.getItem(${JSON.stringify(storageKey)})` : 'null'}||${JSON.stringify(
    defaultMode,
  )};if(m!=="dark"&&m!=="light")m=matchMedia(${JSON.stringify(QUERY)}).matches?"light":"dark";document.documentElement.setAttribute(${JSON.stringify(
    THEME_ATTRIBUTE,
  )},m)}catch(e){}})()`;
  return <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: js }} />;
}
