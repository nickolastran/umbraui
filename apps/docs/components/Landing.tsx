'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge, Button, Card, Checkbox, Container, Grid, Inline, Stack, Switch, Tabs, TabsContent, TabsList, TabsTrigger } from 'umbra-ui';
import { HeroScene, Logo3D, Orb } from 'umbra-ui/3d';
import { BeamBorder, Marquee, NumberTicker, ShimmerButton, SpotlightCard, TextReveal } from 'umbra-ui/motion';
import { CodeBlock } from './CodeBlock';

function Tile({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  return (
    <Card className="tile" size="sm">
      <div className="tile__stage">{children}</div>
      <Link className="tile__link" href={href}>
        {title}
      </Link>
    </Card>
  );
}

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="5" y="5" width="9" height="9" rx="2" />
    <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m3 8.5 3 3 7-7" />
  </svg>
);

export function Landing() {
  const router = useRouter();
  const [checked, setChecked] = useState(true);
  const [copied, setCopied] = useState(false);
  const copyInstall = async () => {
    await navigator.clipboard.writeText('npm install umbra-ui');
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <main>
      <HeroScene className="hero" quality="medium">
        <div className="hero__inner">
          <h1 className="hero__title">
            <TextReveal as="span">Interfaces that come</TextReveal> <span className="hero__dark">out of the dark</span>
          </h1>
          <p className="hero__lead">
            Umbra UI is a dark-first React component library. Forms, overlays, motion and WebGL scenes share one token system, so everything you ship looks
            like one product.
          </p>
          <Inline gap="3" justify="center">
            <ShimmerButton size="lg" onClick={() => router.push('/docs/getting-started')}>
              Get started
            </ShimmerButton>
            <Button asChild size="lg" variant="outline" tone="neutral">
              <Link href="/docs/button">Browse components</Link>
            </Button>
          </Inline>
          <div className="install">
            <button type="button" className="install__copy" onClick={copyInstall}>
              <code>npm install umbra-ui</code>
              <span className="install__status" aria-live="polite">
                {copied ? <CheckIcon /> : <CopyIcon />}
                <span className="install__label">{copied ? 'Copied' : 'Copy'}</span>
              </span>
            </button>
          </div>
        </div>
      </HeroScene>

      <Container size="xl">
        <section className="section" aria-labelledby="featured">
          <div className="section__head">
            <h2 id="featured">Three families, one system</h2>
            <p>Every tile below is the real component. Switch the theme in the header and watch all of them, including the 3D ones, follow.</p>
          </div>
          <Grid minItemWidth="260px" gap="4">
            <Tile href="/docs/button" title="Button">
              <Inline>
                <Button>Deploy</Button>
                <Button variant="soft" tone="neutral">Preview</Button>
              </Inline>
            </Tile>
            <Tile href="/docs/switch" title="Switch and Checkbox">
              <Stack gap="3">
                <Switch checked={checked} onCheckedChange={setChecked}>Automatic deployments</Switch>
                <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)}>Email me on failure</Checkbox>
              </Stack>
            </Tile>
            <Tile href="/docs/tabs" title="Tabs">
              <Tabs defaultValue="a" variant="pill" size="sm">
                <TabsList aria-label="Example tabs">
                  <TabsTrigger value="a">Overview</TabsTrigger>
                  <TabsTrigger value="b">Logs</TabsTrigger>
                </TabsList>
                <TabsContent value="a">24h traffic</TabsContent>
                <TabsContent value="b">Live output</TabsContent>
              </Tabs>
            </Tile>
            <Tile href="/docs/number-ticker" title="NumberTicker">
              <NumberTicker value={128430} locale="en-US" style={{ fontSize: 'var(--umbra-text-3xl-size)', fontWeight: 600, letterSpacing: 'var(--umbra-text-3xl-tracking)' }} />
            </Tile>
            <Tile href="/docs/beam-border" title="BeamBorder">
              <BeamBorder radius="full">
                <span style={{ display: 'block', padding: '6px 16px' }}>Now in every region</span>
              </BeamBorder>
            </Tile>
            <Tile href="/docs/marquee" title="Marquee">
              <Marquee style={{ width: '100%' }} gap="4">
                {['Northwind', 'Kestrel', 'Halcyon', 'Tessellate', 'Parallax'].map((n) => (
                  <Badge key={n} variant="outline">{n}</Badge>
                ))}
              </Marquee>
            </Tile>
            <Tile href="/docs/orb" title="Orb">
              <Orb aria-label="Orb demo" size="lg" />
            </Tile>
            <Tile href="/docs/logo-3d" title="Logo3D">
              <Logo3D aria-label="Umbra mark" style={{ width: 140 }} />
            </Tile>
            <SpotlightCard className="tile" size="sm">
              <div className="tile__stage" style={{ textAlign: 'center', color: 'var(--umbra-color-text-secondary)' }}>
                Move the pointer here
              </div>
              <Link className="tile__link" href="/docs/spotlight-card">
                SpotlightCard
              </Link>
            </SpotlightCard>
          </Grid>
        </section>

        <section className="section" aria-labelledby="start" style={{ paddingTop: 0 }}>
          <div className="section__head">
            <h2 id="start">Three imports</h2>
            <p>Motion and three.js are optional peers. If you never import the second or third line, they are never installed or bundled.</p>
          </div>
          <CodeBlock
            code={`import { Button, Dialog, ThemeProvider } from 'umbra-ui';
import { CommandPalette, toast } from 'umbra-ui/motion';   // needs "motion"
import { HeroScene, ModelViewer } from 'umbra-ui/3d';       // needs "three", "@react-three/fiber", "@react-three/drei"
import 'umbra-ui/styles.css';`}
          />
        </section>
      </Container>
    </main>
  );
}
