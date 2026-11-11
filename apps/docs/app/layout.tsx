import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { ThemeScript } from 'umbra-ui';
import 'umbra-ui/styles.css';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: { default: 'Umbra UI', template: '%s · Umbra UI' },
  description: 'Dark-first React components: static, animated and 3D, on one design-token system.',
};
export const viewport: Viewport = { themeColor: [{ color: '#08090a' }], width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
