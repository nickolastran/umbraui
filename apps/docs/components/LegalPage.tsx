'use client';

import { useEffect, useState } from 'react';

export interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

/** Layout for policy pages: a large header, then a sticky "On this page" list that tracks the section being read. */
export function LegalPage({ eyebrow, title, lead, updated, sections }: { eyebrow: string; title: string; lead: string; updated: string; sections: LegalSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    // A section counts as current once its top passes the upper fifth of the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);

  return (
    <main className="legal">
      <header className="legal__head">
        <p className="legal__eyebrow">{eyebrow}</p>
        <h1 className="legal__title">{title}</h1>
        <p className="legal__lead">{lead}</p>
        <p className="legal__updated">Last updated {updated}</p>
      </header>
      <div className="legal__body">
        <nav className="legal__toc" aria-labelledby="legal-toc">
          <h2 id="legal-toc" className="legal__eyebrow">On this page</h2>
          <ul>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={active === s.id ? 'location' : undefined} onClick={() => setActive(s.id)}>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="legal__content">
          {sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`}>
              <h2 id={`${s.id}-title`}>{s.title}</h2>
              {s.body}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
