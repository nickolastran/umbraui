import axe from 'axe-core';
import { expect } from 'vitest';

/** Runs axe on `node` and fails the test with a readable list if anything is reported. */
export async function expectNoA11yViolations(node: Element = document.body) {
  const { violations } = await axe.run(node, {
    // jsdom has no layout engine, so colour contrast is covered by the token contrast test instead.
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  expect(violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.html).join(', ')})`)).toEqual([]);
}
