import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  FormField,
  Grid,
  Inline,
  Input,
  Select,
  SelectItem,
  Stack,
  Switch,
  tokens,
  useTheme,
  type ThemeMode,
} from 'umbra-ui';
import { HeroScene, ModelViewer, Orb, type Quality } from 'umbra-ui/3d';
import { CommandPalette, NumberTicker, ShimmerButton, SpotlightCard, TextReveal, Toaster, toast, type CommandItem } from 'umbra-ui/motion';

const quality: Quality = 'medium';

export function App() {
  const { mode, setMode } = useTheme();
  const [name, setName] = useState('');
  const commands: CommandItem[] = [
    { id: 'dark', label: 'Use dark theme', group: 'Theme', onSelect: () => setMode('dark') },
    { id: 'light', label: 'Use light theme', group: 'Theme', onSelect: () => setMode('light') },
    { id: 'toast', label: 'Show a toast', group: 'Actions', onSelect: () => toast({ title: 'Hello from the palette', tone: 'success' }) },
  ];

  return (
    <>
      <HeroScene quality={quality} style={{ minHeight: 420 }}>
        <Stack gap="4" align="center" justify="center" style={{ minHeight: 420, textAlign: 'center', padding: 24 }}>
          <Badge tone="accent">Installed from the tarball</Badge>
          <TextReveal as="h1" style={{ margin: 0, fontSize: tokens.shared['text-3xl-size'], letterSpacing: tokens.shared['text-3xl-tracking'] }}>
            Umbra UI in a Vite app
          </TextReveal>
          <Inline justify="center">
            <ShimmerButton onClick={() => toast({ title: 'Deployment ready', description: 'acme-production is live.', tone: 'success' })}>Show a toast</ShimmerButton>
            <span style={{ color: 'var(--umbra-color-text-muted)' }}>or press ⌘K / Ctrl+K</span>
          </Inline>
        </Stack>
      </HeroScene>

      <Container style={{ paddingBlock: 48 }}>
        <Grid minItemWidth="280px" gap="4">
          <Card>
            <CardHeader>
              <CardTitle>Static</CardTitle>
              <CardDescription>Form controls and a dialog from the root entry.</CardDescription>
            </CardHeader>
            <FormField label="Theme">
              <Select value={mode} onValueChange={(v) => setMode(v as ThemeMode)}>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </Select>
            </FormField>
            <Switch defaultChecked>Automatic deployments</Switch>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="soft" tone="neutral">Rename project</Button>
              </DialogTrigger>
              <DialogContent title="Rename project" description="Shown across your dashboard.">
                <FormField label="Name" error={name.length > 20 ? 'Keep it under 20 characters.' : undefined}>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </FormField>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>Save name</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>

          <SpotlightCard>
            <CardHeader>
              <CardTitle>Animated</CardTitle>
              <CardDescription>A spotlight card and a number ticker from umbra-ui/motion.</CardDescription>
            </CardHeader>
            <NumberTicker value={128430} style={{ fontSize: tokens.shared['text-3xl-size'], fontWeight: 600 }} />
          </SpotlightCard>

          <Card>
            <CardHeader>
              <CardTitle>3D</CardTitle>
              <CardDescription>An orb button and a model viewer from umbra-ui/3d, loaded lazily.</CardDescription>
            </CardHeader>
            <Inline>
              <Orb aria-label="Show a toast" onClick={() => toast('The orb is a real button')} />
            </Inline>
            <ModelViewer aria-label="Torus knot" quality={quality} style={{ height: 260 }} />
          </Card>
        </Grid>
      </Container>

      <CommandPalette items={commands} />
      <Toaster />
    </>
  );
}
