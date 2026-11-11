'use client';

import { useState } from 'react';
import { Button } from 'umbra-ui';

/** A code sample with a copy button. The scrollable <pre> is keyboard-focusable. */
export function CodeBlock({ code, label = 'Code sample' }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="code">
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable region must be focusable */}
      <pre tabIndex={0} role="region" aria-label={label}>
        <code>{code}</code>
      </pre>
      <Button className="code__copy" size="sm" variant="soft" tone="neutral" onClick={copy}>
        <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
      </Button>
    </div>
  );
}
