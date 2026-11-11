/**
 * Single source of truth for every Umbra design token.
 *
 * `scripts/build-tokens.ts` turns this file into `src/styles/tokens.css`
 * (`--umbra-<name>` custom properties); the same object is exported, typed, as `tokens`.
 * Never hard-code a color, radius or duration in a component: add it here.
 */

/** Tokens whose value depends on the active theme. */
const dark = {
  'color-bg': '#08090a',
  'color-bg-subtle': '#0c0d0f',
  'color-surface-1': '#111214',
  'color-surface-2': '#17181b',
  'color-surface-3': '#1e1f23',
  'color-overlay': 'rgba(4, 4, 6, 0.72)',
  'color-border-subtle': '#1f2024',
  'color-border': '#2a2c31',
  'color-border-strong': '#3a3d44',
  'color-border-control': '#676b77',
  'color-text': '#f4f5f7',
  'color-text-secondary': '#adb0b9',
  'color-text-muted': '#8a8e99',
  'color-text-disabled': '#5b5e68',
  'color-text-on-accent': '#ffffff',
  'color-accent': '#5b5bd6',
  'color-accent-hover': '#6563de',
  'color-accent-active': '#4f4ec4',
  'color-accent-text': '#a9a7ff',
  'color-accent-subtle': '#16163a',
  'color-accent-border': '#34347a',
  'color-neon': '#5ee6ff',
  'color-focus': '#8b89ff',
  'color-success': '#1a7f4b',
  'color-success-text': '#4ade94',
  'color-success-subtle': '#0c2418',
  'color-success-border': '#17482f',
  'color-warning': '#9a6200',
  'color-warning-text': '#f5b93f',
  'color-warning-subtle': '#2a1e06',
  'color-warning-border': '#54400f',
  'color-danger': '#d13b4a',
  'color-danger-hover': '#c03342',
  'color-danger-active': '#ad2c3a',
  'color-danger-text': '#ff8a94',
  'color-danger-subtle': '#2c0f13',
  'color-danger-border': '#5c1f27',
  'color-info': '#1f6fd1',
  'color-info-text': '#7cb8ff',
  'color-info-subtle': '#0b1c33',
  'color-info-border': '#173a69',
  'shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.4)',
  'shadow-md': '0 8px 24px -8px rgba(0, 0, 0, 0.6)',
  'shadow-lg': '0 24px 64px -16px rgba(0, 0, 0, 0.7)',
  'glow-accent': '0 0 0 1px rgba(123, 121, 255, 0.35), 0 0 24px -4px rgba(123, 121, 255, 0.45)',
  'glow-neon': '0 0 24px -4px rgba(94, 230, 255, 0.45)',
  'gradient-accent': 'linear-gradient(135deg, #7b79ff 0%, #5ee6ff 100%)',
  'gradient-surface': 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%)',
  'gradient-beam': 'conic-gradient(from 0deg, transparent 0deg, #7b79ff 60deg, #5ee6ff 90deg, transparent 120deg)',
  'gradient-spotlight': 'rgba(123, 121, 255, 0.16)',
} as const;

const light: Record<keyof typeof dark, string> = {
  'color-bg': '#f7f7f8',
  'color-bg-subtle': '#f1f1f3',
  'color-surface-1': '#ffffff',
  'color-surface-2': '#f4f4f6',
  'color-surface-3': '#eaeaee',
  'color-overlay': 'rgba(16, 17, 20, 0.4)',
  'color-border-subtle': '#e8e8ec',
  'color-border': '#dcdce2',
  'color-border-strong': '#c4c5ce',
  'color-border-control': '#7d808c',
  'color-text': '#0e0f12',
  'color-text-secondary': '#4b4f59',
  'color-text-muted': '#666a75',
  'color-text-disabled': '#a3a6b0',
  'color-text-on-accent': '#ffffff',
  'color-accent': '#5b5bd6',
  'color-accent-hover': '#4f4ecb',
  'color-accent-active': '#4543bb',
  'color-accent-text': '#4a48c4',
  'color-accent-subtle': '#ededfc',
  'color-accent-border': '#c3c2f2',
  'color-neon': '#0e8fb0',
  'color-focus': '#5b5bd6',
  'color-success': '#18794a',
  'color-success-text': '#12683e',
  'color-success-subtle': '#e8f7ee',
  'color-success-border': '#b3e2c6',
  'color-warning': '#8f5a00',
  'color-warning-text': '#7d4e00',
  'color-warning-subtle': '#fdf3dc',
  'color-warning-border': '#edd292',
  'color-danger': '#c9303f',
  'color-danger-hover': '#b82a38',
  'color-danger-active': '#a52431',
  'color-danger-text': '#b02533',
  'color-danger-subtle': '#fdecee',
  'color-danger-border': '#f3bcc2',
  'color-info': '#1c66c2',
  'color-info-text': '#1757a8',
  'color-info-subtle': '#e9f2fd',
  'color-info-border': '#b7d3f5',
  'shadow-sm': '0 1px 2px rgba(16, 17, 20, 0.06)',
  'shadow-md': '0 8px 24px -8px rgba(16, 17, 20, 0.12)',
  'shadow-lg': '0 24px 64px -16px rgba(16, 17, 20, 0.18)',
  'glow-accent': '0 0 0 1px rgba(91, 91, 214, 0.25), 0 0 20px -6px rgba(91, 91, 214, 0.35)',
  'glow-neon': '0 0 20px -6px rgba(14, 143, 176, 0.35)',
  'gradient-accent': 'linear-gradient(135deg, #5b5bd6 0%, #0e8fb0 100%)',
  'gradient-surface': 'linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%)',
  'gradient-beam': 'conic-gradient(from 0deg, transparent 0deg, #5b5bd6 60deg, #0e8fb0 90deg, transparent 120deg)',
  'gradient-spotlight': 'rgba(91, 91, 214, 0.1)',
};

/** Motion tokens in the shapes Motion expects: seconds, bezier tuples and spring configs. */
const motion = {
  duration: { instant: 0, stagger: 0.04, fast: 0.12, base: 0.2, slow: 0.32, slower: 0.56, loop: 6 },
  ease: {
    standard: [0.2, 0, 0, 1],
    out: [0.16, 1, 0.3, 1],
    in: [0.7, 0, 0.84, 0],
    'in-out': [0.65, 0, 0.35, 1],
  },
  spring: {
    snappy: { type: 'spring', stiffness: 520, damping: 36, mass: 1 },
    smooth: { type: 'spring', stiffness: 260, damping: 30, mass: 1 },
    gentle: { type: 'spring', stiffness: 120, damping: 20, mass: 1 },
  },
} as const satisfies {
  duration: Record<string, number>;
  ease: Record<string, readonly [number, number, number, number]>;
  spring: Record<string, { type: 'spring'; stiffness: number; damping: number; mass: number }>;
};

type DurationVars = { [K in keyof typeof motion.duration as `duration-${K}`]: string };
type EaseVars = { [K in keyof typeof motion.ease as `ease-${K}`]: string };

const motionVars = {
  ...Object.fromEntries(Object.entries(motion.duration).map(([k, s]) => [`duration-${k}`, `${Math.round(s * 1000)}ms`])),
  ...Object.fromEntries(Object.entries(motion.ease).map(([k, b]) => [`ease-${k}`, `cubic-bezier(${b.join(', ')})`])),
} as DurationVars & EaseVars;

/** Tokens that are identical in both themes. */
const shared = {
  'font-sans': '"Geist", "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  'font-mono': '"Geist Mono", "JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  'font-weight-regular': '400',
  'font-weight-medium': '500',
  'font-weight-semibold': '600',
  'text-xs-size': '0.75rem',
  'text-xs-line': '1rem',
  'text-xs-tracking': '0',
  'text-sm-size': '0.8125rem',
  'text-sm-line': '1.25rem',
  'text-sm-tracking': '-0.003em',
  'text-md-size': '0.875rem',
  'text-md-line': '1.375rem',
  'text-md-tracking': '-0.006em',
  'text-lg-size': '1rem',
  'text-lg-line': '1.5rem',
  'text-lg-tracking': '-0.011em',
  'text-xl-size': '1.25rem',
  'text-xl-line': '1.75rem',
  'text-xl-tracking': '-0.017em',
  'text-2xl-size': '1.75rem',
  'text-2xl-line': '2.125rem',
  'text-2xl-tracking': '-0.022em',
  'text-3xl-size': '2.5rem',
  'text-3xl-line': '2.75rem',
  'text-3xl-tracking': '-0.03em',
  'space-0': '0px',
  'space-0.5': '2px',
  'space-1': '4px',
  'space-1.5': '6px',
  'space-2': '8px',
  'space-3': '12px',
  'space-4': '16px',
  'space-5': '20px',
  'space-6': '24px',
  'space-8': '32px',
  'space-10': '40px',
  'space-12': '48px',
  'space-16': '64px',
  'size-sm': '28px',
  'size-md': '32px',
  'size-lg': '40px',
  'container-sm': '40rem',
  'container-md': '48rem',
  'container-lg': '64rem',
  'container-xl': '76rem',
  'radius-xs': '4px',
  'radius-sm': '6px',
  'radius-md': '8px',
  'radius-lg': '12px',
  'radius-full': '9999px',
  'z-base': '0',
  'z-raised': '10',
  'z-sticky': '100',
  'z-overlay': '1000',
  'z-modal': '1100',
  'z-popover': '1200',
  'z-toast': '1300',
  'z-tooltip': '1400',
  'focus-ring-width': '2px',
  'focus-ring-offset': '2px',
  ...motionVars,
} as const;

/** Every Umbra design token. `dark` / `light` are theme-dependent, `shared` is not. */
export const tokens = { dark, light, shared, motion } as const;

/** Name of a theme-dependent token (e.g. `"color-accent"`). */
export type ThemedTokenName = keyof typeof dark;
/** Name of a theme-independent token (e.g. `"radius-md"`). */
export type SharedTokenName = keyof typeof shared;
/** Any token name. Maps to the CSS custom property `--umbra-<name>`. */
export type TokenName = ThemedTokenName | SharedTokenName;
/** Spacing scale steps (`space-<step>` tokens). */
export type SpaceToken = Extract<SharedTokenName, `space-${string}`> extends `space-${infer S}` ? S : never;
/** Partial map of token name to CSS value, used for consumer overrides. */
export type TokenOverrides = Partial<Record<TokenName, string>>;

/** CSS custom property prefix. */
export const TOKEN_PREFIX = '--umbra-';

/** Escape characters that are not valid in a bare CSS identifier (the `.` in `space-0.5`). */
const ident = (name: string) => name.replace(/\./g, '_');

/** `cssVarName("color-bg")` → `"--umbra-color-bg"`. */
export const cssVarName = (name: TokenName): string => `${TOKEN_PREFIX}${ident(name)}`;

/** `cssVar("color-bg")` → `"var(--umbra-color-bg)"`, for inline styles. */
export const cssVar = (name: TokenName): string => `var(${cssVarName(name)})`;

const block = (selector: string, map: Record<string, string>, extra = '') =>
  `  ${selector} {\n${extra}${Object.entries(map)
    .map(([k, v]) => `    ${cssVarName(k as TokenName)}: ${v};`)
    .join('\n')}\n  }`;

/** Serialise a set of overrides to declarations, e.g. for a `style` tag. */
export const overridesToCss = (overrides: TokenOverrides, selector = ':root'): string =>
  `${selector}{${Object.entries(overrides)
    .map(([k, v]) => `${cssVarName(k as TokenName)}:${v}`)
    .join(';')}}`;

/** Full token stylesheet. Dark is the default; `data-umbra-theme` switches a subtree. */
export const tokensToCss = (): string =>
  [
    '/* Generated by scripts/build-tokens.ts from src/tokens/tokens.ts. Do not edit. */',
    '@layer umbra {',
    block(':root', shared),
    block(':root,\n  [data-umbra-theme="dark"]', dark, '    color-scheme: dark;\n'),
    block('[data-umbra-theme="light"]', light, '    color-scheme: light;\n'),
    '}',
    '',
  ].join('\n');
