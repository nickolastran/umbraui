import { Nav } from '@/components/Nav';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs">
      <aside className="sidebar">
        <Nav />
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
