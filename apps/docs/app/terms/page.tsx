import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function Terms() {
  return (
    <LegalPage
      eyebrow="Terms of service"
      title="Free to use, as is"
      lead="Umbra UI is open source under the MIT License. These terms cover your use of this documentation site, its examples and its code samples."
      updated="November 10, 2026"
      sections={[
        {
          id: 'short-version',
          title: 'The short version',
          body: (
            <ul>
              <li>The library is MIT licensed: use it, change it and ship it, including in commercial products.</li>
              <li>The docs and examples are provided as is, without warranty. Test what you ship.</li>
              <li>Don't try to disrupt or break the site.</li>
            </ul>
          ),
        },
        {
          id: 'software',
          title: 'The software',
          body: (
            <p>
              Umbra UI is released under the <a href="https://opensource.org/license/mit">MIT License</a>. You may use, copy, modify and distribute it under that license. If
              anything in these terms conflicts with the MIT License for the software, the license wins.
            </p>
          ),
        },
        {
          id: 'site',
          title: 'Using this site',
          body: (
            <>
              <p>
                The site, its examples and its code samples are provided &quot;as is&quot;, without warranty of any kind. We try to keep them accurate, but they may contain
                mistakes or describe behaviour that has since changed. You are responsible for testing anything you ship.
              </p>
              <p>You agree not to use the site in a way that disrupts it or other people's use of it, such as attempting to overload or break it.</p>
            </>
          ),
        },
        {
          id: 'third-parties',
          title: 'Links to other sites',
          body: <p>The site links to third-party sites and packages, such as npm and GitHub. We don't control them and aren't responsible for their content or their terms.</p>,
        },
        {
          id: 'liability',
          title: 'Limitation of liability',
          body: <p>To the extent permitted by law, the Umbra UI contributors are not liable for any damages arising from your use of the site or the software.</p>,
        },
        {
          id: 'changes',
          title: 'Changes to these terms',
          body: (
            <p>
              We may update these terms. The date at the top shows when they last changed, and continuing to use the site after a change means you accept the updated terms.
              Questions can be raised as an issue on the project's GitHub repository.
            </p>
          ),
        },
      ]}
    />
  );
}
