import type { Meta, StoryObj } from '@storybook/react';
import { tokens, cssVar, type ThemedTokenName } from '../tokens/tokens';

const meta: Meta = { title: 'Foundations/Tokens' };
export default meta;

const colors = (Object.keys(tokens.dark) as ThemedTokenName[]).filter((k) => k.startsWith('color-'));

/** Every colour token in the active theme. */
export const Colors: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: cssVar('space-3') }}>
      {colors.map((name) => (
        <div key={name} style={{ border: `1px solid ${cssVar('color-border')}`, borderRadius: cssVar('radius-md'), overflow: 'hidden' }}>
          <div style={{ height: 48, background: cssVar(name) }} />
          <code style={{ display: 'block', padding: cssVar('space-2'), fontFamily: cssVar('font-mono'), fontSize: cssVar('text-xs-size') }}>
            {name}
          </code>
        </div>
      ))}
    </div>
  ),
};

/** The type scale with its tracking. */
export const Typography: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: cssVar('space-4') }}>
      {(['3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'] as const).map((s) => (
        <div
          key={s}
          style={{
            fontSize: cssVar(`text-${s}-size`),
            lineHeight: cssVar(`text-${s}-line`),
            letterSpacing: cssVar(`text-${s}-tracking`),
            fontWeight: s.includes('xl') ? 600 : 400,
          }}
        >
          {s} — Light is the scarce resource
        </div>
      ))}
    </div>
  ),
};
