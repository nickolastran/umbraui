import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const require = createRequire(import.meta.url);
/** Resolve from this package so presets load regardless of workspace hoisting. */
const pkg = (name: string) => dirname(require.resolve(join(name, 'package.json')));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [pkg('@storybook/addon-essentials'), pkg('@storybook/addon-a11y')],
  framework: { name: pkg('@storybook/react-vite') as '@storybook/react-vite', options: {} },
  typescript: { reactDocgen: 'react-docgen-typescript' },
  core: { disableTelemetry: true },
};

export default config;
