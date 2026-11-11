import type { Metadata } from 'next';
import Changelog from '@/generated/changelog.mdx';

export const metadata: Metadata = { title: 'Changelog' };

/** Built from .changeset/*.md (Unreleased) and packages/umbra-ui/CHANGELOG.md by scripts/generate.mjs. */
export default function ChangelogPage() {
  return (
    <main className="legal">
      <header className="legal__head">
        <p className="legal__eyebrow">Changelog</p>
        <h1 className="legal__title">What&apos;s new</h1>
        <p className="legal__lead">Every change to the umbra-ui package, newest first. Unreleased changes are merged and ship in the next npm version.</p>
      </header>
      <div className="prose changelog">
        <Changelog />
      </div>
    </main>
  );
}
