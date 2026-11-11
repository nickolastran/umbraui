// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { tokens, tokensToCss, type ThemedTokenName } from './tokens';

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};

const surfaces = ['color-bg', 'color-bg-subtle', 'color-surface-1', 'color-surface-2', 'color-surface-3'] as const;
const states = ['success', 'warning', 'danger', 'info'] as const;
const text = [
  'color-text',
  'color-text-secondary',
  'color-text-muted',
  'color-accent-text',
  ...states.map((s) => `color-${s}-text` as const),
] as const;

describe.each(['dark', 'light'] as const)('%s theme contrast (WCAG 2.1 AA)', (theme) => {
  const t = tokens[theme];
  const pairs: [ThemedTokenName, ThemedTokenName, number][] = [
    ...text.flatMap((fg) => surfaces.map((bg) => [fg, bg, 4.5] as [ThemedTokenName, ThemedTokenName, number])),
    ...(['accent', ...states] as const).flatMap((s) => [
      [`color-${s}-text`, `color-${s}-subtle`, 4.5] as [ThemedTokenName, ThemedTokenName, number],
    ]),
    ...(['color-accent', 'color-accent-hover', 'color-accent-active', 'color-danger-hover', 'color-danger-active', ...states.map((s) => `color-${s}` as const)] as const).map(
      (bg) => ['color-text-on-accent', bg, 4.5] as [ThemedTokenName, ThemedTokenName, number],
    ),
    ...surfaces.flatMap((bg) => [
      ['color-border-control', bg, 3] as [ThemedTokenName, ThemedTokenName, number],
      ['color-focus', bg, 3] as [ThemedTokenName, ThemedTokenName, number],
      ['color-accent', bg, 3] as [ThemedTokenName, ThemedTokenName, number],
    ]),
  ];
  it.each(pairs)('%s on %s ≥ %s', (fg, bg, min) => {
    expect(contrast(t[fg], t[bg])).toBeGreaterThanOrEqual(min);
  });
});

it('generated tokens.css is up to date with tokens.ts', () => {
  expect(readFileSync(new URL('../styles/tokens.css', import.meta.url), 'utf8')).toBe(tokensToCss());
});
