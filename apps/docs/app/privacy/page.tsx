import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="Privacy policy"
      title="Nothing to collect"
      lead="The Umbra UI docs are a static site with no accounts, forms or tracking. This policy explains what is saved in your browser, what our host may log, and what we never collect."
      updated="November 10, 2026"
      sections={[
        {
          id: 'short-version',
          title: 'The short version',
          body: (
            <ul>
              <li>There are no accounts, sign-ups or forms, so we don't hold an email address or any profile for you.</li>
              <li>The only thing the site saves is your light or dark theme choice, and it stays in your browser.</li>
              <li>We set no cookies and run no analytics or advertising scripts.</li>
              <li>We don't sell or share personal data.</li>
            </ul>
          ),
        },
        {
          id: 'browser-storage',
          title: "What's stored in your browser",
          body: (
            <p>
              When you switch between light and dark, your choice is saved in your browser's <code>localStorage</code> under the key <code>umbra-theme</code>, so the site
              remembers it next time. It never leaves your device. You can remove it at any time by clearing this site's data in your browser settings.
            </p>
          ),
        },
        {
          id: 'cookies',
          title: 'Analytics and cookies',
          body: <p>The site sets no cookies and loads no analytics, tracking or advertising scripts. We don't measure who visits or what they read.</p>,
        },
        {
          id: 'hosting',
          title: 'Hosting',
          body: (
            <p>
              The site is served by a static hosting provider. Like any web server, the provider may keep standard request logs, such as IP address, browser type and the
              pages requested, for security and reliability. Those logs are handled under the hosting provider's own privacy policy.
            </p>
          ),
        },
        {
          id: 'third-parties',
          title: 'Links to other sites',
          body: <p>Links to other sites, such as npm or GitHub, take you to services with their own privacy policies.</p>,
        },
        {
          id: 'changes',
          title: 'Changes to this policy',
          body: (
            <p>
              If this policy changes, the date at the top will be updated. Privacy questions can be raised as an issue on the project's GitHub repository.
            </p>
          ),
        },
      ]}
    />
  );
}
