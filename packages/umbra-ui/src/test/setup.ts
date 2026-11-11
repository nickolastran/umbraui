import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => cleanup());

// jsdom lacks these browser APIs; Radix, Motion and the 3D stage all touch them.
class Observer {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal('ResizeObserver', Observer);
vi.stubGlobal('IntersectionObserver', Observer);

/** Tests flip this to simulate `prefers-reduced-motion: reduce` / `prefers-color-scheme: light`. */
export const media: Record<string, boolean> = {};
if (typeof window !== 'undefined')
  Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    get matches() {
      return Object.entries(media).some(([k, v]) => v && query.includes(k));
    },
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  }),
});

if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView ??= () => {};
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.setPointerCapture ??= () => {};
  Element.prototype.releasePointerCapture ??= () => {};
}

// jsdom has no WebGL. Returning null (rather than jsdom's "not implemented" error) is exactly what a
// browser without WebGL does, so the 3D components take their fallback path unless a test mocks detection.
if (typeof HTMLCanvasElement !== 'undefined') HTMLCanvasElement.prototype.getContext = (() => null) as never;
