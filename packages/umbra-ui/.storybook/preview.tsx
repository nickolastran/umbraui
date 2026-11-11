import type { Decorator, Preview } from '@storybook/react';
import { useEffect } from 'react';
import '../src/styles/index.css';

/** Applies the toolbar theme to <html>; "side by side" renders the story once per theme. */
const withTheme: Decorator = (Story, { globals }) => {
  const theme = globals.theme as 'dark' | 'light' | 'both';
  useEffect(() => {
    document.documentElement.setAttribute('data-umbra-theme', theme === 'both' ? 'dark' : theme);
  }, [theme]);
  if (theme !== 'both') return <Story />;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', margin: '-1rem' }}>
      {(['dark', 'light'] as const).map((t) => (
        <div key={t} data-umbra-theme={t} style={{ padding: '1rem', minHeight: '100vh' }}>
          <Story />
        </div>
      ))}
    </div>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Umbra theme',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        dynamicTitle: true,
        items: [
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'both', title: 'Side by side', icon: 'sidebyside' },
        ],
      },
    },
  },
  initialGlobals: { theme: 'dark' },
  decorators: [withTheme],
  parameters: {
    backgrounds: { disable: true },
    controls: { matchers: { color: /(background|color)$/i } },
    layout: 'padded',
  },
};

export default preview;
