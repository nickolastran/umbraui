'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge, Button, Card, Checkbox, Container, Grid, Inline, Kbd, Stack, Switch, Tabs, TabsContent, TabsList, TabsTrigger } from 'umbra-ui';
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

export function Landing() {
  const router = useRouter();
  const [checked, setChecked] = useState(true);
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
            <code>npm install umbra-ui</code>
            <Kbd>⌘K</Kbd>
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
      <footer className="footer">Umbra UI is MIT licensed.</footer>
    </main>
  );
}
