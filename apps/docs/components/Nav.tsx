'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { families, guides, registry, type Family } from '@/lib/registry';

/** Sidebar navigation, grouped by family. Used in the desktop sidebar and the mobile menu dialog. */
export function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname().replace(/\/$/, '');
  const link = (slug: string, name: string) => {
    const href = `/docs/${slug}`;
    return (
      <li key={slug}>
        <Link className="nav-link" href={href} aria-current={pathname === href ? 'page' : undefined} onClick={onNavigate}>
          {name}
        </Link>
      </li>
    );
  };
  return (
    <nav aria-label="Documentation">
      <div className="nav-group">
        <h2>Guides</h2>
        <ul>{guides.map((g) => link(g.slug, g.name))}</ul>
      </div>
      {(Object.keys(families) as Family[]).map((family) => (
        <div className="nav-group" key={family}>
          <h2>{families[family].title}</h2>
          <ul>{registry.filter((r) => r.family === family).map((r) => link(r.slug, r.name))}</ul>
        </div>
      ))}
    </nav>
  );
}
