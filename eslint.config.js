import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/.next/**', '**/out/**', '**/storybook-static/**', '**/node_modules/**', '**/generated/**', '**/next-env.d.ts'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    plugins: { 'react-hooks': reactHooks },
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // Library guarantee: no ad-hoc hex colours in component code. Tokens only.
      'no-restricted-syntax': ['error', { selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]", message: 'Use a design token instead of a hard-coded colour.' }],
    },
  },
  {
    files: ['**/tokens/tokens.ts', '**/*.test.{ts,tsx}', '**/*.stories.tsx', 'apps/**', 'examples/**'],
    rules: { 'no-restricted-syntax': 'off' },
  },
  {
    // Stories render hooks inside `render` functions and use autofocus to demo states.
    files: ['**/*.stories.tsx', '**/.storybook/**'],
    rules: { 'react-hooks/rules-of-hooks': 'off', 'jsx-a11y/no-autofocus': 'off' },
  },
);
