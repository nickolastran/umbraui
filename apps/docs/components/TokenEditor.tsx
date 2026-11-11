'use client';

import { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, CardDescription, CardHeader, CardTitle, Checkbox, FormField, Inline, Input, Select, SelectItem, Stack, Switch, cssVarName, tokens, useTheme, type TokenOverrides } from 'umbra-ui';
import { Orb } from 'umbra-ui/3d';
import { ShimmerButton } from 'umbra-ui/motion';
import { CodeBlock } from './CodeBlock';

const hex = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0');
const rgb = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)) as [number, number, number];
/** Mixes two hex colours in sRGB. Plain hex output keeps the values usable by three.js too. */
const mix = (a: string, b: string, t: number) => {
  const [x, y] = [rgb(a), rgb(b)];
  return `#${x.map((v, i) => hex(v + (y[i]! - v) * t)).join('')}`;
};

const radii = {
  sharp: { 'radius-xs': '0px', 'radius-sm': '2px', 'radius-md': '3px', 'radius-lg': '4px' },
  default: {},
  round: { 'radius-xs': '6px', 'radius-sm': '10px', 'radius-md': '14px', 'radius-lg': '20px' },
} satisfies Record<string, TokenOverrides>;
const fonts = {
  Geist: undefined,
  System: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  Serif: 'ui-serif, Georgia, "Times New Roman", serif',
  Mono: 'var(--umbra-font-mono)',
};

/** Live token editor: writes overrides to <html>, so every component on the page (3D included) follows. */
export function TokenEditor() {
  const { resolvedTheme } = useTheme();
  const base = tokens[resolvedTheme];
  const [accent, setAccent] = useState<string>(tokens.dark['color-accent']);
  const [radius, setRadius] = useState<keyof typeof radii>('default');
  const [font, setFont] = useState<keyof typeof fonts>('Geist');

  const overrides = useMemo<TokenOverrides>(() => {
    const dark = resolvedTheme === 'dark';
    const changed = accent.toLowerCase() !== tokens.dark['color-accent'];
    return {
      ...(changed
        ? {
            'color-accent': accent,
            'color-accent-hover': mix(accent, dark ? '#ffffff' : '#000000', 0.1),
            'color-accent-active': mix(accent, '#000000', 0.14),
            'color-accent-text': mix(accent, dark ? '#ffffff' : '#000000', dark ? 0.5 : 0.25),
            'color-accent-subtle': mix(base['color-bg'], accent, dark ? 0.2 : 0.1),
            'color-accent-border': mix(base['color-bg'], accent, dark ? 0.45 : 0.35),
            'color-focus': mix(accent, dark ? '#ffffff' : '#000000', dark ? 0.3 : 0),
          }
        : {}),
      ...radii[radius],
      ...(fonts[font] ? { 'font-sans': fonts[font] } : {}),
    };
  }, [accent, radius, font, resolvedTheme, base]);

  useEffect(() => {
    const root = document.documentElement;
    const names = Object.keys(overrides).map((k) => cssVarName(k as keyof TokenOverrides));
    Object.entries(overrides).forEach(([k, v]) => root.style.setProperty(cssVarName(k as keyof TokenOverrides), v!));
    return () => names.forEach((n) => root.style.removeProperty(n));
  }, [overrides]);

  const css = Object.keys(overrides).length
    ? `:root {\n${Object.entries(overrides).map(([k, v]) => `  ${cssVarName(k as keyof TokenOverrides)}: ${v};`).join('\n')}\n}`
    : '/* Change a control to generate overrides. */';

  return (
    <>
      <div className="editor">
        <Card className="editor__panel" size="sm">
          <FormField label="Accent" controlId="token-accent">
            <input id="token-accent" className="swatch" type="color" value={accent} onChange={(e) => setAccent(e.target.value)} />
          </FormField>
          <FormField label="Radius">
            <Select value={radius} onValueChange={(v) => setRadius(v as keyof typeof radii)}>
              {Object.keys(radii).map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </Select>
          </FormField>
          <FormField label="Font">
            <Select value={font} onValueChange={(v) => setFont(v as keyof typeof fonts)}>
              {Object.keys(fonts).map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </Select>
          </FormField>
          <Button
            variant="ghost"
            tone="neutral"
            size="sm"
            onClick={() => {
              setAccent(tokens.dark['color-accent']);
              setRadius('default');
              setFont('Geist');
            }}
          >
            Reset
          </Button>
        </Card>
        <Stack gap="4">
          <Inline gap="3">
            <Button>Primary</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="outline">Outline</Button>
            <ShimmerButton>Shimmer</ShimmerButton>
            <Badge tone="accent">Accent</Badge>
          </Inline>
          <Inline gap="6">
            <Checkbox defaultChecked>Checkbox</Checkbox>
            <Switch defaultChecked>Switch</Switch>
          </Inline>
          <Input aria-label="Sample input" placeholder="Focus me to see the ring" style={{ maxWidth: 320 }} />
          <Alert tone="accent" title="Accent alert" role="note">Tinted surfaces are derived from the accent too.</Alert>
          <Inline gap="4" align="center">
            <Orb aria-label="Sample orb" />
            <Card size="sm" style={{ flex: 1, minWidth: 200 }}>
              <CardHeader>
                <CardTitle>3D follows along</CardTitle>
                <CardDescription>The orb reads its colour from the same token.</CardDescription>
              </CardHeader>
            </Card>
          </Inline>
        </Stack>
      </div>
      <CodeBlock code={css} label="Generated CSS variables" />
    </>
  );
}
