'use client';

import { ThemeProvider } from 'umbra-ui';
import { Shell } from '@/components/Shell';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Shell>{children}</Shell>
    </ThemeProvider>
  );
}
