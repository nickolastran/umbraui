'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { Button, Dialog, DialogContent, IconButton, Kbd, Tooltip, useTheme } from 'umbra-ui';
import type { CommandItem } from 'umbra-ui/motion';
import { families, guides, registry } from '@/lib/registry';
import { Nav } from './Nav';

// Search and toasts are not needed for first paint: load the Motion-based pieces after hydration.
const CommandPalette = dynamic(() => import('umbra-ui/motion').then((m) => m.CommandPalette), { ssr: false });
const Toaster = dynamic(() => import('umbra-ui/motion').then((m) => m.Toaster), { ssr: false });

const MARK = 'M50 5a45 45 0 1 0 0 90a45 45 0 1 0 0-90Z M60 14a30 30 0 1 1 0 60a30 30 0 1 1 0-60Z';
const Sun = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
  </svg>
);
const Moon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
    <path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7Z" />
  </svg>
);
const MenuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />
  </svg>
);

export function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { resolvedTheme, toggle } = useTheme();
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState(false);

  // The new theme sweeps out in a circle from the toggle (or the top-right corner when run from search).
  const swoop = (from?: Element) => {
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return toggle();
    const box = from?.getBoundingClientRect();
    const x = box ? box.left + box.width / 2 : innerWidth - 40;
    const y = box ? box.top + box.height / 2 : 32;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    document
      .startViewTransition(() => {
        flushSync(toggle);
        // ThemeProvider applies the attribute in an effect; set it now so the snapshot shows the new theme.
        document.documentElement.setAttribute('data-umbra-theme', next);
      })
      .ready.then(() =>
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
        ),
      );
  };

  const items = useMemo<CommandItem[]>(
    () => [
      ...guides.map((g) => ({ id: g.slug, label: g.name, group: 'Guides', onSelect: () => router.push(`/docs/${g.slug}`) })),
      ...registry.map((r) => ({
        id: r.slug,
        label: r.name,
        group: families[r.family].title,
        keywords: [r.description, ...r.exports],
        onSelect: () => router.push(`/docs/${r.slug}`),
      })),
      { id: 'theme', label: 'Toggle theme', group: 'Preferences', keywords: ['dark', 'light'], onSelect: () => swoop() },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- swoop only reads the current theme
    [router, toggle, resolvedTheme],
  );

  return (
    <>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <header className="header">
        <IconButton className="menu-button" aria-label="Open navigation" onClick={() => setMenu(true)}>
          <MenuIcon />
        </IconButton>
        <Link className="brand" href="/">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <path d={MARK} fillRule="evenodd" />
          </svg>
          Umbra UI
        </Link>
        <nav className="header__nav" aria-label="Primary">
          <Button asChild variant="ghost" tone="neutral">
            <Link href="/docs/getting-started">Docs</Link>
          </Button>
          <Button asChild variant="ghost" tone="neutral">
            <Link href="/docs/button">Components</Link>
          </Button>
          <Button asChild variant="ghost" tone="neutral">
            <Link href="/docs/theming">Theming</Link>
          </Button>
        </nav>
        <span className="header__spacer" />
        <Button className="search-trigger" variant="outline" tone="neutral" aria-keyshortcuts="Meta+K Control+K" onClick={() => setSearch(true)}>
          <span>Search documentation</span>
          <Kbd>⌘K</Kbd>
        </Button>
        <Tooltip content={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
          <IconButton aria-label="Toggle theme" onClick={(e) => swoop(e.currentTarget)}>
            {/* Both icons render on the server; CSS shows the right one, so there is no hydration flash. */}
            <span data-show-in="dark"><Sun /></span>
            <span data-show-in="light"><Moon /></span>
          </IconButton>
        </Tooltip>
      </header>
      <div id="content">{children}</div>
      <footer className="footer">
        <span>© 2026 Umbra UI. Released under the MIT License.</span>
        <nav className="footer__links" aria-label="Legal">
          <Link className="footer__link" href="/terms">Terms of Service</Link>
          <Link className="footer__link" href="/privacy">Privacy Policy</Link>
        </nav>
      </footer>
      <Dialog open={menu} onOpenChange={setMenu}>
        <DialogContent title="Navigation" size="sm">
          <Nav onNavigate={() => setMenu(false)} />
        </DialogContent>
      </Dialog>
      <CommandPalette items={items} open={search} onOpenChange={setSearch} label="Search documentation" placeholder="Search components and guides…" />
      <Toaster />
    </>
  );
}
