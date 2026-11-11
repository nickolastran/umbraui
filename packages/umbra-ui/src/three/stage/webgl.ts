let cached: boolean | undefined;

/** `true` when the browser can create a WebGL context. Safe to call on the server (returns `false`). Cached after the first call. */
export function detectWebGL(): boolean {
  if (cached !== undefined) return cached;
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    cached = Boolean(gl);
    // Browsers cap live contexts; hand the probe back straight away.
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}
