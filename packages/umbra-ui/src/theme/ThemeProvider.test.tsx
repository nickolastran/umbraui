import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { media } from '../test/setup';
import { THEME_ATTRIBUTE, ThemeProvider, ThemeScript, useTheme } from './ThemeProvider';

function Probe() {
  const { mode, resolvedTheme, toggle, setMode } = useTheme();
  return (
    <>
      <output>{`${mode}/${resolvedTheme}`}</output>
      <button onClick={toggle}>toggle</button>
      <button onClick={() => setMode('system')}>system</button>
    </>
  );
}

const attr = () => document.documentElement.getAttribute(THEME_ATTRIBUTE);

beforeEach(() => {
  localStorage.clear();
  media['prefers-color-scheme: light'] = false;
});

describe('ThemeProvider', () => {
  it('defaults to dark and sets the attribute on <html>', () => {
    render(<ThemeProvider><Probe /></ThemeProvider>);
    expect(screen.getByRole('status')).toHaveTextContent('dark/dark');
    expect(attr()).toBe('dark');
  });

  it('toggles, persists and restores the preference', async () => {
    const { unmount } = render(<ThemeProvider><Probe /></ThemeProvider>);
    await userEvent.click(screen.getByText('toggle'));
    expect(attr()).toBe('light');
    expect(localStorage.getItem('umbra-theme')).toBe('light');
    unmount();
    render(<ThemeProvider><Probe /></ThemeProvider>);
    expect(screen.getByRole('status')).toHaveTextContent('light/light');
  });

  it('resolves system mode from the OS preference', async () => {
    media['prefers-color-scheme: light'] = true;
    render(<ThemeProvider defaultMode="system"><Probe /></ThemeProvider>);
    expect(screen.getByRole('status')).toHaveTextContent('system/light');
  });

  it('is controllable and does not touch storage when controlled', async () => {
    const onModeChange = vi.fn();
    render(<ThemeProvider mode="light" onModeChange={onModeChange}><Probe /></ThemeProvider>);
    await userEvent.click(screen.getByText('toggle'));
    expect(onModeChange).toHaveBeenCalledWith('dark');
    expect(attr()).toBe('light');
    expect(localStorage.getItem('umbra-theme')).toBeNull();
  });

  it('injects token overrides as custom properties', () => {
    render(<ThemeProvider overrides={{ 'color-accent': '#ff0000', 'space-0.5': '3px' }} />);
    const css = document.querySelector('[data-umbra-overrides]')!.textContent;
    expect(css).toContain('--umbra-color-accent:#ff0000');
    expect(css).toContain('--umbra-space-0_5:3px');
  });

  it('renders the same markup on the server as on first client render', () => {
    localStorage.setItem('umbra-theme', 'light');
    const html = renderToString(<ThemeProvider><Probe /></ThemeProvider>);
    expect(html).toContain('dark/dark');
  });

  it('useTheme throws outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/ThemeProvider/);
    spy.mockRestore();
  });
});

describe('ThemeScript', () => {
  const run = (el: React.ReactElement) => {
    const html = renderToString(el);
    const js = html.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '');
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    act(() => void new Function(js.replace(/&quot;/g, '"').replace(/&amp;/g, '&'))());
  };

  it('applies the stored theme before React runs', () => {
    localStorage.setItem('umbra-theme', 'light');
    run(<ThemeScript />);
    expect(attr()).toBe('light');
  });

  it('falls back to the default, resolving system via matchMedia', () => {
    run(<ThemeScript />);
    expect(attr()).toBe('dark');
    media['prefers-color-scheme: light'] = true;
    run(<ThemeScript defaultMode="system" />);
    expect(attr()).toBe('light');
  });
});
